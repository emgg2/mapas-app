import React, { useEffect, useContext } from 'react'
import { SocketContext } from '../context/SocketContext';
import { useMapbox } from '../hooks/useMapbox'

const puntoInicial = {
    lng: -3.6937,
    lat: 40.3815,
    zoom: 16.5
}


export const MapaPage = () => {

    const { coords, setRef, nuevoMarcador$, movimientoMarcador$, agregarMarcador } = useMapbox( puntoInicial );
    const { socket } = useContext( SocketContext);

    //Escuchar los marcadores activos

    useEffect(() => {
        socket.on('marcadores-activos', (marcadores) => {
            for( const key of Object.keys (marcadores)){
                agregarMarcador( marcadores[key] , key);
            }
        });
    }, [socket, agregarMarcador])

   //nuevo marcador
    useEffect(() => {
        nuevoMarcador$.subscribe(marcador => {
           socket.emit('marcador-nuevo' , marcador )
        });
    }, [nuevoMarcador$, socket])

    //TODO: Tarea
    //Movimiento de marcador, subscribirse
    useEffect(() => {
        movimientoMarcador$.subscribe(marcador => {
        });
    }, [movimientoMarcador$]);

    //Escuchar nuevos marcadores
    useEffect(() => {
        socket.on('marcador-nuevo', (marcador) => {
            console.log(marcador);
        });
    }, [socket])
    return (
        <>
        <div className="info">
            Lng: { coords.lng }  |  lat: { coords.lat }  | zoom: { coords.zoom }
        </div>
         <div
            ref={ setRef }
            className="mapContainer"
            / >
             
             
        </>
    )
}
