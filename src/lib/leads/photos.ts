import { PHOTO_RULES } from "./schema";

/** Vérifie le contenu réel du fichier (signature), pas seulement le type annoncé par le navigateur. */
export function sniffImageType(buf: Uint8Array): "image/jpeg" | "image/png" | "image/webp" | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((b, i) => buf[i] === b)) return "image/png";
  if (buf.length >= 12 && String.fromCharCode(...buf.slice(0, 4)) === "RIFF" && String.fromCharCode(...buf.slice(8, 12)) === "WEBP") return "image/webp";
  return null;
}

const EXT = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" } as const;

export async function readPhotos(files: File[]): Promise<{ ok: true; photos: { filename: string; content: Buffer; contentType: string }[] } | { ok: false; error: string }> {
  const real = files.filter((f) => f.size > 0);
  if (real.length > PHOTO_RULES.maxCount) return { ok: false, error: `${PHOTO_RULES.maxCount} photos maximum.` };
  const photos = [];
  for (const [i, f] of real.entries()) {
    if (f.size > PHOTO_RULES.maxBytes) return { ok: false, error: "Une photo est trop lourde. Réessayez avec une photo plus petite." };
    const content = Buffer.from(await f.arrayBuffer());
    const type = sniffImageType(content);
    if (!type) return { ok: false, error: "Seules les photos JPEG, PNG ou WebP sont acceptées." };
    photos.push({ filename: `photo-${i + 1}.${EXT[type]}`, content, contentType: type });
  }
  return { ok: true, photos };
}
