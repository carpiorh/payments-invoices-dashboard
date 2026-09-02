export function str(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

export function num(value: unknown): number {
  if (value === null || value === undefined || value === "") return 0;
  const parsed = parseFloat(String(value));
  return isNaN(parsed) ? 0 : parsed;
}

export function bool(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  const s = str(value).toLowerCase();
  return s === "true" || s === "yes" || s === "1" || s === "on";
}

export function parseDate(value: unknown): string {
  const s = str(value);
  if (!s) return "";

  const n = parseFloat(s);
  if (!isNaN(n) && n > 0) {
    // Convert Excel serial number to date (Excel epoch: Dec 30, 1899)
    const excelEpoch = new Date(1899, 11, 30);
    const date = new Date(excelEpoch.getTime() + n * 86400000);
    return date.toISOString().split("T")[0];
  }

  // Try to parse as already-formatted date
  if (s.includes("-") || s.includes("/")) {
    const [m, d, y] = s.split(/[-\/]/).map((p) => p.trim());
    if (m && d && y) {
      const parsed = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().split("T")[0];
      }
    }
  }

  return s;
}
