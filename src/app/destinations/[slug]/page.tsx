"use client";

import { Suspense } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const DestinationMap = dynamic(
  () => import("@/components/DestinationMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] rounded-2xl bg-[#e5efe9] animate-pulse flex items-center justify-center text-[#08233f]">
        Loading map...
      </div>
    ),
  }
);

function DestinationDetailsContent() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  const destination = useQuery(api.destinations.getBySlug, {
    slug: params.slug,
  });

  if (destination === undefined) {
    return (
      <main className="min-h-screen bg-[#fbfdff] text-[#08233f] flex items-center justify-center font-sans">
        Loading destination...
      </main>
    );
  }

  if (!destination || !destination.isPublished) {
    return (
      <main className="min-h-screen bg-[#fbfdff] text-[#08233f] flex flex-col items-center justify-center gap-4 font-sans">
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

  return (
    <main className="min-h-screen bg-[#fbfdff] text-[#08233f] font-sans">
      <header className="bg-[#031d38] text-white">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <button
            onClick={() => router.push("/")}
            className="font-bold text-xl"
          >
            Lanka<span className="text-[#44d23c]">Trails</span>
          </button>

          <button
            onClick={() => router.push("/destinations")}
            className="text-sm font-semibold text-slate-200 hover:text-[#b7e36a]"
          >
            ← Back to Destinations
          </button>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <span className="inline-block rounded-full bg-[#e3f6e9] text-[#087947] px-3 py-1 text-xs font-bold uppercase tracking-wider">
          {destination.category}
        </span>

        <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-5">
          {destination.name}
        </h1>

        <p className="text-slate-600 text-lg leading-8 max-w-3xl">
          {destination.description}
        </p>

        <div className="grid md:grid-cols-3 gap-5 mt-10">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <p className="text-slate-500 text-sm">Location</p>
            <h3 className="text-xl font-semibold mt-2">
              {destination.district} · {destination.province}
            </h3>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <p className="text-slate-500 text-sm">Estimated Daily Budget</p>
            <h3 className="text-xl font-semibold mt-2">
              LKR {destination.estimatedDailyBudget.toLocaleString()}
            </h3>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <p className="text-slate-500 text-sm">Best Time to Visit</p>
            <h3 className="text-xl font-semibold mt-2">
              {destination.bestTimeToVisit}
            </h3>
          </div>
        </div>

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
