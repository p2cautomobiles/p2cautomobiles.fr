/**
 * Protections anti-abus, sans service tiers :
 * - champ piège invisible (`website`) que seuls les robots remplissent ;
 * - délai minimal entre l'affichage du formulaire et l'envoi ;
 * - limite d'envois par adresse IP.
 * La limite est gardée en mémoire : elle repart à zéro au redémarrage et n'est pas partagée entre serveurs.
 * Suffisant pour un garage ; à remplacer par un stockage partagé (phase 6) si besoin.
 */

export const MIN_FILL_MS = 3000;

export function looksLikeBot(fields: { website?: unknown; startedAt?: unknown }, now = Date.now()): boolean {
  if (typeof fields.website === "string" && fields.website.trim() !== "") return true;
  const started = Number(fields.startedAt);
  if (!Number.isFinite(started) || started <= 0) return true;
  return now - started < MIN_FILL_MS;
}

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, opts = { max: 5, windowMs: 10 * 60_000 }, now = Date.now()): boolean {
  if (buckets.size > 5000) for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    return true;
  }
  if (b.count >= opts.max) return false;
  b.count += 1;
  return true;
}
