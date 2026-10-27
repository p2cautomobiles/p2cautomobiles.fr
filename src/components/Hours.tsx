import { GARAGE } from "@/config/garage";

export function Hours() {
  if (!GARAGE.hours) return <span className="todo">à renseigner</span>;
  return (
    <ul className="hours">
      {GARAGE.hours.map((h) => (
        <li key={h.days}><span>{h.days}</span> {h.time}</li>
      ))}
    </ul>
  );
}
