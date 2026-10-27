import Image from "next/image";
import photo from "../../public/garage-p2c.webp";

/** Façade et parc de P2C Automobiles à Plan de Campagne. */
export function GaragePhoto({ sizes, priority = false }: { sizes: string; priority?: boolean }) {
  return (
    <Image
      src={photo}
      alt="Le garage P2C Automobiles à Plan de Campagne, avec ses voitures d'occasion devant la façade"
      fill
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      style={{ objectFit: "cover", objectPosition: "50% 60%" }}
    />
  );
}
