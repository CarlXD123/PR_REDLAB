import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import { getAppointmentsApi, getEmployeeApi, getExaminationValuesByExamId, getExamValuesApi, modeloML, modeloMLAI } from '../../api';
import { Button, Grid, InputLabel, Modal, TextField, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../../img/logo-redlab.png'
import logobg from '../../img/logo-redlab-bg.png'

import { Page, Text, View, Document, StyleSheet, PDFViewer, pdf, Image } from '@react-pdf/renderer';
import ModeEditRoundedIcon from '@mui/icons-material/ModeEditRounded';
import LocalPrintshopRoundedIcon from '@mui/icons-material/LocalPrintshopRounded';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import moment from 'moment';
//import Swal from 'sweetalert2';
import { makeStyles } from '@material-ui/styles';

interface Data {
  codigo: string,
  fecha: string,
  hora: string,
  codigoRef: string,
  referencia: string,
  paciente: string,
  precio: string,
  options: string
}

interface PdfHeaderProps {
  nombreCompleto: string;
  edad: string | number; // Dependiendo de cómo manejes la edad
  fecha: string;
  sexo: string;
  sede: string;
  medico: string;
  codigo: string;
}


function createData(
  codigo: string,
  fecha: string,
  hora: string,
  codigoRef: string,
  referencia: string,
  paciente: string,
  precio: string,
  options: string
): Data {
  return {
    codigo,
    fecha,
    hora,
    codigoRef,
    referencia,
    paciente,
    precio,
    options
  };
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

type Order = 'asc' | 'desc';

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

function getCurrentDate() {
  let date = new Date();
  let month = date.getMonth() + 1;
  let auxDay = date.getDate() < 10 ? "0" : "";
  // return `${auxDay}${date.getDate()}_${month}_${date.getFullYear()}`; (dd_mm_yyyy)
  return `${auxDay}${date.getDate()}${month}${date.getFullYear()}`; // (ddmmyyyy)
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
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

interface HeadCell {
  disablePadding: boolean;
  id: any;
  label: string;
  numeric: boolean;
  disableOrder: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'codigo',
    numeric: false,
    disablePadding: false,
    label: 'Código',
    disableOrder: true
  },
  {
    id: 'fecha',
    numeric: false,
    disablePadding: false,
    label: 'Fecha',
    disableOrder: true
  },
  {
    id: 'hora',
    numeric: false,
    disablePadding: false,
    label: 'Hora',
    disableOrder: false
  },
  {
    id: 'codigoRef',
    numeric: false,
    disablePadding: false,
    label: 'Código Referido',
    disableOrder: false
  },
  {
    id: 'referencia',
    numeric: false,
    disablePadding: false,
    label: 'Referencia',
    disableOrder: false
  },
  {
    id: 'paciente',
    numeric: false,
    disablePadding: false,
    label: 'Paciente',
    disableOrder: false
  },
  {
    id: 'precio',
    numeric: false,
    disablePadding: false,
    label: 'Precio Final',
    disableOrder: false
  },
  {
    id: null,
    numeric: false,
    disablePadding: false,
    label: 'Opciones',
    disableOrder: true
  }
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead >
      <TableRow >
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ color: "rgba(0, 0, 0, 0.54)", fontFamily: "Quicksand", fontWeight: "600", fontSize: "1.15rem" }}
          >
            {headCell.disableOrder ? headCell.label :
              <TableSortLabel style={{ color: "rgba(0, 0, 0, 0.54)", fontFamily: "Quicksand", fontWeight: "600", fontSize: "1.15rem" }}
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}

                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

//#region modal
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 850,
  bgcolor: 'white',
  border: '1px solid #white',
  borderRadius: "15px",
  boxShadow: 24,
  p: 4
};
//#endregion




