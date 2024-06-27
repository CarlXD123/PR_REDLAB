import { Box, Button, Grid, InputLabel, MenuItem, Paper, Table, Modal, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from "@mui/material";
import React from "react";
import ReactToPrint from "react-to-print";
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import { getAgreementsAllApi, getRefererApi, getHeadquartersAllApi, getAppointmentsApi, reportExamMonthly } from "../../../api";
import { Link } from 'react-router-dom';
import { months } from "../../../constant";
import BackupRoundedIcon from '@mui/icons-material/BackupRounded';
import LocalPrintshopRoundedIcon from '@mui/icons-material/LocalPrintshopRounded';
import { Contenido } from "../../Home";
import TbReporte from "./tbReporte";
import moment from 'moment';
import TbCitasDate from "./tbCitasDate";
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

export default function TbReportExamFinish() {
    const ExcelJS = require("exceljs");
    const [rowstotal, setVSumTotal] = React.useState(0);
    const [rows, setRows] = React.useState<any[]>([]);
    const [rows2, setRows2] = React.useState<any[]>([]);
    const [rows3, setRows3] = React.useState<any[]>([]);

    const [fecha, setFecha] = React.useState<any>("");
    const [fechaCreacion, setFechaCreacion] = React.useState<any>('');
    const [bloqueaboton, setBloquearBoton] = React.useState<any>(true);

    const [filtros, setFiltros] = React.useState<any>('');
    const [filtros2, setFiltros2] = React.useState<any>('');
    const [textfiltro, setTextFiltro] = React.useState<any>('');
    const [textfiltro2, setTextFiltro2] = React.useState<any>('');
    const [nuevatabla, setNuevaTabla] = React.useState<any>(false);
    const [dia, setDia] = React.useState<any>('');
    const [mes, setMes] = React.useState<any>('');
    const [anio, setAnio] = React.useState<any>('');
    const tableRef = React.useRef(null);
    const [convenioList, setConvenioList] = React.useState<any[]>([]);
    const [convenio, setConvenio] = React.useState<any>('');
    const [sedeList, setSedeList] = React.useState<any[]>([]);
    const [referenciaList, setReferenciaList] = React.useState<any[]>([]);
    const [sede, setSede] = React.useState<any>('');
    const [docTitle, setDocTitle] = React.useState<any>("");
    const [rowsExamenes, setRowsExamenes] = React.useState<any[]>([]);


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


    React.useEffect(() => {
        getHeadquartersAllApi().then((ag: any) => {
            setSedeList(ag.data);
        });
        getRefererApi().then((ag: any) => {
            setReferenciaList(ag.data);
        });
        getAgreementsAllApi().then((ag: any) => {
            setConvenioList(ag.data);
        });
        getAppointmentsApi(0, 1000, "E", "").then((ag: any) => {
            let mapeado: any = []
            let mapeado2: any = []
            ag.data?.forEach((d: any) => {
                mapeado.push({
                    id: d.id,
                    codigo: d.code,
                    fecha: d.dateAppointmentEU,
                    fechaCreada: moment(d.createdAt).format('YYYY-MM-DD'),
                    fechaFiltro: d.dateAppointment,
                    hora: d.time12h,
                    codigoRef: d.refererCode,
                    referencia: d.Referer.name,
                    tipoDocumento: d.client.dni,
                    pac2: d.client.name,
                    apP: d.client.lastNameP,
                    apM: d.client.lastNameM,
                    paciente: d.client.lastNameP + " " + d.client.lastNameM + "," + d.client.name,
                    precio: d.totalPrice == null ? "" : d.totalPrice,
                    descuento: d.discount == null ? "" : "S/. " + d.discount,
                    precioFinal: d.finalPrice == null ? "" : "S/. " + d.finalPrice,

                    nombreCompleto: d.client.name + " " + d.client.lastNameP + " " + d.client.lastNameM,
                    edad: d.client.years + " años",
                    dni: d.client.dni,
                    idclient: d.client.id,
                    sexo: d.client.genderStr,
                    medico: d.Doctor.name,
                    sede: d.headquarter.name,
                    sedecode: d.HeadquarterId,
                    referenciaid: d.RefererId,

                    typeemployee: d.Employee.nametype,
                    citaprice: d.totalPrice,
                    citadescuento: d.discount,
                    citafinalprice: d.finalPrice,
                    referercode: d.refererCode,
                    doctornotes: d.doctorNotes,
                    tlfclient: d.client.tlfNumber,
                    phoneclient: d.client.phoneNumber,
                    birthclient: d.client.birthDate,
                    direcclient: d.client.address,
                    nationality: d.client.nationality,
                    distrito: d.District.name,
                    provincia: d.Provinces.name,
                    departamento: d.Region.name,
                    convenio: d.Convenio.name,
                    examen1: d.Exam.exam.length == 0 ? [0] : d.Exam.exam,
                })

                setRows3(mapeado2)
                setRowsExamenes(mapeado)
                setRows2(mapeado)

            });
        });

    }, [])


    let dateNow = moment().format('YYYY-MM-DD');
    let HourNow = moment().format('H-m-s');


    const busca = rows2.filter(
        (n: any) => (n.fechaFiltro <= fecha && n.fechaFiltro >= fechaCreacion)
    )

    const busca2 = rows2.filter((elemento: any) => {

        if (parseInt(textfiltro) == elemento.sedecode) {


            return elemento.sede

        }

    });

    const busca3 = rows2.filter((elemento: any) => {

        if (parseInt(textfiltro2) == elemento.referenciaid) {


            return elemento.referencia

        }

    });

    const busca4 = busca.filter((elemento: any) => {

        if (parseInt(textfiltro) == elemento.sedecode) {


            return elemento.sede

        }

    });

    const busca5 = busca.filter((elemento: any) => {

        if (parseInt(textfiltro2) == elemento.referenciaid) {


            return elemento.referencia

        }

    });

    const busca6 = busca2.filter((elemento: any) => {

        if (parseInt(textfiltro2) == elemento.referenciaid && textfiltro != "") {


            return elemento.referencia

        }

    });

    const busca7 = busca.filter((elemento: any) => {

        if (parseInt(textfiltro2) == elemento.referenciaid && parseInt(textfiltro) == elemento.sedecode) {


            return elemento.fechaFiltro <= fecha && elemento.fechaFiltro >= fechaCreacion

        }

    });


    const fechatotal = () => {
        Swal.fire({
            title: 'Por favor, ingrese un filtro',
            icon: 'warning',
        })
    }

    const otrosfilt = () => {
        Swal.fire({
            title: 'Por favor, ingrese uno de los filtros',
            icon: 'warning',
        })
    }

    const fechainitial = () => {
        Swal.fire({
            title: 'Ingrese la fecha inicial por favor',
            icon: 'warning',
        })
    }

    const fechasecond = () => {
        Swal.fire({
            title: 'Ingrese la fecha secundaria por favor',
            icon: 'warning',
        })
    }


    let uniqueSedes = Array.from(new Set(rows.map(item => item.sede)));

    const exportExcelFile = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Reporte Examenes Realizados");

        sheet.getRow(1).border = {
            top: { color: { argb: "#060606" } },
            left: { color: { argb: "#060606" } },
            bottom: { color: { argb: "#060606" } },
            right: { color: { argb: "#060606" } },
        };

        sheet.getRow(1).fill = {
            type: "pattern",
            fgColor: { argb: "#060606" },
        };

        sheet.getRow(1).font = {
            name: "Arial",
            family: 4,
            size: 12,
            bold: true,
        };

        sheet.columns = [
            {
                header: "Fecha",
                key: "fecha",
                width: 15,
            },
            { header: "Codigo Cita", key: "codigo", width: 20 },
            {
                header: "Convenio",
                key: "convenio",
                width: 25,
            },
            {
                header: "Referencia",
                key: "referencia",
                width: 25,
            },
            {
                header: "Codigo Referido",
                key: "codigoref",
                width: 25,
            },
            {
                header: "N° Documento",
                key: "nrodocumento",
                width: 25,
            },
            {
                header: "Apellido y Nombres",
                key: "paciente",
                width: 40,
            },
            {
                header: "Edad",
                key: "edad",
                width: 15,
            },
            {
                header: "Examenes",
                key: "examen1",
                width: 30,
            },
            {
                header: "Precios",
                key: "precios",
                width: 20,
            },
            {
                header: "Total",
                key: "precio",
                width: 8,
            },
        ];

        // Insertamos una fila en blanco al principio.
        sheet.spliceRows(0, 0, []);
        sheet.spliceRows(0, 0, []);
        sheet.spliceRows(0, 0, []);
        // Insertamos la fila de la sede en la primera fila y la hacemos negrita.
        uniqueSedes.forEach((sede, index) => {
            const cell = sheet.getRow(1).getCell(5);
            cell.value = "SEDE: " + sede;
            cell.font = { bold: true, name: 'Arial', size: 12 };
        });

        sheet.spliceRows(0, 0, []);
        sheet.spliceRows(0, 0, []);

        // Insertamos la fila de la sede en la primera fila y la hacemos negrita.
        const cell = sheet.getRow(1).getCell(4);
        cell.value = "REPORTE DE EXAMENES REALIZADOS - RedLab Perú";
        cell.font = { bold: true, name: 'Arial', size: 12 };


        const promise = Promise.all([
            rows.map(async (product: any, index: any) => {
                {
                    product.examen1.map((x: any, indeex: any) => {
                        const row = sheet.addRow({
                            fecha: product.fecha,
                            codigo: product.codigo,
                            referencia: product.referencia,
                            codigoref: product.codigoRef,
                            nrodocumento: product.dni,
                            paciente: product.paciente,
                            edad: product.edad,
                            precio: "S/." + product.precio,
                            convenio: product.convenio,
                            examen1: x.listaexamen == "" ? "" : x.listaexamen,
                            precios: x.listaprecios == null ? "" : "S/." + x.listaprecios,
                        });

                        row.eachCell((cell: any) => {
                            cell.font = { name: 'Arial', size: 10 }; // Cambia 'Calibri' por el nombre de la fuente que deseas utilizar.
                        });

                    })
                }
            }),
            sheet.addRow({
                precios: "S/." + rowstotal,
                precio: "S/." + rowstotal,
            })
        ]
        );

        promise.then(() => {
            workbook.xlsx.writeBuffer().then(function (data: any) {
                const blob = new Blob([data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                const url = window.URL.createObjectURL(blob);
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = `Examenes_realizados_${dateNow}_${HourNow}.xlsx`;
                anchor.click();
                window.URL.revokeObjectURL(url);
            });
        });

    }




    const exportExcelFile2 = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Reporte Examenes Realizados");

        sheet.getRow(1).border = {
            top: { color: { argb: "#060606" } },
            left: { color: { argb: "#060606" } },
            bottom: { color: { argb: "#060606" } },
            right: { color: { argb: "#060606" } },
        };

        sheet.getRow(1).fill = {
            type: "pattern",
            fgColor: { argb: "#060606" },
        };

        sheet.getRow(1).font = {
            name: "Arial",
            family: 4,
            size: 12,
            bold: true,
        };

        sheet.columns = [
            {
                header: "Fecha",
                key: "fecha",
                width: 15,
            },
            { header: "Codigo Cita", key: "codigo", width: 20 },
            {
                header: "Registrado por",
                key: "userok",
                width: 25,
            },
            {
                header: "Convenio",
                key: "convenio",
                width: 25,
            },
            {
                header: "Referencia",
                key: "referencia",
                width: 25,
            },
            {
                header: "Codigo Referido",
                key: "codigoref",
                width: 25,
            },
            {
                header: "N° Documento",
                key: "nrodocumento",
                width: 25,
            },
            {
                header: "Apellido y Nombres",
                key: "paciente",
                width: 40,
            },
            {
                header: "Edad",
                key: "edad",
                width: 15,
            },
            {
                header: "Examenes",
                key: "examen1",
                width: 30,
            },
            {
                header: "Precios",
                key: "precios",
                width: 20,
            },
            {
                header: "Total",
                key: "precio",
                width: 8,
            },
        ];

        // Insertamos una fila en blanco al principio.
        sheet.spliceRows(0, 0, []);
        sheet.spliceRows(0, 0, []);
        sheet.spliceRows(0, 0, []);
        // Insertamos la fila de la sede en la primera fila y la hacemos negrita.
        uniqueSedes.forEach((sede, index) => {
            const cell = sheet.getRow(1).getCell(5);
            cell.value = "SEDE: " + sede;
            cell.font = { bold: true, name: 'Arial', size: 12 };
        });

        sheet.spliceRows(0, 0, []);
        sheet.spliceRows(0, 0, []);

        // Insertamos la fila de la sede en la primera fila y la hacemos negrita.
        const cell = sheet.getRow(1).getCell(4);
        cell.value = "REPORTE DE EXAMENES REALIZADOS - RedLab Perú";
        cell.font = { bold: true, name: 'Arial', size: 12 };


        const promise = Promise.all([
            rows.map(async (product: any, index: any) => {
                {
                    product.examen1.map((x: any, indeex: any) => {
                        const row = sheet.addRow({
                            fecha: product.fecha,
                            codigo: product.codigo,
                            userok: product.typeemployee,
                            referencia: product.referencia,
                            codigoref: product.codigoRef,
                            nrodocumento: product.dni,
                            paciente: product.paciente,
                            edad: product.edad,
                            precio: "S/." + product.precio,
                            convenio: product.convenio,
                            examen1: x.listaexamen == "" ? "" : x.listaexamen,
                            precios: x.listaprecios == null ? "" : "S/." + x.listaprecios,
                        });

                        row.eachCell((cell: any) => {
                            cell.font = { name: 'Arial', size: 10 }; // Cambia 'Calibri' por el nombre de la fuente que deseas utilizar.
                        });

                    })
                }
            }),
            sheet.addRow({
                precios: "S/." + rowstotal,
                precio: "S/." + rowstotal,
            })
        ]
        );

        promise.then(() => {
            workbook.xlsx.writeBuffer().then(function (data: any) {
                const blob = new Blob([data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                const url = window.URL.createObjectURL(blob);
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = `Examenes_realizados_${dateNow}_${HourNow}.xlsx`;
                anchor.click();
                window.URL.revokeObjectURL(url);
            });
        });
    }


    const filt = () => {

        if (fechaCreacion == "" && fecha == "" && textfiltro == "" && textfiltro2 == "") {
            fechatotal()
            return;
        }


        if (fechaCreacion != "" || fecha != "" || textfiltro != "" || textfiltro2 != "") {
            //Filtro por fecha
            if (fecha != "" && fechaCreacion != "") {
                const nombtitle = `Reporte_de_examenes_realizados_${dateNow}_${HourNow}`

                setDocTitle(nombtitle)

                setRows(busca)
                const sumar = busca.map((o) => parseFloat(o.citaprice))
                    .reduce((previous, current) => {
                        return previous + current;
                    }, 0);
                setVSumTotal(sumar);
            }

            //Filtro por sedes
            if (textfiltro != "") {

                const nombtitle = `Reporte_de_examenes_realizados_${dateNow}_${HourNow}`

                setDocTitle(nombtitle)
                setRows(busca2)
                const sumar = busca2.map((o) => parseFloat(o.citaprice))
                    .reduce((previous, current) => {
                        return previous + current;
                    }, 0);
                setVSumTotal(sumar);
            }

            //Filtro por referencia
            if (textfiltro2 != "") {

                const nombtitle = `Reporte_de_examenes_realizados_${dateNow}_${HourNow}`

                setDocTitle(nombtitle)
                setRows(busca3)
                const sumar = busca3.map((o) => parseFloat(o.citaprice))
                    .reduce((previous, current) => {
                        return previous + current;
                    }, 0);
                setVSumTotal(sumar);
            }

            //Filtro por sede al filtro de fecha
            if (textfiltro != "" && fecha != "" && fechaCreacion != "") {

                const nombtitle = `Reporte_de_examenes_realizados_${dateNow}_${HourNow}`

                setDocTitle(nombtitle)
                setRows(busca4)
                const sumar = busca4.map((o) => parseFloat(o.citaprice))
                    .reduce((previous, current) => {
                        return previous + current;
                    }, 0);
                setVSumTotal(sumar);
            }


            //Filtro por sede al filtro de fecha
            if (textfiltro2 != "" && fecha != "" && fechaCreacion != "") {

                const nombtitle = `Reporte_de_examenes_realizados_${dateNow}_${HourNow}`

                setDocTitle(nombtitle)
                setRows(busca5)
                const sumar = busca5.map((o) => parseFloat(o.citaprice))
                    .reduce((previous, current) => {
                        return previous + current;
                    }, 0);
                setVSumTotal(sumar);
            }

            //Filtro por referencia al filtro por sedes
            if (textfiltro2 != "" && textfiltro != "") {

                const nombtitle = `Reporte_de_examenes_realizados_${dateNow}_${HourNow}`

                setDocTitle(nombtitle)
                setRows(busca6)
                const sumar = busca6.map((o) => parseFloat(o.citaprice))
                    .reduce((previous, current) => {
                        return previous + current;
                    }, 0);
                setVSumTotal(sumar);
            }


            //Filtro por referencia y sedes al filtro de fecha
            if (textfiltro2 != "" && textfiltro != "" && fechaCreacion != "" && fecha != "") {

                const nombtitle = `Reporte_de_examenes_realizados_${dateNow}_${HourNow}`

                setDocTitle(nombtitle)
                setRows(busca7)
                const sumar = busca7.map((o) => parseFloat(o.citaprice))
                    .reduce((previous, current) => {
                        return previous + current;
                    }, 0);
                setVSumTotal(sumar);
            }


            exportarExcel()
        }
    }



    const borrarFitro = () => {
        setRows(rows3)
        setVSumTotal(0)
        setBloquearBoton(true)
        setFecha("")
        setFechaCreacion("")
        setTextFiltro("")
        setTextFiltro2("")
    }

    const exportarExcel = () => {
        if (busca.length > 0) {
            setBloquearBoton(false)
        } else if (busca2.length > 0) {
            setBloquearBoton(false)
        } else if (busca3.length > 0) {
            setBloquearBoton(false)
        } else if (busca4.length > 0) {
            setBloquearBoton(false)
        } else if (busca5.length > 0) {
            setBloquearBoton(false)
        } else if (busca6.length > 0) {
            setBloquearBoton(false)
        } else if (busca7.length > 0) {
            setBloquearBoton(false)
        } else if (busca.length == 0) {
            setBloquearBoton(true)
        } else if (busca2.length == 0) {
            setBloquearBoton(true)
        } else if (busca3.length == 0) {
            setBloquearBoton(true)
        } else if (busca4.length == 0) {
            setBloquearBoton(true)
        } else if (busca5.length == 0) {
            setBloquearBoton(true)
        } else if (busca6.length == 0) {
            setBloquearBoton(true)
        } else if (busca7.length == 0) {
            setBloquearBoton(true)
        } else if (rows.length == 0) {
            setBloquearBoton(true)
        }
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
                <Grid container xs={200}>
                    <Grid item xs={300}>
                        <div style={{ borderRadius: '5px', width: "1200px", maxWidth: "100%" }}>
                            <div style={{ marginInline: "50px", marginBlock: "1px" }}>
                                <Grid item xs={4}>
                                    <Link to={"/apps/report/exam"}>
                                        <div style={{ display: "flex", alignItems: "center" }} >
                                            <KeyboardBackspaceRoundedIcon style={{ color: "white", fontSize: "1.3rem", cursor: "pointer" }}></KeyboardBackspaceRoundedIcon>
                                            <InputLabel style={{ color: "white", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.6rem", cursor: "pointer" }} >Reportes / Examenes Realizados</InputLabel >
                                        </div>
                                    </Link>
                                </Grid>

                                <Grid container item>
                                    <Grid xs={6.3} mt={1}>
                                        <Grid container item xs={30} mt={1}>
                                            <Grid container item xs={3} mt={1}>
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
                                                    }} type="date" value={fechaCreacion} onChange={handleChangeFechaCreacion} focused id="outlined-basic" variant="outlined" />
                                                </Grid>
                                            </Grid>


                                            <Grid container item xs={3.2} mt={1}>
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
                                                    }} type="date" value={fecha} onChange={handleChangFecha} focused id="outlined-basic" variant="outlined" />
                                                </Grid>
                                            </Grid>

                                            <Grid container xs={0.2} mt={1}></Grid>

                                            <Grid container item xs={2.5} mt={1}>
                                                <Grid container item xs={15}>
                                                    <TextField id="outlined-basic" label="Sede" variant="outlined"
                                                        select fullWidth value={textfiltro} onChange={handleTextFiltros}

                                                        InputProps={{
                                                            style: {
                                                                backgroundColor: "white",
                                                                color: "black",
                                                                cursor: "pointer",
                                                                borderStyle: "revert",
                                                                borderColor: "#039be5",
                                                                borderWidth: "0.1px",
                                                                maxWidth: "320px"
                                                            },
                                                        }}
                                                    >
                                                        {sedeList.map((row: any, index: any) => {
                                                            return (
                                                                <MenuItem key={index} value={row.id}>{row.name}</MenuItem>
                                                            )
                                                        })}
                                                    </TextField>
                                                </Grid>
                                            </Grid>
                                            <Grid container xs={0.5} mt={1}></Grid>
                                            <Grid container item xs={2.6} mt={1}>
                                                <Grid container item xs={15}>
                                                    <TextField id="outlined-basic" label="Referencia" variant="outlined"
                                                        select fullWidth value={textfiltro2} onChange={handleTextFiltros2}

                                                        InputProps={{
                                                            style: {
                                                                backgroundColor: "white",
                                                                color: "black",
                                                                cursor: "pointer",
                                                                borderStyle: "revert",
                                                                borderColor: "#039be5",
                                                                borderWidth: "0.1px",
                                                                maxWidth: "320px"
                                                            },
                                                        }}
                                                    >
                                                        {referenciaList.map((row: any, index: any) => {
                                                            return (
                                                                <MenuItem key={index} value={row.id}>{row.refererName}</MenuItem>
                                                            )
                                                        })}
                                                    </TextField>
                                                </Grid>
                                            </Grid>
                                        </Grid>


                                    </Grid>

                                    <Grid container item xs={2} mt={1}> </Grid>
                                    <Grid item xs={0.2} mt={2.5}></Grid>



                                    <Grid>
                                        <Grid container item>

                                            <Grid item xs={5} mt={0.1}>
                                                <Tooltip title="Generar Reporte" followCursor>
                                                    <Button onClick={filt} fullWidth variant="contained" style={{ width: '15.5ch', height: '3.4ch', backgroundColor: "rgb(0 85 169)", color: "white", fontFamily: "Quicksand", fontWeight: "900", fontSize: "1.20rem" }}>
                                                        Generar
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
                                                    <ReactToPrint
                                                        trigger={() => (
                                                            <Button disabled={bloqueaboton} variant="contained" style={{ width: '15.5ch', height: '3.4ch', backgroundColor: "rgb(0 85 169)", color: "white", fontFamily: "Quicksand", fontWeight: "900", fontSize: "1.20rem" }}>Imprimir</Button>
                                                        )}
                                                        content={() => componente}
                                                        pageStyle="@page {  size: A4 landscape; }"
                                                        documentTitle={docTitle}
                                                    />
                                                </Grid>

                                            </Grid>

                                        </Grid>

                                        <Grid item xs={0.5} mt={2.5}></Grid>
                                        <Grid item xs={0.5} mt={2.5}></Grid>



                                        <Grid container item>

                                            <Grid item xs={5} mt={0.1}>
                                                <Tooltip title="Descargar" followCursor>
                                                    <Button disabled={bloqueaboton} onClick={exportExcelFile} fullWidth variant="contained" style={{ width: '15.5ch', height: '3.4ch', backgroundColor: "rgb(0 85 169)", color: "white", fontFamily: "Quicksand", fontWeight: "900", fontSize: "1.20rem" }}>
                                                        Descargar
                                                    </Button>
                                                </Tooltip>
                                            </Grid>

                                            <Grid item xs={0.5} mt={2.5}></Grid>
                                            <Grid item xs={0.5} mt={2.5}></Grid>
                                            <Grid item xs={0.5} mt={2.5}></Grid>
                                            <Grid item xs={0.5} mt={2.5}></Grid>
                                            <Grid item xs={0.5} mt={2.5}></Grid>




                                            <Grid item xs={0.5} mt={0.1}>
                                                <Tooltip title="Exportar" followCursor>
                                                    <Button disabled={bloqueaboton} onClick={exportExcelFile2} fullWidth variant="contained" style={{ width: '15.5ch', height: '3.4ch', backgroundColor: "rgb(0 85 169)", color: "white", fontFamily: "Quicksand", fontWeight: "900", fontSize: "1.20rem" }}>
                                                        Exportar
                                                    </Button>
                                                </Tooltip>
                                            </Grid>

                                        </Grid>


                                    </Grid>
                                </Grid>



                            </div>
                        </div>
                    </Grid>
                </Grid>
                <br></br>
                <div>
                    <Grid container>
                        <Box sx={{ width: '100%' }} className="card-table-examfinish">
                            <Paper sx={{ width: '100%', borderRadius: "12px", overflowY: "scroll", maxHeight: "30000px", maxWidth: "1500px", mb: 30 }} className="card-table-general" >
                                <Grid container >
                                    <Grid item xs={0.1} mt={1}></Grid>
                                    <Grid item xs={0.5}>
                                        <br></br>
                                        <Tooltip title="Limpiar Filtros" followCursor>
                                            <Button onClick={borrarFitro} fullWidth variant="contained" style={{ width: '20.5ch', height: '3.4ch', backgroundColor: "rgb(0 85 169)", color: "white", fontFamily: "Quicksand", fontWeight: "900", fontSize: "1.20rem" }}>
                                                Limpiar Filtros
                                            </Button>
                                        </Tooltip>
                                    </Grid>
                                    <Box sx={{ width: "100%" }} ref={(ins) => (componente = ins)}>
                                        <Grid item xs={0.1} mt={1}></Grid>
                                        <Grid container mt={2.5} sx={{ placeContent: "center" }}>
                                            <InputLabel style={{ color: "black", fontFamily: "Quicksand", fontWeight: "600", fontSize: "1.8rem" }} >REPORTE DE EXAMENES REALIZADOS - RedLab Perú</InputLabel >
                                        </Grid>
                                        {uniqueSedes.map((row2: any, index: any) =>
                                            <Grid container mt={0.6} sx={{ placeContent: "center" }}>
                                                <InputLabel style={{ color: "black", fontFamily: "Quicksand", fontWeight: "600", fontSize: "1.8rem" }} >Sede: {row2} </InputLabel >
                                            </Grid>
                                        )}
                                        <Grid container mt={2.5} sx={{ width: '920px' }}>
                                            <Grid item xs={1} mt={2.5}>
                                                <TableContainer id={"sheetjs"} sx={{ width: "1225px", marginLeft: "25px" }}>
                                                    <Table sx={{ width: '200px', borderTop: 1, borderLeft: 1, borderRight: 1 }}
                                                        aria-labelledby="tableTitle"
                                                        size={'small'}>
                                                        <TableHead style={{ backgroundColor: "rgb(0 0 0)" }}>
                                                            <TableRow>
                                                                <TableCell sx={{ minWidth: 110, borderTop: 0, borderLeft: 0, borderRight: 0, borderBottom: 0, borderColor: 'black', padding: '5px' }}
                                                                    align="left"
                                                                    style={{ color: "white", fontFamily: "Arial", fontWeight: "400", fontSize: "1.1rem" }}>
                                                                    Fecha
                                                                </TableCell>
                                                                <TableCell sx={{ minWidth: 130, borderTop: 0, borderRight: 0, borderBottom: 0, borderColor: 'black', padding: '5px' }}
                                                                    align="left"
                                                                    style={{ color: "white", fontFamily: "Arial", fontWeight: "400", fontSize: "1.1rem" }}>
                                                                    Convenio
                                                                </TableCell>
                                                                <TableCell sx={{ minWidth: 122, borderTop: 0, borderRight: 0, borderBottom: 0, borderColor: 'black', padding: '5px' }}
                                                                    align="left"
                                                                    style={{ color: "white", fontFamily: "Arial", fontWeight: "400", fontSize: "1.1rem" }}>
                                                                    Referencia
                                                                </TableCell>
                                                                <TableCell sx={{ minWidth: 90, borderTop: 0, borderRight: 0, borderBottom: 0, borderColor: 'black', padding: '5px' }}
                                                                    align="left"
                                                                    style={{ color: "white", fontFamily: "Arial", fontWeight: "400", fontSize: "1.1rem" }}>
                                                                    Codigo Referido
                                                                </TableCell>
                                                                <TableCell sx={{ minWidth: 122, borderTop: 0, borderRight: 0, borderBottom: 0, padding: '5px' }}
                                                                    align="left"
                                                                    style={{ color: "white", fontFamily: "Arial", fontWeight: "400", fontSize: "1.1rem" }}>
                                                                    N° Documento
                                                                </TableCell>
                                                                <TableCell sx={{ minWidth: 190, borderTop: 0, borderRight: 0, borderBottom: 0, padding: '5px' }}
                                                                    align="left"
                                                                    style={{ color: "white", fontFamily: "Arial", fontWeight: "400", fontSize: "1.1rem" }}>
                                                                    Apellidos y Nombres
                                                                </TableCell>

                                                                <TableRow>
                                                                    <TableCell sx={{ minWidth: 170, borderTop: 0, borderBottom: 0, padding: '5px', height: '8px' }}
                                                                        align="left"
                                                                        style={{ height: '50px', color: "white", fontFamily: "Arial", fontWeight: "400", fontSize: "1.1rem" }}
                                                                    >
                                                                        Examenes
                                                                    </TableCell>
                                                                    <TableCell sx={{ minWidth: 90, borderTop: 0, borderBottom: 0, padding: '15px' }}
                                                                        align="left"
                                                                        style={{ height: '50px', color: "white", fontFamily: "Arial", fontWeight: "400", fontSize: "1.1rem" }}
                                                                    >
                                                                        Precios
                                                                    </TableCell>
                                                                </TableRow>

                                                                <TableCell sx={{ minWidth: 90, borderTop: 0, borderRight: 0, borderBottom: 0, padding: '5px' }}
                                                                    align="left"
                                                                    style={{ color: "white", fontFamily: "Arial", fontWeight: "400", fontSize: "1.1rem" }}>
                                                                    Total
                                                                </TableCell>

                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody >
                                                            {rows.map((row: any, index: any) =>
                                                                <TableRow
                                                                    key={index}
                                                                >
                                                                    <TableCell sx={{ minWidth: 110, borderTop: 1, borderLeft: 1, borderBottom: 1, padding: '2px', margin: '0px', height: '5px' }}
                                                                        align="left" component="th" scope="row"
                                                                        style={{ color: "black", fontFamily: "Arial", fontWeight: "400", fontSize: "1rem",  lineHeight: '1.4' }}
                                                                    >
                                                                        {row.fecha}
                                                                    </TableCell>
                                                                    <TableCell sx={{ minWidth: 130, borderTop: 1, borderBottom: 1, padding: '2px', height: '5px' }} align="left" component="th" scope="row"
                                                                        style={{ color: "black", fontFamily: "Arial", fontWeight: "400", fontSize: "1rem", lineHeight: '1.4' }}
                                                                    >
                                                                        {row.convenio}
                                                                    </TableCell>
                                                                    <TableCell sx={{ minWidth: 122, borderTop: 1, borderBottom: 1, padding: '2px', height: '5px' }} align="left" component="th" scope="row"
                                                                        style={{ color: "black", fontFamily: "Arial", fontWeight: "400", fontSize: "1rem", lineHeight: '1.4' }}
                                                                    >
                                                                        {row.referencia}
                                                                    </TableCell>
                                                                    <TableCell sx={{ minWidth: 90, borderTop: 1, borderBottom: 1, padding: '2px', height: '5px' }} align="left" component="th" scope="row"
                                                                        style={{ color: "black", fontFamily: "Arial", fontWeight: "400", fontSize: "1rem", lineHeight: '1.4' }}
                                                                    >
                                                                        {row.codigoRef}
                                                                    </TableCell>
                                                                    <TableCell sx={{ minWidth: 122, borderTop: 1, borderBottom: 1, padding: '2px', height: '5px' }} align="left" component="th" scope="row"
                                                                        style={{ color: "black", fontFamily: "Arial", fontWeight: "400", fontSize: "1rem", lineHeight: '1.4' }}
                                                                    >
                                                                        {row.dni}
                                                                    </TableCell>
                                                                    <TableCell sx={{ borderTop: 1, borderBottom: 1, padding: '2px', height: '5px' }} align="left" component="th" scope="row"
                                                                        style={{ color: "black", fontFamily: "Arial", fontWeight: "400", fontSize: "1rem", lineHeight: '1.4' }}
                                                                    >
                                                                        {row.paciente}
                                                                    </TableCell>
                                                                    {row.examen1.map((x: any, index: number) =>
                                                                        <TableRow key={index}>
                                                                            <TableCell sx={{ minWidth: 180, borderLeft: 1, borderBottom: 1, height: '45px', padding: '5px', margin: '0px' }}
                                                                                align="left"
                                                                                component="th"
                                                                                scope="row"
                                                                                style={{ color: "black", fontFamily: "Arial", fontWeight: "400", fontSize: "1rem" }}
                                                                            >
                                                                                {x.listaexamen}
                                                                            </TableCell>

                                                                            <TableCell sx={{ minWidth: 100, borderLeft: 1, borderBottom: 1, height: '45px', padding: '5px', margin: '0px' }}
                                                                                align="left"
                                                                                component="th"
                                                                                scope="row"
                                                                                style={{ color: "black", fontFamily: "Arial", fontWeight: "400", fontSize: "1rem" }}
                                                                            >
                                                                                S/. {x.listaprecios}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    )}


                                                                    <TableCell sx={{ minWidth: 80, borderRight: 1, borderLeft: 1, borderBottom: 1, padding: '5px', margin: '0px', height: '5px' }} align="left" component="th" scope="row"
                                                                        style={{ color: "black", fontFamily: "Arial", fontWeight: "400", fontSize: "1rem", lineHeight: '1.4' }}
                                                                    >
                                                                        S/. {row.precio}
                                                                    </TableCell>

                                                                </TableRow>

                                                            )}
                                                            <TableRow>
                                                                <TableCell sx={{ borderBottom: 1, height: '10px', margin: '0px' }}
                                                                    align="center"
                                                                    style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>

                                                                </TableCell>
                                                                <TableCell sx={{ borderBottom: 1, height: '10px', margin: '0px' }}
                                                                    align="center"
                                                                    style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>

                                                                </TableCell>
                                                                <TableCell sx={{ borderBottom: 1, height: '10px', margin: '0px' }}
                                                                    align="center"
                                                                    style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>

                                                                </TableCell>
                                                                <TableCell sx={{ borderBottom: 1, height: '10px', margin: '0px' }}
                                                                    align="center"
                                                                    style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>

                                                                </TableCell>
                                                                <TableCell sx={{ borderBottom: 1, height: '10px', margin: '0px' }}
                                                                    align="center"
                                                                    style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>

                                                                </TableCell>
                                                                <TableCell sx={{ borderBottom: 1, height: '10px', margin: '0px' }}
                                                                    align="center"
                                                                    style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1.1rem" }}>

                                                                </TableCell>
                                                                <TableRow>
                                                                    <TableCell sx={{ minWidth: 181, borderBottom: 1, height: '60px', margin: '0px' }}
                                                                        align="center"
                                                                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1rem" }}>

                                                                    </TableCell>
                                                                    <TableCell sx={{ minWidth: 100,  borderRight: 1, borderLeft: 1, borderBottom: 1,  padding: '2px', margin: '0px' }}
                                                                        align="left"
                                                                        style={{ color: "black", fontFamily: "Arial", fontWeight: "500", fontSize: "1rem" }}>
                                                                        {"S/." + rowstotal}
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableCell sx={{ minWidth: 29,  border: 1 , borderLeft: 0 , padding: '2px', margin: '0px' }}
                                                                    align="left"
                                                                    style={{ color: "black", fontFamily: "Arial", fontWeight: "500", fontSize: "1rem" }}>
                                                                    {"S/." + rowstotal}
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>

                                                    </Table>
                                                </TableContainer>
                                            </Grid>
                                            <Grid item xs={0.5} mt={2.5}></Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
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
                                                            <Table sx={{ minWidth: 750 }}
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
                                                                    {rows.map((row: any, index: any) =>
                                                                        <TableRow
                                                                            key={index}
                                                                        >
                                                                            <TableCell
                                                                                align="center" component="th" scope="row"
                                                                                style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                                            >
                                                                                {row.codigo}
                                                                            </TableCell>
                                                                            <TableCell align="center" component="th" scope="row"
                                                                                style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                                                                            >
                                                                                {row.fecha}
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


