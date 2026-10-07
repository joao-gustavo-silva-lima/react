export default function isoDateFormatter(isoString: string): string {
  const date = new Date(isoString);

  const formatedDate = date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return formatedDate.replace(",", " às");
}
