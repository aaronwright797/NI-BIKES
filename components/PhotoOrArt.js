"use client";

import { useState } from "react";
import { HeroArt } from "./Icons";

export default function PhotoOrArt({ photos, category, size, className = "" }) {
  const [failed, setFailed] = useState(false);
  const url = photos && photos.length > 0 ? photos[0] : null;
  if (!url || failed) return <HeroArt category={category} size={size} />;
  return <img src={url} alt="" className={"real-photo real-photo-" + size + " " + className} onError={() => setFailed(true)} />;
}
