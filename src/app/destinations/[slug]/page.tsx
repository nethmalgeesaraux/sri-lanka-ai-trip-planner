
"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const DestinationMap = dynamic(
  () => import("@/components/DestinationMap"),
  { ssr: false }
);

export default function DestinationDetailsPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  const destination = useQuery(
    api.destinations.getBySlug,
    { slug: params.slug }
  );

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
          className="text-emerald-400 underline"
        >
          Back to Home
        </button>
      </main>
    );
  }

  const { latitude, longitude } = destination.location;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <button
          onClick={() => router.push("/")}
          className="text-emerald-400 mb-8"
        >
          ← Back to Destinations
        </button>

        <div className="mb-8">
          <span className="text-emerald-400 text-sm">
            {destination.category}
          </span>

          <h1 className="text-4xl md:text-5xl font-bold mt-3">
            {destination.name}
          </h1>

          <p className="text-slate-400 mt-3">
            📍 {destination.district}, {destination.province} Province
          </p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 mb-8">
          <p className="text-slate-300 leading-7">
            {destination.description}
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div>
              <p className="text-slate-400 text-sm">
                Estimated Daily Budget
              </p>
              <p className="text-xl font-bold text-emerald-400 mt-2">
                LKR {destination.estimatedDailyBudget.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">
                Best Time to Visit
              </p>
              <p className="text-xl font-bold mt-2">
                {destination.bestTimeToVisit}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-8">
            {destination.tags.map((tag) => (
              <span
                key={tag}
                className="bg-slate-800 rounded-full px-4 py-2 text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-5">
          📍 Destination Location
        </h2>

        <DestinationMap
          latitude={latitude}
          longitude={longitude}
          name={destination.name}
        />

        <p className="text-slate-500 text-xs mt-3">
          Map data © OpenStreetMap contributors
        </p>
      </div>
    </main>
  );
}
