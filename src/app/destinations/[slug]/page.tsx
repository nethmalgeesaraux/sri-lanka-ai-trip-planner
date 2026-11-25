
"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const DestinationMap = dynamic(
  () => import("@/components/DestinationMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] rounded-2xl bg-slate-800 animate-pulse flex items-center justify-center text-slate-400">
        Loading map...
      </div>
    ),
  }
);

export default function DestinationDetailsPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  const destination = useQuery(api.destinations.getBySlug, {
    slug: params.slug,
  });

  if (destination === undefined) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading destination...
      </main>
    );
  }

  if (!destination || !destination.isPublished) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold">
          Destination Not Found
        </h1>
        <button
          onClick={() => router.push("/")}
          className="bg-emerald-500 text-slate-950 px-6 py-3 rounded-xl font-semibold"
        >
          Back to Home
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <button
            onClick={() => router.push("/")}
            className="text-emerald-400 font-bold text-xl"
          >
            🇱🇰 LankaTrails
          </button>

          <button
            onClick={() => router.push("/")}
            className="text-slate-300 hover:text-emerald-400"
          >
            ← Back to Explore
          </button>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <span className="text-emerald-400 text-sm font-semibold">
          {destination.category}
        </span>

        <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-5">
          {destination.name}
        </h1>

        <p className="text-slate-400 text-lg leading-8 max-w-3xl">
          {destination.description}
        </p>

        <div className="grid md:grid-cols-3 gap-5 mt-10">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl">
            <p className="text-slate-400 text-sm">Location</p>
            <h3 className="text-xl font-semibold mt-2">
              {destination.district}
            </h3>
          </div>

          <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl">
            <p className="text-slate-400 text-sm">Estimated Daily Budget</p>
            <h3 className="text-xl font-semibold mt-2">
              LKR {destination.estimatedDailyBudget.toLocaleString()}
            </h3>
          </div>

          <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl">
            <p className="text-slate-400 text-sm">Best Time to Visit</p>
            <h3 className="text-xl font-semibold mt-2">
              {destination.bestTimeToVisit}
            </h3>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-5">
            Explore on Map
          </h2>

          <DestinationMap
            latitude={destination.location.latitude}
            longitude={destination.location.longitude}
            name={destination.name}
          />
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-5">
            Things to Explore
          </h2>

          <div className="flex flex-wrap gap-3">
            {destination.tags.map((tag) => (
              <span
                key={tag}
                className="bg-slate-800 text-emerald-400 px-4 py-2 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-slate-500 text-sm">
        © 2026 LankaTrails. Discover Sri Lanka with AI.
      </footer>
    </main>
  );
}
