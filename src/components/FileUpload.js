import React from "react";
import toGeoJSON from "@mapbox/togeojson";
import sanitizeKml from "../utility/sanitizeKml";

// Max file size allowed is set at 10MB
const maxFileSize = 10240000 ;

const FileUpload = ({ setGeojson }) => {
    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        if (!file || !file.name.endsWith(".kml")) {
            alert("Invalid file. Please upload a .kml file.");
            return;
        }

        if (file.size > maxFileSize) {
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

// import React from "react";
// import toGeoJSON from "@mapbox/togeojson";
// import simplify from "simplify-geojson";
// import sanitizeKml from "../utility/sanitizeKml";

// // Max file size allowed is set at 50MB
// const maxFileSize = 50 * 1024 * 1024;

// // Function to simplify the GeoJSON
// const simplifyGeoJSON = (geoJsonData) => {
//     try {
//         return simplify(geoJsonData, 0.001); // You can adjust the tolerance value for simplification
//     } catch (error) {
//         console.error("Error simplifying GeoJSON:", error);
//         return geoJsonData;
//     }
// };

// const FileUpload = ({ setGeojson }) => {
//     const handleFileUpload = (event) => {
//         const file = event.target.files[0];

//         if (!file || !file.name.endsWith(".kml")) {
//             alert("Invalid file. Please upload a .kml file.");
//             return;
//         }

//         if (file.size > maxFileSize) {
//             alert("File size is too large.");
//             return;
//         }

//         const reader = new FileReader();
//         reader.readAsArrayBuffer(file); // More efficient for large files

//         reader.onload = (e) => {
//             try {
//                 const decoder = new TextDecoder("utf-8");
//                 const kmlText = decoder.decode(new Uint8Array(e.target.result));

//                 const cleanKmlText = sanitizeKml(kmlText);
//                 const parser = new DOMParser();
//                 const xmlDoc = parser.parseFromString(cleanKmlText, "text/xml");

//                 if (xmlDoc.getElementsByTagName("parsererror").length) {
//                     alert("Invalid KML format.");
//                     return;
//                 }

//                 const geoJsonData = toGeoJSON.kml(xmlDoc);

//                 if (!geoJsonData || !geoJsonData.features.length) {
//                     alert("KML file does not contain valid geographic data.");
//                     return;
//                 }

//                 const simplifiedGeoJson = simplifyGeoJSON(geoJsonData); // Simplify the GeoJSON

//                 setGeojson(simplifiedGeoJson); // Pass simplified GeoJSON to the parent component
//             } catch (error) {
//                 console.error("Error processing KML file:", error);
//                 alert("Error processing the file. Please upload a valid KML.");
//             }
//         };
//     };

//     return (
//         <div className="file-upload-container">
//             <label htmlFor="file-upload" className="file-upload-button">
//                 Upload KML
//             </label>
//             <input id="file-upload" type="file" accept=".kml" onChange={handleFileUpload} />
//         </div>
//     );
// };

// export default FileUpload;

