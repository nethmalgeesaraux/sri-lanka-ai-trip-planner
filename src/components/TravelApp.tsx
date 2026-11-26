"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { mapDestinationToPlace } from "@/lib/travel-places";
import type { Place, Traveller, TravelTrip as Trip } from "@/lib/travel-types";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import SriLankaMap from "./SriLankaMap";

const faqs = [
  [
    "How does LankaTrails work?",
    "Create an email/password account, choose your preferences, and Gemini drafts your itinerary with routes, transit tips, and places to rest. Generated trips are saved privately to your account so you can revisit and edit them later.",
  ],
  [
    "When is the best time to visit Sri Lanka?",
    "Weather varies by region. The south and west are generally drier from December to March, while the east coast and ancient cities shine from May to September. Always check current forecasts before setting off.",
  ],
  [
    "Can I change my itinerary?",
    "Yes. Rename your trip and edit each day’s title and activities, inspect the route map and rest stops, or generate a new itinerary from different preferences.",
  ],
  [
    "Are the budget estimates live prices?",
    "No. They are illustrative planning estimates in LKR, not booking quotes. Prices vary by season, transport, accommodation, and activities. International flights are excluded.",
  ],
];

const curatedRoutes = [
  {
    title: "Misty Tea & Hill-Country Rail",
    duration: "3",
    style: "Adventure",
    budget: "Comfortable",
    interests: "Nature & Culture",
    season: "December – March",
    startingPoint: "Kandy",
    stops: ["Kandy", "Nuwara Eliya", "Ella"],
    restHighlight: "Tea estate bungalows & cliffside lodges in Ella Gap",
    transportHighlight: "Blue hill-country train from Kandy to Ella",
    slugForPhoto: "ella",
  },
  {
    title: "Ancient Kingdoms & Rock Citadel",
    duration: "5",
    style: "Culture",
    budget: "Comfortable",
    interests: "Heritage",
    season: "July – September",
    startingPoint: "Colombo",
    stops: ["Anuradhapura", "Sigiriya", "Polonnaruwa"],
    restHighlight: "Lakeside resorts beside Tissa Wewa & Parakrama Samudra",
    transportHighlight: "Northern Line train + short Cultural Triangle drives",
    slugForPhoto: "sigiriya-rock-fortress",
  },
  {
    title: "Southern Coast, Whales & Safari",
    duration: "7",
    style: "Relaxation",
    budget: "Luxury",
    interests: "Beach & Relaxation",
    season: "December – March",
    startingPoint: "Galle",
    stops: ["Galle Fort", "Mirissa", "Yala National Park"],
    restHighlight: "Dutch Fort courtyard villas & Tissa safari eco-lodges",
    transportHighlight: "Southern Expressway & scenic coastal highway",
    slugForPhoto: "mirissa-beach",
  },
];

const seasonalGuides = [
  {
    id: "west-south",
    label: "Dec – Apr · West, South & Hills",
    headline: "Dry sunshine in Galle, Mirissa, Kandy & Ella",
    summary:
      "The southwest monsoon retreats, leaving calm turquoise seas for whale watching in Mirissa, crisp mornings on Little Adam's Peak, and clear views from Galle Fort.",
    slugs: ["galle-fort", "mirissa-beach", "ella", "nuwara-eliya"],
  },
  {
    id: "east-north",
    label: "May – Sep · East Coast & Heritage",
    headline: "Surf season in Arugam Bay & golden Cultural Triangle days",
    summary:
      "While the southwest gets brief showers, the east coast shines. Ride clean point breaks in Arugam Bay and cycle ancient stupas in Anuradhapura and Polonnaruwa.",
    slugs: [
      "arugam-bay",
      "anuradhapura-ancient-city",
      "polonnaruwa-ancient-city",
      "sigiriya-rock-fortress",
    ],
  },
  {
    id: "shoulder",
    label: "Oct – Nov · Wildlife & Quiet Trails",
    headline: "Lush green landscapes & peaceful heritage walks",
    summary:
      "Inter-monsoon months bring afternoon warmth and fewer crowds at Sigiriya, Kandy's Temple of the Tooth, and Yala's dry-zone lagoons.",
    slugs: [
      "temple-of-the-tooth",
      "sigiriya-rock-fortress",
      "yala-national-park",
      "ella",
    ],
  },
];

function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[#082b40] px-6 py-14 text-white md:py-20">
      <div
        className="absolute -right-16 -top-28 h-80 w-80 rounded-full border-[45px] border-[#164c4a]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-6xl">
        <p className="text-xs font-bold tracking-[0.2em] text-[#b7e36a]">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
          {description}
        </p>
      </div>
    </section>
  );
}

function FaqList() {
  return (
    <div className="divide-y divide-[#dce6e8]">
      {faqs.map(([question, answer]) => (
        <details key={question} className="group py-1">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-4 text-base font-semibold focus-visible:ring-2 focus-visible:ring-green-600">
            {question}
            <span
              className="text-2xl text-[#07834b] group-open:rotate-45"
              aria-hidden="true"
            >
              +
            </span>
          </summary>
          <p className="max-w-2xl pb-5 text-sm leading-7">{answer}</p>
        </details>
      ))}
    </div>
  );
}

const features = [
  {
    icon: "spark",
    title: "AI-Powered Planning",
    copy: "Personalised trip inspiration",
  },
  {
    icon: "pin",
    title: "Interactive Map",
    copy: "Explore the island your way",
  },
  {
    icon: "calculator",
    title: "Budget Calculator",
    copy: "Plan within your budget",
  },
  {
    icon: "shield",
    title: "Thoughtfully Planned",
    copy: "Routes & rest guidance",
  },
  {
    icon: "save",
    title: "Save Your Trips",
    copy: "Private to your account",
  },
];

