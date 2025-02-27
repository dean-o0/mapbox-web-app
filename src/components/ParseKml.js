import { useEffect } from "react";
import toGeoJSON from "@mapbox/togeojson";

const ParseKml = ({ setGeojson }) => {
    useEffect(() => {
        const fetchKmlAndConvert = async () => {
            // Fetches and converts KML file to GeoJSON
            try {
                const response = await fetch("/custom.geo.kml");
                if (!response.ok) throw new Error("Failed to fetch KML file");
                const kmlText = await response.text();
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(kmlText, 'text/xml');
                const geoJsonData = toGeoJSON.kml(xmlDoc);
                setGeojson(geoJsonData);
            } catch (error) {
                console.error("Error loading KML:", error);
            }
        };


        fetchKmlAndConvert();
    }, []);

    return null;
};

export default ParseKml;
