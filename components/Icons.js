export function BikeMark({ category, size = 48 }) {
  const common = { width: size, height: size, viewBox: "0 0 64 64", fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (category) {
    case "road":
      return (<svg {...common}><circle cx="16" cy="46" r="9" /><circle cx="48" cy="46" r="9" /><path d="M16 46 L27 30 H41 L48 46" /><path d="M27 30 L22 20 H30" /><path d="M41 30 L46 22 L53 24" /><path d="M14 22 H24" /></svg>);
    case "race":
      return (<svg {...common}><circle cx="14" cy="46" r="8" /><circle cx="50" cy="46" r="8" /><path d="M14 46 L30 26 H44 L50 46" /><path d="M30 26 L34 16 H46" /><path d="M20 30 Q28 20 40 22" /><path d="M8 44 L14 40" /></svg>);
    case "motocross":
      return (<svg {...common}><circle cx="15" cy="45" r="8.5" strokeDasharray="1.5 3.2" /><circle cx="47" cy="45" r="8.5" strokeDasharray="1.5 3.2" /><path d="M15 45 L26 27 H40 L47 45" /><path d="M26 27 L20 16 H28" /><path d="M40 27 L44 18" /><path d="M12 24 L22 20" /></svg>);
    case "enduro":
      return (<svg {...common}><circle cx="15" cy="45" r="8.5" strokeDasharray="1.5 3.2" /><circle cx="47" cy="45" r="8.5" strokeDasharray="1.5 3.2" /><path d="M15 45 L26 28 H40 L47 45" /><path d="M26 28 L21 18 H29" /><path d="M40 28 L45 20" /><rect x="42" y="14" width="8" height="5" rx="1" /></svg>);
    case "trials":
      return (<svg {...common}><circle cx="16" cy="45" r="8" strokeDasharray="1.5 3" /><circle cx="46" cy="45" r="8" strokeDasharray="1.5 3" /><path d="M16 45 L25 26 H38 L46 45" /><path d="M25 26 L30 17" /><path d="M38 26 L42 20" /><path d="M25 26 V33" /></svg>);
    default:
      return null;
  }
}

export function HeartIcon({ filled, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
      <path d="M12 21s-7.5-4.6-10-9.1C0.3 8.4 2 4.5 5.8 4c2.1-0.3 4.1 0.8 6.2 3.3C14.1 4.8 16.1 3.7 18.2 4c3.8 0.5 5.5 4.4 3.8 7.9C19.5 16.4 12 21 12 21z" />
    </svg>
  );
}

export function StatIcon({ type, size = 18 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (type) {
    case "gearbox":
      return (<svg {...common}><path d="M6 4v16M18 4v16M6 12h12" /><circle cx="12" cy="4" r="1.4" fill="currentColor" stroke="none" /></svg>);
    case "mileage":
      return (<svg {...common}><path d="M4 16a8 8 0 0 1 16 0" /><path d="M12 16 L16.2 10.4" /><circle cx="12" cy="16" r="1.4" fill="currentColor" stroke="none" /></svg>);
    case "engine":
      return (<svg {...common}><rect x="4" y="10" width="12" height="8" rx="1.2" /><path d="M16 13h4v4h-4" /><path d="M7.5 10V7M11.5 10V7" /></svg>);
    case "fuel":
      return (<svg {...common}><path d="M6 20V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v14" /><path d="M5 20h9" /><path d="M15 9h1.5a2 2 0 0 1 2 2v5.5a1.4 1.4 0 0 0 2.8 0V9.5L19 7" /></svg>);
    default:
      return null;
  }
}

export function HeroArt({ category, size = "lg" }) {
  const iconSize = size === "xl" ? 96 : size === "lg" ? 52 : 34;
  return (
    <div className={"hero-art hero-art-" + size + " hero-art-" + category}>
      <BikeMark category={category} size={iconSize} />
    </div>
  );
}
