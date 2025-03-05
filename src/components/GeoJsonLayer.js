// import { useEffect } from "react";

// const GeoJsonLayer = ({ mapRef, geojson }) => {
//   useEffect(() => {
//     // Check if mapRef and geojson are valid before proceeding
//     if (!mapRef.current || !geojson) return;

//     if (mapRef.current.getSource("geojson-data")) {
//       mapRef.current.getSource("geojson-data").setData(geojson);
//     } else {
//       mapRef.current.addSource("geojson-data", {
//         type: "geojson",
//         data: geojson
//       });

//       mapRef.current.addLayer({
//         id: "geojson-layer",
//         type: "circle",
//         source: "geojson-data",
//         paint: {
//           "circle-radius": 4,
//           "circle-stroke-width": 2,
//           "circle-color": "red",
//           "circle-stroke-color": "white"
//         }
//       });
//     }

//   }, [geojson, mapRef]);

//   return null;
// };

// export default GeoJsonLayer;

import { useEffect } from "react";

const GeoJsonLayer = ({ mapRef, geojson }) => {
  useEffect(() => {
    // Check if mapRef and geojson are valid before proceeding
    if (!mapRef.current || !geojson) return;

    // Check if the source already exists
    if (mapRef.current.getSource("geojson-data")) {
      mapRef.current.getSource("geojson-data").setData(geojson);
    } else {
      // Add the source and layer if it doesn't exist
      mapRef.current.addSource("geojson-data", {
        type: "geojson",
        data: geojson
      });

      mapRef.current.addLayer({
        id: "geojson-layer",
        type: "circle",  // Keep the existing circle style
        source: "geojson-data",
        paint: {
          "circle-radius": 4,  // Point size
          "circle-stroke-width": 2,
          "circle-color": "red",  // Color of the points
          "circle-stroke-color": "white"
        }
      });
    }
  }, [geojson, mapRef]);

  return null;
};

export default GeoJsonLayer;
