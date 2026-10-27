const nf = new Intl.NumberFormat("fr-FR");

export const formatPrice = (n: number) => `${nf.format(n)} €`;
export const formatKm = (n: number) => `${nf.format(n)} km`;

export function formatMonth(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" });
}
