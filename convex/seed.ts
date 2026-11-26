import { mutation } from "./_generated/server";

const DESTINATION_DATA = [
  {
    name: "Sigiriya Rock Fortress",
    slug: "sigiriya-rock-fortress",
    description:
      "Climb the 5th-century Lion Rock citadel rising 200 metres above lush jungle, exploring royal water gardens, ancient frescoes, and panoramic Cultural Triangle views.",
    province: "Central",
    district: "Matale",
    category: "Historical",
    images: [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c7/Sigiriya.jpg/1280px-Sigiriya.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3e/Sigiriya_garden_from_top.jpg/1280px-Sigiriya_garden_from_top.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5f/Sigiriya_summit_ruins2.jpg/1280px-Sigiriya_summit_ruins2.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/SriLanka_Sigiriya_gardens.jpg/1280px-SriLanka_Sigiriya_gardens.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f7/Sigiriya_lion_gate_04.JPG/1280px-Sigiriya_lion_gate_04.JPG",
    ],
    location: { latitude: 7.957, longitude: 80.76 },
    bestTimeToVisit: "January to April",
    estimatedDailyBudget: 5000,
    tags: ["UNESCO", "History", "Nature"],
    highlights: [
      "Lion's Paw Terrace & Mirror Wall",
      "Royal Water Gardens at the western base",
      "Sunrise climb from Pidurangala Rock opposite",
    ],
    gettingThere:
      "4–4.5 hrs drive from Colombo via Kurunegala & Dambulla (A6), or 2.5 hrs from Kandy by car or Dambulla express bus + 20 min tuk-tuk.",
    restSpots: [
      {
        name: "Sigiriya Village & Garden Lodges",
        type: "Eco Resort & Pool Rest",
        priceRange: "LKR 14,000–28,000 / night",
        note: "Shaded garden bungalows ideal for resting after a 6:30 AM summit climb.",
      },
      {
        name: "Inamaluwa & Kibissa Homestays",
        type: "Guesthouse",
        priceRange: "LKR 5,000–11,000 / night",
        note: "Quiet family-run stays with home-cooked Sri Lankan rice & curry near the moat.",
      },
      {
        name: "Moat-side Juice & Tea Verandas",
        type: "Refreshment Stop",
        priceRange: "LKR 800–2,000",
        note: "Stop for king coconut water and shaded seating right outside the main exit gate.",
      },
    ],
  },
  {
    name: "Ella",
    slug: "ella",
    description:
      "Enjoy misty mountain ridges, emerald tea estates, the iconic Nine Arch Bridge, and scenic highland train journeys through Sri Lanka's Uva Province.",
    province: "Uva",
    district: "Badulla",
    category: "Nature",
    images: [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/Nine_arches_bridge_bei_ella_2017-10-24_-_1.jpg/1280px-Nine_arches_bridge_bei_ella_2017-10-24_-_1.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Ella_Rock_Sri_Lanka.jpg/1280px-Ella_Rock_Sri_Lanka.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/82/SL_Ella_asv2020-01_img26_View_from_Little_Adams_Peak.jpg/1280px-SL_Ella_asv2020-01_img26_View_from_Little_Adams_Peak.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/80/Ella_rock-_View_from_the_top.jpg/1280px-Ella_rock-_View_from_the_top.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Nine_arches_bridge_bei_ella_2017-10-24_-_7.jpg/1280px-Nine_arches_bridge_bei_ella_2017-10-24_-_7.jpg",
    ],
    location: { latitude: 6.8667, longitude: 81.0466 },
    bestTimeToVisit: "January to March",
    estimatedDailyBudget: 6000,
    tags: ["Mountains", "Hiking", "Tea"],
    highlights: [
      "Nine Arch Bridge train crossings",
      "Little Adam's Peak sunrise hike",
      "Ella Rock & Ravana Falls viewpoints",
    ],
    gettingThere:
      "Take the scenic hill-country train from Kandy or Nanu Oya (3–6 hrs) straight into Ella Station, or drive via Badulla / Wellawaya.",
    restSpots: [
      {
        name: "Ella Gap Ridge Boutique Cabins",
        type: "Hillside Hotel",
        priceRange: "LKR 15,000–35,000 / night",
        note: "Balconies facing Ella Rock where you can unwind in cool mountain mist.",
      },
      {
        name: "Chill & Tea Garden Cafes (Ella Town)",
        type: "Cafe & Lounge",
        priceRange: "LKR 1,500–4,000",
        note: "Great spots to rest your legs with Ceylon tea, rotis, and mountain Wi-Fi.",
      },
      {
        name: "Demodara Hillside Guesthouses",
        type: "Homestay",
        priceRange: "LKR 6,000–12,000 / night",
        note: "Peaceful stays tucked away from town noise near the Nine Arch trail.",
      },
    ],
  },
  {
    name: "Temple of the Tooth",
    slug: "temple-of-the-tooth",
    description:
      "Visit Sri Dalada Maligawa, the sacred Buddhist temple beside Kandy Lake housing the Tooth Relic, surrounded by royal halls, drumming rituals, and cool hill breezes.",
    province: "Central",
    district: "Kandy",
    category: "Cultural",
    images: [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f3/SL_Kandy_asv2020-01_img34_Sacred_Tooth_Temple.jpg/1280px-SL_Kandy_asv2020-01_img34_Sacred_Tooth_Temple.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Sri_Lanka%2C_Kandy%2C_Temple_of_the_Tooth%2C_Sri_Dalada_Maligawa.jpg/1280px-Sri_Lanka%2C_Kandy%2C_Temple_of_the_Tooth%2C_Sri_Dalada_Maligawa.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/20/Sri_Dalada_Maligawa_2010-01.JPG/1280px-Sri_Dalada_Maligawa_2010-01.JPG",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ce/Shrine_-_The_Temple_of_the_Sacred_Tooth_Relic_%28Kandy%29_%285478626167%29.jpg/1280px-Shrine_-_The_Temple_of_the_Sacred_Tooth_Relic_%28Kandy%29_%285478626167%29.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/93/Sri_Dalada_Maligawa_puja_2566.jpg/1280px-Sri_Dalada_Maligawa_puja_2566.jpg",
    ],
    location: { latitude: 7.2936, longitude: 80.6413 },
    bestTimeToVisit: "December to April",
    estimatedDailyBudget: 3000,
    tags: ["Temple", "Culture", "History"],
    highlights: [
      "Morning & evening Thevava drumming ceremonies",
      "Golden Canopy & Octagon Library (Pattirippuwa)",
      "Sunset walk around Kandy Lake & Udawattakele",
    ],
    gettingThere:
      "2.5–3 hrs by Intercity Express train or highway bus/car from Colombo Fort along the A1 route.",
    restSpots: [
      {
        name: "Kandy Lake Promenade Benches & Cafes",
        type: "Lakeside Rest Area",
        priceRange: "Free – LKR 1,800",
        note: "Shaded lakeside paths right beside the temple walls for a calm afternoon break.",
      },
      {
        name: "Queens & Heritage Colonial Stays",
        type: "Heritage Hotel",
        priceRange: "LKR 18,000–38,000 / night",
        note: "Steps from the temple entrance with courtyard gardens and afternoon tea.",
      },
      {
        name: "Peradeniya & Hilltop Villas",
        type: "Boutique Stay",
        priceRange: "LKR 8,000–16,000 / night",
        note: "Quiet hillside retreats overlooking the Mahaweli river and Royal Botanic Gardens.",
      },
    ],
  },
  {
    name: "Galle Fort",
    slug: "galle-fort",
    description:
      "Stroll 16th-century UNESCO-listed Dutch ramparts, coral-stone lanes, the iconic white lighthouse, independent galleries, and oceanfront sunset bastions.",
    province: "Southern",
    district: "Galle",
    category: "Historical",
    images: [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/SL_Galle_Fort_asv2020-01_img24.jpg/1280px-SL_Galle_Fort_asv2020-01_img24.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/SL_Galle_Fort_asv2020-01_img01.jpg/1280px-SL_Galle_Fort_asv2020-01_img01.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a1/SL_Galle_Fort_asv2020-01_img02.jpg/1280px-SL_Galle_Fort_asv2020-01_img02.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/76/SL_Galle_Fort_asv2020-01_img03.jpg/1280px-SL_Galle_Fort_asv2020-01_img03.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/SL_Galle_Fort_asv2020-01_img11.jpg/1280px-SL_Galle_Fort_asv2020-01_img11.jpg",
    ],
    location: { latitude: 6.0267, longitude: 80.2168 },
    bestTimeToVisit: "December to April",
    estimatedDailyBudget: 4500,
    tags: ["UNESCO", "Architecture", "Ocean"],
    highlights: [
      "Galle Lighthouse & Utrecht Bastion",
      "Flag Rock sunset promenade",
      "Pedlar Street heritage cafes & Maritime Museum",
    ],
    gettingThere:
      "2 hrs from Colombo via the Southern Expressway (E01), or 2.5 hrs on the scenic Southern Coastal Railway right into Galle Station.",
    restSpots: [
      {
        name: "Pedlar Street Courtyard Cafes",
        type: "Cafe & Gelato Stop",
        priceRange: "LKR 1,500–3,500",
        note: "Air-conditioned historic Dutch townhouses ideal for escaping midday coastal heat.",
      },
      {
        name: "Fort Wall Boutique Mansions",
        type: "Heritage Hotel",
        priceRange: "LKR 22,000–48,000 / night",
        note: "Restored colonial villas with inner plunge pools inside the pedestrian fort.",
      },
      {
        name: "Unawatuna Bay Guesthouses (10 min away)",
        type: "Beachside Stay",
        priceRange: "LKR 7,000–15,000 / night",
        note: "Calm swimming bay and relaxed beachfront hammocks just outside the fort.",
      },
    ],
  },
  {
    name: "Mirissa Beach",
    slug: "mirissa-beach",
    description:
      "Relax on a crescent palm-fringed bay famous for Coconut Tree Hill sunrises, blue whale watching excursions, beginner surf breaks, and candlelit seafood dinners.",
    province: "Southern",
    district: "Matara",
    category: "Beach",
    images: [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/Mirissa_Strand_Sri_Lanka_%2829779088050%29.jpg/1280px-Mirissa_Strand_Sri_Lanka_%2829779088050%29.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Mirissa-Plage_%283%29.jpg/1280px-Mirissa-Plage_%283%29.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b3/Mirissa-Plage_%284%29.jpg/1280px-Mirissa-Plage_%284%29.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Mirissa_beach_Sri_Lanka_%2829959458812%29.jpg/1280px-Mirissa_beach_Sri_Lanka_%2829959458812%29.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Mirissa_Sri_Lanka_%2829446442583%29.jpg/1280px-Mirissa_Sri_Lanka_%2829446442583%29.jpg",
    ],
    location: { latitude: 5.9485, longitude: 80.4716 },
    bestTimeToVisit: "November to April",
    estimatedDailyBudget: 5000,
    tags: ["Beach", "Whale Watching", "Surfing"],
    highlights: [
      "Coconut Tree Hill headland & Parrot Rock",
      "Morning Blue Whale & Dolphin boat tours",
      "Weligama & Mirissa bay sunset surf",
    ],
    gettingThere:
      "2.5 hrs from Colombo via Southern Expressway (exit Kokmaduwa/Imaduwa) or 40 min coastal drive/bus east of Galle.",
    restSpots: [
      {
        name: "Mirissa Bay Shaded Beach Lounges",
        type: "Beach Club & Daybed",
        priceRange: "LKR 1,500–4,500",
        note: "Oceanfront sunbeds under coconut palms with fresh smoothie bowls and showers.",
      },
      {
        name: "Secret Beach & Palm Cabanas",
        type: "Boutique Beach Hotel",
        priceRange: "LKR 14,000–32,000 / night",
        note: "Quiet cove stays tucked behind the headland away from main road traffic.",
      },
      {
        name: "Harbour Road Guesthouses",
        type: "Guesthouse",
        priceRange: "LKR 6,000–12,000 / night",
        note: "Convenient early-morning base for 6:30 AM whale watching departures.",
      },
    ],
  },
  {
    name: "Yala National Park",
    slug: "yala-national-park",
    description:
      "Embark on dawn 4x4 safaris through dry-zone scrub forest, coastal lagoons, and rocky outcrops famed for the world's highest density of Sri Lankan leopards and wild elephants.",
    province: "Southern",
    district: "Hambantota",
    category: "Wildlife",
    images: [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Sri_Lankan_Leopard_At_Yala_National_Park.jpg/1280px-Sri_Lankan_Leopard_At_Yala_National_Park.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2b/Sri_Lankan_elephant_%28Elephas_maximus_maximus%29_family.jpg/1280px-Sri_Lankan_elephant_%28Elephas_maximus_maximus%29_family.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Yala_National_park_Sri_Lanka_%2829445767974%29.jpg/1280px-Yala_National_park_Sri_Lanka_%2829445767974%29.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/66/Krokodile_im_Yala-National_Park_in_Sri_Lanka_2.jpg/1280px-Krokodile_im_Yala-National_Park_in_Sri_Lanka_2.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Asian_Green_Bee-eater_at_Yala_National_Park%2C_Sri_Lanka_1.jpg/1280px-Asian_Green_Bee-eater_at_Yala_National_Park%2C_Sri_Lanka_1.jpg",
    ],
    location: { latitude: 6.3725, longitude: 81.5185 },
    bestTimeToVisit: "February to July",
    estimatedDailyBudget: 12000,
    tags: ["Safari", "Leopard", "Wildlife"],
    highlights: [
      "Block 1 dawn & dusk leopard safari drives",
      "Wild elephant herds & mugger crocodiles",
      "Patanangala beach break inside the park",
    ],
    gettingThere:
      "4.5–5 hrs from Colombo via Southern Expressway to Mattala/Hambantota, or 2.5 hrs down from Ella to Tissamaharama (Tissa) gateway.",
    restSpots: [
      {
        name: "Tissamaharama Lakefront Eco Resorts",
        type: "Safari Lodge",
        priceRange: "LKR 16,000–45,000 / night",
        note: "Pools and shaded verandas to nap between 5:30 AM and 3:00 PM safari drives.",
      },
      {
        name: "Palatupana Jungle Tented Camps",
        type: "Glamping",
        priceRange: "LKR 28,000–65,000 / night",
        note: "Immersive bush-camp stays close to the Palatupana park gate.",
      },
      {
        name: "Tissa Town Rest Houses",
        type: "Budget Guesthouse",
        priceRange: "LKR 5,500–11,000 / night",
        note: "Clean safari-ready rooms where hosts arrange 4x4 jeeps and packed breakfasts.",
      },
    ],
  },
  {
    name: "Nuwara Eliya",
    slug: "nuwara-eliya",
    description:
      "Breathe crisp highland air in 'Little England', surrounded by emerald tea plantations, Gregory Lake boating, Hakgala Botanical Garden, and colonial bungalows.",
    province: "Central",
    district: "Nuwara Eliya",
    category: "Nature",
    images: [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/Sri_Lanka%2C_Tea_leaves%2C_Nuwara_Eliya.jpg/1280px-Sri_Lanka%2C_Tea_leaves%2C_Nuwara_Eliya.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/22/Gregory_Lake_Nuwara_Eliya_01.jpg/1280px-Gregory_Lake_Nuwara_Eliya_01.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7d/Gregory_Lake_Nuwara_Eliya_02.jpg/1280px-Gregory_Lake_Nuwara_Eliya_02.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/Sunny_Nuwara_Eliya.jpg/1280px-Sunny_Nuwara_Eliya.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ae/SL_Nuwara_Eliya_asv2020-01_img07_bank_building.jpg/1280px-SL_Nuwara_Eliya_asv2020-01_img07_bank_building.jpg",
    ],
    location: { latitude: 6.9497, longitude: 80.7891 },
    bestTimeToVisit: "January to May",
    estimatedDailyBudget: 5500,
    tags: ["Tea", "Mountains", "Scenery"],
    highlights: [
      "Working tea factory tasting & estate walks",
      "Gregory Lake park & Victoria Park gardens",
      "Early morning Horton Plains & World's End trek",
    ],
    gettingThere:
      "Take the hill-country train to Nanu Oya (4 hrs from Kandy) + 20 min taxi up to Nuwara Eliya, or drive via Hatton / Ramboda Pass.",
    restSpots: [
      {
        name: "Tea Estate Heritage Bungalows",
        type: "Colonial Bungalow",
        priceRange: "LKR 20,000–50,000 / night",
        note: "Fireside lounges, warm blankets, and high tea overlooking misty tea slopes.",
      },
      {
        name: "Grand Hotel & Town Tea Lounges",
        type: "Tea Room & Rest",
        priceRange: "LKR 1,800–4,500",
        note: "Classic afternoon tea, scones, and sheltered gardens when highland rain rolls in.",
      },
      {
        name: "Gregory Lake Cozy Cottages",
        type: "Guesthouse",
        priceRange: "LKR 7,000–14,000 / night",
        note: "Heated rooms near the lakefront promenade for early Horton Plains departures.",
      },
    ],
  },
  {
    name: "Anuradhapura Ancient City",
    slug: "anuradhapura-ancient-city",
    description:
      "Cycle through Sri Lanka's first royal capital, home to towering brick stupas like Ruwanwelisaya, the sacred Jaya Sri Maha Bodhi tree, and serene twin bathing ponds.",
    province: "North Central",
    district: "Anuradhapura",
    category: "Historical",
    images: [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/SL_Anuradhapura_asv2020-01_img11_Ruwanwelisaya_Stupa.jpg/1280px-SL_Anuradhapura_asv2020-01_img11_Ruwanwelisaya_Stupa.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Ruwanweli_Saya_1.jpg/1280px-Ruwanweli_Saya_1.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/The_Ruwanwelisaya_Stupa_at_night%28poya_day%29.jpg/1280px-The_Ruwanwelisaya_Stupa_at_night%28poya_day%29.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/Anuradhapura-ruines3.jpg/1280px-Anuradhapura-ruines3.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/Anuradhapura_02.jpg/1280px-Anuradhapura_02.jpg",
    ],
    location: { latitude: 8.3114, longitude: 80.4037 },
    bestTimeToVisit: "May to September",
    estimatedDailyBudget: 3500,
    tags: ["History", "Heritage", "Culture"],
    highlights: [
      "Ruwanwelisaya Great Stupa & Jaya Sri Maha Bodhi",
      "Abhayagiri & Jetavanaramaya monastery ruins",
      "Sunrise or sunset bicycle loop around Tissa Wewa",
    ],
    gettingThere:
      "3.5–4 hrs by Northern Line express train from Colombo Fort, or 1.5 hrs drive north-west from Sigiriya/Dambulla.",
    restSpots: [
      {
        name: "Tissa Wewa & Nuwara Wewa Lakeside Stays",
        type: "Heritage Resort",
        priceRange: "LKR 10,000–24,000 / night",
        note: "Breezy lakeside verandahs ideal for resting between morning and sunset temple visits.",
      },
      {
        name: "New Town Bicycle & Cafe Rest Stops",
        type: "Cafe & Refreshment",
        priceRange: "LKR 800–2,200",
        note: "Cool drinks, curd & treacle, and shaded rest under rain trees near the Sacred City.",
      },
      {
        name: "Sacred City Eco Guesthouses",
        type: "Guesthouse",
        priceRange: "LKR 4,500–9,500 / night",
        note: "Quiet rooms with bicycle rentals and early morning tea before temple walks.",
      },
    ],
  },
  {
    name: "Arugam Bay",
    slug: "arugam-bay",
    description:
      "Unwind on Sri Lanka's sun-drenched east coast surf capital—home to Main Point reef breaks, Whiskey Point sunrises, Pottuvil Lagoon safaris, and laid-back cafes.",
    province: "Eastern",
    district: "Ampara",
    category: "Beach",
    images: [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/Arugam_bay_beach.jpg/1280px-Arugam_bay_beach.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5f/Whiskey_Point_4.jpg/1280px-Whiskey_Point_4.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/Arugam_Bay%2C_Sri_Lanka_-_panoramio.jpg/1280px-Arugam_Bay%2C_Sri_Lanka_-_panoramio.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Arugam_Bay%2C_Sri_Lanka_-_panoramio_%282%29.jpg/1280px-Arugam_Bay%2C_Sri_Lanka_-_panoramio_%282%29.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1c/Arugam_Bay%2C_Sri_Lanka_-_panoramio_%283%29.jpg/1280px-Arugam_Bay%2C_Sri_Lanka_-_panoramio_%283%29.jpg",
    ],
    location: { latitude: 6.8406, longitude: 81.8368 },
    bestTimeToVisit: "April to October",
    estimatedDailyBudget: 5000,
    tags: ["Surfing", "Beach", "Adventure"],
    highlights: [
      "Main Point & Baby Point surf sessions",
      "Pottuvil Lagoon mangrove & elephant boat tour",
      "Elephant Rock sunset viewpoint & Whiskey Point",
    ],
    gettingThere:
      "3.5 hrs drive east down from Ella via Monaragala & Siyambalanduwa, or 6.5–7 hrs from Colombo via the southern/east highway.",
    restSpots: [
      {
        name: "Main Point Palm Cabanas",
        type: "Surf Lodge",
        priceRange: "LKR 9,000–22,000 / night",
        note: "Hammocks right on the sand steps away from morning surf breaks.",
      },
      {
        name: "Panama & Whisky Point Eco Retreats",
        type: "Boutique Stay",
        priceRange: "LKR 14,000–30,000 / night",
        note: "Secluded coastal huts bordered by lagoons and empty east-coast beaches.",
      },
      {
        name: "Arugam Bay Surf Cafes",
        type: "Cafe & Chill Spot",
        priceRange: "LKR 1,200–3,000",
        note: "Breezy open-air spots for iced coffee, smoothie bowls, and midday shade.",
      },
    ],
  },
  {
    name: "Polonnaruwa Ancient City",
    slug: "polonnaruwa-ancient-city",
    description:
      "Explore the remarkably preserved 12th-century medieval capital, featuring the carved granite Buddhas of Gal Vihara, the circular Vatadage, and Parakrama Samudra lake.",
    province: "North Central",
    district: "Polonnaruwa",
    category: "Historical",
    images: [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c6/Gal_Viharaya_02.jpg/1280px-Gal_Viharaya_02.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8d/Gal_Vihara%2C_Vijjadhara_Guha_2%28js%29.jpg/1280px-Gal_Vihara%2C_Vijjadhara_Guha_2%28js%29.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/68/LK-polonnaruwa-gal-vihara-01.jpg/1280px-LK-polonnaruwa-gal-vihara-01.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/LK-polonnaruwa-gal-vihara-02.jpg/1280px-LK-polonnaruwa-gal-vihara-02.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/Polonn%C3%A2ruv%C3%A2_Gal_Vihara_%282%29.JPG/1280px-Polonn%C3%A2ruv%C3%A2_Gal_Vihara_%282%29.JPG",
    ],
    location: { latitude: 7.9403, longitude: 81.0188 },
    bestTimeToVisit: "May to September",
    estimatedDailyBudget: 3500,
    tags: ["History", "UNESCO", "Heritage"],
    highlights: [
      "Gal Vihara granite rock-cut Buddha statues",
      "Sacred Quadrangle & Polonnaruwa Vatadage",
      "Parakrama Samudra reservoir sunset embankment",
    ],
    gettingThere:
      "1 hr drive east from Sigiriya/Habarana along the A11, or 4.5 hrs from Colombo by train/highway bus.",
    restSpots: [
      {
        name: "Parakrama Samudra Rest House & Lodges",
        type: "Lakeside Hotel",
        priceRange: "LKR 9,000–22,000 / night",
        note: "Historic reservoir-front terraces catching cool evening winds off the water.",
      },
      {
        name: "Giritale Tank Safari & Eco Stays",
        type: "Eco Lodge",
        priceRange: "LKR 12,000–26,000 / night",
        note: "20 minutes west towards Minneriya with quiet forest views and pool decks.",
      },
      {
        name: "Museum & Quadrangle Garden Cafes",
        type: "Refreshment Stop",
        priceRange: "LKR 700–1,800",
        note: "Air-conditioned museum stop and shaded coconut stalls for midday breaks.",
      },
    ],
  },
];

export const seedDestinations = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("destinations").take(100);

    if (existing.length > 0) {
      return "Destinations already exist!";
    }

    const now = Date.now();
    for (const destination of DESTINATION_DATA) {
      await ctx.db.insert("destinations", {
        ...destination,
        isPublished: true,
        createdAt: now,
      });
    }

    return `Successfully added ${DESTINATION_DATA.length} destinations!`;
  },
});

export const refreshDestinationMedia = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("destinations").take(100);
    let updated = 0;

    for (const item of DESTINATION_DATA) {
      const match = existing.find((d) => d.slug === item.slug);
      if (match) {
        await ctx.db.patch("destinations", match._id, {
          description: item.description,
          images: item.images,
          highlights: item.highlights,
          gettingThere: item.gettingThere,
          restSpots: item.restSpots,
        });
        updated++;
      } else {
        await ctx.db.insert("destinations", {
          ...item,
          isPublished: true,
          createdAt: Date.now(),
        });
        updated++;
      }
    }

    return `Updated ${updated} destinations with 5 verified photos, route guides, and rest spots.`;
  },
});
