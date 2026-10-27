"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { PublicVehicle } from "@/lib/vehicles/types";
import { VehiclePhoto } from "./VehiclePhoto";
import { StatusBadge } from "./VehicleCard";

function useSwipe(onSwipe: (dir: 1 | -1) => void) {
  const x0 = useRef<number | null>(null);
  return {
    onTouchStart: (e: React.TouchEvent) => { x0.current = e.touches[0].clientX; },
    onTouchEnd: (e: React.TouchEvent) => {
      if (x0.current === null) return;
      const dx = e.changedTouches[0].clientX - x0.current;
      if (Math.abs(dx) > 40) onSwipe(dx < 0 ? 1 : -1);
      x0.current = null;
    },
  };
}

export function Gallery({ vehicle, count }: { vehicle: PublicVehicle; count: number }) {
  const [i, setI] = useState(0);
  const [full, setFull] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const go = (d: number) => setI((x) => (x + d + count) % count);
  const swipe = useSwipe(go);

  useEffect(() => {
    if (!full) return;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFull(false);
      if (e.key === "ArrowRight") setI((x) => (x + 1) % count);
      if (e.key === "ArrowLeft") setI((x) => (x - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [full, count]);

  if (!count) return <div className="gallery"><div className="main"><VehiclePhoto vehicle={vehicle} sizes="100vw" /></div></div>;

  return (
    <div className="gallery">
      <div className="main" {...swipe}>
        <VehiclePhoto vehicle={vehicle} index={i} sizes="(max-width: 960px) 100vw, 700px" priority={i === 0} fit="contain" />
        {count > 1 && (
          <>
            <button className="nav prev" type="button" aria-label="Photo précédente" onClick={() => go(-1)}><ChevronLeft size={20} aria-hidden /></button>
            <button className="nav next" type="button" aria-label="Photo suivante" onClick={() => go(1)}><ChevronRight size={20} aria-hidden /></button>
          </>
        )}
        <span className="counter num" aria-live="polite">{i + 1} / {count}</span>
        <button className="full" type="button" onClick={() => setFull(true)}><Expand size={15} aria-hidden /> Plein écran</button>
        <StatusBadge vehicle={vehicle} />
        {vehicle.source === "demo" && <span className="demo-tag">Exemple</span>}
      </div>
      {count > 1 && (
        <div className="thumbs">
          {Array.from({ length: count }, (_, k) => (
            <button key={k} type="button" aria-label={`Afficher la photo ${k + 1}`} aria-current={k === i} onClick={() => setI(k)} style={{ position: "relative" }}>
              <VehiclePhoto vehicle={vehicle} index={k} sizes="120px" />
            </button>
          ))}
        </div>
      )}
      {full && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photos en plein écran" {...swipe}>
          <div style={{ position: "relative", width: "min(100%, 1400px)", height: "100%" }}>
            <VehiclePhoto vehicle={vehicle} index={i} sizes="100vw" fit="contain" />
          </div>
          <button ref={closeRef} className="icon-btn" type="button" aria-label="Fermer" onClick={() => setFull(false)}><X size={20} aria-hidden /></button>
          {count > 1 && (
            <>
              <button className="nav prev" type="button" aria-label="Photo précédente" onClick={() => go(-1)}><ChevronLeft size={22} aria-hidden /></button>
              <button className="nav next" type="button" aria-label="Photo suivante" onClick={() => go(1)}><ChevronRight size={22} aria-hidden /></button>
            </>
          )}
          <span className="counter num">{i + 1} / {count}</span>
        </div>
      )}
    </div>
  );
}
