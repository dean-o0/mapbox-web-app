import React, { useState } from "react";
import toGeoJSON from "@mapbox/togeojson";
import sanitizeKml from "../utility/sanitizeKml";

// Max file size allowed is set at 50MB
const maxFileSize = 50 * 1024 * 1024;

const FileUpload = ({ setGeojson }) => {
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        // Check if file is selected and if it is a KML file
        if (!file || !file.name.endsWith(".kml")) {
            alert("Invalid file. Please upload a .kml file.");
            return;
        }

        // Check the file size limit
        if (file.size > maxFileSize) {
            alert("File size is too large. Please upload a file smaller than 50MB.");
            return;
        }

        setUploading(true);
        const reader = new FileReader();

        // Using readAsArrayBuffer for better handling of large files
        reader.readAsArrayBuffer(file);

        reader.onload = (e) => {
            try {
                // Decode the ArrayBuffer to text
                const decoder = new TextDecoder("utf-8");
                const kmlText = decoder.decode(new Uint8Array(e.target.result));

                // Sanitize the KML content
                const cleanKmlText = sanitizeKml(kmlText);

                // Parse the KML into an XML document
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(cleanKmlText, "text/xml");

                // Check for KML parsing errors
                if (xmlDoc.getElementsByTagName("parsererror").length) {
                    alert("Invalid KML format.");
                    setUploading(false);
                    return;
                }

                // Convert KML to GeoJSON
                const geoJsonData = toGeoJSON.kml(xmlDoc);

                // Check if GeoJSON has features
                if (!geoJsonData || !geoJsonData.features.length) {
                    alert("KML file does not contain valid geographic data.");
                    setUploading(false);
                    return;
                }

                // Pass the GeoJSON data to the parent component
                setGeojson(geoJsonData);
            } catch (error) {
                console.error("Error processing KML file:", error);
                alert("Error processing the file. Please upload a valid KML.");
            } finally {
                setUploading(false);
            }
        };

        // Handle error during file reading
        reader.onerror = (error) => {
            console.error("Error reading file:", error);
            alert("Error reading the file. Please try again.");
            setUploading(false);
        };
    };

    return (
        <div className="file-upload-container">
            <label htmlFor="file-upload" className="file-upload-button">
                Upload KML
            </label>
            <input
                id="file-upload"
                type="file"
                accept=".kml"
                onChange={handleFileUpload}
            />
            {uploading && <p className="uploading-text">Uploading file... This may take a few minutes.</p>}
        </div>
    );
};

export default FileUpload;