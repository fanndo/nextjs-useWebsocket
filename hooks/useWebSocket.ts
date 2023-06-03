import React, { useEffect, useRef, useState } from 'react'

interface ActionRequest {
    action:SocketActionRequest;
    username?: string ;
    password?: string ;
}

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

export default function useWebSocket<T,K>( webSocketUrl:string, message:K,pingTime?:number,pingActionMessage?:K) {

  const [IsConnected, setIsConnected] = useState<boolean>(false);
  const [data, setData] = useState<T | undefined>();

  let intervalId:any = null;
  let websocket = useRef<WebSocket | null>(null)

  useEffect(()=>{
    websocket.current = new WebSocket(webSocketUrl) || null;
    
    try {
      if(websocket && websocket.current){

        websocket.current.onopen = ()=>{
          console.log('connected');
          setIsConnected(true)
          if(message && websocket.current?.readyState == 1 ){
            websocket.current?.send(JSON.stringify(message));
          }
        }

        websocket.current.onerror = (error) => {
          console.error(`[error]}`,{ error});
          setIsConnected(false);
        };

        websocket.current.onmessage = (event)=>{
          const data:T = JSON.parse(event.data);
          setData(data);
        }

        websocket.current.onclose =( event:CloseEvent )=>{
          console.log('onclose..................');
          clearInterval(intervalId);
          setIsConnected(false);
          if (event.wasClean)  {
            alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
          } else {
            alert('[close] Connection died');
          }
        }

        if(pingTime && pingActionMessage ){
          intervalId = setInterval(() => {
            if (websocket && websocket.current && websocket.current.readyState == 1 && websocket.current.bufferedAmount == 0){
              websocket.current?.send(JSON.stringify(pingActionMessage));
            }
          }, pingTime);
        }
    }

    return () => {
      if (websocket.current){
        websocket.current.onclose =(event)=>{
          clearInterval(intervalId);
          setIsConnected(false);
          if (event.wasClean)  {
            alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
          } else {
            alert('[close] Connection died');
          }
        }
      }
    }
      
    } catch (error) {
      console.error(error);
      if(websocket && websocket.current){
        websocket.current.close(1000, "Work complete");
      }
    }

      websocket.current = new WebSocket(webSocketUrl) || null;
  

    },[webSocketUrl])

  return {
      websocket,
      IsConnected,
      data
  }
}