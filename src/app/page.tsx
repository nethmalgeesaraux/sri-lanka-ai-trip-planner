
"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const destinations = useQuery(api.destinations.getAll);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-3xl font-bold mb-4">
        🇱🇰 LankaTrails Destinations
      </h1>

      {destinations === undefined ? (
        <p>Loading destinations...</p>
      ) : destinations.length === 0 ? (
        <p>No destinations available yet.</p>
      ) : (
        <div className="grid gap-4">
          {destinations.map((destination) => (
            <div
              key={destination._id}
              className="rounded-xl bg-slate-800 p-5"
            >
              <h2 className="text-xl font-semibold">
                {destination.name}
              </h2>
              <p className="text-slate-300">
                {destination.district}, {destination.province}
              </p>
              <p className="mt-2">{destination.description}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
