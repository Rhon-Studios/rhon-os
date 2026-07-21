export function parseDateString(s: string | null | undefined): Date | null {
  if (!s) return null;
  const [year, month, day] = s.split("T")[0].split("-").map(Number);
  return new Date(year, month - 1, day );
}

export function toDateString(date: Date | null): string | null {
  if (!date) return null;
  if (isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatDateDisplay(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const datePart = dateStr.split("T")[0];
  return datePart.split("-").reverse().join("/");
}