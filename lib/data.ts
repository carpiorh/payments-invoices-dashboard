import { fetchSheetRange, toTable, type SheetTable } from "./sheets";
import { num, str } from "./parse";
import type { DashboardData, PaymentKpis, PaymentTransaction, PlatformSummary } from "./types";

function col(table: SheetTable, row: Record<string, string>, key: string): string {
  if (key in row) return row[key];
  const found = table.headers.find((h) => h.includes(key));
  return found ? row[found] ?? "" : "";
}

async function loadPayments(): Promise<PaymentTransaction[]> {
  try {
    const table = toTable(await fetchSheetRange("PAYMENTS!A4:J3000"));
    return table.rows
      .filter((row) => str(col(table, row, "transaction_id")))
      .map((row, i) => ({
        id: String(i + 1),
        date: str(col(table, row, "date")),
        platform: str(col(table, row, "platform")) || "Unknown",
        transactionId: str(col(table, row, "transaction_id")),
        amount: num(col(table, row, "amount")),
        currency: str(col(table, row, "currency")) || "USD",
        status: str(col(table, row, "status")) || "Pending",
        fees: num(col(table, row, "fees")),
        netProceeds: num(col(table, row, "net_proceeds")),
        paymentMethod: str(col(table, row, "payment_method")),
        notes: str(col(table, row, "notes")),
      }));
  } catch {
    return [];
  }
}

function buildPaymentPlatforms(payments: PaymentTransaction[]): PlatformSummary[] {
  const platformMap = new Map<string, PaymentTransaction[]>();

  payments.forEach((p) => {
    const existing = platformMap.get(p.platform) || [];
    platformMap.set(p.platform, [...existing, p]);
  });

  return Array.from(platformMap.entries())
    .map(([platform, transactions]) => {
      const totalRevenue = transactions.reduce((s, t) => s + t.amount, 0);
      const totalFees = transactions.reduce((s, t) => s + t.fees, 0);
      const netProceeds = transactions.reduce((s, t) => s + t.netProceeds, 0);
      return {
        platform,
        totalTransactions: transactions.length,
        totalRevenue,
        totalFees,
        netProceeds,
        avgTransactionValue: transactions.length > 0 ? totalRevenue / transactions.length : 0,
        currency: transactions[0]?.currency || "USD",
      };
    })
    .sort((a, b) => b.totalRevenue - a.totalRevenue);
}

function buildPaymentKpis(payments: PaymentTransaction[]): PaymentKpis {
  const completed = payments.filter((p) => p.status.toLowerCase() === "completed");
  const pending = payments.filter((p) => p.status.toLowerCase() === "pending");
  const totalRevenue = payments.reduce((s, p) => s + p.amount, 0);
  const totalFees = payments.reduce((s, p) => s + p.fees, 0);
  const totalNetProceeds = payments.reduce((s, p) => s + p.netProceeds, 0);

  return {
    totalRevenue,
    totalFees,
    totalNetProceeds,
    totalTransactions: payments.length,
    avgTransactionValue: payments.length > 0 ? totalRevenue / payments.length : 0,
    platformCount: new Set(payments.map((p) => p.platform)).size,
    pendingCount: pending.length,
    completedCount: completed.length,
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  const payments = await loadPayments();
  const paymentPlatforms = buildPaymentPlatforms(payments);
  const paymentKpis = buildPaymentKpis(payments);

  return {
    fetchedAt: new Date().toISOString(),
    sheetLastUpdated: null,
    payments,
    paymentPlatforms,
    paymentKpis,
  };
}
