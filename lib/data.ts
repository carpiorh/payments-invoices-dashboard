import { fetchSheetRange, toTable, type SheetTable } from "./sheets";
import { num, str, parseDate } from "./parse";
import type { DashboardData, PaymentKpis, PaymentTransaction, PlatformSummary } from "./types";

function col(table: SheetTable, row: Record<string, string>, key: string): string {
  if (key in row) return row[key];
  const found = table.headers.find((h) => h.includes(key));
  return found ? row[found] ?? "" : "";
}

const PLATFORM_TABS = ["Shopify Main", "Amazon US", "Amazon UK", "Shopify NL", "Shopify UK"];

async function loadPayments(): Promise<PaymentTransaction[]> {
  const allTransactions: PaymentTransaction[] = [];
  let id = 1;

  for (const platform of PLATFORM_TABS) {
    try {
      // Fetch from row 5 onwards (rows 1-4 contain headers/instructions)
      const range = `'${platform}'!A5:O500`;
      const values = await fetchSheetRange(range);

      for (const row of values) {
        // Stop at first empty row or row with no invoice number
        if (!row[0] || !str(row[1])) break;

        const invoiceAmount = num(row[6]); // Column G: Invoice Amount
        const totalPaid = num(row[9]); // Column J: Total Paid
        const balance = num(row[11]); // Column L: Balance (calculated)
        const statusStr = str(row[13]); // Column N: Status (calculated)

        // Only include invoices with outstanding balance (unpaid/partially paid)
        if (balance > 0 && invoiceAmount > 0) {
          allTransactions.push({
            id: `${id}`,
            date: parseDate(row[4]), // Column E: Invoice Date
            platform: platform,
            transactionId: str(row[1]), // Column B: Invoice Number
            amount: invoiceAmount,
            currency: "USD",
            status: statusStr.includes("Overdue") ? "Overdue" : "Pending",
            fees: 0,
            netProceeds: balance, // Show the balance owed as "net proceeds"
            paymentMethod: "",
            notes: str(row[14] || ""), // Column O: Notes
          });
          id++;
        }
      }
    } catch (err) {
      console.error(`Failed to load data from ${platform}:`, err);
      // Continue with other platforms even if one fails
    }
  }

  // Sort by date (newest first)
  return allTransactions.sort((a, b) => b.date.localeCompare(a.date));
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
  const overdue = payments.filter((p) => p.status.toLowerCase() === "overdue");
  const pending = payments.filter((p) => p.status.toLowerCase() === "pending");
  const totalInvoiceAmount = payments.reduce((s, p) => s + p.amount, 0);
  const totalBalanceDue = payments.reduce((s, p) => s + p.netProceeds, 0); // netProceeds now holds the balance
  const totalFees = payments.reduce((s, p) => s + p.fees, 0);

  return {
    totalRevenue: totalInvoiceAmount,
    totalFees: totalFees,
    totalNetProceeds: totalBalanceDue,
    totalTransactions: payments.length,
    avgTransactionValue: payments.length > 0 ? totalInvoiceAmount / payments.length : 0,
    platformCount: new Set(payments.map((p) => p.platform)).size,
    pendingCount: overdue.length + pending.length, // All unpaid invoices
    completedCount: 0, // Not used in this context
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
