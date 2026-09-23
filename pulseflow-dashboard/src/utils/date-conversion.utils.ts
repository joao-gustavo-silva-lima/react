export function formatDate(date: Date): string {
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    weekday: "long",
  });

  const [{ value: weekday }, , { value: day }, , { value: month }] =
    formatter.formatToParts(date);

  return `${weekday}, ${day} de ${month}`;
}

export function getLocalDateISO(date?: Date) {
  const now = date ?? new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
