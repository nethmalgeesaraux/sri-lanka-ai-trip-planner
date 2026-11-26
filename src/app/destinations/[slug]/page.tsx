"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useDarkMode } from "@/lib/theme";
import SupportChatWidget from "@/components/SupportChatWidget";
import { api } from "../../../../convex/_generated/api";

const DestinationMap = dynamic(() => import("@/components/DestinationMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] rounded-2xl bg-[#e5efe9] animate-pulse flex items-center justify-center text-[#08233f]">
      Loading map...
    </div>
  ),
});

function DestinationDetailsContent() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [dark, setDark] = useDarkMode();
  const [activePhoto, setActivePhoto] = useState(0);
  const [weather, setWeather] = useState<{
    temperatureC: number;
    condition: string;
    rainProbability: number;
    alert: { title: string; advice: string };
  } | null>(null);

  const destination = useQuery(api.destinations.getBySlug, {
    slug: params.slug,
  });

  useEffect(() => {
    if (!destination) return;
    let cancelled = false;
    fetch(
      `/api/weather?lat=${destination.location.latitude}&lon=${destination.location.longitude}`
    )
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && !d.error) setWeather(d);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [destination]);

  if (destination === undefined) {
    return (
      <main
        className={`min-h-screen flex items-center justify-center font-sans ${
          dark ? "bg-[#0b1f33] text-white" : "bg-[#fbfdff] text-[#08233f]"
        }`}
      >
        Loading destination...
      </main>
    );
  }

  if (!destination || !destination.isPublished) {
    return (
      <main
        className={`min-h-screen flex flex-col items-center justify-center gap-4 font-sans ${
          dark ? "bg-[#0b1f33] text-white" : "bg-[#fbfdff] text-[#08233f]"
        }`}
      >
        <h1 className="text-3xl font-bold">Destination Not Found</h1>
        <button
          onClick={() => router.push("/destinations")}
          className="rounded-full bg-gradient-to-r from-[#087b35] to-[#007b75] text-white px-6 py-3 font-semibold"
        >
          Back to Destinations
        </button>
      </main>
    );
  }

  const photos = (destination.images || []).filter(Boolean);
  const currentPhoto = photos[activePhoto] || photos[0] || "";

  return (
    <main
      className={`min-h-screen font-sans transition-colors duration-300 ${
        dark ? "bg-[#0b1f33] text-white" : "bg-[#fbfdff] text-[#08233f]"
      }`}
    >
      <header className="bg-[#031d38] text-white">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center gap-4">
          <Link href="/" className="font-bold text-xl">
            Lanka<span className="text-[#44d23c]">Trails</span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setDark(!dark)}
              className="rounded-full bg-[#1b3552] px-3.5 py-2 text-xs font-semibold text-white"
            >
              {dark ? "Light Mode" : "Dark Mode"}
            </button>
            <button
              onClick={() => router.push("/destinations")}
              className="text-sm font-semibold text-slate-200 hover:text-[#b7e36a]"
            >
              ← Back to Destinations
            </button>
          </div>
        </div>
      </header>

      <section className="animate-lt-fade-up max-w-6xl mx-auto px-6 py-10">
        <span className="inline-block rounded-full bg-[#e3f6e9] text-[#087947] px-3 py-1 text-xs font-bold uppercase tracking-wider">
          {destination.category} · {destination.district},{" "}
          {destination.province} Province
        </span>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-4xl md:text-5xl font-bold">{destination.name}</h1>
          <Link
            href="/#planner"
            className="inline-flex min-h-11 items-center rounded-full bg-gradient-to-r from-[#087b35] to-[#007b75] px-6 text-sm font-bold text-white shadow-sm hover:brightness-110"
          >
            Plan a Trip Here →
          </Link>
        </div>

        <p
          className={`mt-4 text-lg leading-8 max-w-3xl ${
            dark ? "text-slate-300" : "text-slate-600"
          }`}
        >
          {destination.description}
        </p>

        {weather && (
          <div
            className={`mt-6 rounded-2xl border p-4 ${
              dark
                ? "border-[#254869] bg-[#122b45]"
                : "border-[#cce4d6] bg-[#f5faf7]"
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-wider text-[#1bc75c]">
              Live Weather Alert · {weather.alert.title}
            </p>
            <p className="mt-1 text-base font-bold">
              {weather.temperatureC}°C · {weather.condition} (Rain probability:{" "}
              {weather.rainProbability}%)
            </p>
            <p
              className={`mt-1 text-sm ${
                dark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              {weather.alert.advice}
            </p>
          </div>
        )}

        {/* 5-Photo Interactive Gallery */}
        {currentPhoto && (
          <div className="mt-8">
            <div className="relative overflow-hidden rounded-2xl bg-slate-900 shadow-md">
              <Image
                src={currentPhoto}
                alt={`${destination.name} photo ${activePhoto + 1}`}
                width={1600}
                height={1000}
                className="h-[340px] md:h-[460px] w-full object-cover"
              />
              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous photo"
                    onClick={() =>
                      setActivePhoto(
                        (activePhoto - 1 + photos.length) % photos.length
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-black/60 text-white font-bold hover:bg-black/80"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label="Next photo"
                    onClick={() =>
                      setActivePhoto((activePhoto + 1) % photos.length)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-black/60 text-white font-bold hover:bg-black/80"
                  >
                    →
                  </button>
                </>
              )}
              <span className="absolute bottom-4 left-4 rounded-full bg-black/65 px-3 py-1 text-xs font-bold text-white">
                Photo {activePhoto + 1} / {photos.length}
              </span>
            </div>

            {photos.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-3">
                {photos.slice(0, 5).map((url, idx) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setActivePhoto(idx)}
                    className={`overflow-hidden rounded-xl border-2 transition ${
                      activePhoto === idx
                        ? "border-[#1bc75c] ring-2 ring-[#1bc75c]/30"
                        : "border-transparent opacity-75 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={url}
                      alt={`${destination.name} thumbnail ${idx + 1}`}
                      width={400}
                      height={260}
                      className="h-20 md:h-24 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-5 mt-10">
          {[
            ["Location", `${destination.district} · ${destination.province}`],
            [
              "Estimated Daily Budget",
              `LKR ${destination.estimatedDailyBudget.toLocaleString()}`,
            ],
            ["Best Time to Visit", destination.bestTimeToVisit],
          ].map(([label, val]) => (
            <div
              key={label}
              className={`border p-6 rounded-2xl shadow-sm ${
                dark
                  ? "border-[#234361] bg-[#122b45]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <p
                className={`text-sm ${
                  dark ? "text-slate-300" : "text-slate-500"
                }`}
              >
                {label}
              </p>
              <h3 className="text-xl font-semibold mt-2">{val}</h3>
            </div>
          ))}
        </div>

        {destination.gettingThere && (
          <div
            className={`mt-10 rounded-2xl border p-6 ${
              dark
                ? "border-[#254869] bg-[#122b45]"
                : "border-[#d6e7dd] bg-[#f5faf7]"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Route & Getting There</h2>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${destination.location.latitude},${destination.location.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#087947] px-4 py-2 text-xs font-bold text-white"
              >
                Open in Google Maps →
              </a>
            </div>
            <p
              className={`mt-3 text-sm leading-7 ${
                dark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              {destination.gettingThere}
            </p>
          </div>
        )}

        {destination.restSpots && destination.restSpots.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-5">Where to Rest & Stay</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {destination.restSpots.map((spot) => (
                <article
                  key={spot.name}
                  className={`rounded-2xl border p-5 shadow-sm ${
                    dark
                      ? "border-[#234361] bg-[#122b45]"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <span className="inline-block rounded-full bg-[#e3f6e9] px-3 py-1 text-xs font-bold text-[#087947]">
                    {spot.type}
                  </span>
                  <h3 className="mt-3 text-lg font-bold">{spot.name}</h3>
                  <p
                    className={`mt-1 text-xs font-semibold ${
                      dark ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    {spot.priceRange}
                  </p>
                  <p
                    className={`mt-2 text-sm leading-6 ${
                      dark ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {spot.note}
                  </p>
                </article>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-5">Explore on Map</h2>
          <DestinationMap
            latitude={destination.location.latitude}
            longitude={destination.location.longitude}
            name={destination.name}
          />
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-5">Things to Explore</h2>
          <div className="flex flex-wrap gap-3">
            {destination.tags.map((tag) => (
              <span
                key={tag}
                className="bg-[#e3f6e9] text-[#087947] px-4 py-2 rounded-full text-sm font-semibold"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#031d38] py-8 text-center text-slate-300 text-sm">
        © 2026 LankaTrails. Discover Sri Lanka with AI.
      </footer>

      <SupportChatWidget pageName={destination.name} dark={dark} />
    </main>
  );
}

export default function DestinationDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#fbfdff] text-[#08233f] flex items-center justify-center font-sans">
          Loading destination...
        </main>
      }
    >
      <DestinationDetailsContent />
    </Suspense>
  );
}
