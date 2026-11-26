export type RestSpot = {
  name: string;
  type: string;
  priceRange: string;
  note: string;
};

export type Place = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  district: string;
  province: string;
  tag: string;
  color: string;
  image: string;
  images: string[];
  detail: string;
  latitude: number;
  longitude: number;
  seasonNote: string;
  bestTimeToVisit: string;
  estimatedDailyBudget: number;
  tags: string[];
  highlights: string[];
  gettingThere: string;
  restSpots: RestSpot[];
  credit: string;
};

export type TripDay = {
  destination: string;
  title: string;
  description: string;
  travelNote: string;
  estimatedCost: number;
  transportMode?: string;
  travelDuration?: string;
  routeTip?: string;
  restRecommendation?: string;
};

export type TravelTrip = {
  id: string;
  title: string;
  style: string;
  duration: string;
  budget: string;
  interests: string;
  season: string;
  travellers: number;
  startingPoint: string;
  days: TripDay[];
  source?: "gemini" | "manual";
};

export type Traveller = {
  id: string;
  name: string;
  email: string;
};
