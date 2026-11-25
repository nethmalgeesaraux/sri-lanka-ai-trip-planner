export type Place = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  tag: string;
  color: string;
  image: string;
  detail: string;
  latitude: number;
  longitude: number;
  seasonNote: string;
  credit: string;
};

export type TripDay = {
  destination: string;
  title: string;
  description: string;
  travelNote: string;
  estimatedCost: number;
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
