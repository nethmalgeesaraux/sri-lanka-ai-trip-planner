"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap, TileLayer } from "leaflet";
import type { Place } from "@/lib/travel-types";

type MapStyleKey = "explorer" | "satellite" | "street";

const TILE_LAYERS: Record<
  MapStyleKey,
  { label: string; url: string; attribution: string }
> = {
  explorer: {
    label: "Explorer",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  satellite: {
    label: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics",
  },
  street: {
    label: "Street",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
};

function haversineKm(a: Place, b: Place): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function pinHexForTag(tag: string): string {
  if (tag === "Heritage") return "#d97706";
  if (tag === "Beach") return "#0284c7";
  if (tag === "Wildlife") return "#15803d";
  return "#087b45";
}

export default function SriLankaMap({
  places,
  selected,
  route = false,
  onSelect,
  heightClass = "h-[420px] md:h-[500px]",
}: {
  places: Place[];
  selected?: string;
  route?: boolean;
  onSelect?: (id: string) => void;
  heightClass?: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const tileLayerRef = useRef<TileLayer | null>(null);
  const [failed, setFailed] = useState(false);
  const [readyKey, setReadyKey] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState<MapStyleKey>("explorer");

  const key = places.map((p) => p.id).join(",");
  const currentKey = `${key}-${route}`;
  const ready = readyKey === currentKey;

  const totalDistanceKm = useMemo(() => {
    if (!route || places.length < 2) return 0;
    let total = 0;
    for (let i = 1; i < places.length; i++) {
      // Road travel across Sri Lanka averages ~1.32x straight-line distance
      total += haversineKm(places[i - 1], places[i]) * 1.32;
    }
    return Math.round(total);
  }, [places, route]);

  useEffect(() => {
    let cancelled = false;
    import("leaflet")
      .then((L) => {
        if (cancelled || !container.current) return;
        const instance = L.map(container.current, {
          scrollWheelZoom: false,
          minZoom: 6,
          maxZoom: 17,
          maxBounds: [
            [5.2, 78.8],
            [10.3, 82.6],
          ],
          maxBoundsViscosity: 0.7,
        }).setView([7.65, 80.75], 7);
        map.current = instance;

        const layerConfig = TILE_LAYERS[mapStyle];
        tileLayerRef.current = L.tileLayer(layerConfig.url, {
          attribution: layerConfig.attribution,
          maxZoom: 18,
        }).addTo(instance);

        if (route && places.length > 1) {
          const coords = places.map(
            (p) => [p.latitude, p.longitude] as [number, number]
          );
          L.polyline(coords, {
            color: "#ffffff",
            weight: 8,
            opacity: 0.85,
          }).addTo(instance);
          L.polyline(coords, {
            color: "#087b45",
            weight: 4,
            dashArray: "10 8",
            opacity: 0.95,
          }).addTo(instance);
        }

        places.forEach((place, i) => {
          const isSelected = selected === place.id;
          const pinColor = pinHexForTag(place.tag);

          const popupNode = document.createElement("div");
          popupNode.style.minWidth = "190px";
          popupNode.style.fontFamily = "DM Sans, sans-serif";

          if (place.image) {
            const img = document.createElement("img");
            img.src = place.image;
            img.alt = place.name;
            img.style.width = "100%";
            img.style.height = "92px";
            img.style.objectFit = "cover";
            img.style.borderRadius = "8px";
            img.style.marginBottom = "8px";
            popupNode.appendChild(img);
          }

          const badge = document.createElement("span");
          badge.textContent = route ? `Stop ${i + 1} · ${place.tag}` : place.tag;
          badge.style.display = "inline-block";
          badge.style.fontSize = "11px";
          badge.style.fontWeight = "700";
          badge.style.color = "#087947";
          badge.style.background = "#e3f6e9";
          badge.style.padding = "2px 8px";
          badge.style.borderRadius = "999px";
          badge.style.marginBottom = "4px";
          popupNode.appendChild(badge);

          const title = document.createElement("div");
          title.textContent = place.name;
          title.style.fontWeight = "700";
          title.style.fontSize = "14px";
          title.style.color = "#08233f";
          popupNode.appendChild(title);

          const subtitle = document.createElement("div");
          subtitle.textContent = place.subtitle;
          subtitle.style.fontSize = "12px";
          subtitle.style.color = "#475569";
          subtitle.style.marginTop = "2px";
          popupNode.appendChild(subtitle);

          const marker = L.marker([place.latitude, place.longitude], {
            icon: L.divIcon({
              className: "",
              html: `<div style="position:relative;display:flex;align-items:center;justify-content:center;width:44px;height:44px;">
                ${
                  isSelected
                    ? `<span style="position:absolute;inset:-4px;border-radius:9999px;background:${pinColor};opacity:0.25;"></span>`
                    : ""
                }
                <span style="display:flex;align-items:center;justify-content:center;width:${isSelected ? "40px" : "36px"};height:${isSelected ? "40px" : "36px"};border-radius:9999px;border:3px solid #ffffff;background:${pinColor};color:#ffffff;font-weight:800;font-size:13px;box-shadow:0 8px 18px rgba(3,29,56,0.32);transition:transform 0.2s;">${i + 1}</span>
              </div>`,
              iconSize: [44, 44],
              iconAnchor: [22, 22],
            }),
            title: place.name,
            keyboard: true,
          })
            .addTo(instance)
            .bindPopup(popupNode);

          marker.on("click", () => onSelect?.(place.id));
        });

        if (places.length > 1) {
          instance.fitBounds(
            L.latLngBounds(places.map((p) => [p.latitude, p.longitude])),
            { padding: [55, 55], maxZoom: 9 }
          );
        } else if (places.length === 1) {
          instance.setView([places[0].latitude, places[0].longitude], 11);
        }

        const observer = new ResizeObserver(() => instance.invalidateSize());
        observer.observe(container.current);
        instance.on("unload", () => observer.disconnect());
        setReadyKey(currentKey);
      })
      .catch(() => setFailed(true));

    return () => {
      cancelled = true;
      tileLayerRef.current = null;
      map.current?.remove();
      map.current = null;
    };
    // Rebuild when stops or selected ring changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, route, selected]);

  useEffect(() => {
    if (!map.current || !ready) return;
    import("leaflet").then((L) => {
      if (!map.current) return;
      if (tileLayerRef.current) {
        map.current.removeLayer(tileLayerRef.current);
      }
      const cfg = TILE_LAYERS[mapStyle];
      tileLayerRef.current = L.tileLayer(cfg.url, {
        attribution: cfg.attribution,
        maxZoom: 18,
      }).addTo(map.current);
      tileLayerRef.current.bringToBack();
    });
  }, [mapStyle, ready]);

  useEffect(() => {
    const place = places.find((p) => p.id === selected);
    if (place && ready) {
      map.current?.flyTo([place.latitude, place.longitude], 10, {
        animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      });
    }
  }, [selected, ready, places]);

  return (
    <div className="relative z-0 overflow-hidden rounded-2xl border border-[#cde0d6] bg-[#e5efe9] shadow-[0_12px_36px_-18px_rgba(3,29,56,0.35)] [&_.leaflet-control-attribution]:text-[11px] [&_.leaflet-control-zoom_a]:!h-10 [&_.leaflet-control-zoom_a]:!w-10 [&_.leaflet-control-zoom_a]:!leading-[40px]">
      {/* Map Style Switcher & Route Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d4e4dc] bg-[#031d38] px-4 py-2.5 text-white">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#44d23c]" />
          <span className="font-semibold">
            {route
              ? `${places.length} Route Stops · ~${totalDistanceKm} km overland`
              : `${places.length} Curated Destinations`}
          </span>
        </div>
        <div
          className="flex items-center gap-1 rounded-full bg-[#0e2e4d] p-1"
          role="group"
          aria-label="Map layer style"
        >
          {(Object.keys(TILE_LAYERS) as MapStyleKey[]).map((styleKey) => (
            <button
              key={styleKey}
              type="button"
              onClick={() => setMapStyle(styleKey)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                mapStyle === styleKey
                  ? "bg-[#1bc75c] text-[#031d38]"
                  : "text-slate-200 hover:text-white"
              }`}
            >
              {TILE_LAYERS[styleKey].label}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={container}
        role="region"
        aria-label={
          route
            ? "Itinerary stops map of Sri Lanka"
            : "Interactive Sri Lanka destinations map"
        }
        className={`${heightClass} w-full`}
      />

      {!ready && (
        <p
          role="status"
          className="absolute left-5 top-16 rounded-lg bg-white/95 px-4 py-2.5 text-sm font-medium text-[#08233f] shadow"
        >
          {failed
            ? "The map could not load. You can still explore the destination list."
            : "Loading Sri Lanka map…"}
        </p>
      )}

      {/* Legend / Route Note */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#d4e4dc] bg-white px-4 py-2.5 text-xs text-slate-600">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#d97706]" />
            Heritage
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#087b45]" />
            Nature
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#0284c7]" />
            Beach
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#15803d]" />
            Wildlife
          </span>
        </div>
        {route && (
          <span>
            Dashed line shows stop order (~{totalDistanceKm} km est. road path).
          </span>
        )}
      </div>
    </div>
  );
}
