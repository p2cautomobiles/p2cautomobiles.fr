"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Logo } from "./Logo";
import { GARAGE } from "@/config/garage";

export const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/vehicules", label: "Nos véhicules" },
  { href: "/qui-sommes-nous", label: "Qui sommes-nous ?" },
  { href: "/services", label: "Nos services" },
  { href: "/reprise", label: "Reprise de mon véhicule" },
] as const;

function isCurrent(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [lastPath, setLastPath] = useState(pathname);

  // Referme le menu quand on change de page.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="site">
        <div className="wrap">
          <Link className="logo" href="/" aria-label="P2C Automobiles, accueil">
            <Logo priority />
          </Link>
          <nav className="main" aria-label="Navigation principale">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} aria-current={isCurrent(pathname, n.href) ? "page" : undefined}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="head-actions">
            <Link className="btn btn-primary" href="/contact">Nous contacter</Link>
          </div>
          <button className="menu-btn" type="button" aria-label="Ouvrir le menu" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(true)}>
            <Menu size={22} aria-hidden />
          </button>
        </div>
      </header>

      <div className={`mobile-menu${open ? " open" : ""}`} id="mobile-menu" aria-hidden={!open} inert={!open} onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
        <div className="panel" role="dialog" aria-modal="true" aria-label="Menu">
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
            <button ref={closeRef} className="icon-btn" type="button" aria-label="Fermer le menu" onClick={() => setOpen(false)}>
              <X size={20} aria-hidden />
            </button>
          </div>
          <nav aria-label="Navigation mobile" style={{ display: "flex", flexDirection: "column" }}>
            {NAV.map((n) => (
              <Link key={n.href} className="nav" href={n.href} aria-current={isCurrent(pathname, n.href) ? "page" : undefined}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div style={{ marginTop: "auto", display: "grid", gap: 10, paddingTop: 24 }}>
            <Link className="btn btn-primary" href="/contact">Nous contacter</Link>
            <a className="btn btn-secondary" href={`tel:${GARAGE.phoneTel}`}>
              <Phone aria-hidden /> {GARAGE.phone}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
