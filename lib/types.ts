export type PaymentTransaction = {
  id: string;
  date: string;
  platform: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  fees: number;
  netProceeds: number;
  paymentMethod: string;
  notes: string;
};

export type PlatformSummary = {
  platform: string;
  totalTransactions: number;
  totalRevenue: number;
  totalFees: number;
  netProceeds: number;
  avgTransactionValue: number;
  currency: string;
};

export type PaymentKpis = {
  totalRevenue: number;
  totalFees: number;
  totalNetProceeds: number;
  totalTransactions: number;
  avgTransactionValue: number;
  platformCount: number;
  pendingCount: number;
  completedCount: number;
};

export type DashboardData = {
  fetchedAt: string;
  sheetLastUpdated: string | null;
  payments: PaymentTransaction[];
  paymentPlatforms: PlatformSummary[];
  paymentKpis: PaymentKpis;
};
