"use client";

import { useState } from "react";
import { HeartIcon } from "./Icons";

export default function SaveButton({ label = "Save bike" }) {
  const [saved, setSaved] = useState(false);
  return (
    <button className={"save-btn save-btn-static" + (saved ? " save-btn-active" : "")} onClick={() => setSaved((s) => !s)}>
      <HeartIcon filled={saved} /> {saved ? "Saved" : label}
    </button>
  );
}
