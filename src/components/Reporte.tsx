import { Button, Grid, InputAdornment, InputLabel, MenuItem, TextField } from "@mui/material";
import React from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { months } from "../constant";
import { Contenido } from "./Home";
import TbReporte from "./reporte/filtrar/tbReporte";

class Reporte extends React.Component<{ navigate: NavigateFunction }, any>{
    render() {
        return (
            <div className='tabla-componente'>
                <Contenido>
                    <Grid container>
                        <Grid container item xs={12} spacing={2} style={{ alignItems: "center" }}>
                            <Grid item xs={8}>
                                <div style={{ display: "flex", alignItems: "center" }} >
                                    <InputLabel style={{ color: "white", fontFamily: "Quicksand", fontWeight: "400", fontSize: "1.8rem" }} >Reporte de exámenes mensuales</InputLabel >
                                </div>
                            </Grid>
                            <Grid item xs={2}></Grid>
                            <Grid item xs={2}></Grid>
                        </Grid>
                    </Grid>
                    <br></br>
                    <div>
                        <TbReporte />
                    </div>

                </Contenido>
            </div>
        )
    }
}
function withNavigation(Component: any): (props: any) => JSX.Element {
    return props => <Component {...props} navigate={useNavigate()} />;
}

export default withNavigation(Reporte);