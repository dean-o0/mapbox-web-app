import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import MAPBOX_TOKEN from "../utility/mapboxConfig";
import { coordinatesGeocoder } from "./SearchBar";
import FileUpload from "./FileUpload";
import GeoJsonLayer from "./GeoJsonLayer";
import MapRotation from "./MapRotation";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

mapboxgl.accessToken = MAPBOX_TOKEN;

const MapView = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [geojson, setGeojson] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (mapContainerRef.current) {
      mapContainerRef.current.innerHTML = ""; // Ensure it's empty before mounting Mapbox
    }

    // Initialize Mapbox
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      projection: "globe",
      zoom: 1.75,
      center: [-90, 40],
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    mapRef.current.on("style.load", () => {
      mapRef.current.setFog({});
      setMapLoaded(true);
    });

    mapRef.current.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        localGeocoder: coordinatesGeocoder,
        zoom: 4,
        placeholder: "Try: -40, 170",
        mapboxgl: mapboxgl,
        reverseGeocode: true,
      }),
      "top-right"
    );

    return () => mapRef.current.remove();
  }, []);

  return (
    <>
      <FileUpload setGeojson={setGeojson} />
      {/* Ensure the map container is below the button */}
      <div className="map-container" ref={mapContainerRef} style={{ height: "100vh" }}>
        <GeoJsonLayer mapRef={mapRef} geojson={geojson} />
      </div>
      {/* Keep MapRotation outside of the map container */}
      <MapRotation mapRef={mapRef} mapLoaded={mapLoaded} />
    </>
  );
};

export default MapView;
