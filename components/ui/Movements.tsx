import React, { FC } from 'react'
import { Grid, TableContainer ,Typography} from '@mui/material';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { IMovement } from '../../pages';

interface Props {
    movements: IMovement[];
}

  
export const Movements:FC<Props>  = ({ movements }) => {


  return (
    <Grid container spacing={2} alignItems="stretch" justifyContent="center" direction="row" >
        <Grid item xs={12}>
            <Typography sx={{ p:2 }} component="h2"  alignContent={ 'space-between' } variant="subtitle1" color="primary" gutterBottom>
                    Movimientos 
            </Typography>
        </Grid>
        <Grid item xs={12}>
            <TableContainer sx={{ maxHeight: 570 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre y Apellido</TableCell>
                            <TableCell align="right">CC</TableCell>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Fecha Movimiento</TableCell>
                            <TableCell>Fecha Concertacion</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell align="right">Cant.</TableCell>
                            <TableCell align="right">Monto</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {movements.map((row, i) => (
                            <TableRow key={ i }>
                                <TableCell component="th" scope="row">{ `${ row.Apellido }, ${ row.Nombre } ` }</TableCell>
                                <TableCell>{row.CuentaComitente}</TableCell>
                                <TableCell align="right">{`${row.Cliente}`}</TableCell>
                                <TableCell>{row.FechaMovimiento.toLocaleString() }</TableCell>
                                <TableCell>{row.FechaConcertacion.toLocaleString() }</TableCell>
                                <TableCell>{row.Estado}</TableCell>
                                <TableCell>{row.Cantidad}</TableCell>
                                <TableCell>{row.Monto}</TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    </Grid>

  )
}
