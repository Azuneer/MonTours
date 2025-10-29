import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

// Mapbox access token
mapboxgl.accessToken = "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";

export function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current) return; // Initialize map only once
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [0.6848, 47.3941], // Tours
      zoom: 11,
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  return <div ref={mapContainer} style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }} />;
}
