
"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useMemo, useState } from "react";

const categories = [
  "All",
  "Historical",
  "Cultural",
  "Nature",
  "Beach",
  "Wildlife",
];

export default function Home() {
  const destinations = useQuery(api.destinations.getAll);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredDestinations = useMemo(() => {
    if (!destinations) return [];

    return destinations.filter((destination) => {
      const matchesSearch =
        destination.name.toLowerCase().includes(search.toLowerCase()) ||
        destination.district.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || destination.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [destinations, search, category]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-emerald-400">
            🇱🇰 LankaTrails
          </h1>

          <span className="text-sm text-slate-400">
            Explore Sri Lanka
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <p className="text-emerald-400 font-semibold mb-3">
          DISCOVER THE PEARL OF THE INDIAN OCEAN
        </p>

        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Explore Beautiful <br />
          <span className="text-emerald-400">Sri Lanka</span>
        </h2>

        <p className="text-slate-400 max-w-2xl mx-auto">
          Discover amazing destinations, ancient heritage,
          beautiful beaches and unforgettable experiences.
        </p>
      </section>

      {/* Search and Filter */}
      <section className="max-w-7xl mx-auto px-6 pb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search destinations or districts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 outline-none focus:border-emerald-400"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 outline-none focus:border-emerald-400"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All Categories" : item}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Destinations */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold">
            Popular Destinations
          </h3>

          <span className="text-slate-400 text-sm">
            {destinations?.length ?? 0} destinations
          </span>
        </div>

        {destinations === undefined ? (
          <p className="text-slate-400">Loading destinations...</p>
        ) : filteredDestinations.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 rounded-2xl">
            <p className="text-xl font-semibold">
              No destinations found
            </p>
            <p className="text-slate-400 mt-2">
              Try another search or category.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((destination) => (
              <article
                key={destination._id}
                className="bg-slate-900 border border-white/10 rounded-2xl p-6 hover:border-emerald-400/60 transition"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs bg-emerald-400/10 text-emerald-400 px-3 py-1 rounded-full">
                    {destination.category}
                  </span>

                  <span className="text-xs text-slate-400">
                    {destination.district}
                  </span>
                </div>

                <h4 className="text-xl font-bold mb-3">
                  {destination.name}
                </h4>

                <p className="text-slate-400 text-sm leading-6 mb-5">
                  {destination.description}
                </p>

                <div className="border-t border-white/10 pt-4 space-y-2">
                  <p className="text-sm text-slate-300">
                    📍 {destination.province} Province
                  </p>

                  <p className="text-sm text-slate-300">
                    💰 LKR {destination.estimatedDailyBudget.toLocaleString()} / day
                  </p>

                  <p className="text-sm text-slate-300">
                    ☀️ {destination.bestTimeToVisit}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-5">
                  {destination.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-slate-500 text-sm">
        © 2026 LankaTrails. Discover Sri Lanka with AI.
      </footer>
    </main>
  );
}
