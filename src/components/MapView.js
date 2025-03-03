import React, { useEffect, useRef, useState } from "react";

import FileUpload from "./FileUpload";
import GeoJsonLayer from "./GeoJsonLayer";
import MAPBOX_TOKEN from "../utility/mapboxConfig";
import { coordinatesGeocoder } from "./SearchBar";

import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

import "mapbox-gl/dist/mapbox-gl.css";
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

mapboxgl.accessToken = MAPBOX_TOKEN;

const MapView = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [geojson, setGeojson] = useState(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      mapContainerRef.current.innerHTML = ""; // Ensure it's empty before mounting Mapbox
    }

    // Initialize the Mapbox map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      // style: "mapbox://styles/mapbox/standard-satellite",
      style: "mapbox://styles/mapbox/streets-v11",
      projection: "globe",
      zoom: 2.5,
      center: [25, -5],
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    mapRef.current.on("style.load", () => {
      mapRef.current.setFog({});
    });

    mapRef.current.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        localGeocoder: coordinatesGeocoder,
        zoom: 4,
        placeholder: 'Try: -40, 170',
        mapboxgl: mapboxgl,
        reverseGeocode: true
      }),
      "top-right"
    );

    // Cleanup function to remove the map instance
    return () => mapRef.current.remove();
  }, []);

  return (
    <>
      <FileUpload setGeojson={setGeojson} />

      <div className="map-container" ref={mapContainerRef} style={{ height: '100vh' }}>

        {/* Render layers */}
        <GeoJsonLayer mapRef={mapRef} geojson={geojson} />

      </div>
    </>
  );
};

export default MapView;
