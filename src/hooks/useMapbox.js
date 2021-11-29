import {useEffect, useRef, useState, useCallback} from 'react';
import mapboxgl from 'mapbox-gl';
import { v4 } from 'uuid';
import { Subject } from 'rxjs';

mapboxgl.accessToken = 'pk.eyJ1IjoiZW1nZzIyMjIiLCJhIjoiY2t2djU1ZWxoM3QzazJudGsyZHg3MjU1MSJ9.Z5KPKymYnQGwQJ9ZBz3JRQ';


export const useMapbox = (puntoInicial) => {

    //referencia al DIV del mapa;
    const setRef = useCallback(
        ( node ) => {
            mapaDiv.current = node;
        },
        [],
    );

    // referencia a los marcadores 
    const marcadores = useRef({});
    
    //Observables de Rxjs    
    const movimientoMarcador = useRef( new Subject() );
    const nuevoMarcador = useRef( new Subject() );


    // mapa y coords
    const mapaDiv = useRef();
    const mapa = useRef();
    const [coords, setCoords] = useState(puntoInicial);

    // funcion para agregar marcadores

    const agregarMarcador = useCallback((ev, id) => {
        const { lng, lat } = ev.lngLat || ev;
        const marker = new mapboxgl.Marker();
        marker.id = id ?? v4(); 
        marker
            .setLngLat([lng, lat])
            .addTo( mapa.current )
            .setDraggable(true);
        marcadores.current[ marker.id ] = marker;

        if( !id ) {
           nuevoMarcador.current.next( {
                id: marker.id,
                lng, lat
            });
        }

        // escuchar movimientos del marcador
        marker.on('drag', ({ target }) => {
            const { id } = target;
            const { lng, lat } = target.getLngLat();
            movimientoMarcador.current.next({
                id,lng,lat
            });
        })

        },
        []);


    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapaDiv.current, // container ID
            style: 'mapbox://styles/mapbox/streets-v11', // style URL
            center: [puntoInicial.lng, puntoInicial.lat], // starting position [lng, lat]
            zoom: puntoInicial.zoom // starting zoom
            });
        mapa.current = map;
    }, [puntoInicial]);

    //Cuando se mueve el mapa
    useEffect(() => {
        mapa.current?.on('move', () => {
            const { lng, lat } = mapa.current.getCenter();
            setCoords({
                lng: lng.toFixed(4), 
                lat: lat.toFixed(4), 
                zoom: mapa.current.getZoom().toFixed(2)})
            
        });
    }, []);

    //Agregar marcadores cuando se hace click
    useEffect(()=> {
        mapa.current?.on('click', agregarMarcador);
    },[agregarMarcador]);

    return { 
        agregarMarcador,
        coords,
        marcadores,
        nuevoMarcador$: nuevoMarcador.current,
        movimientoMarcador$: movimientoMarcador.current, 
        setRef
    }
}
