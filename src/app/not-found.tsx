import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap doc">
      <h1>Cette page n&apos;existe pas ou plus</h1>
      <p>Si vous cherchiez un véhicule, il a peut-être été vendu. Découvrez ceux qui sont disponibles en ce moment.</p>
      <p><Link className="btn btn-primary" href="/vehicules">Voir nos véhicules</Link></p>
    </div>
  );
}
