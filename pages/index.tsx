
import React, { useEffect, useState, useRef } from 'react'
import io from 'socket.io-client';
import { Container, Grid, Paper} from '@mui/material';
import { PrincipalLayout } from '../components/layouts';
import { Messages ,Movements } from '../components/ui';
import useWebSocket from '../hooks/useWebSocket';

enum SocketActionRequest {
  Ping='ping',
  Auth='auth',
  Status='status',
  Subscribe='subscribe',
  Resubscribe='resubscribe',
  Unsubscribe='unsubscribe',
  UnsubscribeAll='unsubscribeall',
  Disconnect='disconnect'
}

type SocketActionResponse =
  'success'   |
  'pong'      |
  'connected' |
  'movement'  |
  'trade'     |
  'quote'


interface ActionRequest {
  action:SocketActionRequest;
  username?: string ;
  password?: string ;
}

export interface IMovement {
  IdMovimiento: number;
  Cliente: number;
  FechaMovimiento: Date;
  FechaConcertacion: Date;
  Estado: string;
  Tipo: string;
  Monto: number;
  Pais: string;
  Moneda: string;
  Nota: string;
  TipoCuenta: string;
  CuentaComitente: string;
  NumeroDocumento: string;
  Nombre: string;
  Apellido: string;
  TimeSpan: string;
  Cantidad: number;
  Simbolo: string;
}

const auth:ActionRequest = {
  action: SocketActionRequest.Auth,
  username: process.env.USER,
  password: process.env.PASSWORD
};

const ping : ActionRequest = {
  action : SocketActionRequest.Ping
}

const disconnect:ActionRequest ={
  action: SocketActionRequest.Disconnect
}

interface WebSocketResponse{
  type:SocketActionResponse;
  code: number | undefined,
  msg: any;
}

export type WebSocketResponseDTO = {
  date: Date;
  type:SocketActionResponse;
  code: number | undefined,
  msg: string;
}

const HomePage = () => {

  const { IsConnected, websocket, data } = useWebSocket<WebSocketResponse,ActionRequest>(
    `${process.env.WEBSOCKET_URL_MOV}`,
    auth,
    30000,
    ping
  );

  const [dataResponse, setDataResponse] = useState<WebSocketResponseDTO[]>([]);
  const [movements, setMovements] = useState<IMovement[]>([]);

  useEffect(()=>{
    if(data && IsConnected){
      const { type, code, msg }:WebSocketResponse = data;

      switch (type.toLocaleLowerCase() as SocketActionResponse) {
        case 'success':
          const connect = msg as SocketActionResponse;
          if (connect.toLocaleLowerCase() === 'connected' ){
            const data: WebSocketResponseDTO ={ date: new Date(), type, code, msg  }
            setDataResponse((prev) => [...prev, data])
          }
          break;
        case 'movement':
          const movement = msg as IMovement;
          setMovements((prev) => [...prev, movement ])
          break;
        default:
          break;
      }

    }
  },[data])

  useEffect(()=>{
    // const iframe = document.getElementById('mi-iframe');
    // var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    // iframeDoc.open();
    // iframeDoc.write('<html><head></head><body><script>window.location.replace("https://example.com");</script></body></html>');
    // iframeDoc.close();
  },[])

  



  return (
    <PrincipalLayout title={' Movimientos '} pageDescription={'Movimientos'}>
      {/* <Container  sx={{ mt: 1 }}> */}
        <Grid container spacing={2} alignItems="stretch" justifyContent="center" direction="row" >
          <Grid item sm={8} xs={12}>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <Movements movements={ movements} />
            </Paper>
          </Grid>
          <Grid item sm={4} xs={12}>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <Messages mesagges={ dataResponse } connected = { IsConnected }  />
            </Paper>
          </Grid>
        </Grid>
      {/* </Container> */}
    </PrincipalLayout>

  )
}

export default HomePage

