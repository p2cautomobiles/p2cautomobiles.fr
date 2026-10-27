/** Illustration animée de l'accueil : le vendeur remet les clés d'une voiture prête. Animations en CSS (globals.css). */
const BODY = "M48 152 L48 126 Q52 110 78 105 L128 98 Q158 68 192 63 L262 63 Q288 66 304 98 L344 106 Q362 110 364 128 L364 152 Z";
const TAGS = ["Contrôle technique", "Révision", "Nettoyage complet", "Garantie incluse"];
const SKIN = "#FAD3BB";

function Person({ cx, dir, top, pants, longHair, reach, armClass, badge }: { cx: number; dir: 1 | -1; top: string; pants: string; longHair?: boolean; reach: number; armClass?: string; badge?: boolean }) {
  const sx = cx + dir * 22;
  const hx = cx - dir * 26;
  return (
    <g>
      {longHair && <rect x={cx - 27} y={160} width={54} height={56} rx={22} fill="#171717" />}
      <rect x={cx - 19} y={318} width={16} height={92} rx={8} fill={pants} />
      <rect x={cx + 3} y={318} width={16} height={92} rx={8} fill={pants} />
      <rect x={cx - 24} y={404} width={23} height={11} rx={5.5} fill="#171717" />
      <rect x={cx + 1} y={404} width={23} height={11} rx={5.5} fill="#171717" />
      <line x1={hx} y1={236} x2={hx - dir * 6} y2={312} stroke={top} strokeWidth={16} strokeLinecap="round" />
      <circle cx={hx - dir * 6} cy={318} r={8.5} fill={SKIN} />
      <rect x={cx - 7} y={196} width={14} height={22} rx={5} fill={SKIN} />
      <rect x={cx - 32} y={212} width={64} height={118} rx={28} fill={top} />
      {badge && <rect x={cx + dir * 8 - 5} y={236} width={10} height={10} rx={3} fill="#F36B21" />}
      <circle cx={cx} cy={178} r={24} fill={SKIN} />
      <path d={`M${cx - 25} 176 A25 25 0 0 1 ${cx + 25} 176 Q${cx + dir * 4} 160 ${cx - 25} 176Z`} fill="#171717" />
      <circle cx={cx + dir * 10} cy={180} r={2.4} fill="#171717" />
      <path d={`M${cx + dir * 4} 190 q${dir * 6} 5 ${dir * 12} 0`} stroke="#171717" strokeWidth={2.2} fill="none" strokeLinecap="round" />
      <g className={armClass}>
        <line x1={sx} y1={236} x2={reach} y2={276} stroke={top} strokeWidth={16} strokeLinecap="round" />
        <circle cx={reach + dir * 4} cy={279} r={9} fill={SKIN} />
      </g>
    </g>
  );
}

export function HeroArt() {
  return (
    <svg className="scene" viewBox="0 0 640 460" role="img" aria-label="Un vendeur de P2C Automobiles remet les clés d'une voiture contrôlée, révisée, nettoyée et garantie à une cliente.">
      <circle cx="470" cy="160" r="120" fill="#FFFFFF" opacity=".7" />
      <line x1="0" y1="415" x2="640" y2="415" stroke="#171717" strokeWidth="2" opacity=".12" />
      <g transform="translate(256 238)">
        <defs><clipPath id="hero-car-clip"><path d={BODY} /></clipPath></defs>
        <ellipse cx="206" cy="178" rx="168" ry="9" fill="#171717" opacity=".10" />
        <path d={BODY} fill="#FFFFFF" stroke="#171717" strokeWidth="3" strokeLinejoin="round" />
        <g clipPath="url(#hero-car-clip)"><rect className="shine" x="-40" y="40" width="38" height="140" fill="#F36B21" opacity=".16" /></g>
        <path d="M140 100 Q164 76 194 72 L230 72 L230 100 Z M240 72 L262 72 Q280 75 292 100 L240 100 Z" fill="#171717" />
        <line x1="66" y1="118" x2="350" y2="118" stroke="#F36B21" strokeWidth="5" strokeLinecap="round" />
        <line x1="232" y1="102" x2="232" y2="146" stroke="#171717" strokeWidth="2" opacity=".25" />
        <rect x="248" y="108" width="16" height="4" rx="2" fill="#171717" opacity=".5" />
        <rect x="350" y="112" width="12" height="8" rx="3" fill="#F36B21" />
        {[118, 304].map((x) => (
          <g key={x}><circle cx={x} cy="152" r="26" fill="#171717" /><circle cx={x} cy="152" r="11" fill="#F3F4F6" /></g>
        ))}
      </g>
      <g transform="translate(462 236)">
        {TAGS.map((t, i) => (
          <g key={t} className={`tag t${i + 1}`}>
            <rect x="-98" y="-19" width="196" height="38" rx="19" fill="#171717" />
            <circle cx="-74" cy="0" r="11" fill="#F36B21" />
            <path d="M-79 0 l3.5 3.5 l6.5 -7" stroke="#171717" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <text x="-56" y="5.5" fontFamily="var(--font-figtree), sans-serif" fontWeight="700" fontSize="15" fill="#FFFFFF">{t}</text>
          </g>
        ))}
      </g>
      <Person cx={108} dir={1} top="#F36B21" pants="#171717" longHair reach={168} armClass="client-arm" />
      <Person cx={250} dir={-1} top="#171717" pants="#3A3A3A" reach={206} badge />
      <g className="key">
        <g className="key-swing">
          <circle cx="202" cy="290" r="6.5" fill="none" stroke="#171717" strokeWidth="2.6" />
          <rect x="196" y="296" width="12" height="17" rx="4" fill="#171717" />
          <rect x="199.5" y="312" width="5" height="12" rx="1.5" fill="#9CA3AF" />
          <circle cx="202" cy="302" r="2.2" fill="#F36B21" />
        </g>
      </g>
      <g className="bubble">
        <rect x="150" y="92" width="140" height="38" rx="19" fill="#FFFFFF" />
        <path d="M232 126 L246 142 L218 128Z" fill="#FFFFFF" />
        <text x="220" y="116" textAnchor="middle" fontFamily="var(--font-figtree), sans-serif" fontWeight="700" fontSize="15" fill="#171717">Elle est prête !</text>
      </g>
      <g transform="translate(64 112)">
        <path className="heart" d="M12 22 C12 22 0 14.5 0 7 C0 2.5 3.5 0 7 0 C9.5 0 11.2 1.5 12 3.2 C12.8 1.5 14.5 0 17 0 C20.5 0 24 2.5 24 7 C24 14.5 12 22 12 22Z" fill="#F36B21" />
      </g>
    </svg>
  );
}
