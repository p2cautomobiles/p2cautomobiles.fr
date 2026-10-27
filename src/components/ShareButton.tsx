"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

export function ShareButton({ title }: { title: string }) {
  const [msg, setMsg] = useState<string | null>(null);
  const flash = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(null), 2600);
  };
  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Partage annulé : on propose la copie du lien.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      flash("Lien de l'annonce copié");
    } catch {
      flash(`Copiez ce lien : ${url}`);
    }
  };
  return (
    <>
      <button type="button" onClick={share}><Share2 aria-hidden /> Partager cette annonce</button>
      {msg && <div className="toast" role="status">{msg}</div>}
    </>
  );
}
