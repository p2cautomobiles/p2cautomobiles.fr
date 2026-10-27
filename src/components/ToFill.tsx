/** Valeur à compléter avant la mise en ligne : visible, jamais inventée. */
export function ToFill({ value, label }: { value: string | null; label: string }) {
  return value ? <>{value}</> : <span className="todo">[{label}]</span>;
}
