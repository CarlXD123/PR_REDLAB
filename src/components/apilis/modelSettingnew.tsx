import { Box, Button, Grid, InputLabel, MenuItem, Paper, Table, Modal, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from "@mui/material";
import React from "react";
import ReactToPrint from "react-to-print";
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import { getAgreementsAllApi, getRefererApi, getModelsApi, saveMatchDataDetailApi, getMatchEditValueExamApi2, saveMatchDataApi, getMatchAllApi, getHeadquartersAllApi, getAppointmentsApi, reportExamMonthly } from "../../api";
import { Link, useParams} from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import BackupRoundedIcon from '@mui/icons-material/BackupRounded';
import LocalPrintshopRoundedIcon from '@mui/icons-material/LocalPrintshopRounded';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TablePagination from '@mui/material/TablePagination';
import MediationIcon from '@mui/icons-material/Mediation';
import { Contenido } from "../Home";
import moment from 'moment';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { fileURLToPath } from "url";

export default function ModelSettingNew() {
    type Order = 'asc' | 'desc';
    const { idmodelo, id } = useParams();
    const [rows, setRows] = React.useState<any[]>([]);
    const [idValueExam, setIdValueExam] = React.useState<any>('');
    const [valueExam, setValueNomExam] = React.useState<any>('');
    const [rows4, setRows4] = React.useState<any[]>([]);
    const [status, setStatus] = React.useState("ok");
    const [fecha, setFecha] = React.useState<any>("");
    const [fechaCreacion, setFechaCreacion] = React.useState<any>('');


    const [filtros, setFiltros] = React.useState<any>('');
    const [filtros2, setFiltros2] = React.useState<any>('');
    const [textfiltro, setTextFiltro] = React.useState<any>('');
    const [textfiltro2, setTextFiltro2] = React.useState<any>('');
    const [nuevatabla, setNuevaTabla] = React.useState<any>(false);
    const [setting, setSettingnew] = React.useState<any[]>([]);
    const [valueexa, setValueExam] = React.useState<any[]>([]);

    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<string>("");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);
    const dato = localStorage.getItem('dataUser')??"{}"
          
    const info = JSON.parse(dato);
    const style2 = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        bgcolor: 'white',
        border: '1px solid #white',
        borderRadius: "15px",
        boxShadow: 24,
        p: 4,
    };

    const handleCloseNuevaTabla = () => {
        setNuevaTabla(false);
      }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };

    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;


    function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
        const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
        stabilizedThis.sort((a, b) => {
          const order = comparator(a[0], b[0]);
          if (order !== 0) {
            return order;
          }
          return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
      }


    function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
        if (b[orderBy] < a[orderBy]) {
          return -1;
        }
        if (b[orderBy] > a[orderBy]) {
          return 1;
        }
        return 0;
      }

    function getComparator<Key extends keyof any>(
        order: Order,
        orderBy: Key,
      ): (
          a: { [key in Key]: number | string },
          b: { [key in Key]: number | string },
        ) => number {
        return order === 'desc'
          ? (a, b) => descendingComparator(a, b, orderBy)
          : (a, b) => -descendingComparator(a, b, orderBy);
      }

    React.useEffect(() => {
        getModelsApi(ruta).then((x: any) => {
          setRows4(x.data)
        })
        getMatchAllApi().then((ag: any) => {
            let mapeado: any = []
            ag.data?.forEach((d: any) => {
             d.matchexam?.forEach((s: any) =>
             mapeado.push({
                idexamen: s.id,
                namexamen: s.nameex,
                status: s.status,
            })
             )
            });
            setSettingnew(mapeado);
        });

    }, [])

    const ruta = idmodelo;

   
 
    let aux = setting
    const randomColor = Math.floor(Math.random()*16777215).toString(16);


    const ExamCreateModel=()=>{
        Swal.fire({
            title: 'Examen agregado al modelo correctamente!!!',
            icon: 'success',
          })
    }
    
   

  const crearMatchData = (idexa: any) => {
     let numaleatorio = 1;
        getMatchEditValueExamApi2(idexa).then((y: any) => {
          //setFiltExam(mapeado)
      
         // mapeado.map((row: any) =>
            saveMatchDataApi({
              idExamen: idexa,
              idModel: idmodelo,
              Color: status,
              ColorAle: "#" + randomColor,
              //idApilisMatchData: 1,
              //idExamenValue: idExamenValues,
              //fields: fields,
              //createdBy: info.person.displayName,
              //modifiedBy: info.person.displayName,
            }).then((x: any) => {
            //actualizarTabla();
            //ExamCreateModel()
         
            y.data?.forEach((d: any) => {
            saveMatchDataDetailApi(
                {
                idApilisMatchData: x.message.data,
                idExamenValue: d.idvalueexam,
                fields: d.namevalue,
                //priority: Math.floor(Math.random() * 100) + 1,
                priority: numaleatorio++,
                createdBy: info.person.displayName,
                modifiedBy: info.person.displayName,
                }
              ).then((a: any) => {
                if (a.status) {
                  //alert(x.message.text)
                  actualizarTabla();
                  ExamCreateModel()
                } else {
                  return;
                }
              })
            });
            }
            )
          
            //)
          })
    } 

    const modelito = [rows4]
    const handleAdd = async (id: any, name: any, model: any) => {
        var AddNewExamModel=()=>{
        Swal
        .fire({
            title: "Esta seguro de añadir el examen "+name+" al modelo "+model+" ?",
            showCancelButton: true,
            cancelButtonColor: '#0C3DA7',
            confirmButtonColor: '#FB0909',
            confirmButtonText: "Sí",
            cancelButtonText: "No",
        })
        .then(resultado => {
            if (resultado.value) {
                // Hicieron click en "Sí"
                try {
                  setRows([])
                  //await sleep(50)
                   
                  setRows(aux)
    
                  crearMatchData(id)
            
                } catch(error) {
                 
                   
                }
               // DeleteAppointment();
            } else {
                // Dijeron que no
                console.log("*NO se elimina el convenio");
            }
        });
      }
       
        AddNewExamModel()
    
    };
      


  var filtrarexamen = setting.filter((elemento: any)=>{
   
    if(elemento.namexamen.toLowerCase().includes(fechaCreacion.toLowerCase())){
    
        return elemento
    }
  });

  const filtradoexamen = () => {
    setSettingnew(filtrarexamen)
  };

  const limpiarfiltrado = () => {
    getMatchAllApi().then((ag: any) => {
        let mapeado: any = []
        ag.data?.forEach((d: any) => {
         d.matchexam?.forEach((s: any) =>
         mapeado.push({
            idexamen: s.id,
            namexamen: s.nameex,
            status: s.status,
        })
         )
        });
        setSettingnew(mapeado);
        setFechaCreacion("");
    });
  };




  const actualizarTabla = () => {
    getMatchAllApi().then((ag: any) => {
        let mapeado: any = []
        ag.data?.forEach((d: any) => {
         d.matchexam?.forEach((s: any) =>
         mapeado.push({
            idexamen: s.id,
            namexamen: s.nameex,
            status: s.status,
        })
         )
        });
        setSettingnew(mapeado);
    });
  };

  const sortedSettings = setting.sort((a, b) => {
    const nameA = a.namexamen.toUpperCase(); // Convertir el nombre a mayúsculas
    const nameB = b.namexamen.toUpperCase(); // Convertir el nombre a mayúsculas
  
    if (nameA < nameB) {
      return -1; // El primer elemento debe estar antes en la lista
    }
    if (nameA > nameB) {
      return 1; // El primer elemento debe estar después en la lista
    }
  
    return 0; // Los elementos son iguales
  });


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


    const handleChangeFechaCreacion = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFechaCreacion(event.target.value);
    };
    const handleChangFecha = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFecha(event.target.value);
    };
    const handleFiltros = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiltros(event.target.value);
    };

    

    const handleFiltros2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiltros2(event.target.value);
    };

    const handleTextFiltros = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTextFiltro(event.target.value);
    };

    const handleTextFiltros2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTextFiltro2(event.target.value);
    };

    let componente: any;
    

    return (
        <div className='tabla-componente card-table-examfinish'>
        <Contenido>
                <Grid container xs={1000}>
                    <Grid item xs={1000}>
                      <div style={{ borderRadius: '5px', width: "1000px", maxWidth: "100%" }}>
                      <div style={{ marginInline: "50px", marginBlock: "1px"}}>
                      <div style={{ width: "1150px" }} className="nav-tabla">
                        <Grid item xs={15}>
                        {modelito.map((row: any, index: any) => {
                        return ( 
                        <Link to={"/apps/apilis/configure/modelo/"+ idmodelo + "/marca/"+ id +"/setting"}>
                            <div style={{ display: "flex", alignItems: "center" }} >
                            <KeyboardBackspaceRoundedIcon style={{ color: "white", fontSize: "1.3rem", cursor: "pointer" }}></KeyboardBackspaceRoundedIcon>
                                <InputLabel style={{ color: "white", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.6rem", cursor: "pointer"}} >APILIS/ CONFIGURACION / MARCA / MODELO {row.nameModel} / SETTINGS DATA / NUEVO</InputLabel >
                            </div>
                        </Link>
                        )
                        })}
                        </Grid>

                        <Grid container item className='contenedor-tabla-apilis'>
                        <Grid xs={5} mt={1}>
                        <Grid container item xs={1} mt={1}></Grid>
                        <Grid container item xs={1000} mt={1} className='contenedor-tabla-apilis'>

                        <Grid container item xs={1.5} mt={1}>                          
                           
                        </Grid>



                        <Grid xs={5.4} mt={1}>                          
                           <Grid xs={6}>                          
                            <TextField placeholder="Examen" InputProps={{
                                style: {
                                    backgroundColor: "white",
                                    color: "black",
                                    cursor: "pointer",
                                    borderStyle: "revert",
                                    borderColor: "#039be5",
                                    borderWidth: "0.1px",
                                    width: "190px"
                                },     
                            }} type="text" value={fechaCreacion} onChange={handleChangeFechaCreacion}focused id="outlined-basic" variant="outlined" /> 
                           </Grid>
                        </Grid>

                        <Grid container item xs={3.1} mt={1}>                          
                           <Grid container xs={9}>                          
                           <Button onClick={filtradoexamen} variant="contained" style={{ width: '40ch', height: '5.5ch', backgroundColor: "rgb(0 85 169)", color: "white", fontFamily: "Quicksand", fontWeight: "900", fontSize: "1.10rem" }}>Busca</Button> 
                           </Grid>
                        </Grid>

                       
                        <Grid  xs={2} mt={1}>                          
                           <Grid  xs={9}>                          
                           <Button onClick={limpiarfiltrado} variant="contained" style={{ width: '12ch', height: '5.5ch', backgroundColor: "rgb(0 85 169)", color: "white", fontFamily: "Quicksand", fontWeight: "900", fontSize: "1.10rem" }}>Limpiar</Button> 
                           </Grid>
                        </Grid>
                    
                        </Grid>


                        </Grid>

                        </Grid>

                        

                        </div>
                        </div>
                       </div>
                    </Grid>
                </Grid>
            <br></br>
            <div>
            <Grid container>
            <Box sx={{ width: '100%' }} className="card-table-examfinish contenedor-tabla-apilis1">
                <Paper sx={{ width: '100%', borderRadius: "12px", overflowY: "scroll", maxHeight: "30000px", maxWidth: "1500px", mb: 50}} className="contenedor-tabla-apilis1  card-table-general" >
                                    <TableContainer id={"sheetjs"} sx={{width: '100%'}}>
                                        <Table sx={{ width: '100%'}}
                                            aria-labelledby="tableTitle"
                                            size={'medium'}>
                                            <TableHead style={{backgroundColor: "rgb(244 241 241)"}}>
                                                <TableRow>
                                                    <TableCell sx={{width: 30}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Codigo
                                                    </TableCell>
                                                    <TableCell sx={{width: 30}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Examen
                                                    </TableCell>
                                                    <TableCell sx={{width: 30}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Opciones
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            {modelito.map((rowmo: any, index: any) => {
                                                return ( 
                                            <TableBody>
                                               {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                                                  rows.slice().sort(getComparator(order, orderBy)) */}
                                               {stableSort(setting, getComparator(order, orderBy))
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                 .map((row: any, index: any) => {
                                                   const labelId = `enhanced-table-checkbox-${index}`;
                                                  return (
                                                    <TableRow
                                                      hover
                                                      tabIndex={-1}
                                                      key={index}
                                                    >
                                                        <TableCell
                                                        component="th"
                                                        id={labelId}
                                                        scope="row"
                                                        align="center"
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        > 
                                                          {row.idexamen}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                          {row.namexamen}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                            {row.status ? (
                                                             <CheckIcon style={{ color: "green", fontSize: "1.9rem"}}/>
                                                              ) : (
                                                            <Tooltip title="Añadir" followCursor>
                                                              <Button onClick={() =>  handleAdd(row.idexamen,row.namexamen, rowmo.nameModel)} variant="contained" color="primary">
                                                                 <AddCircleOutlineIcon style={{ color: "white", fontSize: "1.9rem", cursor: "pointer" }}/>
                                                              </Button>
                                                            </Tooltip>
                                                            )}
                                                        </TableCell>
                                              
                                                    </TableRow>
                                                );
                                            })}
                                            {emptyRows > 0 && (
                                            <TableRow
                                                style={{
                                                   height: (53) * emptyRows,
                                                }}
                                            >
                                            <TableCell colSpan={6} />
                                            </TableRow>

                                            )}
                                            {
                                              setting.length == 0 ? <TableRow >
                                            <TableCell colSpan={8} >
                                              No tiene Examenes
                                            </TableCell>
                                            </TableRow> : ""
                                            }
                               </TableBody>
                                 )
                                })}
                                        
                            </Table>
                         </TableContainer>
                    <TablePagination
                       rowsPerPageOptions={[20, 100, 200]}
                       component="div"
                       count={setting.length}
                       rowsPerPage={rowsPerPage}
                       page={page}
                       labelRowsPerPage={"Filas por Pagina: "}
                       labelDisplayedRows={
                       ({ from, to, count }) => {
                       return '' + from + '-' + to + ' de ' + count
                       }
                    }
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper >


                <div>
                  <Modal
                    keepMounted
                    open={nuevatabla}
                    onClose={handleCloseNuevaTabla}
                    aria-labelledby="keep-mounted-modal-title"
                    aria-describedby="keep-mounted-modal-description"
                   >
                        <Box sx={style2}>
                        <InputLabel style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.5rem" }} >Filtro por fecha</InputLabel >
                        <Grid container >
                        <Box sx={{ width: '100%' }}>
                            <Grid container mt={2.5} sx={{ placeContent: "center" }}>
                                <InputLabel style={{ color: "black", fontFamily: "Quicksand", fontWeight: "600", fontSize: "1.8rem" }} >REPORTE DE EXAMENES REALIZADOS - RedLab Perú</InputLabel >
                            </Grid>
                            <Grid container mt={2.5}>
                                <Grid item xs={0.5} mt={2.5}></Grid>
                                <Grid item xs={11} mt={2.5}>
                                    <TableContainer id={"sheetjs2"}>
                                        <Table sx={{ minWidth: 750}}
                                            aria-labelledby="tableTitle"
                                            size={'medium'}>
                                            <TableHead>
                                                <TableRow>
                                                <TableCell 
                                                        align="center"
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>
                                                        CODIGO CITA
                                                    </TableCell>
                                                    <TableCell 
                                                        align="center"
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>
                                                        FECHA CITA
                                                    </TableCell>
                                                    <TableCell
                                                        align="center"
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>
                                                        SEDE
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 200 }}
                                                        align="center"
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1rem" }}>
                                                        CONVENIO
                                                    </TableCell>
                                                    <TableCell
                                                        align="center"
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>
                                                        DOCTOR
                                                    </TableCell>
                                                    <TableCell
                                                        align="center"
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>
                                                        APELLIDO PATERNO PACIENTE
                                                    </TableCell>
                                                    <TableCell
                                                        align="center"
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>
                                                        APELLIDO MATERNO PACIENTE
                                                    </TableCell>
                                                    <TableCell
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>
                                                        NOMBRES PACIENTE
                                                    </TableCell>
                                                    <TableCell
                                                        align="center"
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>
                                                        CODIGO PACIENTE
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{ minWidth: 200 }}
                                                        align="center"
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>
                                                        NRO_DOCUMENTO
                                                    </TableCell>
                                                    <TableCell
                                                        align="center"
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>
                                                        GENERO
                                                    </TableCell>
                                                    <TableCell
                                                        align="center"
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>
                                                        EDAD
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{ minWidth: 200 }}
                                                        align="center"
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>
                                                        NACIONALIDAD
                                                    </TableCell>
                                                    <TableCell
                                                        align="center"
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>
                                                        PRECIO
                                                    </TableCell>
                                                    <TableCell
                                                        align="center"
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>
                                                        DESCUENTO
                                                    </TableCell>
                                                    <TableCell
                                                        align="center"
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>
                                                        PRECIO FINAL
                                                    </TableCell>
                                                    <TableCell
                                                        align="center"
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>
                                                        CODIGO REFERIDO
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{ minWidth: 250 }}
                                                        align="center"
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>
                                                        NOTAS DOCTOR
                                                    </TableCell>
                                                    <TableCell
                                                        align="center"
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>
                                                        TELEFONO
                                                    </TableCell>
                                                    <TableCell
                                                        align="center"
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>
                                                        CELULAR
                                                    </TableCell>
                                                    <TableCell
                                                        align="center"
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>
                                                        FECHA NACIMIENTO
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 200 }}
                                                        align="center"
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>
                                                        DISTRITO
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 200 }}
                                                        align="center"
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>
                                                        PROVINCIA
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{ minWidth: 200 }}
                                                        align="center"
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>
                                                        DEPARTAMENTO
                                                    </TableCell>
                                                    <TableCell
                                                        align="center"
                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>
                                                        DIRECCION
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody >
                                                {setting.map((row: any, index: any) =>
                                                    <TableRow
                                                        key={index}
                                                    >
                                                        <TableCell
                                                            align="center" component="th" scope="row"
                                                            style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                            {row.idexamen}
                                                        </TableCell>
                                                        <TableCell align="center" component="th" scope="row"
                                                            style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                            {row.namexamen}
                                                        </TableCell>
                                                        <TableCell align="center" component="th" scope="row"
                                                            style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                            {row.sede}
                                                        </TableCell>
                                                        <TableCell sx={{ minWidth: 200 }} align="center" component="th" scope="row"
                                                            style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                            {row.convenio}
                                                        </TableCell>
                                                        <TableCell align="center" component="th" scope="row"
                                                            style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                            {row.medico}
                                                        </TableCell>
                                                        <TableCell align="center" component="th" scope="row"
                                                            style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                            {row.apP}
                                                        </TableCell>
                                                        <TableCell align="center" component="th" scope="row"
                                                            style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                            {row.apM}
                                                        </TableCell>
                                                        <TableCell align="center" component="th" scope="row"
                                                            style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                            {row.pac2}
                                                        </TableCell>
                                                        <TableCell align="center" component="th" scope="row"
                                                            style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                            {row.idclient}
                                                        </TableCell>
                                                        <TableCell align="center" component="th" scope="row"
                                                            style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                            {row.dni}
                                                        </TableCell>
                                                        
                                                        <TableCell align="center" component="th" scope="row"
                                                            style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                            {row.sexo}
                                                        </TableCell>
                                                        <TableCell align="center" component="th" scope="row"
                                                            style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                            {row.edad}
                                                        </TableCell>
                                                        <TableCell align="center" component="th" scope="row"
                                                            style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                            {row.nationality}
                                                        </TableCell>
                                                        <TableCell align="center" component="th" scope="row"
                                                            style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                            {row.citaprice}
                                                        </TableCell>
                                                        <TableCell align="center" component="th" scope="row"
                                                            style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                            {row.citadescuento}
                                                        </TableCell>
                                                        <TableCell align="center" component="th" scope="row"
                                                            style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                            {row.citafinalprice}
                                                        </TableCell>
                                                        <TableCell align="center" component="th" scope="row"
                                                            style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                            {row.referercode}
                                                        </TableCell>
                                                        <TableCell align="center" component="th" scope="row"
                                                            style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                            {row.doctornotes}
                                                        </TableCell>
                                                        <TableCell align="center" component="th" scope="row"
                                                            style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                            {row.tlfclient}
                                                        </TableCell>
                                                        <TableCell align="center" component="th" scope="row"
                                                            style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                            {row.phoneclient}
                                                        </TableCell>
                                                        <TableCell align="center" component="th" scope="row"
                                                            style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                            {row.birthclient}
                                                        </TableCell>
                                                        <TableCell align="center" component="th" scope="row"
                                                            style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                            {row.distrito}
                                                        </TableCell>
                                                        <TableCell align="center" component="th" scope="row"
                                                            style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                            {row.provincia}
                                                        </TableCell>
                                                        <TableCell align="center" component="th" scope="row"
                                                            style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                            {row.departamento}
                                                        </TableCell>
                                                        <TableCell align="center" component="th" scope="row"
                                                            style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                            {row.direcclient}
                                                        </TableCell>

                                                    </TableRow>
                                                )}
                                            </TableBody>
                                            
                                        </Table>
                                    </TableContainer>
                                </Grid>
                                <Grid item xs={0.5} mt={2.5}></Grid>
                                <Grid container item xs mt={2.5}>
                               <Grid item xs={8} ></Grid>
                            <Grid container item xs={4} spacing={2}>
                              <Grid item xs={20} >
                                <Button onClick={handleCloseNuevaTabla} variant="contained" style={{ backgroundColor: "rgb(0 85 169)", color: "white", fontFamily: "Quicksand", fontWeight: "900", fontSize: "1rem" }}>Cancelar</Button>
                            </Grid>
                
              </Grid>
            </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                        </Box>
                    </Modal>
                </div>


























               
            </Box >
        </Grid>
            </div>

        </Contenido>
    </div>
    );
}


