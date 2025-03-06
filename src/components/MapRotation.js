import React, { useEffect, useRef, useState } from "react";

const MapRotation = ({ mapRef, mapLoaded }) => {
  const [isSpinning, setIsSpinning] = useState(true);
  const userInteracting = useRef(false);
  const rotationInterval = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    startRotation();

    const handleInteractionStart = () => {
      userInteracting.current = true;
      stopRotation();
    };

    const handleInteractionEnd = () => {
      userInteracting.current = false;
      if (isSpinning) startRotation();
    };

    mapRef.current.on("mousedown", handleInteractionStart);
    mapRef.current.on("mouseup", handleInteractionEnd);
    mapRef.current.on("dragend", handleInteractionEnd);
    mapRef.current.on("pitchend", handleInteractionEnd);
    mapRef.current.on("rotateend", handleInteractionEnd);
    mapRef.current.on("moveend", handleInteractionEnd);

    startRotation();

    return () => {
      stopRotation();
      mapRef.current.off("mousedown", handleInteractionStart);
      mapRef.current.off("mouseup", handleInteractionEnd);
      mapRef.current.off("dragend", handleInteractionEnd);
      mapRef.current.off("pitchend", handleInteractionEnd);
      mapRef.current.off("rotateend", handleInteractionEnd);
      mapRef.current.off("moveend", handleInteractionEnd);
    };
  }, [mapRef, mapLoaded]);

  const startRotation = () => {
    if (!mapRef.current || !isSpinning || userInteracting.current) return;

    stopRotation(); // Clear existing interval if any
    rotationInterval.current = setInterval(() => {
      if (mapRef.current) {
        const zoom = mapRef.current.getZoom();
        const maxSpinZoom = 5;
        const slowSpinZoom = 3;
        const secondsPerRevolution = 120;

        if (zoom >= maxSpinZoom) return;

        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }

        const center = mapRef.current.getCenter();
        center.lng -= distancePerSecond;
        mapRef.current.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    }, 1000);
  };

  const stopRotation = () => {
    if (rotationInterval.current) {
      clearInterval(rotationInterval.current);
      rotationInterval.current = null;
    }
  };

  const toggleRotation = () => {
    setIsSpinning((prev) => {
      if (!prev) startRotation();
      else stopRotation();
      return !prev;
    });
  };

  return (
    <button onClick={toggleRotation} className="rotation-button">
      {isSpinning ? "Pause rotation" : "Start rotation"}
    </button>
  );
};

export default MapRotation;
