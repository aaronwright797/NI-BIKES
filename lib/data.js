/* ---------------------------------------------------------
   NI Bikes — shared data & helpers
   Ported from the NIBikes.jsx prototype. Seed data only for
   now; Step 2 replaces this with reads from Supabase.
--------------------------------------------------------- */

export const CATEGORIES = [
  { id: "road", label: "Road", blurb: "Tarmac-bred, mile-eating machines" },
  { id: "race", label: "Race", blurb: "Track-only, stripped for speed" },
  { id: "motocross", label: "Motocross", blurb: "Dirt, jumps, no lights required" },
  { id: "enduro", label: "Enduro", blurb: "Street-legal off-road all-rounders" },
  { id: "trials", label: "Trials", blurb: "No seat, no fear, all balance" },
];

export const OFFROAD = ["motocross", "enduro", "trials"];
export const SERIOUS = ["race", "motocross", "enduro", "trials"];

export const STYLE_TAGS = ["Sportbikes", "Naked", "Adventure", "Cruiser", "Supermoto", "Classic", "125cc", "Electric"];

export const PRICE_OPTIONS = [2000, 3000, 4000, 5000, 6000, 8000, 10000, 15000, 20000];

export const NI_TOWNS = ["Belfast", "Lisburn", "Newtownabbey", "Bangor", "Ballymena", "Coleraine", "Derry", "Newry"];

export const DEALER_META = {
  "Lagan Motorcycles": {
    town: "Belfast", rating: 4.9, address: "142 Boucher Road, Belfast, BT12 6RE",
    phone: "028 9024 1187", email: "sales@laganmotorcycles.co.uk", hours: "Mon–Fri 9am–5:30pm, Sat 9am–1pm",
    bio: "Official Triumph dealer serving Belfast and the wider Lagan Valley since 2008. Full workshop, finance, and part-exchange on site.",
  },
  "Antrim Off-Road Centre": {
    town: "Antrim", rating: 4.7, address: "18 Dunadry Road, Antrim, BT41 2QN",
    phone: "028 9446 5523", email: "info@antrimoffroad.co.uk", hours: "Mon–Fri 9am–5pm, Sat 9am–4pm",
    bio: "Motocross and enduro specialists — KTM, Husqvarna and GasGas stock, plus servicing, tyres and race-day support.",
  },
  "Belfast Motorcycle Centre": {
    town: "Belfast", rating: 4.8, address: "76 Donegall Road, Belfast, BT12 5JN",
    phone: "028 9032 8814", email: "hello@belfastmotorcyclecentre.co.uk", hours: "Mon–Sat 9am–5:30pm",
    bio: "Multi-franchise dealer covering Kawasaki and Suzuki, with a strong range of learner-legal and A2-licence bikes.",
  },
  "Bangor Superbikes": {
    town: "Bangor", rating: 5.0, address: "9 Central Avenue, Bangor, BT20 5HS",
    phone: "028 9127 3390", email: "sales@bangorsuperbikes.co.uk", hours: "Tue–Sat 9.30am–5.30pm",
    bio: "Performance and sportsbike specialists — Ducati and Aprilia agents, with in-house finance and PX on all trade-ins.",
  },
  "Ballymena BMW Motorrad": {
    town: "Ballymena", rating: 4.9, address: "212 Galgorm Road, Ballymena, BT42 1AB",
    phone: "028 2565 2201", email: "motorrad@ballymenabmw.co.uk", hours: "Mon–Fri 9am–6pm, Sat 9am–5pm",
    bio: "Northern Ireland's official BMW Motorrad dealer — new and approved-used GS, R and S ranges, servicing and genuine parts.",
  },
  "Omagh Trail & Enduro": {
    town: "Omagh", rating: 4.6, address: "5 Dromore Road, Omagh, BT78 1QG",
    phone: "028 8224 6675", email: "info@omaghtrailenduro.co.uk", hours: "Mon–Fri 9am–5pm, Sat 10am–2pm",
    bio: "Family-run trail and enduro specialists covering the west of the province — Husqvarna and Beta, plus green-lane advice and trailer hire.",
  },
};

// Freely-licensed (CC-BY-SA / CC0) photos from Wikimedia Commons, used as category & hero imagery.
export const CATEGORY_PHOTOS = {
  road: "https://commons.wikimedia.org/wiki/Special:FilePath/BMW%20R%201250%20GS%20(1).jpg?width=900",
  race: "https://commons.wikimedia.org/wiki/Special:FilePath/2018%20Yamaha%20YZF-R6-0.jpg?width=900",
  motocross: "https://commons.wikimedia.org/wiki/Special:FilePath/Motocross-Kleinhau.JPG?width=900",
  enduro: "https://commons.wikimedia.org/wiki/Special:FilePath/Hard%20Enduro.jpg?width=900",
  trials: "https://commons.wikimedia.org/wiki/Special:FilePath/Beta%20trial%20motorcycle.jpg?width=900",
};
export const HERO_PHOTO = "https://commons.wikimedia.org/wiki/Special:FilePath/2007%20BMW%20F800ST%20motorcycle%20at%20sunset.jpg?width=1800";