export default function TbResultadosAtendidas({ texto, opcion }: any) {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<string>("");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [rows, setRows] = React.useState<any>([]);
  const [rows2, setRows2] = React.useState<any>([]);
  const [rangeDate, setRangeDate] = React.useState<any>(false);
  const [fechaCreacion, setFechaCreacion] = React.useState<any>('');

  const [abrirResultado, setAbrirResultado] = React.useState<any>(false);

  const [nombreCompleto, setNombreCompleto] = React.useState<any>("");
  const [edad, setEdad] = React.useState<any>("");
  const [dni, setDni] = React.useState<any>("");
  const [sexo, setSexo] = React.useState<any>("");
  const [codigo, setCodigo] = React.useState<any>("");
  const [medico, setMedico] = React.useState<any>("");
  const [fecha, setFecha] = React.useState<any>("");
  const [sede, setSede] = React.useState<any>("");


  const [examenLista, setExamenLista] = React.useState<readonly string[]>([]);

  const [direccion, setDireccion] = React.useState<any>("");
  const [sedeUser, setSedeUser] = React.useState<any>("");
  const [telfUser, setTelfUser] = React.useState<any>("");
  const [correoUser, setCorreoUser] = React.useState<any>("");
  const [firma, setFirma] = React.useState<any>("");
  const [nameService, setNameService] = React.useState<string[]>([]);
  const [obser, setObser] = React.useState<any>("");
  const [docTitle, setDocTitle] = React.useState<any>("");
  const [diagnosticoActual, setDiagnosticoActual] = React.useState("");
  const [diagnosticoActualAI, setDiagnosticoActualAI] = React.useState("");

  const handleCloseResultado = () => {
    setAbrirResultado(false);
    setDiagnosticoActual('');
  }

  const handleCloseRangeDate = () => {
    setRangeDate(false);
  }

  const handleAbrirResultado = async (obj: any) => {
    setAbrirResultado(true);
    setNombreCompleto(obj.nombreCompleto)
    setEdad(obj.edad)
    setDni(obj.dni)
    if (obj && obj.sexo) {
      setSexo(obj.sexo.toUpperCase());
    }

    if (obj && obj.codigoRef) {
      setCodigo(obj.codigoRef.toUpperCase());
    }

    if (obj && obj.medico) {
      setMedico(obj.medico.toUpperCase());
    }

    setFecha(obj.fecha)
    if (obj && obj.sede) {
      setSede(obj.sede.toUpperCase());
    }

    setDocTitle(obj.docTitle)
    getExamValuesApi(obj.id).then(async (y: any) => {
      let daton: any = [];
      for (let exam of y.data) {
        let x = await getExaminationValuesByExamId(exam.ExaminationId, "")
        x.data.forEach((p: any) => {
          p.examGroupId = p.examGroup.name
        })
        const valor = x.data.reduce((examGroup: any, daton: any) => {
          const { examGroupId } = daton;
          examGroup[examGroupId] = examGroup[examGroupId] ?? [];
          examGroup[examGroupId].push(daton);
          return examGroup;
        }, {})



        daton.push({
          id: exam.id,
          nameservice: exam.nameservice,
          name: exam.name,
          detalleExam: valor,
          result: exam.result
        })

        setObser(exam.result)

      }
      setExamenLista(daton);


      // Iterar sobre cada examen en 'daton'
      daton.forEach((examen: any) => {
        // Verifica si detalleExam es un objeto y no está vacío
        if (examen.detalleExam && typeof examen.detalleExam === 'object' && Object.keys(examen.detalleExam).length > 0) {
          // Itera sobre todas las claves en detalleExam
          Object.keys(examen.detalleExam).forEach((clave) => {
            // Asume que cada clave en detalleExam es un array y lo recorre
            examen.detalleExam[clave].forEach((detalles: any) => {
              // Llamada a handleFetchDiagnostico con los datos correctos
              handleFetchDiagnostico({
                name: examen.name,
                result: detalles.result,
                gender: obj.sexo.charAt(0).toUpperCase(),
                age: obj.edad.match(/\d+/)[0],
                time_range: "12 - 5 p.m."
              });
            });
          });
        }
      });





    })

    setNameService(obj.servicios)
    // Luego, cada vez que iteras sobre obj.servicio, añade d.nameservice al array

    const dato = localStorage.getItem('dataUser')
    if (dato != null) {
      const info = JSON.parse(dato);
      setDireccion(info.person.headquarter.address)
      setSedeUser(info.person.headquarter.name)
      setTelfUser(info.person.headquarter.tlfNumber)
      setCorreoUser(info.person.headquarter.email)
      let x = await getEmployeeApi(info.person.id)
      setFirma(x.data.person.digitalSignatureUrl)

    }


  }

  const handleChangeFechaCreacion = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFechaCreacion(event.target.value);
  };

  const handleChangFecha = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFecha(event.target.value);
  };

  var resultadosBusqueda = rows2.filter((elemento: any) => {

    if (opcion == "nombre2" && texto != "") {

      if (elemento.pac2.toString().toLowerCase().includes(texto.toLowerCase())) {

        return elemento
      }

      if (elemento.apP.toString().toLowerCase().includes(texto.toLowerCase())) {

        return elemento
      }

      if (elemento.apM.toString().toLowerCase().includes(texto.toLowerCase())) {

        return elemento
      }
    }

  });

  var resultadosBusqueda2 = rows2.filter((elemento: any) => {

    if (opcion == "dniResultAtend" && texto != "") {

      if (elemento.tipoDocumento.toString().toLowerCase().includes(texto.toLowerCase())) {

        return elemento
      }
    }

  });


  const gruposPorNameservice: any = {};

  examenLista.forEach((examen: any) => {
    if (!gruposPorNameservice[examen.nameservice]) {
      gruposPorNameservice[examen.nameservice] = [examen];
    } else {
      gruposPorNameservice[examen.nameservice].push(examen);
    }
  });

  const nuevoArray: any[] = [];

  function getExamResults(examen: any) {
    // Obtener todas las claves del objeto examen.detalleExam
    const keys = Object.keys(examen.detalleExam);

    // Buscar la clave que contiene la información de "Resultado" (caso insensible a mayúsculas/minúsculas)
    const resultadoKeys = keys.filter(key => key && key.trim().toLowerCase() === 'resultado');

    // Si se encontraron claves, se accede a los resultados, de lo contrario, se devuelve un arreglo vacío
    return resultadoKeys.length > 0 ? resultadoKeys.map(key => examen.detalleExam[key]).flat() : [];
  }

  function getExamResult(examen: any) {
    return examen.result;
  }

  for (const nameservice in gruposPorNameservice) {
    const examenes = gruposPorNameservice[nameservice];

    const examenesAgrupables: any[] = [];
    const examenesNoAgrupables: any[] = [];

    examenes.forEach((examen: any) => {
      const result = getExamResults(examen);
      if (result.length > 0) {
        examenesAgrupables.push(examen);
      } else {
        examenesNoAgrupables.push(examen);
      }
    });

    if (examenesAgrupables.length > 0) {
      const examenesCombinados: any = {
        ...examenesAgrupables[0],
        detalleExam: {
          Resultado: examenesAgrupables
            .map((examen: any) => getExamResults(examen))
            .flat(),
        },
        RESULT: examenesAgrupables
          .map((examen: any) => getExamResult(examen))
          .filter((result: any) => result !== null),
      };
      nuevoArray.push(examenesCombinados);
    }

    examenesNoAgrupables.forEach((examen: any) => {
      examen.RESULT = getExamResult(examen);
      nuevoArray.push(examen);
    });
  }

  console.log(nuevoArray);




  const filt = () => {
    if (opcion == "dateResultAtend") {
      setRows(busca)
    }
  }




  let dateNow = moment().format('YYYY-MM-DD');

  const ope2 = () => {
    getAppointmentsApi(0, 1000, "E", dateNow).then((ag: any) => {
      let mapeado: any = []
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
          servicios: d.Service.name,
          tipoDocumento: d.client.dni,
          observaciones: d.result,
          pac2: d.client.name,
          apP: d.client.lastNameP,
          apM: d.client.lastNameM,
          paciente: d.client.name + " " + d.client.lastNameP + " " + d.client.lastNameM,
          precio: d.totalPrice == null ? "" : "S/. " + d.totalPrice,
          descuento: d.discount == null ? "" : "S/. " + d.discount,
          precioFinal: d.finalPrice == null ? "" : "S/. " + d.finalPrice,

          nombreCompleto: d.client.name + " " + d.client.lastNameP + " " + d.client.lastNameM,
          edad: d.client.years + " AÑOS",
          dni: d.client.dni,
          sexo: d.client.genderStr,
          medico: d.Doctor.name,
          sede: d.headquarter.name,

        })
      });
      setRows(mapeado)
    });


    getAppointmentsApi(0, 1000, "E", "").then((ag: any) => {
      let mapeado: any = []
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
          observaciones: d.result,
          servicios: d.Service.name,
          tipoDocumento: d.client.dni,
          pac2: d.client.name,
          apP: d.client.lastNameP,
          apM: d.client.lastNameM,
          paciente: d.client.name + " " + d.client.lastNameP + " " + d.client.lastNameM,
          precio: d.totalPrice == null ? "" : "S/. " + d.totalPrice,
          descuento: d.discount == null ? "" : "S/. " + d.discount,
          precioFinal: d.finalPrice == null ? "" : "S/. " + d.finalPrice,

          nombreCompleto: d.client.name + " " + d.client.lastNameP + " " + d.client.lastNameM,
          edad: d.client.years + " AÑOS",
          dni: d.client.dni,
          sexo: d.client.genderStr,
          medico: d.Doctor.name,
          sede: d.headquarter.name,

        })
      });


      //setRows(mapeado)
      setRows2(mapeado)
    });

  }

  var resultadosBusqueda3 = rows2.filter((elemento: any) => {

    if (opcion == "referente2" && texto != "") {

      if (elemento.referencia.toString().toLowerCase().includes(texto.toLowerCase())) {

        return elemento
      }
    }

  });


  var resultadosBusqueda4 = rows2.filter((elemento: any) => {

    if (opcion == "codeResultPorAtend" && texto != "") {

      if (elemento.codigo.toString().toLowerCase().includes(texto.toLowerCase())) {

        return elemento
      }
    }

  });

  var resultadosBusqueda5 = rows2.filter((elemento: any) => {

    if (opcion == "codeReferido" && texto != "") {

      if (elemento.codigoRef && elemento.codigoRef.toLowerCase().includes(texto.toLowerCase())) {
        return elemento
      }
    }

  });

  const ope = () => {
    if (opcion == "dateResultAtend") {
      setRangeDate(true);
    }
  }



  const style2 = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 490,
    bgcolor: 'white',
    border: '1px solid #white',
    borderRadius: "15px",
    boxShadow: 24,
    p: 4,
  };

  const useStyles = makeStyles(() => ({
    wrapText: {
      wordBreak: 'break-all'
    }
  }));

  const classes = useStyles();


  const busca = rows2.filter(
    (n: any) => (n.fechaFiltro <= fecha && n.fechaFiltro >= fechaCreacion)
  )



  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const stylespro = StyleSheet.create({
    pageOrSection: {
      flexDirection: 'row',
      justifyContent: 'center', // Esto centrará los elementos hijos horizontalmente
    },
    container: {
      border: '1px solid gray',
      borderRadius: 15,
      width: '90%',
      padding: '2px 6px',
      flexDirection: 'column',
      marginBottom: 6,
    },
    column: {
      flexDirection: 'column',
    },
    column2: {
      flexDirection: 'column',
      width: '20%',  // ejemplo
      marginRight: 5,
    },
    row2: {
      flexDirection: 'row',
      width: '100%',
      marginBottom: 10,
    },

    labelBold2: {
      fontWeight: 'bold',
      fontSize: 8,
      width: '100%',  // para asegurarte de que toma todo el espacio de su contenedor
      overflow: 'hidden',  // para ocultar el desbordamiento
      whiteSpace: 'nowrap',  // para evitar que el texto se divida en varias líneas
    },


    row: {
      flexDirection: 'row',
      alignItems: 'center',
      //marginVertical: 5,
      marginBottom: 5,
    },
    labelBold: {
      fontWeight: 'bold',
      fontSize: 8,
      width: 60,
      textAlign: 'right',
      shadowColor: 'rgba(0, 0, 0, 0.2)',   // Sombra de texto
      shadowOffset: { width: 0.3, height: 0.3 },   // Desplazamiento de la sombra
      shadowRadius: 0.5,  // Suavizado de la sombra
    },
    label: {
      fontSize: 8,
      marginLeft: 5,
      flexGrow: 1,
    },
    halfRow: {
      flexDirection: 'row',
      width: '50%',
      paddingRight: 14,
      marginLeft: 25,
    },
    logoContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginBottom: 10,
    },
    logo: {
      width: 150,
      height: 50,
    },
    divider: {
      marginVertical: 15, // Para agregar espacio entre los elementos
      height: 15,
    },
    borderedBox: {
      border: '1px solid black',
      width: '90%',
      flexDirection: 'row',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      marginBottom: 15,
      minHeight: 15,
    },
    innerContainer: {
      marginInline: "5px", // Reduzco el margen aquí
      marginBlock: "0.2px",
      display: "flex",
      flexDirection: 'row',
      justifyContent: 'center'
    },
    header: {
      color: 'black',
      fontWeight: 'bold',
      fontSize: 11,
      textAlign: 'center',
    },
    pageContainer: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',      // Esto centrará los hijos horizontalmente.
      margin: 0,
      padding: 0,
    },

    pageBackground: {
      position: 'absolute',
      width: '210mm',
      height: '295mm',
      background: `url(${logobg})`,
      backgroundSize: '120%',
    },
    container3: {
      flexDirection: 'row',
      marginVertical: 8,
      paddingLeft: 1,
      justifyContent: 'flex-start',
    },
    label3: {
      color: 'black',
      fontWeight: 'bold',
      fontSize: 9,
      textAlign: 'left',
      justifyContent: 'flex-start',
      marginLeft: -343,
      marginTop: -12,
    },



    container4: {
      flexDirection: 'row',
      width: '100%',
      marginVertical: 10,
    },
    innerContainer4: {
      flexDirection: 'row',
      width: '100%',
      marginVertical: 5,
    },
    item4: {
      width: '33.33%', // Representa 1/3 (xs={4} en un total de 12) del contenedor.
      justifyContent: 'flex-start',
    },
    label4: {
      textTransform: 'uppercase',
      color: 'black',
      textAlign: 'left',
      fontSize: 8,
      marginBottom: 8,
      marginTop: -8,
    },



    innerContainer9: {
      flexDirection: 'row',
      width: '100%',
    },
    item: {
      flexDirection: 'column',
      marginVertical: 5,
    },
    labelRight: {
      textAlign: 'right',
      color: 'black',
      fontSize: 10.2,
      paddingRight: 5,
    },
    resultLabel: {
      textAlign: 'center',
      color: 'black',
      fontSize: 10.3,
    },
    unitLabel: {
      textAlign: 'center',
      color: 'black',
      fontSize: 10.2,
    },
    refValue: {
      textAlign: 'center',
      color: 'black',
      fontSize: 10.2,
    },
    methodLabel: {
      textAlign: 'center',
      color: 'black',
      fontSize: 10.2,
    },

    pageStyle: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      paddingBottom: 30  // Adjust as per your needs
    },
    headerContainer: {
      marginTop: 20,   // Adjust as per your needs
    },

    detailsContainer: {
      flexDirection: 'column',
      width: '90%',
      margin: 0,
      padding: 0,
      alignItems: 'flex-start', // Alineación horizontal de los elementos hijos
      justifyContent: 'flex-start', // Alineación vertical de los elementos hijos
    },
    detailSection: {
      width: '100%',
      marginBottom: 15, // Espaciado entre secciones
    },

    tableHeaderContainer: {
      flexDirection: 'row',
      width: '100%',
      borderBottomWidth: 0,
      borderBottomColor: 'gray',
      padding: 10,
      paddingLeft: 50,
      marginTop: -12,
      marginBottom: 5,
    },

    tableHeaderItem: {
      flex: 1,
      marginRight: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },

    rangosReferencialesContainer: {
      flex: 1.3,
    },

    rangosResultadosContainer: {
      flex: 1.1,
    },

    examenItem: {
      flex: 0.3,  // Dando un poco más de espacio al elemento "EXAMEN"
      marginRight: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },


    watermark: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: -1  // Esto asegura que la marca de agua esté detrás de todo el contenido
    },
    watermarkImage: {
      opacity: 0.5,  // Esto hace que la imagen sea un poco transparente
      width: '100%',
      height: '30%',
      resizeMode: 'contain' // Para que la imagen se ajuste dentro del espacio
    }




  });

  const styles50 = StyleSheet.create({
    container: {
      flexDirection: 'column',
      width: '90%',
    },
    label: {
      flex: 2,
      fontSize: 8,
      fontWeight: 'bold',
      marginRight: 90,
      whiteSpace: 'nowrap',
    },
    value: {
      flex: 9,
      fontSize: 8,
      whiteSpace: 'pre-wrap',
      marginRight: 200,
    },
    emptySpace: {
      flex: 2,
      fontSize: 10,
    },

    observationContainer: {
      flexDirection: 'row',
      width: '100%',
      marginLeft: 58,
      alignItems: 'center',
      justifyContent: 'flex-start', // Alineará los elementos hijos al inicio del contenedor.
      marginVertical: 5, // Proporciona un margen vertical para espaciado.
      paddingLeft: 5, // Un poco de padding a la izquierda para asegurarse de que el texto no esté muy cerca del borde.
    },
  });


  const styles468 = StyleSheet.create({
    container: {
      flexDirection: 'column',
      alignItems: 'flex-end',
      marginBottom: 20,   // Adjust as per your needs
      width: '90%',  // Aquí se establece el ancho
      marginLeft: 30,
    },
    image: {
      height: 22,
      width: 80,
    },
    footerContainer: {
      flexDirection: 'column',
      width: 800,
      maxWidth: '100%',
      maxHeight: '100%',
      marginTop: 10,
    },
    footerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: 5,
    },
    label: {
      color: "#0B1463",
      fontWeight: 'bold',
      fontSize: 9,
    },
    leftColumn: {
      width: '66%',
    },
    rightColumn: {
      width: '33%',
      alignItems: 'flex-end',
    },
  });

  //REPORTE DE 0
  const downloadPdf = () => {
    const doc = pdf(<PDFReporte />);
    doc.toBlob().then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${docTitle}.pdf`;  // Aquí se modifica para usar el valor de docTitle
      a.click();
    });
  };

  type PatientInfoRowProps = {
    label: string;
    value: string;
  };

  const PatientInfoRow: React.FC<PatientInfoRowProps> = ({ label, value }) => (
    <View style={stylespro.halfRow}>
      <Text style={stylespro.labelBold}>{label}</Text>
      <Text style={stylespro.label}>{value}</Text>
    </View>
  );


  type TableHeaderProps = {
    label: string;
  };

  const TableHeader: React.FC<TableHeaderProps> = ({ label }) => (
    <View style={stylespro.tableHeaderItem}>
      <Text style={[stylespro.labelBold2, { fontWeight: 'bold', color: '#000000' }]}>{label}</Text>
    </View>
  );


  type DatonType = {
    name: string;
    // Puedes agregar más propiedades aquí si las necesitas
  };

  interface TableItemProps {
    label: string;
    value?: string | null;
    bold?: boolean;
    center?: boolean;
    padding?: string;
    fontSize?: string;
    lineHeight?: string;
  }


  const TableItem: React.FC<TableItemProps> = ({ label, bold, fontSize, lineHeight, center }) => (
    <Text
      style={{
        color: "black",
        fontWeight: bold ? "bold" : "normal",
        fontSize: fontSize || "10.2",
        lineHeight: lineHeight || "1.5",
        textAlign: center ? "center" : "left",
      }}
    >
      {label}
    </Text>
  );



  const ExamenRow: React.FC<{ daton: any }> = ({ daton }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

      <View style={{
        flex: 2.7,
        paddingRight: "5px", // Añade un pequeño padding para asegurarnos de que el texto no se superponga con los dos puntos
        justifyContent: 'center',  // Centra el contenido verticalmente
        alignItems: 'center'       // Centra el contenido horizontalmente
      }}>
        <Text style={{
          color: "black",
          fontWeight: "normal",
          fontSize: "5px",
          textAlign: "right",
          position: "relative",
          marginBottom: "5px"
        }}>
          {daton.name}
          <Text style={{
            position: "absolute",
            right: "-5px",  // Ajustado para mover el carácter ':' más a la derecha
            top: "-3px"
          }}>
            :
          </Text>
        </Text>


      </View>


      <View style={{
        flex: 1.3,
        padding: "3px",
        fontSize: "6px",
        paddingRight: "15px",
        justifyContent: 'center',  // Centra el contenido verticalmente
        alignItems: 'center'       // Centra el contenido horizontalmente
      }}>
        <TableItem label={daton.result} bold fontSize='9px' />
      </View>

      {/* Unit */}
      <View style={{
        flex: 3,
        fontSize: "5px",
        justifyContent: 'center',  // Centra el componente TableItem verticalmente
        alignItems: 'center'       // Intenta centrar horizontalmente el componente TableItem
      }}>
        <TableItem label={daton.unit.name === "N/A" ? "" : daton.unit.name} fontSize='6px' center={true} />
      </View>



      {/* Datito: Examination Reference Values */}
      <View style={{
        flex: 3,
        padding: "3px",
        justifyContent: 'center',  // Centra el contenido verticalmente
        alignItems: 'center'       // Intenta centrar horizontalmente el contenido
      }}>
        {daton.examinationReferenceValues.map((datito: any, indexT: any) => (
          <TableItem key={indexT} label={datito.name} center fontSize="5px" lineHeight="1.5" />
        ))}
      </View>


      {/* Metodologia */}
      <View style={{
        flex: 2,
        padding: "3px",
        fontSize: "5px",
        paddingRight: "15px",
        justifyContent: 'center',  // Centra el contenido verticalmente
        alignItems: 'center'       // Centra el contenido horizontalmente
      }}>
        <TableItem label={daton.methodology.name === "N/A" ? "" : daton.methodology.name} fontSize='6px' />
      </View>


    </View>


  );



  const Watermark = () => (
    <View style={stylespro.watermark}>
      <Image source={logobg} style={stylespro.watermarkImage} />
    </View>
  );

  interface PatientDataType {
    label: string;
    value: string;
    next?: string;
    nextValue?: string;
  }

  type FooterProps = {
    firma: string;
    direccion: string;
    correoUser: string;
    telfUser: string;
  };

  const Header: React.FC<{ patientData: PatientDataType[] }> = ({ patientData }) => {
    return (
      <View style={stylespro.headerContainer}>
        <View style={stylespro.logoContainer}>
          <Image source={logo} style={stylespro.logo} />
        </View>
        <View style={stylespro.pageOrSection}>
          <View style={stylespro.container}>
            {patientData.map((info: any) => (
              <View style={stylespro.row} key={info.label}>
                <PatientInfoRow label={info.label} value={info.value} />
                {info.next && <PatientInfoRow label={info.next} value={info.nextValue} />}
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };


  const Footer: React.FC<FooterProps> = ({ firma, direccion, correoUser, telfUser }) => {
    return (
      <View style={styles468.container}>
        <Image src={firma} style={styles468.image} />
        <View style={{ flex: 8 }}></View>
        <View style={styles468.footerContainer}>
          <View style={styles468.footerRow}>
            <View style={styles468.leftColumn}>
              <Text style={styles468.label}>{direccion}</Text>
            </View>
            <View style={styles468.rightColumn}>
              <Text style={styles468.label}><Text style={{ fontWeight: 'bold' }}>EMAIL:</Text> {correoUser}</Text>
            </View>
          </View>
          <View style={styles468.footerRow}>
            <View style={styles468.leftColumn}>
              <Text style={styles468.label}><Text style={{ fontWeight: 'bold' }}>Telf.:</Text> {telfUser}</Text>
            </View>
            <View style={styles468.rightColumn}>
              <Text style={styles468.label}><Text style={{ fontWeight: 'bold' }}>www.redlabperu.com</Text></Text>
            </View>
          </View>
        </View>
      </View>
    );
  };


  const PDFReporte = () => {
    const patientData = [
      { label: 'PACIENTE:', value: nombreCompleto },
      { label: 'EDAD:', value: edad, next: 'FECHA:', nextValue: fecha },
      { label: 'SEXO:', value: sexo, next: 'SEDE:', nextValue: sede },
      { label: 'MEDICO:', value: medico, next: 'CODIGO:', nextValue: codigo }
    ];

    return (
      <Document>
        {nuevoArray.map((data) => (
          <Page key={data.id} size="A4" style={stylespro.pageStyle} wrap>
            <Watermark />
            {/* Header */}
            <Header patientData={patientData} />
            {/* Main Content - Note: Add your main content here. */}
            <View style={stylespro.pageContainer} wrap>

              <View style={stylespro.borderedBox}>
                <View style={stylespro.innerContainer}>
                  <Text style={stylespro.header}>{data.nameservice}</Text>
                </View>
              </View>

              <View style={stylespro.tableHeaderContainer}>
                <TableHeader key="EXAMEN" label="EXAMEN" />
                <View style={stylespro.rangosResultadosContainer}>
                  <TableHeader key="RESULTADOS" label="RESULTADOS" />
                </View>
                <TableHeader key="UNIDADES" label="UNIDADES" />
                <View style={stylespro.rangosReferencialesContainer}>
                  <TableHeader key="RANGOS REFERENCIALES" label="RANGOS REFERENCIALES" />
                </View>
                <TableHeader key="METODOLOGIA" label="METODOLOGIA" />
              </View>
              <View style={{ height: 12 }} />  {/* Este es un componente vacío que actúa como un espacio */}
              {!Object.keys(data.detalleExam).some(nombre =>
                data.detalleExam[nombre].some((daton: DatonType) => {
                  const names = data.name.split("/").map((name: string) => name.toLowerCase().replace(/\s/g, ''));
                  return names.some((name: string) => name.includes(daton.name.toLowerCase().replace(/\s/g, '')));
                })
              ) && <Text style={stylespro.label3}>{data.name.toUpperCase()}</Text>}
              <View style={{ height: 15 }} />  {/* Este es un componente vacío que actúa como un espacio */}

              <View style={stylespro.detailsContainer}>
                {Object.keys(data.detalleExam).map((nombre, indexY) => (
                  <View key={indexY} style={stylespro.detailSection} wrap>
                    {new RegExp(/^\s*resultados?\s*$/i).test(nombre) || data.name === nombre ? null : (
                      <Text style={stylespro.label4}>{nombre}</Text>
                    )}


                    {data.detalleExam[nombre].map((daton: any, indexW: any) => (
                      <ExamenRow key={indexW} daton={daton} />
                    ))}
                  </View>
                ))}
              </View>
              {data.RESULT && (() => {
                const resultArray = Array.isArray(data.RESULT) ? data.RESULT : [data.RESULT];
                const resultString = resultArray.filter((result: any) => result && result.trim() !== '').join('\n');

                if (resultString) {
                  const words = resultString.split(' ');

                  const lines = [];
                  let currentLine = words[0];

                  for (let i = 1; i < words.length; i++) {
                    if (currentLine.length + words[i].length + 1 < 200) {
                      currentLine += ' ' + words[i];
                    } else {
                      lines.push(currentLine);
                      currentLine = words[i];
                    }
                  }

                  if (currentLine) {
                    lines.push(currentLine);
                  }
                  return (
                    <View style={styles50.observationContainer}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'nowrap' }}>
                        <Text style={{ ...styles50.label, minWidth: 100, flexShrink: 0 }}>OBSERVACION: </Text>
                        <Text style={{ ...styles50.value, minWidth: 100, flexShrink: 1 }}>{lines[0]}</Text>
                      </View>
                      {lines.slice(1).map((line: string, index: number) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <View style={{ width: 100 }}></View>
                          <Text style={styles50.value}>{line}</Text>
                        </View>
                      ))}
                    </View>
                  );
                }
              })()}

              <Text style={{ fontSize: 7 }}>Diagnostico ML por evaluar: {diagnosticoActual} </Text>
              
              <Text style={{ fontSize: 7 }}>Interpretación IA: {diagnosticoActualAI} </Text>
             

            </View>
            {/* Footer */}
            <Footer firma={firma} direccion={direccion} correoUser={correoUser} telfUser={telfUser} />
          </Page>
        ))}
      </Document>

    );
  }


  const handleFetchDiagnostico = async (daton: any) => {
    try {
      // Validación básica de los datos
      if (!daton.name || isNaN(daton.result)) {
        console.error("Datos inválidos para el diagnóstico:", daton);
        return;
      }


      // Asegúrate de que age es un número
      const ageNumber = parseInt(daton.age, 10);
      if (isNaN(ageNumber)) {
        console.error("Edad inválida:", daton.age);
        return;
      }

      // Llamada a la API
      const response = await modeloML(daton.name, daton.result, daton.time_range, daton.gender, ageNumber);
      const response2 = await modeloMLAI(daton.name, daton.result, daton.time_range, daton.gender, ageNumber);

      console.log(response2)
      // Si response ya es un objeto JavaScript y no una respuesta HTTP
      setDiagnosticoActual(response.diagnostic_dict_output);
      setDiagnosticoActualAI(response2.response);

    } catch (error) {
      console.error("Error al obtener el diagnóstico", error);
    }
  };






  React.useEffect(() => {
    if (texto == "") {
      getAppointmentsApi(0, 1000, "E", dateNow).then((ag: any) => {
        let mapeado: any = [];
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
            observaciones: d.result,
            servicios: d.Service.name,
            pac2: d.client.name,
            apP: d.client.lastNameP,
            apM: d.client.lastNameM,
            paciente: d.client.name + " " + d.client.lastNameP + " " + d.client.lastNameM,
            precio: d.totalPrice == null ? "" : "S/. " + d.totalPrice,
            descuento: d.discount == null ? "" : "S/. " + d.discount,
            precioFinal: d.finalPrice == null ? "" : "S/. " + d.finalPrice,

            nombreCompleto: d.client.name + " " + d.client.lastNameP + " " + d.client.lastNameM,
            edad: d.client.years + " AÑOS",
            dni: d.client.dni,
            sexo: d.client.genderStr,
            medico: d.Doctor.name,
            sede: d.headquarter.name,

            docTitle: d.code + "_" + d.client.code + "_" + d.client.name + "_" + d.client.lastNameP + "_" + d.client.lastNameM + "_" + getCurrentDate()

          })
        });
        setRows(mapeado)
        //setRows2(mapeado)
      });
    }

    if (texto == "") {
      getAppointmentsApi(0, 1000, "E", "").then((ag: any) => {
        let mapeado: any = [];
        ag.data?.forEach((d: any) => {
          mapeado.push({
            id: d.id,
            codigo: d.code,
            fecha: d.dateAppointmentEU,
            fechaCreada: moment(d.createdAt).format('YYYY-MM-DD'),
            fechaFiltro: d.dateAppointment,
            hora: d.time12h,
            codigoRef: d.refererCode,
            observaciones: d.result,
            servicios: d.Service.name,
            referencia: d.Referer.name,
            tipoDocumento: d.client.dni,
            pac2: d.client.name,
            apP: d.client.lastNameP,
            apM: d.client.lastNameM,
            paciente: d.client.name + " " + d.client.lastNameP + " " + d.client.lastNameM,
            precio: d.totalPrice == null ? "" : "S/. " + d.totalPrice,
            descuento: d.discount == null ? "" : "S/. " + d.discount,
            precioFinal: d.finalPrice == null ? "" : "S/. " + d.finalPrice,

            nombreCompleto: d.client.name + " " + d.client.lastNameP + " " + d.client.lastNameM,
            edad: d.client.years + " AÑOS",
            dni: d.client.dni,
            sexo: d.client.genderStr,
            medico: d.Doctor.name,
            sede: d.headquarter.name,

            docTitle: d.code + "_" + d.client.code + "_" + d.client.name + "_" + d.client.lastNameP + "_" + d.client.lastNameM + "_" + getCurrentDate()

          })
        });
        //setRows(mapeado)
        setRows2(mapeado)
      });
    }

    if (opcion == "nombre2") {
      setRows(resultadosBusqueda)
    }

    if (opcion == "referente2") {
      setRows(resultadosBusqueda3)
    }

    if (opcion == "codeResultPorAtend") {
      setRows(resultadosBusqueda4)
    }

    if (opcion == "codeReferido") {
      setRows(resultadosBusqueda5)
    }

    if (opcion == "dniResultAtend") {
      setRows(resultadosBusqueda2)
    }

    if (opcion == "dateResultAtend") {
      setRows(busca)
    }

  }, [texto, opcion]);



  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  let componente: any;
  const pageStyle = `
  @page {
    size: 210mm 297mm;
    
  }

  @media all {
    .pagebreak {
      display: none;
    }
  }

  @media print {
    .pagebreak {
      page-break-before: always;
      page-break-after: always !important;
      page-break-inside: avoid !important;
    }

    .no-break-inside {
      // apply this class to every component that shouldn't be cut off between to pages of your PDF
      break-inside: "avoid";
    }
  
    .break-before {
      // apply this class to every component that should always display on next page
      break-before: "always";
    }
  }
`;

  return (
    <Box sx={{ width: '100%' }}>
      <br></br>
      <br></br>
      <Paper sx={{ width: '100%', mb: 50 }} className="card-table-resultados">
        <div style={{ display: "flex" }}>
          <div style={{ paddingLeft: "5px" }}>
            <Tooltip title="Filtro por fecha" followCursor>
              <Button onClick={ope} variant="contained" style={{ width: '25.5ch', height: '4.4ch', backgroundColor: "rgb(0 85 169)", color: "white", fontFamily: "Quicksand", fontWeight: "900", fontSize: "1.20rem" }} startIcon={<FilterAltIcon />}>
                Filtro por fecha
              </Button>
            </Tooltip>
          </div>
          <div style={{ paddingLeft: "5px" }}>
            <Tooltip title="Actualizar" followCursor>
              <Button onClick={ope2} variant="contained" style={{ width: '18.5ch', height: '4.4ch', backgroundColor: "rgb(0 85 169)", color: "white", fontFamily: "Quicksand", fontWeight: "900", fontSize: "1.20rem" }}>
                Actualizar
              </Button>
            </Tooltip>
          </div>

        </div>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {
                stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: any, index: any) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                        >
                          {row.codigo}
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                        >
                          {row.fecha}
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                        >
                          {row.hora}
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                        >
                          {row.codigoRef}
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                        >
                          {row.referencia}
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                        >
                          {row.paciente}
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                        >
                          {row.precio}
                        </TableCell>
                        <TableCell align="left">
                          <div style={{ display: "flex" }}>
                            <div style={{ paddingRight: "5px" }}>
                              <Link to={`/apps/edit/results/${row.id}`}>
                                <Tooltip title="Editar resultado" followCursor>
                                  <Button variant="contained" className='boton-icon'>
                                    <ModeEditRoundedIcon />
                                  </Button>
                                </Tooltip>
                              </Link>
                            </div>
                            <div style={{ paddingLeft: "5px" }}>
                              <Tooltip title="Imprimir Resultado" followCursor>
                                <Button onClick={() => handleAbrirResultado(row)} variant="contained" className='boton-icon'>
                                  <LocalPrintshopRoundedIcon />
                                </Button>
                              </Tooltip>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              {(emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={8} />
                </TableRow>
              ))}
              {
                rows.length == 0 ? <TableRow >
                  <TableCell colSpan={8} >
                    No tiene Atendidas
                  </TableCell>
                </TableRow> : ""
              }
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[20, 100, 200]}
          component="div"
          count={rows.length}
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
      </Paper>



      <div>
        <Modal
          keepMounted
          open={rangeDate}
          onClose={handleCloseRangeDate}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={style2}>
            <InputLabel style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.5rem" }} >Filtro por fecha</InputLabel >
            <Grid container item mt={2.5}>
              <Grid item xs={4} ></Grid>
              <Grid container item xs={15} spacing={1}>
                <Grid item xs={9} >
                  <TextField type="date" focused fullWidth id="outlined-basic" label="Fecha inicial *" variant="outlined" value={fechaCreacion} onChange={handleChangeFechaCreacion} />
                </Grid>
                <Grid item xs={9} >
                  <TextField type="date" focused fullWidth id="outlined-basic" label="Fecha final *" variant="outlined" value={fecha} onChange={handleChangFecha} />
                </Grid>
                <Grid item xs={3} >
                  <Button onClick={filt} variant="contained" style={{ backgroundColor: "rgb(0 85 169)", color: "white", fontFamily: "Quicksand", fontWeight: "900", fontSize: "1rem" }}>Filtrar</Button>
                </Grid>
                <Grid item xs={3} >
                  <Button onClick={handleCloseRangeDate} variant="contained" style={{ backgroundColor: "rgb(0 85 169)", color: "white", fontFamily: "Quicksand", fontWeight: "900", fontSize: "1rem" }}>Cerrar</Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      </div>


      <div>
        <Modal
          keepMounted
          open={abrirResultado}
          onClose={handleCloseResultado}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Grid container  >
            <Grid item xs={15} >
              <Box sx={style} >
                <InputLabel style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.5rem" }} >Imprimir Resultados</InputLabel >
                <Grid container item>
                  <Grid container item
                    style={{ overflowY: "scroll", maxHeight: "500px" }}>
                    <Grid container item ref={(ins) => (componente = ins)}
                      style={{ justifyContent: "center" }}>
                      {nuevoArray.map((data: any) =>
                        <>
                          <Grid container item key={data.id}
                            style={{
                              justifyContent: "center",
                              // backgroundColor:'red',
                              background: `url(${logobg}) no-repeat center center transparent`,
                              backgroundSize: '120%',
                              backgroundRepeat: "no-repeat",
                              maxWidth: "210mm",
                              minWidth: "210mm",
                              height: "295mm",
                              minHeight: "281mm"
                            }}

                          >
                            <div style={{ height: "250mm" }}></div>

                            <Grid container item xs={11} >
                              <Grid item xs={8} ></Grid>
                              {/* Header */}
                              <Grid container item alignItems="flex-start">
                                <Grid item xs={12}>
                                  <Grid container item xs={20} style={{ justifyContent: "end", marginBlock: "10px" }}>
                                    <img src={logo} width="280em" height="70em"></img>
                                  </Grid>
                                  <Grid item xs={15}  >
                                    <div style={{ border: '1px solid gray', borderRadius: '15px', width: "770px", maxWidth: "100%" }}>
                                      <div style={{ marginInline: "15px", marginBlock: "1px" }}>
                                        <Grid container item mt={1}>
                                          <Grid container item xs={8} style={{ marginLeft: "70px" }}>
                                            <InputLabel style={{ color: "black", fontFamily: "Arial", fontWeight: "700", fontSize: "0.8rem" }} >PACIENTE :&nbsp;</InputLabel >
                                            <InputLabel style={{ color: "black", fontFamily: "Arial", fontWeight: "400", fontSize: "0.8rem" }} >{nombreCompleto}</InputLabel >
                                          </Grid>
                                        </Grid>

                                        <Grid container item mt={1}>
                                          <Grid container item xs={6} style={{ marginLeft: "94px" }}>
                                            <InputLabel style={{ color: "black", fontFamily: "Arial", fontWeight: "700", fontSize: "0.8rem" }} >EDAD :&nbsp;</InputLabel >
                                            <InputLabel style={{ color: "black", fontFamily: "Arial", fontWeight: "400", fontSize: "0.8rem" }} >{edad}</InputLabel >
                                          </Grid>

                                          <Grid container item xs={2.5}>
                                            <InputLabel style={{ color: "black", fontFamily: "Arial", fontWeight: "700", fontSize: "0.8rem" }} >FECHA :&nbsp;</InputLabel >
                                            <InputLabel style={{ color: "black", fontFamily: "Arial", fontWeight: "400", fontSize: "0.8rem" }} >{fecha}</InputLabel >
                                          </Grid>
                                        </Grid>

                                        <Grid container item mt={1}>
                                          <Grid container item xs={6.1} style={{ marginLeft: "94px" }}>
                                            <InputLabel style={{ color: "black", fontFamily: "Arial", fontWeight: "700", fontSize: "0.8rem" }} >SEXO :&nbsp;</InputLabel >
                                            <InputLabel style={{ color: "black", fontFamily: "Arial", fontWeight: "400", fontSize: "0.8rem" }} >{sexo}</InputLabel >
                                          </Grid>

                                          <Grid container item xs={3}>
                                            <InputLabel style={{ color: "black", fontFamily: "Arial", fontWeight: "700", fontSize: "0.8rem" }} >SEDE :&nbsp;</InputLabel >
                                            <InputLabel style={{ color: "black", fontFamily: "Arial", fontWeight: "400", fontSize: "0.8rem" }} >{sede}</InputLabel >
                                          </Grid>
                                        </Grid>

                                        <Grid container item mt={1}>
                                          <Grid container item xs={6} style={{ marginLeft: "80px" }}>
                                            <InputLabel style={{ color: "black", fontFamily: "Arial", fontWeight: "700", fontSize: "0.8rem" }} >MEDICO :&nbsp;</InputLabel >
                                            <InputLabel style={{ color: "black", fontFamily: "Arial", fontWeight: "400", fontSize: "0.8rem" }} >{medico}</InputLabel >
                                          </Grid>

                                          <Grid container item xs={4} style={{ marginLeft: "6px" }}>
                                            <InputLabel style={{ color: "black", fontFamily: "Arial", fontWeight: "700", fontSize: "0.8rem" }} >CODIGO :&nbsp;</InputLabel >
                                            <InputLabel style={{ color: "black", fontFamily: "Arial", fontWeight: "400", fontSize: "0.8rem" }} >{codigo}</InputLabel >
                                          </Grid>
                                        </Grid>
                                      </div>
                                    </div>
                                  </Grid>
                                  <Grid item xs={8} ></Grid>
                                  <Grid item xs={8} ></Grid>
                                  <Grid item xs={8} ></Grid>
                                  <Grid item xs={8} ></Grid>
                                  <Grid item xs={8} ></Grid>
                                  <Grid item xs={8} ></Grid>
                                  <Grid item xs={8} ></Grid>
                                  <Grid item xs={8} height="15px" ></Grid>
                                  <div style={{ border: '1px solid black', borderRadius: '0', width: "770px", maxWidth: "100%", display: "flex", justifyContent: "center", alignItems: "center", minHeight: '20px' }}>
                                    <div style={{ marginInline: "15px", marginBlock: "0.2px" }}>
                                      <Grid container item xs={12} style={{ justifyContent: "center", marginBlock: "0.2px", paddingLeft: "30px" }}>
                                        <InputLabel style={{ color: "black", fontFamily: "Arial", fontWeight: "700", fontSize: "12.5px", textAlign: "center" }} >
                                          {data.nameservice}
                                        </InputLabel>
                                      </Grid>
                                    </div>
                                  </div>

                                  <Grid item xs={8} ></Grid>

                                  <Grid item xs={8} height="10px" ></Grid>
                                  <Grid container item xs={25} style={{ marginBlock: "5px" }}>

                                    <Grid container item xs={3} style={{ justifyContent: "center" }}>
                                      <InputLabel style={{ color: "black", textAlign: "center", fontFamily: "Arial", fontWeight: "700", fontSize: "12px" }} >EXAMEN</InputLabel >
                                    </Grid>
                                    <Grid container item xs={2} style={{ justifyContent: "center" }}>
                                      <InputLabel style={{ color: "black", fontFamily: "Arial", fontWeight: "700", fontSize: "12px" }} >RESULTADOS</InputLabel >
                                    </Grid>
                                    <Grid container item xs={2.03} style={{ justifyContent: "center" }}>
                                      <InputLabel style={{ color: "black", fontFamily: "Arial", fontWeight: "700", fontSize: "12px" }} >UNIDADES</InputLabel >
                                    </Grid>
                                    <Grid container item xs={3.2} style={{ justifyContent: "left" }} >
                                      <InputLabel style={{ color: "black", fontFamily: "Arial", fontWeight: "700", fontSize: "12px" }} >RANGOS REFERENCIALES</InputLabel >
                                    </Grid>
                                    <Grid container item xs={1.7} style={{ justifyContent: "left" }}>
                                      <InputLabel style={{ color: "black", fontFamily: "Arial", fontWeight: "700", fontSize: "12px" }} >METODOLOGIA</InputLabel >
                                    </Grid>
                                  </Grid>
                                  <Grid container item xs={12} style={{ justifyContent: "flex-start", marginBlock: "8px", paddingLeft: "5px" }}>
                                    {
                                      !Object.keys(data.detalleExam).some(nombre =>
                                        data.detalleExam[nombre]?.some((daton: any) => {
                                          if (daton && daton.name) {
                                            const names = data.name?.split("/").map((name: any) => name.toLowerCase().replace(/\s/g, ''));
                                            return names?.some((name: any) => name.includes(daton.name.toLowerCase().replace(/\s/g, '')));
                                          }
                                          return false;
                                        })
                                      ) &&
                                      <InputLabel style={{ color: "black", fontFamily: "Arial", fontWeight: "bold", fontSize: "14px" }} ><b>{data.name}</b></InputLabel >
                                    }
                                  </Grid>
                                  <Grid item xs={8} ></Grid>
                                  <Grid item xs={8} ></Grid>
                                  <Grid item xs={8} ></Grid>
                                  <Grid item xs={8} ></Grid>
                                  {/* Contenido */}
                                  <Grid container item xs={12} style={{ display: 'flex' }}>
                                    {
                                      Object.keys(data.detalleExam).map((nombre: any, indexY: any) =>
                                        <Grid container item key={indexY} style={{ display: 'flex' }}>
                                          <Grid container item xs={4} style={{ justifyContent: "flex-start", marginBlock: "5px" }}>
                                            {!(new RegExp(/^\s*resultados?\s*$/i).test(nombre)) && data.name !== nombre &&
                                              <InputLabel style={{ textTransform: "uppercase", color: "black", justifyContent: "right", fontFamily: "Arial", fontWeight: "620", fontSize: "11.2px", textAlign: "left" }} >
                                                {nombre}
                                              </InputLabel>
                                            }
                                          </Grid>


                                          {data.detalleExam[nombre].map((daton: any, indexW: any) =>
                                            <Grid container item key={indexW} style={{ display: 'flex' }}>
                                              <Grid container item xs={3} style={{ justifyContent: "right" }}>
                                                <div
                                                  style={{
                                                    color: "black",
                                                    fontFamily: "Arial",
                                                    fontWeight: "400",
                                                    fontSize: "10.2px",
                                                    textAlign: "right",
                                                    wordBreak: "break-all",
                                                    paddingRight: "5px", // añade un pequeño padding para asegurarnos de que el texto no se superponga con los dos puntos
                                                    position: "relative"  // necesario para el pseudo-elemento
                                                  }}
                                                >
                                                  <span>{daton.name}</span>
                                                  <span
                                                    style={{
                                                      position: "absolute",
                                                      right: 0,
                                                      top: 0
                                                    }}
                                                  >
                                                    :
                                                  </span>
                                                </div>
                                              </Grid>
                                              <Grid container item xs={2} style={{ justifyContent: "center", display: 'flex' }} >
                                                <InputLabel style={{ color: "black", fontFamily: "Arial", fontWeight: "800", fontSize: "10.3px", lineHeight: "1.5" }} >{daton.result}</InputLabel >
                                              </Grid>
                                              <Grid container item xs={2} style={{ justifyContent: "center", display: 'flex' }}>
                                                <InputLabel style={{ color: "black", fontFamily: "Arial", fontWeight: "400", fontSize: "10.2px", lineHeight: "1.5" }} >{daton.unit.name === "N/A" ? "" : daton.unit.name}</InputLabel >
                                              </Grid>
                                              <Grid container item xs={3.15} style={{ justifyContent: "center", padding: "3px", flexDirection: 'column' }}>
                                                {daton.examinationReferenceValues.map((datito: any, indexT: any) =>
                                                  <div key={indexT} style={{ color: "black", fontFamily: "Arial", fontWeight: "400", fontSize: "10.2px", lineHeight: "1.5", textAlign: "center", wordBreak: "break-all" }} >{datito.name}</div >
                                                )}
                                              </Grid>
                                              <Grid container item xs={1.7} style={{ justifyContent: "center", padding: "3px" }}>
                                                <div
                                                  style={{
                                                    color: "black",
                                                    fontFamily: "Arial",
                                                    fontWeight: "400",
                                                    fontSize: "10.2px",
                                                    wordBreak: "break-all"
                                                  }}
                                                >
                                                  {daton.methodology.name === "N/A" ? "" : daton.methodology.name}
                                                </div>
                                              </Grid>
                                            </Grid>
                                          )}
                                        </Grid>
                                      )
                                    }
                                  </Grid>
                                  <Grid item xs={8} style={{ display: 'flex' }}></Grid>
                                  <Grid item xs={8} style={{ display: 'flex' }}></Grid>
                                  <Grid item xs={8} style={{ display: 'flex' }}></Grid>
                                  <Grid item xs={8} style={{ display: 'flex' }}></Grid>
                                  <br></br>
                                  {
                                    data.RESULT &&
                                    (() => {
                                      const resultArray = Array.isArray(data.RESULT) ? data.RESULT : [data.RESULT];
                                      const resultString = resultArray.filter((result: any) => result && result.trim() !== '').join('\n');

                                      return (
                                        <Grid container style={{ display: 'flex' }}>
                                          {
                                            resultString &&
                                            (() => {
                                              const [firstLine, ...restOfLines] = resultString.split('\n');
                                              const restOfText = restOfLines.join('\n');

                                              return (
                                                <>
                                                  <Grid container style={{ display: 'flex' }}>
                                                    <Grid item xs={2} className={classes.wrapText} style={{ fontSize: '10px' }}>
                                                      <b>OBSERVACION: </b>
                                                    </Grid>
                                                    <Grid item xs={9} className={classes.wrapText} style={{ whiteSpace: 'pre-wrap', fontSize: '10px' }}>
                                                      {firstLine}
                                                    </Grid>
                                                    <Grid item xs={2} className={classes.wrapText} style={{ fontSize: '10px' }}>
                                                      {/* Espacio vacío para alinear el texto */}
                                                    </Grid>
                                                    <Grid item xs={7} className={classes.wrapText} style={{ whiteSpace: 'pre-wrap', fontSize: '10px' }}>
                                                      {restOfText}
                                                    </Grid>

                                                  </Grid>

                                                </>
                                              );
                                            })()
                                          }

                                        </Grid>
                                      );
                                    })()
                                  }
                                  <Grid item xs={15} className={classes.wrapText} style={{ fontSize: '10px' }}>
                                    <b>Diagnostico ML por evaluar: {diagnosticoActual} </b>
                                  </Grid>
                                  <br></br>
                                  <Grid item xs={15} className={classes.wrapText} style={{ fontSize: '10px' }}>
                                    <b>Interpretación: {diagnosticoActualAI} </b>
                                  </Grid>
                                </Grid>
                              </Grid>

                              {/* Body */}


                              <Grid item xs={8} ></Grid>
                              <Grid item xs={8} ></Grid>
                              <Grid item xs={8} ></Grid>
                              <Grid item xs={8} ></Grid>
                              <Grid item xs={8} ></Grid>
                              <Grid item xs={8} ></Grid>
                              <Grid item xs={8} ></Grid>
                              <Grid item xs={8} ></Grid>
                              <Grid item xs={8} ></Grid>
                              <Grid item xs={8} ></Grid>
                              <Grid item xs={8} ></Grid>
                              <Grid item xs={8} ></Grid>
                              <Grid item xs={8} ></Grid>
                              <Grid item xs={8} ></Grid>
                              <Grid item xs={8} ></Grid>
                              <Grid item xs={8} ></Grid>
                              <Grid item xs={8} ></Grid>
                              <Grid item xs={8} ></Grid>
                              <Grid item xs={8} ></Grid>
                              <Grid item xs={8} ></Grid>





                              <Grid container item xs={12} style={{ justifyContent: "end" }}>
                                <img src={firma} height="28px" width="140px"></img>
                              </Grid>
                              <Grid item xs={8} ></Grid>





                              {/* Footer */}
                              <Grid container item >
                                <Grid item xs={12}  >
                                  <div style={{ width: "800px", maxWidth: "100%", justifyContent: "left", maxHeight: "100%" }}>
                                    <div style={{ margin: "5px" }}>
                                      <Grid container item mt={1} style={{ justifyContent: "left" }} >
                                        <Grid container item xs={8} >
                                          <InputLabel style={{ color: "#0B1463", fontFamily: "Arial", fontWeight: "bold", fontSize: "12px" }} >{direccion}</InputLabel >
                                        </Grid>
                                        <Grid container item xs={4} style={{ justifyContent: "end" }}>
                                          <InputLabel style={{ color: "#0B1463", fontFamily: "Arial", fontWeight: "bold", fontSize: "12px" }} ><b>EMAIL:</b>   {correoUser}</InputLabel >
                                        </Grid>
                                      </Grid>
                                      <Grid container item mt={1}>
                                        <Grid container item xs={8}>
                                          <InputLabel style={{ color: "#0B1463", fontFamily: "Arial", fontWeight: "bold", fontSize: "12px" }} ><b>Telf.:</b>   {telfUser}</InputLabel >
                                        </Grid>
                                        <Grid container item xs={4} style={{ justifyContent: "end" }}>
                                          <InputLabel style={{ color: "#0B1463", fontFamily: "Arial", fontWeight: "bold", fontSize: "12px" }} ><b>www.redlabperu.com</b></InputLabel >
                                        </Grid>
                                      </Grid>

                                    </div>
                                  </div>
                                </Grid>
                              </Grid>

                            </Grid>


                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Grid>
                  <Grid container item xs mt={2.5}>
                    <Grid item xs={8} ></Grid>
                    <Grid container item xs={4} spacing={2}>
                      <Grid item xs={6} >
                        <Button onClick={handleCloseResultado} variant="contained" style={{ backgroundColor: "rgb(0 85 169)", color: "white", fontFamily: "Quicksand", fontWeight: "900", fontSize: "1rem" }}>Cancelar</Button>
                      </Grid>
                      <Grid item xs={6} >
                        <Button onClick={downloadPdf} variant="contained" style={{ backgroundColor: "rgb(0 85 169)", color: "white", fontFamily: "Quicksand", fontWeight: "900", fontSize: "1rem" }}>Imprimir</Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Modal>
      </div >


    </Box>
  );
}

