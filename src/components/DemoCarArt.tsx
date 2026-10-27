import type { Vehicle } from "@/lib/vehicles/types";

/** Silhouette dessinée pour les véhicules de démonstration. Jamais utilisée pour un vrai véhicule. */
const SHAPES = {
  citadine: { d: "M48 152 L48 126 Q52 110 78 105 L128 98 Q158 68 192 63 L262 63 Q288 66 304 98 L344 106 Q362 110 364 128 L364 152 Z", win: "M140 100 Q164 76 194 72 L230 72 L230 100 Z M240 72 L262 72 Q280 75 292 100 L240 100 Z", w: [118, 304] },
  suv: { d: "M42 154 L42 118 Q46 100 74 96 L114 91 Q140 56 172 52 L298 52 Q320 54 332 90 L352 96 Q366 100 366 120 L366 154 Z", win: "M126 90 Q148 62 176 60 L232 60 L232 90 Z M242 60 L294 60 Q312 62 320 90 L242 90 Z", w: [114, 308] },
  compacte: { d: "M40 152 L40 124 Q44 108 72 103 L122 96 Q154 64 190 60 L270 60 Q296 63 312 96 L352 104 Q368 108 368 128 L368 152 Z", win: "M134 96 Q160 70 192 68 L236 68 L236 96 Z M246 68 L270 68 Q290 71 302 96 L246 96 Z", w: [112, 310] },
  berline: { d: "M30 150 L30 128 Q34 114 62 110 L118 102 Q152 70 188 66 L248 66 Q276 68 298 98 L354 106 Q372 110 372 128 L372 150 Z", win: "M130 101 Q158 76 190 74 L226 74 L226 101 Z M236 74 L248 74 Q270 76 286 101 L236 101 Z", w: [104, 316] },
  break: { d: "M36 152 L36 122 Q40 106 68 102 L118 95 Q150 64 186 60 L330 60 Q346 62 352 92 L360 100 Q370 106 370 126 L370 152 Z", win: "M130 95 Q156 70 188 68 L236 68 L236 95 Z M246 68 L326 68 Q338 70 342 95 L246 95 Z", w: [110, 314] },
} as const;

const SCENES = [
  { bg: ["#F3F4F6", "#E2E4E8"], floor: "#C9CDD3", label: "Profil", flip: false, zoom: 1 },
  { bg: ["#F7F1E8", "#E9DCC9"], floor: "#CDBCA5", label: "Extérieur", flip: true, zoom: 1 },
  { bg: ["#EEF0F3", "#D5DAE1"], floor: "#B6C0CC", label: "Profil", flip: false, zoom: 1.12 },
  { bg: ["#2A2A2A", "#171717"], floor: "#0B0B0C", label: "Studio", flip: true, zoom: 1 },
  { bg: ["#F1EEE9", "#DED8CE"], floor: "#BFB6A8", label: "Extérieur", flip: false, zoom: 1 },
];
export const DEMO_PHOTO_COUNT = SCENES.length;

export function DemoCarArt({ vehicle, scene = 0, label }: { vehicle: Vehicle; scene?: number; label: string }) {
  const art = vehicle.demoArt ?? { paint: "#9CA3AF", shape: "citadine" as const };
  const s = SCENES[scene % SCENES.length];
  const b = SHAPES[art.shape];
  const id = `${vehicle.externalId}-${scene}`;
  const text = s.bg[0] === "#2A2A2A" ? "#FFFFFF" : "#171717";
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={label} preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }}>
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={s.bg[0]} />
          <stop offset="1" stopColor={s.bg[1]} />
        </linearGradient>
        <linearGradient id={`sh-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".28" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#bg-${id})`} />
      <rect y="205" width="400" height="95" fill={s.floor} opacity=".35" />
      <g transform={`translate(200 168) scale(${s.zoom * 0.92}) translate(-200 -110)`}>
        <g transform={s.flip ? "translate(400 0) scale(-1 1)" : undefined}>
          <ellipse cx="206" cy="178" rx="170" ry="10" fill="#000" opacity=".18" />
          <path d={b.d} fill={art.paint} />
          <path d={b.d} fill={`url(#sh-${id})`} />
          <path d={b.win} fill="#22262C" opacity=".88" />
          {b.w.map((x) => (
            <g key={x}>
              <circle cx={x} cy="152" r="25" fill="#1B1B1D" />
              <circle cx={x} cy="152" r="14" fill="#9EA3AA" />
              <circle cx={x} cy="152" r="5" fill="#45484D" />
            </g>
          ))}
        </g>
      </g>
      <text x="200" y="20" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill={text} opacity=".5">
        Visuel d&apos;exemple · {s.label}
      </text>
    </svg>
  );
}
