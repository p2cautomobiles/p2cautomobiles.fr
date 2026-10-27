import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import type { PublicVehicle } from "@/lib/vehicles/types";
import { formatKm, formatPrice } from "@/lib/format";
import { VehiclePhoto } from "./VehiclePhoto";

export function StatusBadge({ vehicle }: { vehicle: PublicVehicle }) {
  if (vehicle.status === "sold") return <div className="badges"><span className="badge badge-sold">VENDU</span></div>;
  if (vehicle.status === "reserved") return <div className="badges"><span className="badge badge-res">Réservé</span></div>;
  if (vehicle.isNew) return <div className="badges"><span className="badge badge-new">Nouveau</span></div>;
  return null;
}

export function VehicleCard({ vehicle: v, priority = false }: { vehicle: PublicVehicle; priority?: boolean }) {
  return (
    <Link className={`car${v.status === "sold" ? " is-sold" : ""}`} href={`/vehicules/${v.slug}`}>
      <div className="ph">
        <VehiclePhoto vehicle={v} sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 380px" priority={priority} />
        <StatusBadge vehicle={v} />
        {v.source === "demo" && <span className="demo-tag">Exemple</span>}
      </div>
      <div className="body">
        <div>
          <h3>{v.brand} {v.model}</h3>
          {v.version && <p className="ver">{v.version}</p>}
        </div>
        <div className="specs num">
          <span>{v.year}</span>
          <span>{formatKm(v.mileageKm)}</span>
          {v.fuel && <span>{v.fuel}</span>}
          {v.gearbox && <span>{v.gearbox}</span>}
        </div>
        <p className="warranty-line"><ShieldCheck size={15} aria-hidden /> Chaque voiture est garantie</p>
        <div className="foot">
          <span className="price num">{formatPrice(v.priceEur)}</span>
          <span className="link">Voir le véhicule <ArrowRight size={16} aria-hidden /></span>
        </div>
      </div>
    </Link>
  );
}
