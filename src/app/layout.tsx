import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { GARAGE, SITE_URL } from "@/config/garage";
import { isDemoStock } from "@/lib/vehicles/service";

const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], weight: ["600", "700", "800"] });
const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "P2C Automobiles · Voitures d'occasion à Plan de Campagne", template: "%s · P2C Automobiles" },
  description: "Voitures d'occasion multimarques préparées et garanties, à Plan de Campagne (Les Pennes-Mirabeau), entre Marseille et Aix-en-Provence.",
  openGraph: { type: "website", locale: "fr_FR", siteName: GARAGE.name },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#FFFFFF" };

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const demo = await isDemoStock();
  return (
    <html lang="fr" className={`${bricolage.variable} ${figtree.variable}`}>
      <body>
        <a className="skip-link" href="#contenu">Aller au contenu</a>
        {demo && (
          <div className="proto" role="note">
            <div className="wrap">
              <span><strong>Version de démonstration.</strong> Les véhicules affichés sont des exemples, pas le stock réel de P2C Automobiles.</span>
            </div>
          </div>
        )}
        <div className="topbar"><div className="wrap">À Plan de Campagne</div></div>
        <SiteHeader />
        <main id="contenu">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
