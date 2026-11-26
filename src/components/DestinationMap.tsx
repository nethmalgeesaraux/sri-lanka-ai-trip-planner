"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface DestinationMapProps {
  latitude: number;
  longitude: number;
  name: string;
}

const markerIcon = L.divIcon({
  className: "",
  html: `<div style="display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:9999px;border:3px solid #fff;background:#087b45;color:#fff;font-weight:800;box-shadow:0 8px 18px rgba(3,29,56,0.32);">★</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

export default function DestinationMap({
  latitude,
  longitude,
  name,
}: DestinationMapProps) {
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!isMounted) {
    return (
      <div className="h-[400px] w-full animate-pulse rounded-2xl bg-[#e5efe9] flex items-center justify-center text-[#08233f]">
        Loading map...
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full overflow-hidden rounded-2xl border border-[#cde0d6] shadow-[0_12px_32px_-18px_rgba(3,29,56,0.35)]">
      <MapContainer
        center={[latitude, longitude]}
        zoom={12}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <Marker position={[latitude, longitude]} icon={markerIcon}>
          <Popup>{name}</Popup>
        </Marker>

        <MapResizeHandler />
      </MapContainer>
    </div>
  );
}
