
"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const message = useQuery(api.test.hello);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold mb-4">
          🇱🇰 LankaTrails
        </h1>

        <p className="text-lg text-slate-300">
          {message ?? "Connecting to Convex..."}
        </p>
      </div>
    </main>
  );
}
