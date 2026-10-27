import Image from "next/image";
import type { Vehicle } from "@/lib/vehicles/types";
import { DemoCarArt, DEMO_PHOTO_COUNT } from "./DemoCarArt";

export function photoCount(v: Vehicle) {
  return v.photos.length || (v.source === "demo" ? DEMO_PHOTO_COUNT : 0);
}

/** Photo réelle via next/image, ou visuel dessiné pour un véhicule de démonstration. */
export function VehiclePhoto({
  vehicle,
  index = 0,
  sizes,
  priority = false,
  fit = "cover",
}: {
  vehicle: Vehicle;
  index?: number;
  sizes: string;
  priority?: boolean;
  fit?: "cover" | "contain";
}) {
  const name = `${vehicle.brand} ${vehicle.model}`;
  const photo = vehicle.photos[index];
  if (photo) {
    return <Image src={photo.url} alt={photo.alt ?? `${name}, photo ${index + 1}`} fill sizes={sizes} priority={priority} style={{ objectFit: fit }} />;
  }
  if (vehicle.source === "demo") {
    return <DemoCarArt vehicle={vehicle} scene={index} label={`${name}, visuel d'exemple ${index + 1}`} />;
  }
  return <div style={{ display: "grid", placeItems: "center", height: "100%", color: "var(--text-2)", fontSize: 14 }}>Photo à venir</div>;
}
