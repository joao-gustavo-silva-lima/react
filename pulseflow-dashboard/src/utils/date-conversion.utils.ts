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
