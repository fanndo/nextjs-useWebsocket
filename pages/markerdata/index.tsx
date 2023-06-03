import React, { useEffect, useState } from 'react'

import { PrincipalLayout } from '../../components/layouts'
import { Button, FormControl, Grid, Icon, Input, InputLabel, MenuItem, Paper, Select, FormHelperText, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Stack, Alert, Snackbar } from '@mui/material'
import  useWebSocket from '../../hooks/useWebSocket';
import { WebSocketResponseDTO } from '../index';
import { Messages } from '../../components/ui';
import { useForm } from 'react-hook-form';
import {  VariantType, useSnackbar } from 'notistack';
import moment from 'moment';

interface WebSocketResponse{
  type:SocketActionResponse;
  code: number | undefined,
  msg: any;
}

type SocketActionResponse =
  'success'   |
  'pong'      |
  'connected' |
  'movement'  |
  'trade'     |
  'quote'     |
  'subscribed'|
  'disconnecting'|
  'resubscribed'|
  'unsubscribed'

type Term = 'T0' | 'T1' | 'T2' 


enum SocketActionRequest {
  Ping='ping',
  Auth='auth',
  Status='status',
  Subscribe='subscribe',
  Resubscribe='resubscribe',
  Unsubscribe='unsubscribe',
  UnsubscribeAll='unsubscribeall',
  Disconnect='disconnect',
}

interface IQuote {
  AskSize: number;
  BidSize: number;
  AskPrice: number;
  BidPrice: number;
  Symbol: string;
  Market: string;
  Term: Term;
  Timespan: string;
}

export interface ITrade {
  Symbol: string;
  Market: string;
  Term: Term;
  Price: number;
  Size: number;
  Timespan: string;
  TradeSize: number;
  TradePrice: number;
}

interface ActionRequest {
  action:SocketActionRequest;
  username?: string ;
  password?: string ;
  trades?: string[] ;
  quotes?: string[] ;

}
const auth :ActionRequest= {
  action: SocketActionRequest.Auth,
  username:process.env.USER,
  password:process.env.PASSWORD
};
const disconect :ActionRequest= {
  action: SocketActionRequest.Disconnect
};
const ping:ActionRequest={
  action : SocketActionRequest.Ping
}

type FormData = {
  symbol: string;
};

interface MarkerData{
  Symbols:string[]
}

interface Simbolo{
  Symbol : string;
  Quote:IQuote | null;
  Trade:ITrade | null;
}

