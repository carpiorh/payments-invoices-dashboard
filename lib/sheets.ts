const SHEETS_API_BASE = "https://sheets.googleapis.com/v4/spreadsheets";
const REVALIDATE_SECONDS = 120;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Set it in .env.local (see .env.local.example) or in your Vercel project settings.`
    );
  }
  return value;
}

export async function fetchSheetRange(range: string): Promise<string[][]> {
  const sheetId = requireEnv("GOOGLE_SHEET_ID");
  const apiKey = requireEnv("GOOGLE_SHEETS_API_KEY");
  const url = `${SHEETS_API_BASE}/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}&valueRenderOption=UNFORMATTED_VALUE`;

  const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Google Sheets request failed for range "${range}" (${res.status}): ${body.slice(0, 300)}`);
  }
  const json = (await res.json()) as { values?: unknown[][] };
  return (json.values ?? []).map((row) => row.map((cell) => (cell === undefined || cell === null ? "" : String(cell))));
}

function normalizeHeader(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[()#%]/g, " ")
    .replace(/[\s_/-]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export type SheetTable = {
  headers: string[];
  rows: Record<string, string>[];
};

export function toTable(values: string[][]): SheetTable {
  const [headerRow, ...dataRows] = values;
  const headers = (headerRow ?? []).map(normalizeHeader);
  const rows = dataRows
    .filter((row) => row.some((cell) => cell !== ""))
    .map((row) => {
      const record: Record<string, string> = {};
      headers.forEach((key, i) => {
        if (key) record[key] = row[i] ?? "";
      });
      return record;
    });
  return { headers, rows };
}