function Icon({
  name = "arrow",
  className = "",
}: {
  name?: string;
  className?: string;
}) {
  const paths: Record<string, React.ReactNode> = {
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    back: <path d="M20 12H4m6-6-6 6 6 6" />,
    spark: (
      <>
        <path d="m12 2 2.7 7.3L22 12l-7.3 2.7L12 22l-2.7-7.3L2 12l7.3-2.7Z" />
        <path d="M21 2v4m-2-2h4" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    home: (
      <>
        <path d="m3 10 9-7 9 7v11h-7v-7h-4v7H3Z" />
      </>
    ),
    bag: (
      <>
        <rect x="4" y="7" width="16" height="14" rx="2" />
        <path d="M9 7V3h6v4m-7 5v4m8-4v4" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="7" r="4" />
        <path d="M4 22v-3a8 8 0 0 1 16 0v3Z" />
      </>
    ),
    moon: <path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z" />,
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2" />
      </>
    ),
    play: <path d="m8 4 12 8-12 8Z" />,
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 2v6m10-6v6M3 11h18m-13 4h1m6 0h1" />
      </>
    ),
    wallet: (
      <>
        <rect x="3" y="5" width="18" height="15" rx="2" />
        <path d="M3 7V4l14-2v3m4 7h-6v4h6" />
      </>
    ),
    leaf: (
      <>
        <path d="M20 3C8 2 2 8 5 15s15 3 15-12Z" />
        <path d="M3 21 15 9" />
      </>
    ),
    calculator: (
      <>
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M8 6h8v4H8Zm0 8h1m6 0h1m-8 4h1m6 0h1" />
      </>
    ),
    shield: (
      <>
        <path d="m12 2 9 4v6c0 6-9 10-9 10S3 18 3 12V6Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    save: (
      <>
        <path d="M6 18H5a4 4 0 0 1-1-8 8 8 0 0 1 15-2 5 5 0 0 1 0 10h-1M12 11v11m-4-7 4-4 4 4" />
      </>
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    mail: (
      <>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m2 5 10 8L22 5" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v6m0-10v1" />
      </>
    ),
    camera: (
      <>
        <path d="M4 7h3l2-2h6l2 2h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
        <circle cx="12" cy="13" r="3.5" />
      </>
    ),
    bed: (
      <>
        <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
        <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
        <path d="M2 16h20" />
      </>
    ),
    route: (
      <>
        <circle cx="6" cy="19" r="3" />
        <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
        <circle cx="18" cy="5" r="3" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-5 w-5 shrink-0 ${className}`}
      aria-hidden="true"
    >
      {paths[name] || paths.spark}
    </svg>
  );
}

function Brand({ small = false }: { small?: boolean }) {
  return (
    <Link
      href="/"
      className="flex min-h-11 items-center gap-2.5"
      aria-label="LankaTrails home"
    >
      <svg
        viewBox="0 0 100 75"
        className={`${small ? "h-12 w-16" : "h-12 w-14 sm:h-16 sm:w-20"} shrink-0`}
        aria-hidden="true"
      >
        <path d="M5 54 38 18l23 23 13-17 22 32Z" fill="#3bbd31" />
        <path d="m24 46 14-28 10 16-8-4-4 11Z" fill="#c4e94d" />
        <path d="m60 42 14-18 14 22-13-8Z" fill="#8cda34" />
        <path
          d="M30 48Q16 31 26 9"
          fill="none"
          stroke="#e9bf28"
          strokeWidth="5"
        />
        <path
          d="M26 13Q8-2 7 13q11-5 18 2Q4 12 6 24q10-9 19-7Q38-2 45 10q-12-1-18 6 18-6 18 7-10-6-20-6"
          fill="#52c438"
        />
        <path d="M1 58q45-16 98 0-51 8-98 0" fill="#14c0ee" />
        <path d="M11 64q44-5 79 0-42 19-79 0" fill="#43c9ee" />
        <path
          d="M15 57q42-6 73 2"
          fill="none"
          stroke="#08233f"
          strokeWidth="3"
        />
      </svg>
      <span>
        <span
          className={`${small ? "text-2xl" : "text-2xl sm:text-[30px]"} block font-bold leading-none tracking-[-1px] text-white`}
        >
          Lanka<span className="text-[#44d23c]">Trails</span>
        </span>
        <span
          className={`${small ? "text-xs" : "text-xs sm:text-sm"} mt-1 block tracking-wide text-slate-300`}
        >
          AI Trip Planner
        </span>
      </span>
    </Link>
  );
}

function Photo({
  id,
  alt,
  className,
}: {
  id: string;
  alt: string;
  className: string;
}) {
  const [errorSrc, setErrorSrc] = useState<string | null>(null);
  const error = errorSrc === id;
  return error || !id ? (
    <svg
      role="img"
      aria-label={alt}
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      <rect width="800" height="500" fill="#76a99c" />
      <circle cx="650" cy="90" r="50" fill="#d9eaa4" />
      <path d="m0 500 290-400 250 330 130-180 130 250" fill="#2e6b4b" />
      <path d="m0 500 180-180 250 180" fill="#16432e" />
    </svg>
  ) : (
    <Image
      src={id}
      alt={alt}
      width={1600}
      height={1000}
      loading="eager"
      onError={() => setErrorSrc(id)}
      className={className}
    />
  );
}

function Modal({
  title,
  onClose,
  wide = false,
  children,
}: {
  title: string;
  onClose: () => void;
  wide?: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.showModal();
    return () => previous?.focus();
  }, []);
  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-modal="true"
      aria-labelledby="dialog-title"
      className={`fixed m-auto max-h-[88vh] w-[calc(100%-1.5rem)] ${wide ? "max-w-3xl" : "max-w-xl"} overflow-y-auto rounded-2xl bg-white p-6 text-[#08233f] shadow-2xl backdrop:bg-[#00162e]/75 md:p-7`}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 id="dialog-title" className="text-2xl font-bold">
          {title}
        </h2>
        <button
          aria-label="Close dialog"
          onClick={onClose}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 focus-visible:ring-2"
        >
          <Icon name="close" />
        </button>
      </div>
      {children}
    </dialog>
  );
}

const primary =
  "inline-flex min-h-11 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#087b35] to-[#007b75] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2";

const navigation = [
  { label: "Home", icon: "home" },
  { label: "Destinations", icon: "leaf" },
  { label: "Map", icon: "pin" },
  { label: "My Trips", icon: "bag" },
  { label: "About", icon: "info" },
  { label: "Contact", icon: "mail" },
];

const routes: Record<string, string> = {
  Home: "/",
  Destinations: "/destinations",
  Map: "/map",
  "My Trips": "/trips",
  About: "/about",
  Contact: "/contact",
};

async function generateWithGemini(data: unknown) {
  const response = await fetch("/api/travel/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-lankatrails-client": "1",
    },
    body: JSON.stringify(data || {}),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Unable to complete your request.");
  }
  return result as { trip: Trip };
}

function buildGoogleMapsRouteUrl(startingPoint: string, stops: Place[]): string {
  if (stops.length === 0) return "https://www.google.com/maps";
  const origin = encodeURIComponent(`${startingPoint}, Sri Lanka`);
  const last = stops[stops.length - 1];
  const destination = encodeURIComponent(`${last.latitude},${last.longitude}`);
  const mid = stops
    .slice(0, -1)
    .map((p) => `${p.latitude},${p.longitude}`)
    .join("|");
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${mid ? `&waypoints=${encodeURIComponent(mid)}` : ""}&travelmode=driving`;
}

export default function TravelApp({
  initialView = "Home",
  initialPlaces = [],
}: {
  initialView?: string;
  initialPlaces?: Place[];
}) {
  const router = useRouter();
  const destinations = useQuery(api.destinations.getAll);
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const user: Traveller | null = session?.user
    ? {
        id: session.user.id,
        name: session.user.name || session.user.email || "Traveller",
        email: session.user.email || "",
      }
    : null;

  const savedTripsQuery = useQuery(
    api.trips.listMine,
    isAuthenticated ? {} : "skip"
  );
  const saved: Trip[] = savedTripsQuery ?? [];

  const createManualTrip = useMutation(api.trips.createManualTrip);
  const updateTripMutation = useMutation(api.trips.updateTrip);
  const deleteTripMutation = useMutation(api.trips.deleteTrip);
  const submitContactMutation = useMutation(api.contact.submitMessage);

  const places: Place[] = destinations
    ? destinations.map(mapDestinationToPlace)
    : initialPlaces;

  const [dark, setDark] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const view = initialView;
  const [modal, setModal] = useState<string | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [itineraryTab, setItineraryTab] = useState<
    "itinerary" | "route" | "rest"
  >("itinerary");
  const [seasonTab, setSeasonTab] = useState("west-south");

  const [style, setStyle] = useState("Adventure");
  const [duration, setDuration] = useState("3");
  const [budget, setBudget] = useState("All Budget");
  const [interests, setInterests] = useState("Nature & Culture");
  const [trip, setTrip] = useState<Trip | null>(null);
  const [busy, setBusy] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [season, setSeason] = useState("Flexible");
  const [travellers, setTravellers] = useState("1");
  const [startingPoint, setStartingPoint] = useState("Colombo");
  const [selectedPlace, setSelectedPlace] = useState<string>();
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [tripQuery, setTripQuery] = useState("");
  const [contactNotice, setContactNotice] = useState("");

  const authReady = !isSessionPending && !isAuthLoading;
  const daily =
    budget === "Budget friendly" ? 6500 : budget === "Luxury" ? 35000 : 15000;

  useEffect(() => {
    if (view === "Home" && window.location.hash === "#planner") {
      document
        .getElementById("planner")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [view]);

  function openPlaceModal(placeName: string) {
    setActivePhotoIndex(0);
    setLightboxOpen(false);
    setModal(placeName);
  }

  function openTripModal(selectedTrip: Trip, tab: "itinerary" | "route" | "rest" = "itinerary") {
    setTrip(selectedTrip);
    setNotice("");
    setItineraryTab(tab);
    setModal("Your Itinerary");
  }

  function navigate(label: string) {
    setMobileMenu(false);
    router.push(routes[label] || "/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveTrip() {
    if (!trip) return;
    setBusy(true);
    setNotice("");
    try {
      const updated = await updateTripMutation({
        id: trip.id as Id<"trips">,
        title: trip.title,
        days: trip.days.map((d) => ({
          title: d.title,
          description: d.description,
        })),
      });
      setTrip(updated);
      setNotice("Changes saved to your account.");
    } catch (error) {
      setNotice((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function deleteTrip(id: string) {
    setBusy(true);
    setNotice("");
    try {
      await deleteTripMutation({ id: id as Id<"trips"> });
      if (trip?.id === id) setTrip(null);
    } catch (error) {
      setNotice((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function generateTrip(manual = false) {
    if (!user || !isAuthenticated) {
      setNotice("Sign in or create an account, then generate your trip.");
      setModal("Sign In");
      return;
    }
    setBusy(true);
    setNotice("");
    try {
      if (manual) {
        const created = await createManualTrip({
          style,
          duration: Number(duration),
          budget,
          interests,
          season,
          travellers: Number(travellers || 1),
          startingPoint,
        });
        openTripModal(created, "itinerary");
      } else {
        const result = await generateWithGemini({
          style,
          duration,
          budget,
          interests,
          season,
          travellers,
          startingPoint,
        });
        openTripModal(result.trip, "itinerary");
      }
    } catch (error) {
      setNotice((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function openPlanner() {
    if (view !== "Home") {
      setMobileMenu(false);
      router.push("/#planner");
    } else {
      document
        .getElementById("planner")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  const hero = places.find((p) => p.slug === "ella") || places[0];
  const sigiriyaPlace = places.find(
    (p) => p.slug === "sigiriya" || p.slug.startsWith("sigiriya")
  );
  const mirissaPlace = places.find(
    (p) => p.slug === "mirissa" || p.slug.startsWith("mirissa")
  );
  const tripPlaces = (trip?.days || [])
    .map((day) => places.find((p) => p.id === day.destination))
    .filter((p): p is Place => Boolean(p));
  const shown = places.filter(
    (p) =>
      (filter === "All" || p.tag === filter) &&
      `${p.name} ${p.subtitle}`.toLowerCase().includes(query.toLowerCase())
  );
  const matchingTrips = saved
    .map((item, index) => ({ item, index }))
    .filter(({ item }) =>
      item.title.toLowerCase().includes(tripQuery.toLowerCase())
    );
  const activeModalPlace = places.find((p) => p.name === modal);
  const activeGalleryImages = activeModalPlace
    ? activeModalPlace.images.length > 0
      ? activeModalPlace.images
      : [activeModalPlace.image].filter(Boolean)
    : [];
  const activeSeasonGuide =
    seasonalGuides.find((g) => g.id === seasonTab) || seasonalGuides[0];

  return (
    <div
      className={`min-h-screen overflow-x-hidden font-sans ${dark ? "bg-[#102e4a] text-white" : "bg-[#fbfdff] text-[#08233f]"}`}
    >
      <header className="relative z-20 bg-[#031d38] text-white">
        <div className="mx-auto flex min-h-[88px] max-w-[1600px] items-center justify-between gap-5 px-5 lg:px-[3%]">
          <Brand />
          <nav
            aria-label="Main navigation"
            className="hidden self-stretch xl:flex"
          >
            {navigation.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.label)}
                className={`mx-1 flex min-h-11 items-center gap-2 border-b-2 px-2 text-sm font-semibold transition hover:text-[#b7e36a] focus-visible:ring-2 ${view === item.label ? "border-[#1bc75c] text-[#a9eb58]" : "border-transparent text-white"}`}
              >
                <Icon name={item.icon} className="!h-4 !w-4" />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3 md:gap-5">
            <button
              onClick={() => setDark(!dark)}
              aria-label="Toggle dark theme"
              aria-pressed={dark}
              className="flex min-h-11 items-center gap-2 rounded-full bg-[#1b3552] px-3 focus-visible:ring-2 focus-visible:ring-lime-300"
            >
              <Icon name={dark ? "sun" : "moon"} />
            </button>
            <button
              onClick={() => {
                setNotice("");
                setModal(user ? "Your Account" : "Sign In");
              }}
              className="hidden min-h-11 max-w-44 items-center gap-3 rounded-full border border-slate-300 px-5 text-sm font-semibold sm:flex"
            >
              <Icon name="user" />
              <span className="truncate">{user ? user.name : "Sign In"}</span>
            </button>
            <button
              aria-label="Toggle navigation"
              aria-expanded={mobileMenu}
              onClick={() => setMobileMenu(!mobileMenu)}
              className="min-h-11 px-2 text-sm xl:hidden"
            >
              {mobileMenu ? "Close" : "Menu"}
            </button>
          </div>
        </div>
        {mobileMenu && (
          <nav
            aria-label="Mobile navigation"
            className="grid border-t border-slate-600 px-6 pb-4 xl:hidden"
          >
            {navigation.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.label)}
                className="flex min-h-12 items-center gap-3 text-sm"
              >
                <Icon name={item.icon} />
                {item.label}
              </button>
            ))}
            <button
              className="min-h-11 text-left"
              onClick={() => {
                setMobileMenu(false);
                setModal(user ? "Your Account" : "Sign In");
              }}
            >
              {user ? "Your Account" : "Sign In"}
            </button>
          </nav>
        )}
      </header>

      {notice && !modal && (
        <p
          role="status"
          className="border-b border-[#cce4d3] bg-[#edf8ef] px-6 py-4 text-center text-sm text-[#17472d]"
        >
          {notice}
        </p>
      )}

      <main>
        {view === "Home" && (
          <>
            <section className="relative isolate bg-[#063e37]">
              <Photo
                id={hero?.image || ""}
                alt="Nine Arch Bridge in Ella, Sri Lanka"
                className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#002735]/95 via-[#002735]/55 to-[#001c20]/25" />
              <div className="mx-auto grid max-w-[1600px] items-center gap-10 px-6 py-10 md:px-[4.3%] lg:min-h-[500px] lg:grid-cols-[1fr_410px] lg:gap-16 lg:py-10 xl:grid-cols-[1fr_440px]">
                <div className="min-w-0 text-white">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#1cb683]/60 bg-[#042e34] px-4 py-2 text-sm font-semibold text-[#daef79]">
                    <Icon name="pin" className="text-[#e5e02a]" />
                    Explore Sri Lanka
                  </span>
                  <h1 className="mt-3 text-[42px] font-bold leading-[1.06] tracking-[-1.8px] md:text-[55px] xl:text-[62px]">
                    AI Trip Planner for
                    <br />
                    <span className="relative inline-block bg-gradient-to-r from-[#55e751] via-[#25c85a] to-[#b7db29] bg-clip-text text-[1.2em] text-transparent">
                      Sri Lanka
                      <svg
                        viewBox="0 0 180 30"
                        className="absolute -right-[150px] bottom-1 hidden h-8 w-36 xl:block"
                        aria-hidden="true"
                      >
                        <path
                          d="M2 22Q15 33 70 11T176 9"
                          fill="none"
                          stroke="#ffc414"
                          strokeWidth="5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </h1>
                  <p className="mt-5 max-w-[500px] text-base font-medium leading-6 md:text-lg">
                    Discover authentic places, get Gemini-powered routes and
                    rest recommendations, and save every journey to your
                    account.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-4">
                    <button onClick={openPlanner} className={primary}>
                      <Icon name="spark" />
                      Plan Your Trip
                      <Icon />
                    </button>
                    <button
                      onClick={() => navigate("Map")}
                      className="inline-flex min-h-11 items-center gap-3 rounded-full border border-white bg-[#031d38]/40 px-5 py-3 text-sm font-semibold backdrop-blur-sm hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-lime-300"
                    >
                      <Icon name="pin" />
                      Explore Island Map
                    </button>
                    <button
                      onClick={() => setModal("Explore Sri Lanka")}
                      className="inline-flex min-h-11 items-center gap-2 px-3 py-3 text-sm font-semibold text-[#daef79] hover:underline focus-visible:ring-2 focus-visible:ring-lime-300"
                    >
                      <Icon name="play" />
                      How LankaTrails Works
                    </button>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-white">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#81bfa0] bg-[#063c34] text-[#b7e36a]">
                        <Icon name="shield" />
                      </span>
                      <div>
                        <p className="font-semibold">
                          Routes, stays & 50+ verified photos
                        </p>
                        <p className="mt-0.5 text-xs text-slate-300">
                          Real places. Rest stops included. Your pace.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <form
                  id="planner"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void generateTrip();
                  }}
                  className="relative min-w-0 scroll-mt-5 rounded-[20px] border border-white bg-white p-6 text-[#08233f] shadow-[0_15px_50px_#001e2d45] xl:p-7"
                >
                  <span className="absolute -top-1 left-6 h-1 w-16 rounded-t bg-gradient-to-r from-[#16cb4b] to-[#bbec5f]" />
                  <h2 className="flex items-center gap-3 text-[22px] font-bold tracking-[-0.6px]">
                    <Icon name="spark" className="!h-7 !w-7 text-[#17b335]" />
                    Plan Your Dream Trip
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#344b65]">
                    Tell us your preferences. Gemini builds your route, daily
                    activities & places to rest!
                  </p>
                  <div className="mt-5 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    {[
                      {
                        label: "Travel Style",
                        icon: "leaf",
                        value: style,
                        change: setStyle,
                        options: [
                          "Adventure",
                          "Relaxation",
                          "Family",
                          "Culture",
                        ],
                      },
                      {
                        label: "Duration",
                        icon: "calendar",
                        value: duration,
                        change: setDuration,
                        options: ["3", "5", "7", "10", "14"],
                      },
                      {
                        label: "Budget (LKR)",
                        icon: "wallet",
                        value: budget,
                        change: setBudget,
                        options: [
                          "All Budget",
                          "Budget friendly",
                          "Comfortable",
                          "Luxury",
                        ],
                      },
                      {
                        label: "Interests",
                        icon: "pin",
                        value: interests,
                        change: setInterests,
                        options: [
                          "Nature & Culture",
                          "Beach & Relaxation",
                          "Wildlife",
                          "Heritage",
                        ],
                      },
                    ].map((field) => (
                      <label
                        key={field.label}
                        className="min-w-0 text-sm font-semibold"
                      >
                        <span className="mb-2 block">{field.label}</span>
                        <span className="flex min-h-12 items-center gap-2 rounded-lg border border-[#d7e1ea] px-3">
                          <Icon
                            name={field.icon}
                            className={
                              field.icon === "leaf" ? "text-[#0b9c3c]" : ""
                            }
                          />
                          <select
                            value={field.value}
                            onChange={(e) => field.change(e.target.value)}
                            className="min-h-11 w-full min-w-0 bg-transparent text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-green-600"
                          >
                            {field.options.map((option) => (
                              <option key={option} value={option}>
                                {field.label === "Duration"
                                  ? `${option} Days`
                                  : option}
                              </option>
                            ))}
                          </select>
                        </span>
                      </label>
                    ))}
                  </div>
                  <details className="mt-4 border-t border-slate-200 pt-2">
                    <summary className="flex min-h-11 cursor-pointer items-center text-sm font-semibold text-[#087947]">
                      Fine-tune my journey +
                    </summary>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="text-sm">
                        Travel season
                        <select
                          value={season}
                          onChange={(e) => setSeason(e.target.value)}
                          className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-2 text-sm"
                        >
                          {[
                            "Flexible",
                            "December – March",
                            "April – June",
                            "July – September",
                            "October – November",
                          ].map((value) => (
                            <option key={value}>{value}</option>
                          ))}
                        </select>
                      </label>
                      <label className="text-sm">
                        Travellers
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={travellers}
                          onChange={(e) => setTravellers(e.target.value)}
                          className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3"
                        />
                      </label>
                      <label className="text-sm sm:col-span-2">
                        Starting point
                        <select
                          value={startingPoint}
                          onChange={(e) => setStartingPoint(e.target.value)}
                          className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3"
                        >
                          {["Colombo", "Kandy", "Galle", "Ella"].map(
                            (value) => (
                              <option key={value}>{value}</option>
                            )
                          )}
                        </select>
                      </label>
                    </div>
                  </details>
                  <button
                    type="submit"
                    disabled={busy || !authReady}
                    className={`${primary} mt-3 w-full !rounded-[22px] disabled:cursor-wait`}
                  >
                    {busy ? "Crafting Your Journey…" : "Generate My Trip"}
                    <Icon name="spark" />
                  </button>
                  <p className="mt-4 flex items-center justify-center gap-2 text-xs text-[#425670]">
                    <Icon name="spark" className="text-green-700" />
                    Powered by Gemini · Sign in to generate & save
                  </p>
                  <button
                    type="button"
                    disabled={busy || !authReady}
                    onClick={() => void generateTrip(true)}
                    className="mt-2 min-h-11 w-full text-sm font-semibold text-[#087947] underline underline-offset-4"
                  >
                    Or start an editable plan without AI
                  </button>
                </form>
              </div>
            </section>

            {/* Popular Destinations */}
            <section className="mx-auto grid max-w-[1600px] gap-6 px-6 pb-6 pt-8 md:grid-cols-3 md:px-[4.3%] lg:grid-cols-[1.05fr_1fr_1fr_1fr]">
              <div className="min-w-0 md:col-span-3 lg:col-span-1">
                <p className="flex items-center gap-2 text-sm font-semibold text-[#078a39]">
                  <span className="h-0.5 w-8 bg-[#14b74c]" />
                  Popular Destinations
                </p>
                <h2 className="mt-2 text-[28px] font-bold leading-[1.13] tracking-[-0.8px]">
                  Explore Sri Lanka’s
                  <br />
                  Most Beautiful Places
                </h2>
                <p
                  className={`mt-3 text-sm leading-5 ${dark ? "text-slate-300" : "text-[#344b65]"}`}
                >
                  Click any card to browse 5 authentic photos, route tips, and
                  places to rest.
                </p>
                <button
                  onClick={() => navigate("Destinations")}
                  className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#078c49] px-5 text-sm font-semibold text-[#07834b] focus-visible:ring-2 focus-visible:ring-green-600"
                >
                  View All Destinations
                  <Icon className="!h-4 !w-4" />
                </button>
              </div>
              {places.slice(0, 3).map((place) => (
                <button
                  key={place.name}
                  onClick={() => openPlaceModal(place.name)}
                  className="group relative isolate h-[215px] overflow-hidden rounded-2xl bg-[#1d5e47] text-left text-white focus-visible:ring-4 focus-visible:ring-green-500 xl:h-[220px]"
                >
                  <Photo
                    id={place.image}
                    alt={`${place.name}, Sri Lanka`}
                    className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <span
                    className={`absolute right-2.5 top-2.5 rounded-full px-3 py-1.5 text-xs font-bold ${place.color}`}
                  >
                    {place.tag}
                  </span>
                  <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                    <Icon name="camera" className="!h-3.5 !w-3.5" />
                    {Math.max(1, place.images.length)} photos
                  </span>
                  <span className="absolute bottom-4 left-4 right-4">
                    <span className="flex items-center gap-1.5 text-lg font-bold">
                      <Icon name="pin" className="!h-4 !w-4" />
                      {place.name}
                    </span>
                    <span className="mt-1 block text-sm">{place.subtitle}</span>
                    <span className="absolute bottom-0 right-0 flex h-11 w-11 items-center justify-center rounded-full border border-white">
                      <Icon />
                    </span>
                  </span>
                </button>
              ))}
            </section>

            {/* Features Bar */}
            <section
              aria-label="Planning features"
              className="mx-auto max-w-[1600px] px-5 md:px-[2.2%]"
            >
              <div className="grid gap-5 rounded-xl bg-gradient-to-r from-[#e4f9ef] via-[#e0faf4] to-[#e4f9ef] px-7 py-6 text-[#08233f] sm:grid-cols-2 lg:grid-cols-5 lg:gap-0">
                {features.map((feature, i) => (
                  <button
                    key={feature.title}
                    onClick={() =>
                      i === 4
                        ? navigate("My Trips")
                        : i === 1
                          ? navigate("Map")
                          : i === 2
                            ? setModal("Budget Calculator")
                            : i === 3
                              ? setModal("Travel Guidance")
                              : openPlanner()
                    }
                    className={`flex min-h-11 items-center gap-4 text-left focus-visible:ring-2 focus-visible:ring-green-600 lg:justify-center ${i !== 0 ? "lg:border-l lg:border-[#bde6d6]" : ""}`}
                  >
                    <Icon
                      name={feature.icon}
                      className="!h-8 !w-8 text-[#08a45b]"
                    />
                    <span>
                      <span className="block text-sm font-bold">
                        {feature.title}
                      </span>
                      <span className="mt-1 block text-sm text-[#344b65]">
                        {feature.copy}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* How It Works */}
            <section className="mx-auto grid max-w-[1600px] items-center gap-8 px-6 py-10 md:px-[4.3%] lg:grid-cols-[1fr_2fr]">
              <div>
                <p className="text-sm font-semibold text-[#078b3b]">
                  — How It Works
                </p>
                <h2 className="mt-1 text-[23px] font-bold tracking-[-0.7px]">
                  Plan Your Trip in 3 Simple Steps
                </h2>
              </div>
              <div className="grid gap-5 md:grid-cols-3">
                {[
                  ["Tell Us Your Preferences", "Travel style, duration, budget"],
                  [
                    "Let Gemini Plan",
                    "Daily stops, routes & rest spots for you",
                  ],
                  ["Explore Sri Lanka", "View routes, save, edit & travel"],
                ].map(([title, copy], i) => (
                  <div key={title} className="flex items-start gap-3">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xl font-bold ${i === 2 ? "border-green-500 bg-green-100 text-green-800" : "border-cyan-500 bg-cyan-100 text-cyan-800"}`}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold">{title}</h3>
                      <p
                        className={`mt-1 text-sm leading-5 ${dark ? "text-slate-300" : "text-[#344b65]"}`}
                      >
                        {copy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Signature Island Routes & Rest Ideas */}
            <section className="mx-auto max-w-6xl px-6 py-12">
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div>
                  <p className="text-xs font-bold tracking-[0.18em] text-[#087947]">
                    CURATED ROUTE INSPIRATION
                  </p>
                  <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                    Ready-to-customize Sri Lanka routes
                  </h2>
                </div>
                <button
                  onClick={() => navigate("My Trips")}
                  className="flex min-h-11 items-center gap-2 text-sm font-bold text-[#087947]"
                >
                  Open My Saved Trips
                  <Icon />
                </button>
              </div>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {curatedRoutes.map((routeCard) => {
                  const photoPlace = places.find(
                    (p) => p.slug === routeCard.slugForPhoto
                  );
                  return (
                    <article
                      key={routeCard.title}
                      className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-[#08233f] shadow-sm"
                    >
                      <div className="relative">
                        <Photo
                          id={photoPlace?.image || hero?.image || ""}
                          alt={routeCard.title}
                          className="h-44 w-full object-cover"
                        />
                        <span className="absolute left-4 top-4 rounded-full bg-[#031d38]/90 px-3 py-1 text-xs font-bold text-[#b7e36a]">
                          {routeCard.duration} Days · {routeCard.style}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="text-xl font-bold">{routeCard.title}</h3>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#087947]">
                          {routeCard.stops.join(" → ")}
                        </p>
                        <div className="mt-4 space-y-2.5 text-sm text-slate-600">
                          <p className="flex items-start gap-2">
                            <Icon
                              name="route"
                              className="mt-0.5 !h-4 !w-4 text-[#087947]"
                            />
                            <span>{routeCard.transportHighlight}</span>
                          </p>
                          <p className="flex items-start gap-2">
                            <Icon
                              name="bed"
                              className="mt-0.5 !h-4 !w-4 text-[#087947]"
                            />
                            <span>{routeCard.restHighlight}</span>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setStyle(routeCard.style);
                            setDuration(routeCard.duration);
                            setBudget(routeCard.budget);
                            setInterests(routeCard.interests);
                            setSeason(routeCard.season);
                            setStartingPoint(routeCard.startingPoint);
                            openPlanner();
                          }}
                          className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#087947] px-4 text-sm font-bold text-[#087947] transition hover:bg-[#edf8f3]"
                        >
                          Load Route into Planner
                          <Icon name="spark" className="!h-4 !w-4" />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Go Beyond the Ordinary */}
            <section className="border-y border-[#c8e4dd] bg-[#edf8f3] px-6 py-16 text-[#08233f] md:py-20">
              <div className="mx-auto max-w-6xl">
                <div className="flex flex-wrap items-end justify-between gap-5">
                  <div>
                    <p className="text-xs font-bold tracking-[0.18em] text-[#087947]">
                      GO BEYOND THE ORDINARY
                    </p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                      One island. A world of experiences.
                    </h2>
                  </div>
                  <button
                    className="flex min-h-11 items-center gap-3 text-sm font-bold text-[#087947]"
                    onClick={() => navigate("Destinations")}
                  >
                    Find your next adventure
                    <Icon />
                  </button>
                </div>
                <div className="mt-9 grid gap-6 md:grid-cols-3">
                  {[
                    {
                      icon: "leaf",
                      title: "Into the hill country",
                      text: "Trade the rush for misty trails, tea-covered hills, and a window seat on the slow train.",
                      image: hero?.image || "",
                      interest: "Nature & Culture",
                      label: "NATURE & ADVENTURE",
                    },
                    {
                      icon: "pin",
                      title: "Stories set in stone",
                      text: "Walk through ancient kingdoms and discover the living traditions that make this island unique.",
                      image: sigiriyaPlace?.image || "",
                      interest: "Heritage",
                      label: "CULTURE & HERITAGE",
                    },
                    {
                      icon: "sun",
                      title: "Follow the coastline",
                      text: "Barefoot mornings, coconut palms, and one more sunset. Find your own little stretch of paradise.",
                      image: mirissaPlace?.image || "",
                      interest: "Beach & Relaxation",
                      label: "BEACHES & SLOW LIVING",
                    },
                  ].map((item) => (
                    <article
                      key={item.title}
                      className="overflow-hidden rounded-2xl border border-[#dbe9e1] bg-white shadow-[0_8px_30px_-20px_#163e44]"
                    >
                      <div className="relative">
                        <Photo
                          id={item.image}
                          alt={item.title}
                          className="h-52 w-full object-cover"
                        />
                        <span className="absolute bottom-4 left-5 rounded-full bg-[#08233f] px-3 py-2 text-xs font-bold tracking-wide text-white">
                          {item.label}
                        </span>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold">{item.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                          {item.text}
                        </p>
                        <button
                          onClick={() => {
                            setInterests(item.interest);
                            openPlanner();
                          }}
                          className="mt-4 flex min-h-11 items-center gap-3 text-sm font-bold text-[#087947]"
                        >
                          Make it my trip
                          <Icon />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* Seasonal Monsoon & Travel Essentials Guide */}
            <section className="mx-auto max-w-6xl px-6 py-16">
              <div className="rounded-3xl border border-[#d6e7dd] bg-[#082b40] p-7 text-white md:p-10">
                <p className="text-xs font-bold tracking-[0.2em] text-[#b7e36a]">
                  SEASONAL ISLAND ADVISOR
                </p>
                <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                  <h2 className="text-2xl font-bold md:text-3xl">
                    Where the weather shines, month by month
                  </h2>
                  <div
                    className="flex flex-wrap gap-2"
                    role="tablist"
                    aria-label="Sri Lanka travel seasons"
                  >
                    {seasonalGuides.map((g) => (
                      <button
                        key={g.id}
                        role="tab"
                        aria-selected={seasonTab === g.id}
                        onClick={() => setSeasonTab(g.id)}
                        className={`min-h-10 rounded-full px-4 text-xs font-bold transition ${
                          seasonTab === g.id
                            ? "bg-[#1bc75c] text-[#031d38]"
                            : "bg-[#123d58] text-slate-200 hover:bg-[#194e6f]"
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="mt-6 text-lg font-bold text-[#daef79]">
                  {activeSeasonGuide.headline}
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                  {activeSeasonGuide.summary}
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {activeSeasonGuide.slugs
                    .map((slug) => places.find((p) => p.slug === slug))
                    .filter((p): p is Place => Boolean(p))
                    .map((place) => (
                      <button
                        key={place.id}
                        onClick={() => openPlaceModal(place.name)}
                        className="group overflow-hidden rounded-xl border border-white/15 bg-[#0d354e] text-left transition hover:border-[#44d23c]"
                      >
                        <Photo
                          id={place.image}
                          alt={place.name}
                          className="h-32 w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                        <div className="p-3.5">
                          <p className="text-sm font-bold text-white">
                            {place.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-300">
                            {place.bestTimeToVisit}
                          </p>
                        </div>
                      </button>
                    ))}
                </div>
                <div className="mt-7 grid gap-4 border-t border-white/15 pt-6 sm:grid-cols-3">
                  {[
                    [
                      "Scenic Rail & Highways",
                      "Book Kandy–Ella observation seats early; Southern Expressway cuts Galle travel to 2 hours.",
                    ],
                    [
                      "Where to Rest Comfortably",
                      "Mix lakeside eco-lodges, tea-estate bungalows, and shaded midday cafe breaks to pace your days.",
                    ],
                    [
                      "Sacred Sites & Cash",
                      "Carry LKR cash for tuk-tuks & stupas, and pack modest shoulder/knee cover for temples.",
                    ],
                  ].map(([title, desc]) => (
                    <div key={title} className="rounded-xl bg-[#0d354e] p-4">
                      <p className="text-sm font-bold text-[#b7e36a]">
                        {title}
                      </p>
                      <p className="mt-1.5 text-xs leading-5 text-slate-300">
                        {desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section className="mx-auto grid max-w-6xl gap-10 px-6 pb-16 pt-4 md:grid-cols-[.8fr_1.2fr] md:gap-20 md:pb-20">
              <div>
                <span className="inline-flex rounded-full bg-[#e3f6e9] p-3 text-[#087947]">
                  <Icon name="info" className="!h-7 !w-7" />
                </span>
                <p className="mt-5 text-xs font-bold tracking-[0.18em]">
                  A LITTLE KNOW-HOW GOES A LONG WAY
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                  Less wondering.
                  <br />
                  More wandering.
                </h2>
                <p className="mt-5 text-sm leading-7">
                  Everything to know before you start planning your Sri Lankan
                  escape.
                </p>
                <button
                  onClick={() => navigate("Contact")}
                  className="mt-6 flex min-h-11 items-center gap-3 text-sm font-bold"
                >
                  Still have a question?
                  <Icon />
                </button>
              </div>
              <FaqList />
            </section>

            {/* Bottom CTA */}
            <section className="px-5 pb-16">
              <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#063c3b] px-7 py-12 text-center text-white md:px-16">
                <span
                  className="absolute -left-12 -top-14 h-48 w-48 rounded-full border-[30px] border-[#12544b]"
                  aria-hidden="true"
                />
                <div className="relative">
                  <p className="text-xs font-bold tracking-[0.2em] text-[#b7e36a]">
                    YOUR STORY STARTS HERE
                  </p>
                  <h2 className="mt-4 text-3xl font-bold md:text-4xl">
                    The best journeys begin with a little curiosity.
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300">
                    A mountain sunrise or a seaside sunset? You don’t have to
                    choose just yet. Let’s find a route that feels like you.
                  </p>
                  <button className={`${primary} mt-7`} onClick={openPlanner}>
                    Let’s Plan My Trip
                    <Icon name="spark" />
                  </button>
                  <p className="mt-4 text-xs text-slate-300">
                    Personalised by Gemini · Saved privately to your account
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        {view === "Destinations" && (
          <>
            <PageIntro
              eyebrow="A SMALL ISLAND. ENDLESS POSSIBILITIES."
              title="Find your kind of paradise."
              description="Click any destination to explore 5 verified photos, how to get there, and recommended places to rest."
            />
            <section className="mx-auto min-h-[55vh] max-w-6xl px-6 py-10">
              <div className="flex flex-wrap items-center justify-between gap-5">
                <div className="flex flex-wrap gap-2">
                  {["All", "Heritage", "Nature", "Beach", "Wildlife"].map(
                    (tag) => (
                      <button
                        key={tag}
                        aria-pressed={filter === tag}
                        onClick={() => setFilter(tag)}
                        className={`min-h-11 rounded-full border px-5 text-sm font-semibold ${filter === tag ? "border-green-700 bg-green-700 text-white" : "border-slate-500"}`}
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
                <input
                  aria-label="Search destinations"
                  placeholder="Search your next escape…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="min-h-12 w-full rounded-full border border-slate-300 bg-white px-5 text-sm text-[#08233f] outline-none focus:ring-2 focus:ring-green-600 md:w-72"
                />
              </div>
              <p role="status" className="my-6 text-sm">
                {shown.length} places to discover · Click a card to inspect 5
                photos & rest spots
              </p>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {shown.map((place) => (
                  <button
                    key={place.name}
                    onClick={() => openPlaceModal(place.name)}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left text-[#08233f] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-green-600"
                  >
                    <div className="relative overflow-hidden">
                      <Photo
                        id={place.image}
                        alt={place.name}
                        className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <span
                        className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold ${place.color}`}
                      >
                        {place.tag}
                      </span>
                      <span className="absolute right-3 top-4 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                        <Icon name="camera" className="!h-3.5 !w-3.5" />
                        {Math.max(1, place.images.length)}
                      </span>
                    </div>
                    <div className="p-6">
                      <p className="text-xs font-semibold uppercase tracking-wider text-green-800">
                        {place.subtitle}
                      </p>
                      <h2 className="mt-2 text-2xl font-bold">{place.name}</h2>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {place.detail}
                      </p>
                      <span className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-bold text-[#087947]">
                        Explore {place.name} (5 Photos)
                        <Icon />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              {!shown.length && (
                <div className="py-16 text-center">
                  <h2 className="text-xl font-bold">
                    No places found just yet.
                  </h2>
                  <p className="mt-3 text-sm">
                    Try another name or choose a different category.
                  </p>
                  <button
                    className={`${primary} mt-5`}
                    onClick={() => {
                      setQuery("");
                      setFilter("All");
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </section>
          </>
        )}

        {view === "Map" && (
          <>
            <PageIntro
              eyebrow="SEE THE ISLAND DIFFERENTLY"
              title="A little pin. A whole new possibility."
              description="Switch between Explorer, Satellite, and Street layers. Click any destination pin or list card to preview photos and plan your route."
            />
            <section className="mx-auto max-w-7xl px-6 py-10">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">Explore Sri Lanka</h2>
                <button onClick={openPlanner} className={primary}>
                  Plan a Route
                  <Icon name="spark" />
                </button>
              </div>
              <div className="grid items-start gap-6 lg:grid-cols-[330px_1fr]">
                <div className="max-h-[620px] space-y-3 overflow-y-auto pr-1">
                  {places.map((place, i) => (
                    <button
                      key={place.id}
                      aria-pressed={selectedPlace === place.id}
                      onClick={() => setSelectedPlace(place.id)}
                      className={`flex min-h-20 w-full items-center gap-3.5 rounded-xl border p-3 text-left text-[#08233f] transition focus-visible:ring-2 focus-visible:ring-green-600 ${selectedPlace === place.id ? "border-green-600 bg-green-50 shadow-sm" : "border-slate-200 bg-white hover:border-green-400"}`}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e5f7ec] text-sm font-bold text-green-800">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="block truncate text-base font-bold">
                          {place.name}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-slate-600">
                          {place.subtitle}
                        </span>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${place.color}`}
                      >
                        {place.tag}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="min-w-0">
                  <SriLankaMap
                    places={places}
                    selected={selectedPlace}
                    onSelect={setSelectedPlace}
                    heightClass="h-[460px] md:h-[540px]"
                  />
                  {selectedPlace && (
                    <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-[#08233f] shadow-sm sm:flex-row sm:items-center">
                      <Photo
                        id={
                          places.find((p) => p.id === selectedPlace)?.image ||
                          ""
                        }
                        alt={
                          places.find((p) => p.id === selectedPlace)?.name || ""
                        }
                        className="h-28 w-full shrink-0 rounded-xl object-cover sm:w-44"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-bold">
                          {places.find((p) => p.id === selectedPlace)?.name}
                        </h3>
                        <p className="mt-1.5 text-sm leading-6 text-slate-600">
                          {places.find((p) => p.id === selectedPlace)?.detail}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-3">
                          <button
                            onClick={() =>
                              openPlaceModal(
                                places.find((p) => p.id === selectedPlace)
                                  ?.name || ""
                              )
                            }
                            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#e3f6e9] px-4 text-sm font-bold text-[#087947]"
                          >
                            View 5 Photos & Rest Spots
                            <Icon name="camera" className="!h-4 !w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        )}

        {view === "My Trips" && (
          <>
            <PageIntro
              eyebrow="YOUR PERSONAL COLLECTION"
              title="Good adventures are worth keeping."
              description="Click any saved trip to inspect your route map, travel transfers, places to rest, and editable day-by-day plan."
            />
            <section className="mx-auto min-h-[50vh] max-w-6xl px-6 py-10">
              <div className="flex flex-wrap items-center justify-between gap-5">
                <div>
                  <h2 className="text-2xl font-bold">
                    My Trips{" "}
                    <span className="ml-2 rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                      {saved.length}
                    </span>
                  </h2>
                  <p className="mt-2 text-sm">
                    {user
                      ? "Privately saved to your account · Click any trip to see routes & rest spots"
                      : "Sign in to access your private trip collection"}
                  </p>
                </div>
                <button
                  onClick={user ? openPlanner : () => setModal("Sign In")}
                  className={primary}
                >
                  {user ? "Create New Trip" : "Sign In to Your Account"}
                  <Icon name={user ? "spark" : "user"} />
                </button>
              </div>
              {saved.length > 0 && (
                <input
                  aria-label="Search saved trips"
                  placeholder="Search your trips…"
                  value={tripQuery}
                  onChange={(e) => setTripQuery(e.target.value)}
                  className="mt-7 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-[#08233f] focus:ring-2 focus:ring-green-600"
                />
              )}
              {saved.length === 0 ? (
                <div className="my-10 rounded-2xl border border-dashed border-[#b6d9c8] bg-[#eff8f3] px-6 py-16 text-center text-[#08233f]">
                  <span className="inline-flex rounded-full bg-white p-5">
                    <Icon name="bag" className="!h-9 !w-9 text-green-700" />
                  </span>
                  <h2 className="mt-5 text-2xl font-bold">
                    Your travel stories belong here.
                  </h2>
                  <p className="mx-auto mb-6 mt-3 max-w-md text-sm leading-7 text-slate-600">
                    From a weekend by the ocean to a journey through the hills,
                    create your first itinerary and keep it here.
                  </p>
                  <button onClick={openPlanner} className={primary}>
                    Plan My First Trip
                    <Icon />
                  </button>
                </div>
              ) : (
                <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {matchingTrips.map(({ item, index }) => (
                    <article
                      key={item.id || index}
                      className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-[#08233f] shadow-sm transition hover:shadow-md"
                    >
                      <button
                        type="button"
                        onClick={() => openTripModal(item, "itinerary")}
                        className="text-left"
                      >
                        <Photo
                          id={
                            places.find(
                              (p) => p.id === item.days[0]?.destination
                            )?.image ||
                            hero?.image ||
                            ""
                          }
                          alt="Sri Lanka trip inspiration"
                          className="h-44 w-full object-cover"
                        />
                      </button>
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                            {item.duration} days · {item.style}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            From {item.startingPoint}
                          </span>
                        </div>
                        <h2 className="mt-3 text-xl font-bold">{item.title}</h2>
                        <p className="mt-1.5 text-sm text-slate-600">
                          {item.interests} · {item.budget}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-[#e3f6e9] px-3.5 text-xs font-bold text-[#087947]"
                            onClick={() => openTripModal(item, "route")}
                          >
                            <Icon name="route" className="!h-3.5 !w-3.5" />
                            View Route
                          </button>
                          <button
                            className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-[#eef5fb] px-3.5 text-xs font-bold text-[#0c4a6e]"
                            onClick={() => openTripModal(item, "rest")}
                          >
                            <Icon name="bed" className="!h-3.5 !w-3.5" />
                            Places to Rest
                          </button>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                          <button
                            className="flex min-h-10 items-center gap-2 text-sm font-bold text-[#087947]"
                            onClick={() => openTripModal(item, "itinerary")}
                          >
                            Open Itinerary
                            <Icon />
                          </button>
                          <button
                            disabled={busy}
                            aria-label={`Delete ${item.title}`}
                            className="min-h-10 px-2 text-sm text-red-700"
                            onClick={() => {
                              setTrip(item);
                              setModal("Delete Trip");
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
              {saved.length > 0 && matchingTrips.length === 0 && (
                <p className="py-12 text-center text-sm">
                  No trips match that search. Try a different name.
                </p>
              )}
            </section>
          </>
        )}

        {view === "About" && (
          <>
            <PageIntro
              eyebrow="ROOTED IN SRI LANKA. MADE FOR EXPLORERS."
              title="A little island. A thousand stories."
              description="We believe the best trip isn’t the one that sees everything. It’s the one that feels like you."
            />
            <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:gap-16">
              <div className="relative pb-5 pr-5">
                <Photo
                  id={hero?.image || ""}
                  alt="Nine Arch Bridge, Ella, Sri Lanka"
                  className="h-[400px] w-full rounded-3xl object-cover"
                />
                <div className="absolute bottom-0 right-0 rounded-2xl bg-[#b7e36a] px-7 py-5 text-[#08233f]">
                  <span className="font-script text-3xl">
                    Go a little further.
                  </span>
                  <p className="mt-1 text-xs font-semibold tracking-wider">
                    COME BACK WITH A STORY
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold tracking-[0.18em]">
                  THE IDEA BEHIND LANKATRAILS
                </p>
                <h2 className="mt-4 text-3xl font-bold leading-tight">
                  Less time planning.
                  <br />
                  More time feeling alive.
                </h2>
                <p className="mt-5 text-sm leading-7">
                  Sri Lanka has a way of surprising you. A winding train ride
                  becomes the highlight of your trip. A quiet beach becomes
                  somewhere you never want to leave.
                </p>
                <p className="mt-4 text-sm leading-7">
                  LankaTrails is built to help you find those moments—complete
                  with authentic destination photography, realistic routes, and
                  thoughtful places to rest along the way.
                </p>
                <button onClick={openPlanner} className={`${primary} mt-7`}>
                  Find My Trail
                  <Icon />
                </button>
              </div>
            </section>
            <section className="bg-[#eaf7f0] px-6 py-14 text-[#08233f]">
              <div className="mx-auto max-w-6xl">
                <h2 className="text-center text-3xl font-bold">
                  Thoughtful journeys. By design.
                </h2>
                <div className="mt-9 grid gap-6 md:grid-cols-3">
                  {[
                    [
                      "user",
                      "Your trip, your way",
                      "A starting point shaped around what you love—not a one-size-fits-all checklist.",
                    ],
                    [
                      "leaf",
                      "Travel a little slower",
                      "Leave room for scenic train rides, rest stops, local food, and the people you meet.",
                    ],
                    [
                      "shield",
                      "Honest inspiration",
                      "Clearly labelled AI suggestions and manual plans. Estimated budgets, never fake bookings.",
                    ],
                  ].map(([icon, title, text]) => (
                    <article
                      key={title}
                      className="rounded-2xl border border-[#d7e7dc] bg-white p-7"
                    >
                      <Icon name={icon} className="!h-8 !w-8 text-green-700" />
                      <h3 className="mt-5 text-lg font-bold">{title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {text}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </section>
            <section className="mx-auto max-w-3xl px-6 py-16">
              <h2 className="mb-5 text-2xl font-bold">
                A thoughtful starting point
              </h2>
              <p className="text-sm leading-7">
                LankaTrails combines curated Sri Lankan destinations, a live
                island map, and Gemini-powered itinerary inspiration. Your plans
                belong to your private traveller account. Routes and costs are
                suggestions, not guaranteed prices or bookings. Check travel
                details, local guidance, and weather before setting off.
              </p>
              <button
                onClick={() => navigate("Contact")}
                className="mt-5 flex min-h-11 items-center gap-3 text-sm font-bold"
              >
                Let’s talk about the journey
                <Icon />
              </button>
            </section>
          </>
        )}

        {view === "Contact" && (
          <>
            <PageIntro
              eyebrow="LET’S START A CONVERSATION"
              title="A question before your adventure?"
              description="Trip ideas, feedback, or a little island curiosity. We’d love to know what’s on your mind."
            />
            <section className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[.8fr_1.2fr] md:gap-16">
              <div>
                <h2 className="text-2xl font-bold">
                  Every great trip starts
                  <br />
                  with a good question.
                </h2>
                <p className="mt-5 text-sm leading-7">
                  Planning your first visit? Exploring an idea for the site?
                  Start with our quick answers or prepare a message below.
                </p>
                <div className="mt-7 space-y-4">
                  {[
                    [
                      "pin",
                      "Inspired by Sri Lanka",
                      "Built around the island’s landscapes, culture, and slower moments.",
                    ],
                    [
                      "mail",
                      "A direct line to the team",
                      "Messages are stored privately for the site team to review. This form does not send an email confirmation.",
                    ],
                  ].map(([icon, title, copy]) => (
                    <div
                      key={title}
                      className="flex gap-4 rounded-xl bg-[#edf7f2] p-5 text-[#08233f]"
                    >
                      <Icon name={icon} className="mt-1 text-green-700" />
                      <div>
                        <h3 className="text-sm font-bold">{title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {copy}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const data = Object.fromEntries(new FormData(form));
                  setBusy(true);
                  try {
                    await submitContactMutation({
                      name: String(data.name || ""),
                      email: String(data.email || ""),
                      topic: String(data.topic || "Trip planning"),
                      message: String(data.message || ""),
                      website: data.website ? String(data.website) : undefined,
                    });
                    setContactNotice(
                      "Your message has been received and stored for the team to review."
                    );
                    form.reset();
                  } catch (error) {
                    setContactNotice((error as Error).message);
                  } finally {
                    setBusy(false);
                  }
                }}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-[#08233f] shadow-sm md:p-8"
              >
                <h2 className="text-2xl font-bold">Send a message</h2>
                <p className="mt-2 text-sm text-slate-600">
                  A question, an idea, or a little island inspiration.
                </p>
                <label className="hidden" aria-hidden="true">
                  Website
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  {[
                    ["Name", "name", "text", "Your name"],
                    ["Email address", "email", "email", "you@example.com"],
                  ].map(([label, name, type, placeholder]) => (
                    <label key={name} className="text-sm font-semibold">
                      {label}
                      <input
                        name={name}
                        type={type}
                        required
                        placeholder={placeholder}
                        className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 px-4 font-normal outline-none focus:ring-2 focus:ring-green-600"
                      />
                    </label>
                  ))}
                </div>
                <label className="mt-5 block text-sm font-semibold">
                  What’s it about?
                  <select
                    name="topic"
                    className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 px-3 font-normal focus:ring-2 focus:ring-green-600"
                  >
                    <option>Trip planning</option>
                    <option>Site feedback</option>
                    <option>General question</option>
                  </select>
                </label>
                <label className="mt-5 block text-sm font-semibold">
                  Your message
                  <textarea
                    name="message"
                    required
                    minLength={10}
                    rows={5}
                    placeholder="Tell us what you have in mind…"
                    className="mt-2 w-full resize-y rounded-lg border border-slate-300 p-4 font-normal outline-none focus:ring-2 focus:ring-green-600"
                  />
                </label>
                <button
                  type="submit"
                  disabled={busy}
                  className={`${primary} mt-5`}
                >
                  {busy ? "Sending…" : "Send Message"}
                  <Icon name="mail" />
                </button>
                <p role="status" className="mt-4 text-sm leading-6 text-green-800">
                  {contactNotice ||
                    "Your message is private. No email confirmation is sent."}
                </p>
              </form>
            </section>
            <section className="mx-auto max-w-3xl px-6 pb-16">
              <h2 className="mb-5 text-2xl font-bold">A few quick answers</h2>
              <FaqList />
            </section>
          </>
        )}
      </main>

      <footer className="bg-[#031d38] px-6 py-8 text-white">
        <div className="mx-auto mb-7 flex max-w-6xl flex-wrap items-center justify-between gap-5 border-b border-[#2c455b] pb-7">
          <div>
            <h2 className="text-xl font-bold">
              A little inspiration goes a long way.
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Find your trail. Make it your own.
            </p>
          </div>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-5">
            {navigation.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.label)}
                className="min-h-11 text-sm text-slate-300 hover:text-white focus-visible:ring-2 focus-visible:ring-lime-300"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mx-auto flex max-w-[1530px] flex-wrap items-center justify-between gap-6">
          <Brand small />
          <p className="text-sm">© 2026 LankaTrails. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-300">
            {[
              "Privacy Policy",
              "Terms of Service",
              "Photo Credits",
              "Contact",
            ].map((item) => (
              <button
                key={item}
                className="min-h-11 hover:text-white"
                onClick={() =>
                  item === "Contact" ? navigate("Contact") : setModal(item)
                }
              >
                {item}
              </button>
            ))}
          </div>
          <p className="text-sm">
            Made with <span className="text-red-500">♥</span> in Sri Lanka
          </p>
        </div>
      </footer>

      {modal && (
        <Modal
          title={modal}
          wide={modal === "Your Itinerary" || Boolean(activeModalPlace)}
          onClose={() => {
            setLightboxOpen(false);
            setModal(null);
          }}
        >
          {modal === "Sign In" ? (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                setNotice("");
                const formData = new FormData(e.currentTarget);
                const email = String(formData.get("email") || "").trim();
                const password = String(formData.get("password") || "");
                const name = String(formData.get("name") || "").trim();
                try {
                  if (authMode === "register") {
                    const res = await authClient.signUp.email({
                      email,
                      password,
                      name,
                    });
                    if (res.error) {
                      throw new Error(
                        res.error.message ||
                          "Unable to create account. Use a valid email, a name, and a password of at least 10 characters."
                      );
                    }
                  } else {
                    const res = await authClient.signIn.email({
                      email,
                      password,
                    });
                    if (res.error) {
                      throw new Error(
                        res.error.message || "Email or password is incorrect."
                      );
                    }
                  }
                  setNotice("You’re signed in. Your island story starts here.");
                  setModal(null);
                } catch (error) {
                  setNotice((error as Error).message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              <p className="mb-5 text-sm leading-7 text-slate-600">
                {authMode === "register"
                  ? "Create your traveller account and keep your journeys in one place."
                  : "Welcome back. Your saved journeys are waiting for you."}
              </p>
              <div
                className="mb-6 grid grid-cols-2 rounded-xl bg-[#eef5f1] p-1"
                role="tablist"
                aria-label="Account access"
              >
                {["login", "register"].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    role="tab"
                    aria-selected={authMode === mode}
                    onClick={() => {
                      setAuthMode(mode);
                      setNotice("");
                    }}
                    className={`min-h-11 rounded-lg text-sm font-semibold ${authMode === mode ? "bg-white shadow-sm" : ""}`}
                  >
                    {mode === "login" ? "Sign In" : "Create Account"}
                  </button>
                ))}
              </div>
              {authMode === "register" && (
                <label className="mb-4 block text-sm font-semibold">
                  Your name
                  <input
                    name="name"
                    autoComplete="name"
                    required
                    minLength={2}
                    maxLength={80}
                    className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 px-4 focus:ring-2 focus:ring-green-600"
                  />
                </label>
              )}
              <label className="block text-sm font-semibold">
                Email address
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={200}
                  className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 px-4 focus:ring-2 focus:ring-green-600"
                />
              </label>
              <label className="mt-4 block text-sm font-semibold">
                Password
                <input
                  name="password"
                  type="password"
                  autoComplete={
                    authMode === "register"
                      ? "new-password"
                      : "current-password"
                  }
                  required
                  minLength={authMode === "register" ? 10 : 1}
                  maxLength={128}
                  className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 px-4 focus:ring-2 focus:ring-green-600"
                />
              </label>
              {authMode === "register" && (
                <p className="mt-2 text-xs text-slate-600">
                  Use at least 10 characters. Never reuse an important password.
                </p>
              )}
              <button
                disabled={busy}
                className={`${primary} mt-6 w-full`}
                type="submit"
              >
                {busy
                  ? "Please wait…"
                  : authMode === "register"
                    ? "Create My Account"
                    : "Sign In"}
                <Icon name="arrow" />
              </button>
              <p role="status" className="mt-4 text-sm leading-6 text-[#8b3021]">
                {notice}
              </p>
            </form>
          ) : modal === "Your Account" && user ? (
            <>
              <div className="rounded-xl bg-green-50 p-5">
                <p className="text-xl font-bold">{user.name}</p>
                <p className="mt-2 break-all text-sm text-slate-600">
                  {user.email}
                </p>
                <p className="mt-3 text-xs text-green-800">
                  Traveller account · Your trips are private
                </p>
              </div>
              <button
                className={`${primary} mt-5`}
                onClick={() => {
                  setModal(null);
                  navigate("My Trips");
                }}
              >
                My Saved Trips
                <Icon name="bag" />
              </button>
              <button
                disabled={busy}
                className="ml-3 min-h-11 px-4 text-sm font-semibold text-slate-700"
                onClick={async () => {
                  setBusy(true);
                  try {
                    await authClient.signOut();
                    setTrip(null);
                    setModal(null);
                    setNotice("You have been signed out.");
                  } catch {
                    setNotice("Could not sign out. Please try again.");
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Sign Out
              </button>
              <p role="status" className="mt-3 text-sm">
                {notice}
              </p>
            </>
          ) : modal === "Delete Trip" && trip ? (
            <>
              <p className="text-sm leading-7 text-slate-600">
                Delete “{trip.title}” from your account? This cannot be undone.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  disabled={busy}
                  className="min-h-11 rounded-full bg-red-700 px-6 text-sm font-semibold text-white"
                  onClick={async () => {
                    await deleteTrip(trip.id);
                    setModal(null);
                  }}
                >
                  Delete Trip
                </button>
                <button
                  className="min-h-11 px-4 text-sm"
                  onClick={() => setModal(null)}
                >
                  Keep My Trip
                </button>
              </div>
            </>
          ) : modal === "Photo Credits" ? (
            <div className="space-y-5">
              {places.map((place) => (
                <div key={place.id}>
                  <h3 className="text-sm font-bold">{place.name}</h3>
                  <p className="mt-1 break-words text-xs leading-6 text-slate-600">
                    {place.credit?.split(" · https:")[0] || "Wikimedia Commons"}
                  </p>
                  {place.credit?.includes("https:") && (
                    <a
                      className="inline-flex min-h-11 items-center text-sm font-semibold text-green-800 underline"
                      href={`https:${place.credit.split("https:")[1]}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Original image & licence
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : modal === "Your Itinerary" && trip ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-wider text-green-800">
                {trip.source === "manual"
                  ? "Your manual plan · Not AI-generated"
                  : "Created with Gemini"}{" "}
                · Saved to your account
              </p>
              <label className="mt-3 block text-sm font-semibold">
                Trip title
                <input
                  aria-label="Trip title"
                  value={trip.title}
                  maxLength={100}
                  onChange={(e) => setTrip({ ...trip, title: e.target.value })}
                  className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 px-3 text-xl font-bold outline-none focus:ring-2 focus:ring-green-600"
                />
              </label>
              <p className="my-3 text-sm text-slate-600">
                {trip.duration} days · {trip.travellers} traveller
                {trip.travellers > 1 ? "s" : ""} · Starting from{" "}
                {trip.startingPoint}
              </p>

              {/* Tab Switcher inside Trip Modal */}
              <div
                className="mb-5 grid grid-cols-3 rounded-xl bg-[#eef5f1] p-1"
                role="tablist"
                aria-label="Trip details tabs"
              >
                {[
                  { id: "itinerary", label: "Day-by-Day Plan" },
                  { id: "route", label: "Route & Map" },
                  { id: "rest", label: "Where to Rest" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={itineraryTab === tab.id}
                    onClick={() =>
                      setItineraryTab(tab.id as "itinerary" | "route" | "rest")
                    }
                    className={`min-h-10 rounded-lg px-2 text-xs font-bold transition sm:text-sm ${
                      itineraryTab === tab.id
                        ? "bg-white text-[#087947] shadow-sm"
                        : "text-slate-600 hover:text-[#08233f]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {itineraryTab === "route" && (
                <div className="space-y-4">
                  <SriLankaMap
                    places={tripPlaces}
                    route
                    heightClass="h-[340px] md:h-[400px]"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#d6e7dd] bg-[#f5faf7] p-4">
                    <div>
                      <p className="text-sm font-bold text-[#08233f]">
                        Full Route Navigation
                      </p>
                      <p className="text-xs text-slate-600">
                        {trip.startingPoint} →{" "}
                        {tripPlaces.map((p) => p.name).join(" → ")}
                      </p>
                    </div>
                    <a
                      href={buildGoogleMapsRouteUrl(
                        trip.startingPoint,
                        tripPlaces
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#087947] px-4 text-xs font-bold text-white hover:brightness-110"
                    >
                      Open in Google Maps
                      <Icon name="arrow" className="!h-3.5 !w-3.5" />
                    </a>
                  </div>
                  <div className="space-y-3">
                    {trip.days.map((day, i) => {
                      const stopPlace = places.find(
                        (p) => p.id === day.destination
                      );
                      return (
                        <div
                          key={i}
                          className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#087947] text-xs font-bold text-white">
                            {i + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h3 className="text-sm font-bold">
                                Day {i + 1}: {stopPlace?.name || "Destination"}
                              </h3>
                              {day.travelDuration && (
                                <span className="rounded-full bg-[#eef5fb] px-2.5 py-0.5 text-xs font-semibold text-[#0c4a6e]">
                                  {day.travelDuration}
                                </span>
                              )}
                            </div>
                            {day.transportMode && (
                              <p className="mt-1 text-xs font-semibold text-[#087947]">
                                Transport: {day.transportMode}
                              </p>
                            )}
                            <p className="mt-1.5 text-sm leading-6 text-slate-600">
                              {day.routeTip ||
                                stopPlace?.gettingThere ||
                                day.travelNote}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {itineraryTab === "rest" && (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">
                    Recommended stays, guesthouses, and quiet refreshment stops
                    along your {trip.duration}-day route.
                  </p>
                  {trip.days.map((day, i) => {
                    const stopPlace = places.find(
                      (p) => p.id === day.destination
                    );
                    return (
                      <section
                        key={i}
                        className="rounded-xl border border-[#d6e7dd] bg-[#f5faf7] p-4"
                      >
                        <p className="text-xs font-bold uppercase tracking-wide text-[#087947]">
                          Day {i + 1} · {stopPlace?.name || "Destination"}
                        </p>
                        {day.restRecommendation && (
                          <p className="mt-2 rounded-lg bg-white p-3 text-sm leading-6 text-[#08233f] shadow-xs">
                            <strong className="font-semibold">
                              Trip Rest Note:{" "}
                            </strong>
                            {day.restRecommendation}
                          </p>
                        )}
                        {stopPlace && stopPlace.restSpots.length > 0 && (
                          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                            {stopPlace.restSpots.map((spot) => (
                              <div
                                key={spot.name}
                                className="rounded-lg border border-slate-200 bg-white p-3"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-xs font-bold text-[#08233f]">
                                    {spot.name}
                                  </p>
                                  <span className="shrink-0 rounded-full bg-[#e3f6e9] px-2 py-0.5 text-[10px] font-bold text-[#087947]">
                                    {spot.type}
                                  </span>
                                </div>
                                <p className="mt-1 text-xs font-semibold text-slate-500">
                                  {spot.priceRange}
                                </p>
                                <p className="mt-1 text-xs leading-5 text-slate-600">
                                  {spot.note}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </section>
                    );
                  })}
                </div>
              )}

              {itineraryTab === "itinerary" && (
                <>
                  <SriLankaMap
                    places={tripPlaces}
                    route
                    heightClass="h-[260px] md:h-[300px]"
                  />
                  <div className="mt-5 space-y-4">
                    {trip.days.map((day, i) => {
                      const stopPlace = places.find(
                        (p) => p.id === day.destination
                      );
                      return (
                        <section
                          key={i}
                          className="rounded-xl border border-[#dae8df] bg-[#f5faf7] p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-xs font-bold uppercase tracking-wide text-green-800">
                              DAY {i + 1} · {stopPlace?.name || "Destination"}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {day.transportMode && (
                                <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#08233f]">
                                  {day.transportMode}
                                </span>
                              )}
                              {day.travelDuration && (
                                <span className="rounded-full bg-[#e3f6e9] px-2.5 py-0.5 text-[11px] font-semibold text-[#087947]">
                                  {day.travelDuration}
                                </span>
                              )}
                            </div>
                          </div>
                          <label className="mt-3 block text-sm font-semibold">
                            Day title
                            <input
                              value={day.title}
                              maxLength={120}
                              onChange={(e) =>
                                setTrip({
                                  ...trip,
                                  days: trip.days.map((entry, j) =>
                                    j === i
                                      ? { ...entry, title: e.target.value }
                                      : entry
                                  ),
                                })
                              }
                              className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 font-normal focus:ring-2 focus:ring-green-600"
                            />
                          </label>
                          <label className="mt-3 block text-sm font-semibold">
                            Activities
                            <textarea
                              rows={4}
                              maxLength={2000}
                              value={day.description}
                              onChange={(e) =>
                                setTrip({
                                  ...trip,
                                  days: trip.days.map((entry, j) =>
                                    j === i
                                      ? { ...entry, description: e.target.value }
                                      : entry
                                  ),
                                })
                              }
                              className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm font-normal leading-6 focus:ring-2 focus:ring-green-600"
                            />
                          </label>
                          {day.restRecommendation && (
                            <p className="mt-2.5 rounded-lg bg-white/90 px-3 py-2 text-xs leading-5 text-slate-700">
                              <strong className="text-[#087947]">
                                Where to rest:{" "}
                              </strong>
                              {day.restRecommendation}
                            </p>
                          )}
                          <p className="mt-2.5 text-sm leading-6 text-slate-600">
                            {day.travelNote}
                          </p>
                          <p className="mt-2 text-sm font-bold text-green-800">
                            Est. LKR {day.estimatedCost.toLocaleString()} /
                            person
                          </p>
                        </section>
                      );
                    })}
                  </div>
                </>
              )}

              <div className="mt-5 rounded-xl bg-[#e6f5ec] p-5">
                <p className="text-sm">
                  Estimated trip budget for {trip.travellers} traveller
                  {trip.travellers > 1 ? "s" : ""}
                </p>
                <p className="mt-2 text-2xl font-bold">
                  LKR{" "}
                  {(
                    trip.days.reduce((sum, day) => sum + day.estimatedCost, 0) *
                    trip.travellers
                  ).toLocaleString()}
                </p>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                AI suggestions, not bookings or verified live prices. Check
                monsoon conditions, travel times, and opening hours.
                International flights excluded.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  disabled={busy}
                  onClick={saveTrip}
                  className={primary}
                >
                  {busy ? "Saving…" : "Save Changes"}
                  <Icon name="save" />
                </button>
                <button
                  className="min-h-11 px-3 text-sm font-semibold"
                  onClick={() => {
                    setStyle(trip.style);
                    setDuration(trip.duration);
                    setBudget(trip.budget);
                    setInterests(trip.interests);
                    setSeason(trip.season);
                    setTravellers(String(trip.travellers));
                    setStartingPoint(trip.startingPoint);
                    setModal(null);
                    openPlanner();
                  }}
                >
                  Plan Another Version
                </button>
              </div>
              <p role="status" className="mt-3 text-sm text-green-800">
                {notice}
              </p>
            </>
          ) : modal === "Budget Calculator" ? (
            <>
              <p className="text-sm leading-6 text-slate-600">
                Adjust your duration and comfort level for an illustrative
                per-person budget. Excludes flights.
              </p>
              <label className="mt-5 block text-sm">
                Days
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3"
                >
                  {["3", "5", "7", "10", "14"].map((day) => (
                    <option key={day}>{day}</option>
                  ))}
                </select>
              </label>
              <label className="mt-4 block text-sm">
                Travel budget
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3"
                >
                  {["Budget friendly", "Comfortable", "Luxury"].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              <p className="mt-6 rounded-xl bg-green-50 p-5 text-2xl font-bold">
                LKR {(daily * Number(duration)).toLocaleString()}
                <span className="mt-2 block text-sm font-normal">
                  Estimated total · LKR {daily.toLocaleString()} per day
                </span>
              </p>
              <p className="mt-3 text-xs leading-5 text-slate-600">
                Planning estimate only. Actual accommodation, food, transport
                and activity costs will vary.
              </p>
            </>
          ) : activeModalPlace ? (
            <>
              {/* 5-Photo Gallery Viewer for this Place */}
              <div className="relative overflow-hidden rounded-xl bg-slate-900">
                <Photo
                  id={
                    activeGalleryImages[activePhotoIndex] ||
                    activeModalPlace.image
                  }
                  alt={`${activeModalPlace.name} photo ${activePhotoIndex + 1}`}
                  className={`${lightboxOpen ? "h-[60vh]" : "h-64 sm:h-80"} w-full object-cover transition-all`}
                />
                {activeGalleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous photo"
                      onClick={() =>
                        setActivePhotoIndex(
                          (activePhotoIndex - 1 + activeGalleryImages.length) %
                            activeGalleryImages.length
                        )
                      }
                      className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                    >
                      <Icon name="back" className="!h-4 !w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next photo"
                      onClick={() =>
                        setActivePhotoIndex(
                          (activePhotoIndex + 1) % activeGalleryImages.length
                        )
                      }
                      className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                    >
                      <Icon name="arrow" className="!h-4 !w-4" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="rounded-full bg-black/65 px-3 py-1 text-xs font-bold text-white">
                    Photo {activePhotoIndex + 1} /{" "}
                    {Math.max(1, activeGalleryImages.length)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(!lightboxOpen)}
                    className="rounded-full bg-black/65 px-3 py-1 text-xs font-bold text-white hover:bg-black/85"
                  >
                    {lightboxOpen ? "Compact View" : "Expand Photo"}
                  </button>
                </div>
              </div>

              {activeGalleryImages.length > 1 && (
                <div className="mt-3 grid grid-cols-5 gap-2">
                  {activeGalleryImages.slice(0, 5).map((imgUrl, idx) => (
                    <button
                      key={imgUrl}
                      type="button"
                      aria-label={`View photo ${idx + 1} of ${activeModalPlace.name}`}
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`overflow-hidden rounded-lg border-2 transition ${
                        activePhotoIndex === idx
                          ? "border-[#087947] ring-2 ring-[#087947]/30"
                          : "border-transparent opacity-75 hover:opacity-100"
                      }`}
                    >
                      <Photo
                        id={imgUrl}
                        alt={`${activeModalPlace.name} thumbnail ${idx + 1}`}
                        className="h-14 w-full object-cover sm:h-16"
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${activeModalPlace.color}`}
                >
                  {activeModalPlace.tag}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-green-800">
                  {activeModalPlace.subtitle}
                </span>
              </div>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {activeModalPlace.detail}
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-[#f5faf7] p-3.5">
                  <p className="text-xs font-bold uppercase text-[#087947]">
                    Best Time to Visit
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {activeModalPlace.bestTimeToVisit}
                  </p>
                </div>
                <div className="rounded-xl bg-[#f5faf7] p-3.5">
                  <p className="text-xs font-bold uppercase text-[#087947]">
                    Estimated Daily Budget
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    LKR {activeModalPlace.estimatedDailyBudget.toLocaleString()}{" "}
                    / day
                  </p>
                </div>
              </div>

              {activeModalPlace.highlights.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Top Highlights
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                    {activeModalPlace.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#087947]" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#08233f]">
                  <Icon name="route" className="!h-4 !w-4 text-[#087947]" />
                  Route & Getting There
                </p>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">
                  {activeModalPlace.gettingThere}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${activeModalPlace.latitude},${activeModalPlace.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#087947] underline"
                >
                  Open location in Google Maps
                </a>
              </div>

              {activeModalPlace.restSpots.length > 0 && (
                <div className="mt-4">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#08233f]">
                    <Icon name="bed" className="!h-4 !w-4 text-[#087947]" />
                    Where to Rest & Stay
                  </p>
                  <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
                    {activeModalPlace.restSpots.map((spot) => (
                      <div
                        key={spot.name}
                        className="rounded-xl border border-[#d7e7dc] bg-[#f5faf7] p-3"
                      >
                        <p className="text-xs font-bold text-[#08233f]">
                          {spot.name}
                        </p>
                        <p className="mt-0.5 text-[11px] font-semibold text-[#087947]">
                          {spot.type} · {spot.priceRange}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-600">
                          {spot.note}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setModal(null);
                    openPlanner();
                  }}
                  className={primary}
                >
                  Plan Your Visit
                  <Icon />
                </button>
                <Link
                  href={`/destinations/${activeModalPlace.slug}`}
                  onClick={() => setModal(null)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#087947] px-5 text-sm font-bold text-[#087947] hover:bg-[#edf8f3]"
                >
                  Open Full Place Page
                </Link>
              </div>
            </>
          ) : (
            <div className="text-sm leading-7 text-slate-600">
              {modal === "Privacy Policy"
                ? "LankaTrails stores your account, private itineraries, generation attempt records, and submitted messages in its Convex database. Trip preferences and a public destination catalogue are sent to Google Gemini to generate suggestions; passwords are never sent to Gemini. An HTTP-only cookie keeps you signed in. You can delete saved trips in My Trips. No payment or booking details are collected."
                : modal === "Terms of Service"
                  ? "LankaTrails is a planning tool, not a booking service. AI routes and budget estimates may be inaccurate and must be checked independently. No accommodation, transport, availability, or prices are guaranteed. Generation is limited to five attempts per account per hour."
                  : modal === "Travel Guidance"
                    ? "Check local weather and monsoon seasons, verify transport schedules, respect sacred sites, and use licensed guides where needed. Map lines show stop order, not navigable driving routes. Never rely on AI for emergency, medical, or safety-critical advice."
                    : "From Sigiriya’s ancient fortress to the tea-covered hills of Ella and the golden beaches of Mirissa, discover an island full of possibilities. Explore the destination map, browse 5 photos per destination, and let Gemini draft an itinerary complete with routes and rest recommendations."}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
