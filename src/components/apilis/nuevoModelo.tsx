import { Box, Button, Grid, InputLabel, MenuItem, Paper, Table, Modal, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from "@mui/material";
import React from "react";
import ReactToPrint from "react-to-print";
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import { getAgreementsAllApi, saveModelApi, savePathApi, getModelApi, getRefererApi,  getAmbAllApi, getBrandApi, getHeadquartersAllApi, getAppointmentsApi, reportExamMonthly } from "../../api";
import { Link, useParams } from 'react-router-dom';
import { Contenido } from "../Home";
import moment from 'moment';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

export default function NuevoModelo() {
    const { id } = useParams();
    const [nommodelo, setNomModelo] = React.useState<any>("");
    const [user, setUser] = React.useState<any>("");
    const [passw, setPassw] = React.useState<any>("");
    const [env, setEnv] = React.useState<any>("");
    const [nombre, setNombre] = React.useState<any>([]);
    const [ambList, setAmbList] = React.useState<any[]>([]);
    const [listmodel, setModel] = React.useState<any[]>([]);




    React.useEffect(() => {
        getBrandApi(id).then((x: any) => {
            setNombre(x.data.nameBrand)
        })

        getModelApi(id).then((x: any) => {
            let mapeado: any = []
            x.data.data?.forEach((d: any) =>{
              mapeado.push({
                id:d.id,
                nombremodelo:d.nameModel,
                color:d.Color,
              })
            })
            setModel(mapeado)
           // setRows2(mapeado)
        })

        getAmbAllApi().then((ag: any) => {
            setAmbList(ag.data)
        });

    }, [])
    
    const nomModel=()=>{
        Swal.fire({
            title: 'Por favor ingresa el nombre del modelo',
            icon: 'warning',
          })
    }

    const modelSuccess=()=>{
        Swal.fire({
            title: 'Modelo guardado con exito',
            icon: 'success',
          })
    }

    const modelNameExist=()=>{
        Swal.fire({
            title: 'El modelo ya ha sido registrado',
            icon: 'warning',
          })
    }
    const [api, setApi] = React.useState<any>("http://localhost:5000/api/dymind/");
    const randomColor = Math.floor(Math.random()*16777215).toString(16);

    const crearModel = () => {
        const validamodelo= listmodel.some((cred: any) => cred.nombremodelo === nommodelo)
        if (nommodelo== "") {
            //NomBrand()
            nomModel()
            return;
        }

        if(validamodelo){
            modelNameExist()
            return;
        }
       
        saveModelApi({
            nameModel: nommodelo.toUpperCase(),
            Color: "#"+randomColor,
            user: user,
            passw: passw,
            env: env,
            Api: api,
            idBrand: id
  
        }).then((x: any) => {
            if (x.status) {
                //alert(x.message.text);
                //BrandSuccess()
                modelSuccess()
                window.location.href = '/apps/apilis/configure/marca/'+ id +'/modelos'
                //setNomMarca("");
                //setDescrMarca("");
                
            } else if(validamodelo){
                //alert(x.text);
                modelNameExist() 
            }
        })


    }
    
   
    const fechatotal=()=>{
        Swal.fire({
            title: 'Por favor, ingrese un filtro',
            icon: 'warning',
          })
    }

    const otrosfilt=()=>{
        Swal.fire({
            title: 'Por favor, ingrese uno de los filtros',
            icon: 'warning',
          })
    }

    const fechainitial=()=>{
        Swal.fire({
            title: 'Ingrese la fecha inicial por favor',
            icon: 'warning',
          })
    }

    const fechasecond=()=>{
        Swal.fire({
            title: 'Ingrese la fecha secundaria por favor',
            icon: 'warning',
          })
    }


    const handleChangeModelo= (event: React.ChangeEvent<HTMLInputElement>) => {
        setNomModelo(event.target.value);
    };
    const handleChangeUser= (event: React.ChangeEvent<HTMLInputElement>) => {
        setUser(event.target.value);
    };
    const handleChangePassw= (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassw(event.target.value);
    };
    const handleChangeEnv= (event: React.ChangeEvent<HTMLInputElement>) => {
        setEnv(event.target.value);
    };
    const handleChangeApi= (event: React.ChangeEvent<HTMLInputElement>) => {
        setApi(event.target.value);
    };
 


    return (
        <div className='tabla-componente card-table-examfinish'>
        <Contenido>
                <Grid container xs={200} sx={{mb: 50}}>
                    <Grid item xs={300} sx={{ placeContent: "center" }}>
                      <div style={{ borderRadius: '5px', width: "950px", maxWidth: "100%" }}>
                      <div style={{ marginInline: "50px", marginBlock: "1px"}}>
                      <div style={{ display: "flex",  width: "1150px" }} className="nav-tabla">
                        
                        <Grid container item></Grid>
                        <Grid container item></Grid>
                        <Grid container item></Grid>
                        <Grid container item></Grid>
                        <Grid container item></Grid>
                        <Grid container item></Grid>
                        
                        <Grid container item>
                            <Tooltip title="Guardar" followCursor>
                                <Button onClick={crearModel} variant="contained" style={{ width: '18.5ch', height: '4.2ch', backgroundColor: "rgb(0 85 169)", color: "white", fontFamily: "Quicksand", fontWeight: "900", fontSize: "1.10rem" }}>Guardar</Button>
                            </Tooltip>
                        </Grid>
                      </div>


                        <br></br>
                        <br></br>
                        <Grid xs={1000} mt={1} sx={{ placeContent: "center" }}>

                        <Grid item xs={10}>
                        <Link to={"/apps/apilis/configure/marca/"+ id + "/modelos"}>  
                            <div style={{ display: "flex", alignItems: "center" }} >
                            <KeyboardBackspaceRoundedIcon style={{ color: "white", fontSize: "1.3rem", cursor: "pointer" }}></KeyboardBackspaceRoundedIcon>
                                <InputLabel style={{ color: "white", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.4rem", cursor: "pointer"}} >APILIS / CONFIGURACION / MODELO / NUEVO</InputLabel >
                            </div>
                        </Link>
                        </Grid>
                        <br></br>
                        <br></br>
                        <Grid container sx={{ placeContent: "center" }} xs={1000} mt={1} className='contenedor-tabla-apilis'>
                        <Box
                            sx={{
                            width: 400,
                            height: 410,
                            backgroundColor: 'primary.dark',
                            
                            }}
                        >
                            <br></br>
                            <br></br>
                            <Grid container sx={{ placeContent: "center" }}>
                            <TextField placeholder="Nombre del Modelo" InputProps={{
                                style: {
                                    backgroundColor: "white",
                                    color: "black",
                                    cursor: "pointer",
                                    borderStyle: "revert",
                                    borderColor: "#039be5",
                                    borderWidth: "0.1px",
                                    width: "300px"
                                },     
                            }} type="text" value={nommodelo} onChange={handleChangeModelo}focused id="outlined-basic" variant="outlined" /> 
                            </Grid>
                            <br></br>
                            <Grid container sx={{ placeContent: "center" }}>
                            <TextField placeholder="API" InputProps={{
                                style: {
                                    backgroundColor: "white",
                                    color: "black",
                                    cursor: "pointer",
                                    borderStyle: "revert",
                                    borderColor: "#039be5",
                                    borderWidth: "0.1px",
                                    width: "300px"
                                },     
                            }} type="text" value={api} onChange={handleChangeApi}focused id="outlined-basic" variant="outlined" /> 
                            </Grid>
                            <br></br>
                            <Grid container sx={{ placeContent: "center" }}>
                            <TextField placeholder="Usuario" InputProps={{
                                style: {
                                    backgroundColor: "white",
                                    color: "black",
                                    cursor: "pointer",
                                    borderStyle: "revert",
                                    borderColor: "#039be5",
                                    borderWidth: "0.1px",
                                    width: "300px"
                                },     
                            }} type="text" value={user} onChange={handleChangeUser}focused id="outlined-basic" variant="outlined" /> 
                            </Grid>
                            <br></br>
                            <Grid container sx={{ placeContent: "center" }}>
                            <TextField placeholder="Contraseña" InputProps={{
                                style: {
                                    backgroundColor: "white",
                                    color: "black",
                                    cursor: "pointer",
                                    borderStyle: "revert",
                                    borderColor: "#039be5",
                                    borderWidth: "0.1px",
                                    width: "300px"
                                },     
                            }} type="text" value={passw} onChange={handleChangePassw}focused id="outlined-basic" variant="outlined" /> 
                            </Grid>
                            <br></br>
                             <Grid container sx={{ placeContent: "center" }}>
                            <TextField select label="Tipo Ambiente" InputProps={{
                                style: {
                                    backgroundColor: "white", 
                                    color: "black",
                                    cursor: "pointer",
                                    borderStyle: "revert",
                                    borderColor: "#039be5",
                                    borderWidth: "0.1px",
                                    width: "300px"
                                },     
                            }}  value={env} onChange={handleChangeEnv} id="outlined-basic" variant="outlined" > 

                               {ambList.map((row: any, index: any) => {
                                    return (
                                     <MenuItem key={index} value={row.label}>{row.label}</MenuItem>
                                    )
                                })}
                            </TextField>
                            </Grid>


                        </Box>
                        </Grid>

                        </Grid>

    
                        <Grid>
                        
                        </Grid>
                        
                    


                        </div>
                       </div>
                    </Grid>
                </Grid>
            <br></br>
            <div>
            
            </div>

        </Contenido>
    </div>
    );
}


