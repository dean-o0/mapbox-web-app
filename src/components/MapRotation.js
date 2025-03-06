import React, { useEffect, useRef, useState } from "react";

const MapRotation = ({ mapRef }) => {
  const [isSpinning, setIsSpinning] = useState(true);
  const userInteracting = useRef(false);
  const rotationInterval = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Event listeners to detect user interaction
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

    // Start rotation on mount
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
  }, [mapRef, isSpinning]);

  const startRotation = () => {
    if (!mapRef.current || !isSpinning || userInteracting.current) return;

    stopRotation(); // Clear existing interval if any
    rotationInterval.current = setInterval(() => {
      if (mapRef.current) {
        const center = mapRef.current.getCenter();
        center.lng -= 0.2; // Adjust rotation speed (smaller = slower)
        mapRef.current.easeTo({ center, duration: 100, easing: (n) => n });
      }
    }, 100); // Adjust interval timing if necessary
  };

  const stopRotation = () => {
    if (rotationInterval.current) {
      clearInterval(rotationInterval.current);
      rotationInterval.current = null;
    }
  };

  const toggleRotation = () => {
    setIsSpinning((prev) => {
      if (!prev) startRotation(); // Restart rotation if enabling
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
