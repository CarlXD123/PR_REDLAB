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
import { editHeadquarterApi, getFilterPatientsApi, getHeadquartersAllApi, getPagedPatientsApi } from '../../api';
import { Button, Grid, InputLabel, Modal, TextField } from '@mui/material';
import { toBase64 } from '../../util';
import Swal from 'sweetalert2';

interface Data {
  name: string;
}


function createData(
  name: string
): Data {
  return { name };
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
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Nombre',
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

export default function TbAdministrarSedes() {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<string>("");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState<any>([]);

  const [abrirSede, setAbrirSede] = React.useState<any>(false);

  const [nombre, setNombre] = React.useState<any>("");
  const [direccion, setDireccion] = React.useState<any>("");
  const [telefono, setTelefono] = React.useState<any>("");
  const [correo, setCorreo] = React.useState<any>("");
  const [img, setImg] = React.useState<any>("");
  const [textImg, setTextImg] = React.useState<any>("");
  const [imgFile, setImgFile] = React.useState<any>();
  const [id, setID] = React.useState<any>("");


  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  React.useEffect(() => {
    getHeadquartersAllApi().then((ap: any) => {
      let mapeado: any = [];
      ap.data.forEach((d: any) => {
        mapeado.push({
          id: d.id,
          name: d.name,
          address: d.address,
          tlfNumber: d.tlfNumber,
          email: d.email,
          img: d.urlImage
        })
      });
      setRows(mapeado)
    });
  }, []);
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

  var ModifiedSave=()=>{
    Swal.fire({
        title: 'Sede actualizada',
        icon: 'success',
    })
  }

  var ModifiedError=()=>{
    Swal.fire({
        title: 'Sede no actualizada',
        icon: 'warning',
    })
  }

  var NombIncomplete=()=>{
    Swal.fire({
        title: 'Coloque el nombre de la sede',
        icon: 'warning',
        target: '#custom-target',
    })
}

var DirIncomplete=()=>{
    Swal.fire({
        title: 'Coloque la direccion de la sede',
        icon: 'warning',
        target: '#custom-target',
    })
}

  const handleOpenSede = (data: any) => {
    setID(data.id)
    setNombre(data.name)
    setDireccion(data.address)
    setTelefono(data.tlfNumber)
    setCorreo(data.email)
    setImg(data.img)
    setAbrirSede(true);
  }
  const handleCloseSede = () => {
    setAbrirSede(false);
  }
  const handleChangeNombre = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(event.target.value);
  };
  const handleChangeDireccion = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDireccion(event.target.value);
  };
  const handleChangeTelefono = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTelefono(event.target.value);
  };
  const handleChangeCorreo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCorreo(event.target.value);
  };
  const handleChangeImg = (event: any) => {
    setTextImg(event.target.value);
    setImgFile(event.target.files[0]);
  };
  const guardarSede = async () => {

    if (nombre === "") {
        NombIncomplete();
        return;
    }

    if (direccion === "") {
       DirIncomplete();
       return;
    }

    let daton = {
      address: direccion,
      email: correo,
      name: nombre,
      tlfNumber: telefono,
    }

    if (textImg == "") {
      let data = {
        ...daton,
        urlImage: img
      }
      editHeadquarterApi(id, data).then((x: any) => {
        if (x.status) {
          ModifiedSave()
          setAbrirSede(false)
          window.location.href = '/apps/headquarters'
        } else {
          ModifiedError()
          setAbrirSede(false)
        }
      })
    } else {
      let data = {
        ...daton,
        file: {
          base64: await toBase64(imgFile),
          path: textImg.split("\\")[textImg.split("\\").length - 1]
        },
        urlImage: textImg.split("\\")[textImg.split("\\").length - 1]
      }
      editHeadquarterApi(id, data).then((x: any) => {
        if (x.status) {
          //alert(x.message.text)
          ModifiedSave()
          setAbrirSede(false)
          window.location.href = '/apps/headquarters'
        } else {
          //alert(x.message.text)
          ModifiedError()
          setAbrirSede(false)
        }
      })
    }
  }
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, borderRadius: "12px" }}>
        <TableContainer style={{maxHeight: 300, overflow: "scroll", overflowX: "scroll"}}>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(rows, getComparator(order, orderBy))
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
                        style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.1rem" }}
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="left">
                        <div style={{ display: "flex" }}>
                          <div style={{ paddingLeft: "5px" }}>
                            <Button onClick={() => handleOpenSede(row)} variant="contained" style={{ color: "white", fontFamily: "Quicksand", fontWeight: "500", fontSize: "1rem" }}>Editar</Button>
                          </div>
                        </div>
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
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 15, 20]}
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
          id="custom-target"
          keepMounted
          open={abrirSede}
          onClose={handleCloseSede}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={style}>
            <InputLabel style={{ color: "black", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.5rem" }} >Información de Sede</InputLabel >

            <Grid container item xs mt={2.5}>
              <TextField fullWidth id="outlined-basic" label="Nombre" variant="outlined" value={nombre} onChange={handleChangeNombre} />
            </Grid>
            <Grid container item xs mt={2.5}>
              <TextField fullWidth id="outlined-basic" label="Dirección" variant="outlined" value={direccion} onChange={handleChangeDireccion} />
            </Grid>
            <Grid container item xs mt={2.5}>
              <TextField fullWidth id="outlined-basic" label="Teléfono" variant="outlined" value={telefono} onChange={handleChangeTelefono} />
            </Grid>
            <Grid container item xs mt={2.5}>
              <TextField fullWidth id="outlined-basic" label="Correo eléctronico" variant="outlined" value={correo} onChange={handleChangeCorreo} />
            </Grid>
            <Grid container item xs mt={2.5}>
              <TextField type="file" id="outlined-basic" focused label="Firma digital" variant="outlined" fullWidth value={textImg} onChange={handleChangeImg} />
            </Grid>
            <Grid container item xs mt={2.5}>
              <InputLabel style={{ color: "black", fontFamily: "Quicksand", fontWeight: "600", fontSize: "1rem" }} >Fondo actual</InputLabel >
            </Grid>
            <Grid container item xs mt={2.5}>
              <img src={`${img}`} style={{ height: "auto", maxWidth: "200px" }} ></img>
            </Grid>
            <Grid container item xs mt={2.5}>
              <Grid item xs={6} ></Grid>
              <Grid container item xs={6} spacing={2}>
                <Grid item xs={6} >
                  <Button onClick={handleCloseSede} variant="contained" style={{ backgroundColor: "rgb(0 85 169)", color: "white", fontFamily: "Quicksand", fontWeight: "900", fontSize: "1rem" }}>Cancelar</Button>
                </Grid>
                <Grid item xs={6} >
                  <Button onClick={guardarSede} variant="contained" style={{ backgroundColor: "rgb(0 85 169)", color: "white", fontFamily: "Quicksand", fontWeight: "900", fontSize: "1rem" }}>Editar</Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      </div>
    </Box>
  );
}