export function categoryMeta(id) {
  if (id === "all") return { label: "All bikes", blurb: "Every category, newest first." };
  if (id === "offroad") return { label: "Off-road ready", blurb: "Motocross, enduro and trials in one place." };
  return CATEGORIES.find((c) => c.id === id);
}

export function slugify(...parts) {
  return parts
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const RAW_SEED_LISTINGS = [
  {
    id: 1, title: "Triumph Speed Twin 900", make: "Triumph", category: "road", styleTags: ["Classic", "Naked"],
    price: 6450, year: 2021, mileage: 8200, location: "Belfast", engine: "900cc parallel twin", fuel: "Petrol",
    transmission: "6-speed", owners: 2, mot: "Valid until Apr 2027", registration: "RXI 4471",
    desc: "Well-kept commuter and weekend tourer. Full service history, new chain and sprockets fitted last month. Comes with a genuine Triumph rack and screen.",
    sellerType: "dealer", sellerName: "Lagan Motorcycles", verified: true,
    checks: { registration: true, mot: true, finance: true, serviceHistory: true, hpi: true },
    photos: [],
  },
  {
    id: 2, title: "Yamaha YZF-R6", make: "Yamaha", category: "race", styleTags: ["Sportbikes"],
    price: 5200, year: 2018, mileage: 14300, location: "Lisburn", engine: "599cc inline-four", fuel: "Petrol",
    transmission: "6-speed", owners: 3, mot: "Not road registered", registration: "Track bike — no plate",
    desc: "Track-prepped R6 with quick-shifter and Akrapovic exhaust. Sold with spare bodywork and paddock stands. Not road registered.",
    sellerType: "private", sellerName: "Private seller", verified: false,
    checks: { registration: true, mot: true, finance: false, serviceHistory: false, hpi: false },
    photos: [CATEGORY_PHOTOS.race],
  },
  {
    id: 3, title: "KTM 250 SX-F", make: "KTM", category: "motocross", styleTags: [],
    price: 4800, year: 2022, mileage: 0, location: "Antrim", engine: "250cc single, 4-stroke", fuel: "Petrol",
    transmission: "5-speed", owners: 1, mot: "Off-road only", registration: "Not road registered",
    desc: "Low hours, one owner, garage kept. Fresh top-end rebuild, new plastics and graphics fitted this season.",
    sellerType: "dealer", sellerName: "Antrim Off-Road Centre", verified: true,
    checks: { registration: false, mot: false, finance: true, serviceHistory: true, hpi: false },
    photos: [],
  },
  {
    id: 4, title: "Honda CRF450L", make: "Honda", category: "enduro", styleTags: ["Adventure"],
    price: 5900, year: 2020, mileage: 3100, location: "Newtownabbey", engine: "449cc single, 4-stroke", fuel: "Petrol",
    transmission: "6-speed", owners: 2, mot: "Valid until Jun 2027", registration: "MEZ 8821",
    desc: "Road-registered enduro, MOT until next spring. Handguards, bash plate and rally roadbook holder included.",
    sellerType: "private", sellerName: "Private seller", verified: false,
    checks: { registration: true, mot: true, finance: false, serviceHistory: true, hpi: false },
    photos: [],
  },
  {
    id: 5, title: "Gas Gas TXT 300", make: "Gas Gas", category: "trials", styleTags: [],
    price: 3600, year: 2019, mileage: 0, location: "Carrickfergus", engine: "300cc single, 2-stroke", fuel: "Petrol",
    transmission: "5-speed", owners: 2, mot: "Off-road only", registration: "Not road registered",
    desc: "Club-level trials bike, recently rebuilt clutch. Light, agile, ready for the next event.",
    sellerType: "private", sellerName: "Private seller", verified: false,
    checks: { registration: false, mot: false, finance: false, serviceHistory: true, hpi: false },
    photos: [],
  },
  {
    id: 6, title: "Kawasaki Ninja 650", make: "Kawasaki", category: "road", styleTags: ["Sportbikes"],
    price: 5300, year: 2022, mileage: 4100, location: "Belfast", engine: "649cc parallel twin", fuel: "Petrol",
    transmission: "6-speed", owners: 1, mot: "Valid until Feb 2027", registration: "OIB 2290",
    desc: "One owner from new, dealer serviced throughout. Perfect first big bike — light, torquey and easy to live with.",
    sellerType: "dealer", sellerName: "Belfast Motorcycle Centre", verified: true,
    checks: { registration: true, mot: true, finance: true, serviceHistory: true, hpi: true },
    photos: [],
  },
  {
    id: 7, title: "Ducati Panigale V2", make: "Ducati", category: "race", styleTags: ["Sportbikes"],
    price: 11900, year: 2022, mileage: 2400, location: "Bangor", engine: "955cc V-twin", fuel: "Petrol",
    transmission: "6-speed", owners: 1, mot: "Valid until Sep 2027", registration: "DPV 955",
    desc: "Immaculate condition, quick-shifter, Termignoni exhaust. Track days only, never dropped.",
    sellerType: "dealer", sellerName: "Bangor Superbikes", verified: true,
    checks: { registration: true, mot: true, finance: true, serviceHistory: true, hpi: true },
    photos: [],
  },
  {
    id: 8, title: "BMW R1250GS", make: "BMW", category: "road", styleTags: ["Adventure"],
    price: 12500, year: 2021, mileage: 11800, location: "Ballymena", engine: "1254cc boxer twin", fuel: "Petrol",
    transmission: "6-speed", owners: 1, mot: "Valid until Nov 2026", registration: "BGS 1250",
    desc: "Full luggage set, heated grips, adaptive headlight. Serviced at BMW dealer throughout.",
    sellerType: "dealer", sellerName: "Ballymena BMW Motorrad", verified: true,
    checks: { registration: true, mot: true, finance: true, serviceHistory: true, hpi: true },
    photos: [CATEGORY_PHOTOS.road],
  },
  {
    id: 9, title: "Sherco 300 Factory", make: "Sherco", category: "trials", styleTags: [],
    price: 4200, year: 2021, mileage: 0, location: "Coleraine", engine: "300cc single, 2-stroke", fuel: "Petrol",
    transmission: "5-speed", owners: 1, mot: "Off-road only", registration: "Not road registered",
    desc: "Factory edition, carbon guards, barely marked. Selling due to injury, reluctant sale.",
    sellerType: "private", sellerName: "Private seller", verified: false,
    checks: { registration: false, mot: false, finance: false, serviceHistory: false, hpi: false },
    photos: [],
  },
  {
    id: 10, title: "Kawasaki KX250", make: "Kawasaki", category: "motocross", styleTags: [],
    price: 4100, year: 2021, mileage: 0, location: "Derry", engine: "249cc single, 4-stroke", fuel: "Petrol",
    transmission: "5-speed", owners: 1, mot: "Off-road only", registration: "Not road registered",
    desc: "Fresh piston and rings, new chain and sprockets. Ready to race this weekend.",
    sellerType: "private", sellerName: "Private seller", verified: false,
    checks: { registration: false, mot: false, finance: false, serviceHistory: true, hpi: false },
    photos: [],
  },
  {
    id: 11, title: "Yamaha MT-07", make: "Yamaha", category: "road", styleTags: ["Naked"],
    price: 5650, year: 2021, mileage: 8000, location: "Newry", engine: "689cc parallel twin", fuel: "Petrol",
    transmission: "6-speed", owners: 1, mot: "Valid until May 2027", registration: "YMT 689",
    desc: "Punchy, lightweight naked bike — brilliant first big bike or B-road weapon. Recent service, new tyres front and rear.",
    sellerType: "private", sellerName: "Private seller", verified: false,
    checks: { registration: true, mot: true, finance: false, serviceHistory: true, hpi: false },
    photos: [],
  },
  {
    id: 12, title: "Husqvarna FE 501", make: "Husqvarna", category: "enduro", styleTags: ["Adventure"],
    price: 6700, year: 2022, mileage: 1900, location: "Omagh", engine: "510cc single, 4-stroke", fuel: "Petrol",
    transmission: "6-speed", owners: 1, mot: "Valid until Jul 2027", registration: "HFE 501",
    desc: "Road legal, recent service, Rekluse clutch fitted. Great all-round trail and green-lane bike.",
    sellerType: "dealer", sellerName: "Omagh Trail & Enduro", verified: true,
    checks: { registration: true, mot: true, finance: true, serviceHistory: true, hpi: true },
    photos: [],
  },
];

export const SEED_LISTINGS = RAW_SEED_LISTINGS.map((l) => ({
  ...l,
  slug: slugify(l.make, l.title.replace(l.make, ""), l.year, l.location),
}));

export function getListingBySlug(slug) {
  return SEED_LISTINGS.find((l) => l.slug === slug) || null;
}

export function getAllDealers() {
  const map = new Map();
  SEED_LISTINGS.forEach((l) => {
    if (l.sellerType !== "dealer") return;
    if (!map.has(l.sellerName)) map.set(l.sellerName, { name: l.sellerName, count: 0 });
    map.get(l.sellerName).count += 1;
  });
  return [...map.values()]
    .map((d) => ({
      ...d,
      slug: slugify(d.name),
      ...(DEALER_META[d.name] || {
        town: "Northern Ireland", rating: 4.8, address: "Address not yet added",
        phone: "Not yet added", email: "Not yet added", hours: "Not yet added",
        bio: "This dealer hasn't added a profile description yet.",
      }),
    }))
    .sort((a, b) => b.count - a.count);
}

export function getDealerBySlug(slug) {
  return getAllDealers().find((d) => d.slug === slug) || null;
}

export function getDealerStock(dealerName) {
  return SEED_LISTINGS.filter((l) => l.sellerType === "dealer" && l.sellerName === dealerName);
}

export const gbp = (n) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
export const milesText = (n) => (n === 0 ? "Delivery miles only" : n.toLocaleString() + " miles");
export const milesShort = (n) => (n === 0 ? "New" : n.toLocaleString());
export const engineShort = (engine) => {
  const m = engine && engine.match(/^(\d+)\s*cc/i);
  return m ? m[1] + "cc" : (engine || "—");
};
