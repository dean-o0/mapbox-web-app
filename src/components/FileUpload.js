import React from "react";
import toGeoJSON from "@mapbox/togeojson";
import sanitizeKml from "../utility/sanitizeKml";

// Max file size allowed is set at 5GB 
const maxFileSize = 5368709120;

const FileUpload = ({ setGeojson }) => {
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const sizeInBytes = file.size;

        if (!file || !file.name.endsWith(".kml")) {
            alert("Invalid file. Please upload a .kml file.");
            return;
        }

        if (sizeInBytes > maxFileSize) {
            alert("File size is too large.");
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const kmlText = e.target.result;
                // Sanitize before parsing
                const cleanKmlText = sanitizeKml(kmlText);

                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(cleanKmlText, "text/xml");

                if (xmlDoc.getElementsByTagName("parsererror").length) {
                    alert("Invalid KML format.");
                    return;
                }

                if(xmlDoc.getElementsByTagName("sizeerror").length) {
                    alert("The file size is too large.")
                }

                const geoJsonData = toGeoJSON.kml(xmlDoc);

                if (!geoJsonData || !geoJsonData.features.length) {
                    alert("KML file does not contain valid geographic data.");
                    return;
                }

                setGeojson(geoJsonData);
            } catch (error) {
                console.error("Error processing KML file:", error);
                alert("Error processing the file. Please upload a valid KML.");
            }
        };

        reader.readAsText(file);
    };

    return (
        <div className="file-upload-container">
            <label htmlFor="file-upload" className="file-upload-button">
                Upload KML
            </label>
            <input id="file-upload" type="file" accept=".kml" onChange={handleFileUpload} />
        </div>
    );
};

export default FileUpload;


