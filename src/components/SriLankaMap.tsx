"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import type { Place } from "@/lib/travel-types";

export default function SriLankaMap({
  places,
  selected,
  route = false,
  onSelect,
}: {
  places: Place[];
  selected?: string;
  route?: boolean;
  onSelect?: (id: string) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const [failed, setFailed] = useState(false);
  const [readyKey, setReadyKey] = useState<string | null>(null);
  const key = places.map((p) => p.id).join(",");
  const currentKey = `${key}-${route}`;
  const ready = readyKey === currentKey;

  useEffect(() => {
    let cancelled = false;
    import("leaflet")
      .then((L) => {
        if (cancelled || !container.current) return;
        const instance = L.map(container.current, {
          scrollWheelZoom: false,
        }).setView([7.65, 80.75], 7);
        map.current = instance;
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }).addTo(instance);
        places.forEach((place, i) => {
          const label = document.createElement("div");
          const title = document.createElement("strong");
          title.textContent = place.name;
          const detail = document.createElement("p");
          detail.textContent = place.subtitle;
          label.append(title, detail);
          const marker = L.marker([place.latitude, place.longitude], {
            icon: L.divIcon({
              className: "",
              html: `<span class="flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-white bg-[#087b45] text-sm font-bold text-white shadow-lg">${i + 1}</span>`,
              iconSize: [44, 44],
              iconAnchor: [22, 40],
            }),
            title: place.name,
            keyboard: true,
          })
            .addTo(instance)
            .bindPopup(label);
          marker.on("click", () => onSelect?.(place.id));
        });
        if (route && places.length > 1) {
          L.polyline(
            places.map((p) => [p.latitude, p.longitude]),
            { color: "#087b45", weight: 4, dashArray: "8 8" }
          ).addTo(instance);
        }
        if (places.length > 1) {
          instance.fitBounds(
            L.latLngBounds(places.map((p) => [p.latitude, p.longitude])),
            { padding: [55, 55], maxZoom: 9 }
          );
        }
        const observer = new ResizeObserver(() => instance.invalidateSize());
        observer.observe(container.current);
        instance.on("unload", () => observer.disconnect());
        setReadyKey(currentKey);
      })
      .catch(() => setFailed(true));
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
    // Rebuild only when the ordered stop collection changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, route]);

  useEffect(() => {
    const place = places.find((p) => p.id === selected);
    if (place && ready) {
      map.current?.flyTo([place.latitude, place.longitude], 11, {
        animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      });
    }
  }, [selected, ready, places]);

  return (
    <div className="relative z-0 overflow-hidden rounded-2xl border border-[#d4e4dc] bg-[#e5efe9] [&_.leaflet-control-attribution]:text-xs [&_.leaflet-control-zoom_a]:!h-11 [&_.leaflet-control-zoom_a]:!w-11 [&_.leaflet-control-zoom_a]:!leading-[44px]">
      <div
        ref={container}
        role="region"
        aria-label={
          route
            ? "Itinerary stops map of Sri Lanka"
            : "Interactive Sri Lanka destinations map"
        }
        className="h-[420px] w-full md:h-[480px]"
      />
      {!ready && (
        <p
          role="status"
          className="absolute left-5 top-5 rounded-lg bg-white p-3 text-sm text-[#08233f]"
        >
          {failed
            ? "The map could not load. You can still explore the destination list."
            : "Loading Sri Lanka map…"}
        </p>
      )}
      {route && (
        <p className="bg-white px-4 py-3 text-xs leading-5 text-slate-600">
          Dashed lines show the sequence of destinations, not road directions.
          Check transport routes before travelling.
        </p>
      )}
    </div>
  );
}
