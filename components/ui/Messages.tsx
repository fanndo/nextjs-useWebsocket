import React, { FC } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Grid, SvgIcon, SvgIconProps, TableContainer, Typography } from '@mui/material';
import { WebSocketResponseDTO } from '../../pages/index';

interface Props {
  mesagges: WebSocketResponseDTO[];
  connected:boolean;
}

const ConnectedIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <circle cx="12" cy="12" r="8"></circle>
    </SvgIcon>
  );
}

export const Messages:FC<Props> = ( { mesagges, connected }  ) => {
  
  return (
    <Grid container spacing={2} alignItems="stretch" justifyContent="center" direction="row" >
      <Grid item  xs={12} display={ 'flex' } justifyContent={ 'space-between' } alignItems={'baseline' }  >
        <Typography sx={{ p:2 }} component="h2" align='justify'  alignContent={ 'space-between' } variant="h6" color="primary" gutterBottom>
            Logs
        </Typography>
        <ConnectedIcon color= { connected ? 'success'  : 'error' } />
      </Grid>
      <Grid item  xs={12}>
        <TableContainer sx={{ maxHeight: 570 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>DateTime</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Code</TableCell>
                <TableCell>Message</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mesagges.map((row, i) => (
                <TableRow key={ i }>
                  <TableCell component="th" scope="row">{ row.date.toLocaleString() }</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell align="right">{`${row.code}`}</TableCell>
                  <TableCell>{row.msg}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}
