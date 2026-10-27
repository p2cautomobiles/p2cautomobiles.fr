import Image from "next/image";
import logo from "../../public/logo-p2c.png";

export function Logo({ height = 50, priority = false }: { height?: number; priority?: boolean }) {
  return (
    <Image
      src={logo}
      alt="P2C Automobiles"
      priority={priority}
      style={{ height, width: "auto" }}
      sizes={`${Math.round((height * logo.width) / logo.height)}px`}
    />
  );
}
