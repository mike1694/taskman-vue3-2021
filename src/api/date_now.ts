export function getDateNow(): string {
  const date = new Date().toLocaleDateString().split('.');
  const d = date[0];
  const m = date[1];
  const y = date[2];

  return `${y}-${m}-${d}`;
}