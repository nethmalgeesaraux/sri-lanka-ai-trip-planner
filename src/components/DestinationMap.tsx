"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
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
  const [layer, setLayer] = useState<"street" | "satellite">("street");
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
    <div className="overflow-hidden rounded-2xl border border-[#cde0d6] shadow-[0_12px_32px_-18px_rgba(3,29,56,0.35)]">
      <div className="flex items-center justify-between bg-[#031d38] px-4 py-2.5 text-white">
        <span className="text-xs font-semibold">{name} Location Map</span>
        <div className="flex gap-1 rounded-full bg-[#0e2e4d] p-1">
          {(["street", "satellite"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setLayer(k)}
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition ${
                layer === k
                  ? "bg-[#1bc75c] text-[#031d38]"
                  : "text-slate-200 hover:text-white"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[400px] w-full">
        <MapContainer
          center={[latitude, longitude]}
          zoom={12}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          {layer === "street" ? (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          ) : (
            <TileLayer
              attribution="Tiles &copy; Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          )}

          <Marker position={[latitude, longitude]} icon={markerIcon}>
            <Popup>{name}</Popup>
          </Marker>

          <MapResizeHandler />
        </MapContainer>
      </div>
    </div>
  );
}
