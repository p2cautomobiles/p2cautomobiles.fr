import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export type Attachment = { filename: string; content: Buffer; contentType: string };
export type OutgoingEmail = { subject: string; text: string; html: string; replyTo?: string; attachments: Attachment[] };
export type SendResult = { ok: true } | { ok: false; reason: "not_configured" | "failed" };

/**
 * Envoi des demandes au garage.
 * - LEADS_TRANSPORT=resend : envoi réel via l'API Resend (RESEND_API_KEY, LEADS_FROM_EMAIL, LEADS_TO_EMAIL).
 * - LEADS_TRANSPORT=file : développement uniquement, écrit la demande dans .leads/ pour pouvoir tester.
 * - Sinon : non configuré. Le formulaire l'indique au visiteur et ne prétend jamais avoir envoyé.
 */
export function leadsTransport(): "resend" | "file" | "none" {
  const t = process.env.LEADS_TRANSPORT;
  if (t === "resend" && process.env.RESEND_API_KEY && process.env.LEADS_FROM_EMAIL && process.env.LEADS_TO_EMAIL) return "resend";
  if (t === "file" && process.env.NODE_ENV !== "production") return "file";
  return "none";
}

export async function sendLeadEmail(mail: OutgoingEmail): Promise<SendResult> {
  const transport = leadsTransport();
  if (transport === "none") return { ok: false, reason: "not_configured" };
  try {
    if (transport === "file") {
      const dir = path.join(process.cwd(), ".leads", `${new Date().toISOString().replace(/[:.]/g, "-")}-${Math.random().toString(36).slice(2, 8)}`);
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, "message.txt"), `Objet : ${mail.subject}\nRépondre à : ${mail.replyTo ?? "-"}\n\n${mail.text}\n`);
      await Promise.all(mail.attachments.map((a) => writeFile(path.join(dir, a.filename), a.content)));
      return { ok: true };
    }
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.LEADS_FROM_EMAIL,
        to: process.env.LEADS_TO_EMAIL!.split(",").map((s) => s.trim()),
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
        reply_to: mail.replyTo,
        attachments: mail.attachments.map((a) => ({ filename: a.filename, content: a.content.toString("base64") })),
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      console.error("[leads] Échec de l'envoi Resend", res.status, (await res.text()).slice(0, 300));
      return { ok: false, reason: "failed" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[leads] Échec de l'envoi", err instanceof Error ? err.message : err);
    return { ok: false, reason: "failed" };
  }
}
