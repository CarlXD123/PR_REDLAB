import { Box, Button, Grid, IconButton, InputLabel, Modal, TextField } from "@mui/material";
import React from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Contenido } from "../Home";
import TbAdministrarSedes from "../tablas/tbAdministrarSedes";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { saveHeadquarterApi } from "../../api";
import { toBase64 } from "../../util";
import Swal from 'sweetalert2';


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'white',
    border: '1px solid #white',
    borderRadius: "15px",
    boxShadow: 24,
    p: 4,
};
var SaveComplete=()=>{
    Swal.fire({
        title: 'La sede se creo con exito',
        icon: 'success',
    })
}

var SaveFail=()=>{
    Swal.fire({
        title: 'La sede no se creo',
        icon: 'warning',
    })
}

var NombIncomplete=()=>{
    Swal.fire({
        title: 'Coloque el nombre de la sede',
        icon: 'warning',
        target: '#custom-target2',
    })
}

var DirIncomplete=()=>{
    Swal.fire({
        title: 'Coloque la direccion de la sede',
        icon: 'warning',
        target: '#custom-target2',
    })
}

class AdministrarSedes extends React.Component<{ navigate: NavigateFunction }, any>{
    constructor(props: any) {
        super(props);
        this.state = {
            abrirSede: false,
            nombre: "",
            direccion: "",
            telefono: "",
            correo: "",
            imagen: "",
            imagenFile: ""
        }
    }
    
    handleChangeSede = () => {
        this.setState({
            abrirSede: true
        });
    }
    handleChangeCerrarSede = () => {
        this.setState({
            abrirSede: false
        });
    }
    handleChange = (prop: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            [prop]: event.target.value
        });
    }
    handleChangeImagen = (event: any) => {
        this.setState({
            imagen: event.target.value,
            imagenFile: event.target.files[0]
        });
    }
    guardarSede = async () => {
        if (this.state.nombre === "") {
            NombIncomplete();
            return;
        }

        if (this.state.direccion === "") {
            DirIncomplete();
            return;
        }
        
        let data = {
            name: this.state.nombre,
            tlfNumber: this.state.telefono,
            address: this.state.direccion,
            email: this.state.correo
        };
    
        if (this.state.imagen !== "") {
            let daton = {
                ...data,
                file: {
                    base64: await toBase64(this.state.imagenFile),
                    path: this.state.imagen.split("\\")[this.state.imagen.split("\\").length - 1]
                }
            };
            saveHeadquarterApi(daton).then((x: any) => {
                if (x.status) {
                    SaveComplete();
                    this.setState({
                        abrirSede: false
                    });
                    window.location.href = '/apps/headquarters';
                } else {
                    SaveFail();
                    this.setState({
                        abrirSede: false
                    });
                }
            });
        } else {
            saveHeadquarterApi(data).then((x: any) => {
                if (x.status) {
                    SaveComplete();
                    this.setState({
                        abrirSede: false
                    });
                    window.location.href = '/apps/headquarters';
                } else {
                    SaveFail();
                    this.setState({
                        abrirSede: false
                    });
                }
            });
        }
    }
    
    render() {
        return (

            <div className='tabla-componente' style={{ maxHeight:"950", overflow: "auto"}}>
                <Contenido>
                    <Grid container style={{ alignItems: "center" }}>
                        <Grid item>
                            <InputLabel><HomeRoundedIcon style={{ color: "white", fontSize: "40px" }}></HomeRoundedIcon></InputLabel>
                        </Grid>
                        <Grid item xs>
                            <InputLabel style={{ color: "white", fontFamily: "Quicksand", fontWeight: "400", fontSize: "2.5rem" }} >Sedes</InputLabel>
                        </Grid>
                        <Grid item xs>
                            <Button onClick={this.handleChangeSede} variant="contained" style={{ width: '24ch', height: '4.4ch', backgroundColor: "rgb(0 85 169)", color: "white", fontFamily: "Quicksand", fontWeight: "900", fontSize: "1.15rem" }}>Agregar nueva sede</Button>
                        </Grid>
                    </Grid>

                    <br></br>
                    <div>
                        <TbAdministrarSedes />
                    </div>
                    <div>
                        <Modal
                            id="custom-target2"
                            keepMounted
                            open={this.state.abrirSede}
                            onClose={this.handleChangeCerrarSede}
                            aria-labelledby="keep-mounted-modal-title"
                            aria-describedby="keep-mounted-modal-description"
                        >
                            <Box sx={style}>
                                <InputLabel style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.5rem" }} >Información de Sede</InputLabel >

                                <Grid container item xs mt={2.5}>
                                    <TextField fullWidth id="outlined-basic" label="Nombre" variant="outlined" value={this.state.nombre} onChange={this.handleChange("nombre")} />
                                </Grid>
                                <Grid container item xs mt={2.5}>
                                    <TextField fullWidth id="outlined-basic" label="Dirección" variant="outlined" value={this.state.direccion} onChange={this.handleChange("direccion")} />
                                </Grid>
                                <Grid container item xs mt={2.5}>
                                    <TextField fullWidth id="outlined-basic" label="Teléfono" variant="outlined" value={this.state.telefono} onChange={this.handleChange("telefono")} />
                                </Grid>
                                <Grid container item xs mt={2.5}>
                                    <TextField fullWidth id="outlined-basic" label="Correo eléctronico" variant="outlined" value={this.state.correo} onChange={this.handleChange("correo")} />
                                </Grid>
                                <Grid container item xs mt={2.5}>
                                    <TextField type="file" id="outlined-basic" focused label="Firma digital" variant="outlined" fullWidth value={this.state.imagen} onChange={this.handleChangeImagen} />
                                </Grid>
                                <Grid container item xs mt={2.5}>
                                    <Grid item xs={6} ></Grid>
                                    <Grid container item xs={6} spacing={2}>
                                        <Grid item xs={6} >
                                            <Button onClick={this.handleChangeCerrarSede} variant="contained" style={{ backgroundColor: "rgb(0 85 169)", color: "white", fontFamily: "Quicksand", fontWeight: "900", fontSize: "1rem" }}>Cancelar</Button>
                                        </Grid>
                                        <Grid item xs={6} >
                                            <Button onClick={this.guardarSede} variant="contained" style={{ backgroundColor: "rgb(0 85 169)", color: "white", fontFamily: "Quicksand", fontWeight: "900", fontSize: "1rem" }}>Editar</Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Modal>
                    </div>
                </Contenido>
            </div>
        )
    }

}
function withNavigation(Component: any): (props: any) => JSX.Element {
    return props => <Component {...props} navigate={useNavigate()} />;
}

export default withNavigation(AdministrarSedes);