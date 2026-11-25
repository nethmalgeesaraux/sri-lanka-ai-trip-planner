import type { Doc } from "../../convex/_generated/dataModel";
import type { Place } from "./travel-types";

function mapCategoryToTag(category: string): string {
  if (category === "Historical" || category === "Cultural") {
    return "Heritage";
  }
  return category;
}

function badgeColorForTag(tag: string): string {
  if (tag === "Heritage") return "bg-[#ffbb18] text-[#08233f]";
  if (tag === "Beach") return "bg-[#85dcff] text-[#08233f]";
  return "bg-[#b7e36a] text-[#08233f]";
}

export function mapDestinationToPlace(dest: Doc<"destinations">): Place {
  const tag = mapCategoryToTag(dest.category);
  const imageUrl = dest.images?.[0] || "";
  return {
    id: String(dest._id),
    slug: dest.slug,
    name: dest.name,
    subtitle: `${dest.district} · ${dest.province} Province`,
    tag,
    color: badgeColorForTag(tag),
    image: imageUrl,
    detail: dest.description,
    latitude: dest.location.latitude,
    longitude: dest.location.longitude,
    seasonNote: `Best time: ${dest.bestTimeToVisit} · Est. LKR ${dest.estimatedDailyBudget.toLocaleString()}/day`,
    credit: "Unsplash · https://unsplash.com",
  };
}