const MarkerData = () => {

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const { IsConnected, websocket, data } = useWebSocket<WebSocketResponse,ActionRequest>(
    `${process.env.WEBSOCKET_URL}` ,
    auth,
    10000,
    ping
  );

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar();

  const [quotes, setQuotes] = useState<IQuote[]>([]);
  const [trades, setTrades] = useState<ITrade[]>([]);
  const [symbols, setSymbols] = useState<string[]>([ "COME", "ALUA", "GGAL"]);
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [simbolos, setSimbolos] = useState<Simbolo[]>([]) 

  const onSubscribe = async() => {

    const subscription: ActionRequest ={
        action: SocketActionRequest.Subscribe,
        trades: symbols,
        quotes: symbols
    }

    if (websocket.current?.readyState == 1){
      websocket.current.send(JSON.stringify(subscription))
    }
  } 

  useEffect(()=>{
    if(data && IsConnected){
      const { type, code, msg }:WebSocketResponse = data;

      switch (type.toLocaleLowerCase() as SocketActionResponse) {
        case 'success':
          const response = msg as SocketActionResponse;
          if (response.toLocaleLowerCase() === 'connected' ){
            setIsAuthenticated(true);
            enqueueSnackbar<'success'>('Usuario Autenticado!');

            if (websocket.current?.readyState == 1){
              const subscription: ActionRequest ={
                action: SocketActionRequest.Subscribe,
                trades: symbols,
                quotes: symbols
              }
              websocket.current.send(JSON.stringify(subscription))
            }
            
          }
          else if (response.toLocaleLowerCase() === 'pong' ){
            console.warn('pong received... ')
          }
          else if (response.toLocaleLowerCase() === 'subscribed' ){
            setSubscribed(true)
            enqueueSnackbar<'success'>('Usuario Subscripto!');
            let simbolos = symbols.map( s => ({
              Symbol: s,
              Quote: null,
              Trade: null
            }))

            setSimbolos(simbolos);
          }
          else if (response.toLocaleLowerCase() === 'disconnecting' ){
            setIsAuthenticated(false);
            console.log('Disconnecting...')
          }else if (response.toLocaleLowerCase() === 'resubscribed' ){

          }else{
            //Unsubscribed
            // UNSUBSCRIBE OK | UNSUBSCRIBE_ALL OK 
            console.log('UNSUBSCRIBE OK | UNSUBSCRIBE_ALL OK', {response})
          }
          break;
        case 'subscribed':
          const subscribed = msg as SocketActionResponse;
          console.log('case subscribe', { subscribed } );
          break;
        case 'quote':
          const quote = msg as IQuote;
          const currentSymbols = simbolos.map(simbolo => {
            if(simbolo.Symbol === quote.Symbol ){
               simbolo.Quote = quote
            }
            return simbolo
          } )
          setSimbolos(currentSymbols)
          // let currentSymbol = simbolos.filter( el => el.Symbol === quote.Symbol && quote.Term === 'T2')
          setQuotes((prev) => [...prev, quote ])
          // setQuotes([...currentQuotes, quote  ])
          break;
        case 'trade':
          const trade = msg as ITrade;
          console.log('case trade', { trade } );
          const current = simbolos.map(simbolo => {
            if(simbolo.Symbol === trade.Symbol ){
               simbolo.Trade = trade
            }
            return simbolo
          } )
          setSimbolos(current)
          break;          
        default:
          break;
      }
    }
  },[data])

  return (
    <PrincipalLayout title={'Marker Data'} pageDescription={'Cotizaciones'}>
        <Grid container spacing={3}>
            <Grid item xs={12}>
              {
                (symbols && symbols.length > 0) &&          
                <TableContainer sx={{ maxHeight: 570 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Simbolo</TableCell>

                        <TableCell>Precio Compra</TableCell>
                        <TableCell>Cantidad Compra</TableCell>
                        <TableCell>Mercado</TableCell>
                        <TableCell>Precio Venta</TableCell>
                        
                        <TableCell>Plazo</TableCell>
                        <TableCell>Precio</TableCell>
                        <TableCell>Cantidad</TableCell>
                        <TableCell>Fecha-Hora</TableCell>
                        <TableCell>Cantidad Operada</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        (simbolos.length > 0) &&
                        simbolos.map((symbol,i)=>(
                          <TableRow key={ symbol.Symbol }>
                            <TableCell> { symbol.Symbol }</TableCell>
                            <TableCell> { symbol.Quote?.AskPrice.toLocaleString('es-AR', {minimumFractionDigits: 4, maximumFractionDigits: 4}) || '' } </TableCell>
                            <TableCell> { symbol.Quote?.AskSize || '' } </TableCell>
                            <TableCell> { symbol.Quote?.Market || '' } </TableCell>
                            <TableCell> { symbol.Quote?.BidPrice.toLocaleString('es-AR', {minimumFractionDigits: 4, maximumFractionDigits: 4}) || '' } </TableCell>
                            <TableCell> { symbol.Trade?.Term || '' } </TableCell>
                            <TableCell> { symbol.Trade?.Price.toLocaleString('es-AR', {minimumFractionDigits: 4, maximumFractionDigits: 4}) || '' } </TableCell>
                            <TableCell> { symbol.Trade?.Size || '' } </TableCell>
                            <TableCell> { moment(symbol.Trade?.Timespan).format('DD/MM/YYYY HH:mm:ss')  || '' } </TableCell>
                            <TableCell> { symbol.Trade?.TradeSize || '' } </TableCell>
                          </TableRow>
                        )
                        )
                        
                      }
                      
                    </TableBody>
                  </Table>
                </TableContainer>
              }
            </Grid>
        </Grid>
    </PrincipalLayout>
  )
}

export default MarkerData