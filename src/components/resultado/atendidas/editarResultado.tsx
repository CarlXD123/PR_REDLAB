import { Box, Button, CardContent, Grid, InputLabel, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Tab, TextField, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { Contenido } from "../../Home";
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import React from "react";
import { getExaminationValuesByExamId, getExamValuesApi, getEmployeeByUserId, getSpecialitiesApi, attendAppointmentApi, getSpecialityApi, getAppointmentsResultsApi } from "../../../api";
import Swal from 'sweetalert2';

export default function TbEditarResultado() {
    const { id } = useParams();

    const [observaciones, setObservaciones] = React.useState<any>("")
    const [cargo, setCargo] = React.useState<any>("")
    const [cargoName, setCargoName] = React.useState<any>("")
    const [speciality, setSpecility] = React.useState<any[]>([])

    const [nombreCompleto, setNombreCompleto] = React.useState<any>("")
    const [examenLista, setExamenLista] = React.useState<any[]>([])

    const [expanded, setExpanded] = React.useState<string | false>('');
    const [tabValue, setTabValue] = React.useState<number>(0);

    const handleChangeNombreCompleto = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNombreCompleto(event.target.value)
    }
    const handleChangeCargoName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCargo(event.target.value)
    };
    const handleChangeTab = (event: any, tabValue: number) => {
        setTabValue(tabValue);
    };

    console.log(cargoName)


    React.useEffect(() => {
        getSpecialitiesApi().then((ag: any) => {
            setSpecility(ag.data)
        });
        getAppointmentsResultsApi(id).then(async (x: any) => {
            console.log(x.data)
            setCargoName(x.data.specialityName)
            setCargo(x.data.SpecialityId)

        })
        getExamValuesApi(id).then(async (y: any) => {
            let daton: any = [];
            for (let exam of y.data) {
                let aux: any = [];
                let x = await getExaminationValuesByExamId(exam.ExaminationId, "")
                for (let exam of x.data) {
                    let dato = {
                        id: exam.id,
                        valorNombre: exam.name,
                        grupoExamenNombre: exam.examGroup.name,
                        unidad: exam.unit.name,
                        examenReferencial: exam.examinationReferenceValues,
                        valorObtenido: exam.result,
                    }
                    aux.push(dato)
                }
                daton.push({
                    name: exam.name,
                    result: exam.result,
                    detalleExam: aux,
                    idexam: exam.ExaminationId
                })

                setObservaciones(exam.result);
            }
            setExamenLista(daton)
        })
        const dato = localStorage.getItem('dataUser')
        if (dato != null) {
            const info = JSON.parse(dato);
            setNombreCompleto(info.person.name + " " + info.person.lastNameP + " " + info.person.lastNameM)
        }

        /*CAMBIO ACTUAL 
        const dato = localStorage.getItem('dataUser')
        console.log("soy el user",dato)
        if (dato != null) {
            const info = JSON.parse(dato);
            setNombreCompleto(info.person.name + " " + info.person.lastNameP + " " + info.person.lastNameM)
            getEmployeeByUserId(info.user.id).then(async (x: any) => {
                console.log(x.data)
                setCargo(x.data.SpecialityId)
                getSpecialityApi(x.data.SpecialityId).then(async (x: any) => {
                    setCargoName(x.data.name)
                })
            })
        }
        */
    }, [])

    //#endregion
    const sleep = (ms: any) => new Promise(resolve => setTimeout(resolve, ms))
    const changeValor = (indexX: any, indexY: any) => async (event: any) => {
        examenLista[indexX].detalleExam[indexY].valorObtenido = event.target.value
        setExpanded(false);
        await sleep(50)
        setExpanded(`panel${indexX + 1}`);
    }

    const changeValor2 = (indexX: any) => async (event: any) => {
        examenLista[indexX].result = event.target.value;
        localStorage.setItem('examenLista', JSON.stringify(examenLista));
        //setObservaciones(examenLista[indexX].result);    
        setExpanded(false);
        await sleep(50);
        setExpanded(`panel${indexX + 1}`);
    };


    var saveResult = () => {
        Swal.fire({
            title: 'Resultado modificado de forma exitosa',
            icon: 'success',
        })
    }

    var Cargo = () => {
        Swal.fire({
            title: 'Elija un cargo por favor',
            icon: 'warning',
        })
    }

    const GuardarResultado = () => {
        if (cargo == "") {
            Cargo()
        }

        let data = {
            examinations: examenLista,
            ResponsibleId: 1,
            SpecialityId: cargo,
            result: observaciones,
        }

        attendAppointmentApi(data, id).then((x: any) => {
            if (x.status) {
                saveResult()
                window.location.href = "/apps/results"
            } else if (cargo == "") {
                Cargo()
            }
        })

    }

    return (
        <div className='tabla-componente card-table-general'>
            <Contenido>
                <Grid container style={{ alignItems: "center" }}>
                    <Grid container item >
                        <Link to={`/apps/results`}>
                            <div style={{ display: "flex", alignItems: "center" }} >
                                <KeyboardBackspaceRoundedIcon style={{ color: "white", fontSize: "1.3rem", cursor: "pointer" }}></KeyboardBackspaceRoundedIcon>
                                <InputLabel style={{ color: "white", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.3rem", paddingLeft: "4px", cursor: "pointer" }} >Resultados</InputLabel >
                            </div>
                        </Link>
                    </Grid>
                    <Grid container item style={{ alignItems: "center" }} mt={1.5}>
                        <Grid item md={8}>
                            <InputLabel style={{ color: "white", fontFamily: "Quicksand", fontWeight: "400", fontSize: "2.2rem" }} >Editar Resultados</InputLabel >
                        </Grid>
                        <Grid item md={4}>
                            <Button onClick={GuardarResultado} variant="contained" style={{ width: '22ch', height: '4.4ch', backgroundColor: "rgb(0 85 169)", color: "white", fontFamily: "Quicksand", fontWeight: "900", fontSize: "1.15rem" }}>Guardar</Button>
                        </Grid>
                    </Grid>
                </Grid>
                <br></br>
                <div>
                    <CardContent style={{ backgroundColor: "white", borderRadius: "12px", overflowY: "scroll", maxHeight: "500px" }}>
                        <Box sx={{ flexGrow: 1, mb: 10 }}>
                            <Grid container spacing={2}>
                                <Grid container item md={3}>
                                    <TextField fullWidth id="outlined-basic" label="Cargo" variant="outlined"
                                        select value={cargo} onChange={handleChangeCargoName}
                                    >
                                        {speciality.map((row: any, index: any) => {
                                            return (
                                                <MenuItem key={index} value={row.id}>{row.name}</MenuItem>
                                            )
                                        })}
                                    </TextField>
                                </Grid>
                                <Grid container item md={3}>
                                    <TextField fullWidth id="outlined-basic" label="Nombre" variant="outlined"
                                        value={nombreCompleto} onChange={handleChangeNombreCompleto}
                                    />
                                </Grid>

                            </Grid>
                            <br></br>

                            <CardContent>
                                <Tabs
                                    value={tabValue}
                                    onChange={handleChangeTab}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label="scrollable auto tabs example"
                                >
                                    {examenLista.map((data, index) =>
                                        <Tab key={index} label={data.name} />
                                    )}
                                </Tabs>

                                <Paper sx={{ width: '100%', mb: 2, borderRadius: "12px" }}>
                                    <TableContainer>
                                        <Table sx={{ minWidth: 750 }}
                                            aria-labelledby="tableTitle"
                                            size={'medium'}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>
                                                        Nombre
                                                    </TableCell>
                                                    <TableCell
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>
                                                        Sub grupo
                                                    </TableCell>
                                                    <TableCell
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>
                                                        Valor obtenido
                                                    </TableCell>
                                                    <TableCell
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>
                                                        Unidad
                                                    </TableCell>
                                                    <TableCell
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>
                                                        Rangos referenciales
                                                    </TableCell>

                                                </TableRow>
                                            </TableHead>

                                            {examenLista.slice(tabValue, tabValue + 1).map((data: any, indexX: any) =>
                                                <TableBody
                                                    key={tabValue}
                                                >
                                                    {data.detalleExam.map((row: any, indexY: any) => (
                                                        <TableRow
                                                            key={indexY}
                                                        >
                                                            <TableCell component="th" scope="row"
                                                                style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                            >
                                                                {row.valorNombre}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row"
                                                                style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                            >
                                                                {row.grupoExamenNombre}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row"
                                                                style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                            >
                                                                <TextField fullWidth id="outlined-basic" label="Ingrese valor" variant="outlined" value={row.valorObtenido} onChange={changeValor(tabValue, indexY)} />
                                                            </TableCell>
                                                            <TableCell component="th" scope="row"
                                                                style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                            >
                                                                {row.unidad === "N/A" ? "" : row.unidad}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row"
                                                                style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                            >
                                                                {row.examenReferencial.map((x: any, indeex: any) =>
                                                                    <div key={indeex}>{x.name}<hr /></div>
                                                                )}
                                                            </TableCell>

                                                        </TableRow>
                                                    ))}

                                                    <TableRow>
                                                        <TableCell colSpan={5} component="th" scope="row"
                                                            style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                            <TextField fullWidth id="outlined-basic" label="Observaciones" variant="outlined" multiline value={data.result === 'null' ? '' : (data.result || '')} onChange={changeValor2(tabValue)} />
                                                        </TableCell>

                                                    </TableRow>
                                                </TableBody>
                                            )}
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </CardContent>
                        </Box>
                    </CardContent>
                </div >
            </Contenido>
        </div>
    )
}