/* ---------------------------------------------------------
   NI Bikes — shared static reference data & helpers.
   Listings and dealers now come from Supabase — see lib/listings.js.
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

export const gbp = (n) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
export const milesText = (n) => (n === 0 ? "Delivery miles only" : n.toLocaleString() + " miles");
export const milesShort = (n) => (n === 0 ? "New" : n.toLocaleString());
export const engineShort = (engine) => {
  const m = engine && engine.match(/^(\d+)\s*cc/i);
  return m ? m[1] + "cc" : (engine || "—");
};
