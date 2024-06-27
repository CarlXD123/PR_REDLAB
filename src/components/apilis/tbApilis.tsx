import { Box, Button, Grid, InputLabel, MenuItem, Paper, Table, Modal, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from "@mui/material";
import React from "react";
import { getAgreementsAllApi, getRefererApi, saveValuesApi, getMonitorAllApi, getHeadquartersAllApi, getAppointmentsApi, reportExamMonthly } from "../../api";
import { Link } from 'react-router-dom';
import BiotechIcon from '@mui/icons-material/Biotech';
import TablePagination from '@mui/material/TablePagination';
import MediationIcon from '@mui/icons-material/Mediation';
import { Contenido } from "../Home";
import moment from 'moment';
import Swal from 'sweetalert2';


export default function TbApilis() {
    type Order = 'asc' | 'desc';
    const [rows, setRows] = React.useState<any[]>([]);
    const [monitor, setMonitor] = React.useState<any[]>([]);

    const [fecha, setFecha] = React.useState<any>("");
    const [fechaCreacion, setFechaCreacion] = React.useState<any>('');
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<string>("");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);

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
        getMonitorAllApi().then((ag: any) => {
          let mapeado: any = []
          ag.data.forEach((d: any) => {
            mapeado.push({
              namecli: d.nameclie,
              clilastnamep: d.clilastnamep,
              clilastnamem: d.clilastnamem,
              nameex:d.nameex,
              idmonitor: d.idmonitor,
              fechaprocess:moment(d.fechaprocess).format('YYYY-MM-DD'),
              field01: d.status,
              codeapi: d.codeapi,
              val01:d.val01,
              val02:d.val02,
              val03:d.val03,
              val04:d.val04,
              val05:d.val05,
              val06:d.val06,
              val07:d.val07,
              val08:d.val08,
              val09:d.val09,
              val10:d.val10,
              val11:d.val11,
              val12:d.val12,
              val13:d.val13,
              val14:d.val14,
              val15:d.val15,
              val16:d.val16,
              val17:d.val17,
              val18:d.val18,
              val19:d.val19,
              val20:d.val20,
              val21:d.val21,
              val22:d.val22,
              val23:d.val23,
              val24:d.val24,
              val25:d.val25,
              val26:d.val26,
              val27:d.val27,
              val28:d.val28,
              val29:d.val29,
              val30:d.val30,
              val31:d.val31,
              val32:d.val32,
              val33:d.val33,
              val34:d.val34,
              val35:d.val35,
              val36:d.val36,
              val37:d.val37,
              val38:d.val38,
              val39:d.val39,
              val40:d.vale40
              ,
            })
          });
            setMonitor(mapeado)
        });
     
    }, [])

   
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

    const datetotal=()=>{
      Swal.fire({
          title: 'Ingresa las dos fechas',
          icon: 'warning',
        })
  }

    const busca = monitor.filter(
      (n: any) => ( n.fechaprocess <= fecha && n.fechaprocess >= fechaCreacion)
    )  

    const filt = () => {
      if (fechaCreacion  == "") {
        fechainitial()
      }
      if (fecha == "") {
        fechasecond()
      }
      if (fechaCreacion == "" && fecha == "") {
        datetotal()
      }
      if(fecha != "" && fechaCreacion!= ""){
        setMonitor(busca);
      }
    }

    const proccess = (codeapi: any, rowData: any) => {
      const values = [];
      for (let i = 1; i <= 40; i++) {
        const columnName = `val${i.toString().padStart(2, '0')}`;
        const value = rowData[columnName];
        values.push(value);
        console.log(value)
        console.log(columnName)
      }
    
      saveValuesApi({ codeapi, values })
      .then((response: any) => {
      // Manejar la respuesta del backend si es necesario
      })
      .catch((error: any) => {
      // Manejar el error si ocurre
      });
    }
    
    const clean = () => {
      getMonitorAllApi().then((ag: any) => {
        let mapeado: any = []
        ag.data.forEach((d: any) => {
          mapeado.push({
            namecli: d.nameclie,
            clilastnamep: d.clilastnamep,
            clilastnamem: d.clilastnamem,
            nameex:d.nameex,
            idmonitor: d.idmonitor,
            fechaprocess:moment(d.fechaprocess).format('YYYY-MM-DD'),
            field01: d.status,
            codeapi: d.codeapi,
            val01:d.val01,
            val02:d.val02,
            val03:d.val03,
            val04:d.val04,
            val05:d.val05,
            val06:d.val06,
            val07:d.val07,
            val08:d.val08,
            val09:d.val09,
            val10:d.val10,
            val11:d.val11,
            val12:d.val12,
            val13:d.val13,
            val14:d.val14,
            val15:d.val15,
            val16:d.val16,
            val17:d.val17,
            val18:d.val18,
            val19:d.val19,
            val20:d.val20,
            val21:d.val21,
            val22:d.val22,
            val23:d.val23,
            val24:d.val24,
            val25:d.val25,
            val26:d.val26,
            val27:d.val27,
            val28:d.val28,
            val29:d.val29,
            val30:d.val30,
            val31:d.val31,
            val32:d.val32,
            val33:d.val33,
            val34:d.val34,
            val35:d.val35,
            val36:d.val36,
            val37:d.val37,
            val38:d.val38,
            val39:d.val39,
            val40:d.vale40
            ,
          })
        });
          setMonitor(mapeado)
      });
      setFecha("");
      setFechaCreacion("");
    }
   
    const handleChangeFechaCreacion = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFechaCreacion(event.target.value);
    };
    const handleChangFecha = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFecha(event.target.value);
    };

    let componente: any;


    return (
        <div className='tabla-componente' style={{overflowY: "scroll"}}>
        <Contenido>
                <Grid container xs={200}>
                    <Grid item xs={300}>
                      <div style={{ borderRadius: '5px', width: "950px", maxWidth: "100%" }}>
                      <div style={{ marginInline: "50px", marginBlock: "1px"}}>
                      <div style={{ width: "1150px" }} className="nav-tabla">
                        <Grid item xs={4}>
                            <div style={{ display: "flex", alignItems: "center" }} >
                                <MediationIcon style={{ color: "white", fontSize: "35px" }}></MediationIcon>
                                <InputLabel style={{ color: "white", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.6rem"}} >APILIS</InputLabel >
                            </div>
                        </Grid>
                      </div>

                        <Grid container item className='contenedor-tabla-apilis'>
                        <Grid xs={5.3} mt={1}>
                        <Grid container item xs={1} mt={1}></Grid>
                        <Grid container item xs={30} mt={1} className='contenedor-tabla-apilis'>

                        <Grid container item xs={1.5} mt={1}>                          
                           
                        </Grid>



                        <Grid container item xs={4.5} mt={1}>                          
                           <Grid container item xs={15}>                          
                            <TextField InputProps={{
                                style: {
                                    backgroundColor: "white",
                                    color: "black",
                                    cursor: "pointer",
                                    borderStyle: "revert",
                                    borderColor: "#039be5",
                                    borderWidth: "0.1px",
                                    maxWidth: "520px"
                                },     
                            }} type="date" value={fechaCreacion} onChange={handleChangeFechaCreacion}focused id="outlined-basic" variant="outlined" /> 
                           </Grid>
                        </Grid>

                       
                        <Grid container item xs={4.5} mt={1}>                          
                           <Grid container item xs={15}>                          
                           <TextField InputProps={{
                                style: {
                                    backgroundColor: "white",
                                    color: "black",
                                    cursor: "pointer",
                                    borderStyle: "revert",
                                    borderColor: "#039be5",
                                    borderWidth: "0.1px",
                                    maxWidth: "520px"
                                },     
                            }} type="date" value={fecha} onChange={handleChangFecha} focused id="outlined-basic"  variant="outlined" />      
                           </Grid>
                        </Grid>

                        
                        
                        </Grid>


                        </Grid>

    
                        <Grid>
                        <Grid container item className='contenedor-tabla-apilis contenedor-tabla-apilis2'>

                        <Grid item xs={4} mt={0.1}>
                                <Tooltip title="Limpiar" followCursor>
                                    <Button onClick={clean} fullWidth variant="contained" style={{ width: '15.5ch', height: '3.4ch', backgroundColor: "rgb(0 85 169)", color: "white", fontFamily: "Quicksand", fontWeight: "900", fontSize: "1.10rem" }}>
                                      Limpiar
                                    </Button>
                                </Tooltip>
                        </Grid>

                        <Grid item xs={0.5} mt={2.5}></Grid>
                        <Grid item xs={0.5} mt={2.5}></Grid>
                        <Grid item xs={0.5} mt={2.5}></Grid>
                        <Grid item xs={0.5} mt={2.5}></Grid>
                        <Grid item xs={0.5} mt={2.5}></Grid>
                        
                        <Grid item xs={4} mt={0.1}>
                                <Grid item xs={6} >
                                <Link to={'/apps/apilis/configure'}>
                                    <Tooltip title="Configurar" followCursor>
                                       <Button  variant="contained"  style={{ width: '15.5ch', height: '3.4ch', backgroundColor: "rgb(0 85 169)", color: "white", fontFamily: "Quicksand", fontWeight: "900", fontSize: "1.10rem" }}>Configurar</Button> 
                                    </Tooltip>
                                </Link>
                                 </Grid>
                                
                        </Grid>

                        </Grid>
                        
                        <Grid item xs={0.5} mt={2.5}></Grid>
                        <Grid item xs={0.5} mt={2.5}></Grid>
                     
                       
                        
                        <Grid container item>

                        <Grid item xs={5} mt={0.1}>
                                <Tooltip title="Buscar" followCursor>
                                    <Button onClick={filt} fullWidth variant="contained" style={{ width: '15.5ch', height: '3.4ch', backgroundColor: "rgb(0 85 169)", color: "white", fontFamily: "Quicksand", fontWeight: "900", fontSize: "1.10rem" }}>
                                      Buscar
                                    </Button>
                                </Tooltip>
                        </Grid>

                        <Grid item xs={0.5} mt={2.5}></Grid>
                        <Grid item xs={0.5} mt={2.5}></Grid>
                        <Grid item xs={0.5} mt={2.5}></Grid>
                        <Grid item xs={0.5} mt={2.5}></Grid>
                        <Grid item xs={0.5} mt={2.5}></Grid>
                        
                        </Grid>


                        </Grid>
                        </Grid>
                    


                        </div>
                       </div>
                    </Grid>
                </Grid>
            <br></br>
            <div style={{height: "500px"}}>
            <Grid container>
            <Box sx={{ width: '100%' }} className="contenedor-tabla-apilis1">
                <Paper sx={{ width: '100%', borderRadius: "12px"}} className="contenedor-tabla-apilis1  card-table-general" >
                                    <TableContainer id={"sheetjs"} style={{maxHeight: 300, overflow: "scroll", overflowX: "scroll", maxWidth: 1000}}>
                                        <Table
                                            aria-labelledby="tableTitle"
                                            size={'medium'}>
                                            <TableHead style={{backgroundColor: "rgb(244 241 241)", zIndex: 1, position: "sticky", top: 0, overflow: "auto" }}>
                                                <TableRow>
                                                    <TableCell sx={{minWidth: 50}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Codigo
                                                    </TableCell>
                                                    <TableCell sx={{minWidth: 50}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Cod.Apilis
                                                    </TableCell>
                                                    <TableCell sx={{minWidth: 70}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Paciente
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 150}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Examen
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 122}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Fecha Proceso
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Estado
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Procesamiento
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 01
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 02
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 03
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 04
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 05
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 06
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 07
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 08
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 09
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 10
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 11
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 12
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 13
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 14
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 15
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 16
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 17
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 18
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 19
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 20
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 21
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 22
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 23
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 24
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 25
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 26
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 27
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 28
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 29
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 30
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 31
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 32
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 33
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 34
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 35
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 36
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 37
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 38
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 39
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 190}}
                                                        align="center"
                                                        style={{ color: "grey", fontFamily: "Quicksand", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        Valor 40
                                                    </TableCell>
                                                   
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                               {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                                                  rows.slice().sort(getComparator(order, orderBy)) */}
                                               {stableSort(monitor, getComparator(order, orderBy))
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
                                                          {row.idmonitor}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                          {row.codeapi}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                          {row.namecli}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.nameex}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.fechaprocess}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{
                                                            backgroundColor: row.field01 === 'A' ? 'lightgreen' : 'red',  // Cambia el color de fondo dependiendo del estado
                                                            color: "black", 
                                                            fontFamily: "Quicksand", 
                                                            fontWeight: "400", 
                                                            fontSize: "1.1rem" ,
                                                            cursor: "pointer"
                                                          }}
                                                          title={row.field01 === 'A' ? 'Todo salio bien' : row.field01 === 'error' ? 'Error' : 'Error al procesar el api'}
                                                        >
                                                             {row.field01 === 'A' ? 'Procesado' : row.field01 === 'error' ? 'Error' : 'Error'}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                         {row.field01 === 'A' && (
                                                          <Tooltip title="Procesar" followCursor>
                                                            <Button 
                                                               onClick={() => proccess(row.codeapi,  
                                                                {
                                                                  val01: row.val01, val02: row.val02, val03: row.val03, val04: row.val04, val05: row.val05, val06: row.val06, val07: row.val07, val08: row.val08, val09: row.val09, val10: row.val10, val11: row.val11, val12: row.val12, val13: row.val13, val14: row.val14, val15: row.val15, val16: row.val16, val17: row.val17, val18: row.val18, val19: row.val19, val20: row.val20, val21: row.val21, val22: row.val22, val23: row.val23, val24: row.val24, val25: row.val25, val26: row.val26, val27: row.val27, val28: row.val28, val29: row.val29, val30: row.val30, val31: row.val31, val32: row.val32, val33: row.val33, val34: row.val34,  val35: row.val35, val36: row.val36, val37: row.val37, val38: row.val38, val39: row.val39, val40: row.val40
                                                                })} 
                                                                variant="contained" 
                                                                className='boton-icon'>
                                                                     <BiotechIcon style={{ color: "white", fontSize: "30px" }}></BiotechIcon>
                                                             </Button>
                                                           </Tooltip>
                                                         )}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val01}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val02}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val03}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val04}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val05}
                                                        </TableCell>

                                                        <TableCell
                                                         align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val06}
                                                        </TableCell>

                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val07}
                                                        </TableCell>

                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val08}
                                                        </TableCell>

                                                        <TableCell
                                                          align="center" 
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val09}
                                                        </TableCell>

                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val10}
                                                        </TableCell>

                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val11}
                                                        </TableCell>

                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val12}
                                                        </TableCell>

                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val13}
                                                        </TableCell>

                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val14}
                                                        </TableCell>

                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val15}
                                                        </TableCell>

                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val16}
                                                        </TableCell>

                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val17}
                                                        </TableCell>

                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val18}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val19}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val20}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val21}
                                                        </TableCell>
                                                        <TableCell
                                                         align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val22}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val23}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val24}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val25}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val26}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val27}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val28}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val29}
                                                        </TableCell>
                                                        <TableCell
                                                           align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val30}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val31}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val32}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val33}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val34}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val35}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val36}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val37}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val38}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val39}
                                                        </TableCell>
                                                        <TableCell
                                                          align="center"
                                                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                        >
                                                        {row.val40}
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
                                              monitor.length == 0 ? <TableRow >
                                            <TableCell colSpan={8} >
                                              No tiene Procesos
                                            </TableCell>
                                            </TableRow> : ""
                                            }
                               </TableBody>
                                        
                            </Table>
                         </TableContainer>
                    <TablePagination
                       rowsPerPageOptions={[20, 100, 200]}
                       component="div"
                       count={monitor.length}
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
            </Box >
        </Grid>
            </div>

        </Contenido>
    </div>
    );
}


