import { Box, Button, Grid, InputLabel, MenuItem, Paper, Table, Modal, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from "@mui/material";
import React from "react";
import ReactToPrint from "react-to-print";
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import { getAgreementsAllApi, getRefererApi, getNationAllApi, editDetailApi2 , getMatchEditValueExamApi,  getExaminationApi, getModelsApi ,getHeadquartersAllApi, getAppointmentsApi, reportExamMonthly } from "../../api";
import { Link, useParams } from 'react-router-dom';
import { Contenido } from "../Home";
import moment from 'moment';
import Swal from 'sweetalert2';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import * as XLSX from 'xlsx';

export default function ModelSettingEdit() {
    type Order = 'asc' | 'desc';
    const { idmodelo, id, idexam} = useParams();
    const [rows4, setRows4] = React.useState<any[]>([]);
    const [setexame, setExam] = React.useState<any[]>([]);
    const [valueEx, setValueEx] = React.useState<any[]>([]);


    function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
        if (b[orderBy] < a[orderBy]) {
          return -1;
        }
        if (b[orderBy] > a[orderBy]) {
          return 1;
        }
        return 0;
      }


    React.useEffect(() => {
        getModelsApi(ruta).then((x: any) => {
          setRows4(x.data)
        })
        getExaminationApi(idexam).then((x: any) => {
          setExam(x.data.name)
        })

        getMatchEditValueExamApi(idexam).then((x: any) => {
          let mapeado: any = []
          x.data?.forEach((d: any) => {
            mapeado.push({
               namevaluexamen: d.namevalue,
               idvalueexam: d.idvalueexam,
               idapilismatchdata:d.idapilismatchdata,
               priority: d.priority,
            })
           });
          setValueEx(mapeado)
        })


    }, [])

    const ruta = idmodelo;
  

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

    const reorder = (list: any, startIndex: any, endIndex: any) => {
      const result = [...list];
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
    
      return result;
    };


    const modelito = [rows4]

    return (
        <div className='tabla-componente card-table-examfinish'>
        <Contenido>
                <Grid container xs={200}>
                    <Grid item xs={200}>
                      <div style={{ borderRadius: '5px', width: "1000px", maxWidth: "100%" }}>
                      <div style={{ marginInline: "50px", marginBlock: "1px"}}>
                      <div style={{ width: "1150px" }} className="nav-tabla">
                        <Grid item xs={15}>
                        {modelito.map((row: any, index: any) => {
                        return ( 
                        <Link to={"/apps/apilis/configure/modelo/"+ idmodelo + "/marca/"+ id +"/setting"}>
                            <div style={{ display: "flex", alignItems: "center" }} >
                            <KeyboardBackspaceRoundedIcon style={{ color: "white", fontSize: "1.3rem", cursor: "pointer" }}></KeyboardBackspaceRoundedIcon>
                                <InputLabel style={{ color: "white", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.6rem", cursor: "pointer"}} >APILIS/ CONFIGURACION / MARCA / MODELO {row.nameModel} / SETTINGS DATA / {setexame}</InputLabel >
                            </div>
                        </Link>
                        )
                        })}
                        </Grid>
                      </div>
                        </div>
                       </div>
                    </Grid>
                </Grid>
            <br></br>
            <br></br>
            <div style={{justifyContent:"center"}}>
            <Grid container sx={{ placeContent: "center", mb: 50}} className="contenedor-tabla-apilis">
            <Box sx={{ width: '50%',  placeContent: "center"}} className="card-table-examfinish contenedor-tabla-apilis">
            
               <DragDropContext
      onDragEnd={(result) => {
        const { source, destination } = result;
        if (!destination) {
          return;
        }
        if (
          source.index === destination.index &&
          source.droppableId === destination.droppableId
        ) {
          return;
        }
        const newOrder = reorder(valueEx, source.index, destination.index);
        const newValues = newOrder.map((item, index) => ({ ...item, priority: index }));
        setValueEx(newValues);
        
        // Actualizar los valores en la base de datos
        newValues.forEach((item) => {
          editDetailApi2(item.priority, item.idvalueexam);
        });


      }}
    >
      <div>
        <Droppable droppableId="tasks">
          {(droppableProvided) => (
            <ul
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}
              className="task-container"
            >
              {valueEx.map((task, index) => (
                <Draggable key={task.idvalueexam} draggableId={task.priority.toString()} index={index}>
                  {(draggableProvided) => (
                    <li
                      {...draggableProvided.draggableProps}
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.dragHandleProps}
                      className="task-item"
                      
                    >
                      {task.namevaluexamen}
                    </li>
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </ul>
          )}
        </Droppable>
      </div>
    </DragDropContext> 
    
            </Box >
        </Grid>
            </div>

        </Contenido>
    </div>
    );
}


