import React, { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiZW1nZzIyMjIiLCJhIjoiY2t2djU1ZWxoM3QzazJudGsyZHg3MjU1MSJ9.Z5KPKymYnQGwQJ9ZBz3JRQ';
const puntoInicial = {
    lng: -3.6937,
    lat: 40.3815,
    zoom: 16.5
}

export const MapaPage = () => {

    const mapaDiv = useRef();
    const [ mapa, setMapa ] = useState();
    const [coords, setCoords] = useState(puntoInicial)


    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapaDiv.current, // container ID
            style: 'mapbox://styles/mapbox/streets-v11', // style URL
            center: [puntoInicial.lng, puntoInicial.lat], // starting position [lng, lat]
            zoom: puntoInicial.zoom // starting zoom
            });
        setMapa(map);
    }, []);

    //Cuando se mueve el mapa
    useEffect(() => {
        mapa?.on('move', () => {
            const { lng, lat } = mapa.getCenter();
            setCoords({
                lng: lng.toFixed(4), 
                lat: lat.toFixed(4), 
                zoom: mapa.getZoom().toFixed(2)})
            
        });
    }, [mapa])

    return (
        <>
        <div className="info">
            Lng: { coords.lng }  |  lat: { coords.lat }  | zoom: { coords.zoom }
        </div>
         <div
            ref={ mapaDiv }
            className="mapContainer"
            / >
             
             
        </>
    )
}
