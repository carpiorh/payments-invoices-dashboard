"use client";

import { useMemo, useState } from "react";
import { useData } from "@/lib/client/DataContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TableWrap, Th, Td } from "@/components/ui/Table";
import { StatTile } from "@/components/ui/StatTile";
import { formatCurrency, formatDate, formatPercent } from "@/lib/format";

type Filter = "all" | "pending" | "completed";
type ViewMode = "overview" | "channel";

const PLATFORMS = ["Shopify Main", "Amazon US", "Amazon UK", "Shopify NL", "Shopify UK"];

export default function Home() {
  const { data, loading, error } = useData();
  const [viewMode, setViewMode] = useState<ViewMode>("overview");
  const [selectedChannel, setSelectedChannel] = useState(PLATFORMS[0]);
  const [statusFilter, setStatusFilter] = useState<Filter>("pending");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = useMemo(() => {
    if (!data?.payments) return [];

    let platform = platformFilter;
    if (viewMode === "channel") {
      platform = selectedChannel;
    }

    return data.payments
      .filter((txn) => {
        if (statusFilter === "pending") return ["pending", "overdue"].includes(txn.status.toLowerCase());
        if (statusFilter === "completed") return txn.status.toLowerCase() === "completed";
        return true;
      })
      .filter((txn) => {
        if (platform === "all") return true;
        return txn.platform === platform;
      })
      .filter((txn) => {
        if (!dateFrom) return true;
        return txn.date >= dateFrom;
      })
      .filter((txn) => {
        if (!dateTo) return true;
        return txn.date <= dateTo;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [data, statusFilter, platformFilter, dateFrom, dateTo, viewMode, selectedChannel]);

  if (loading) return <div className="text-sm text-gray-600 dark:text-gray-400">Loading payments…</div>;
  if (error || !data) return <div className="text-sm text-red-600 dark:text-red-400">{error ?? "Failed to load data"}</div>;

  const { paymentKpis, paymentPlatforms } = data;
  const feePercent = paymentKpis.totalRevenue > 0 ? (paymentKpis.totalFees / paymentKpis.totalRevenue) * 100 : 0;

  const platforms = ["all", ...Array.from(new Set(data.payments.map((p) => p.platform)))];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments Needing Settlement</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {viewMode === "channel" ? `${selectedChannel} Channel` : "All Channels"}
        </p>
      </div>

      <Card className="p-4">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">View by Channel</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={viewMode === "overview" ? "primary" : "secondary"}
            onClick={() => setViewMode("overview")}
          >
            Overview (All)
          </Button>
          {PLATFORMS.map((platform) => (
            <Button
              key={platform}
              variant={viewMode === "channel" && selectedChannel === platform ? "primary" : "secondary"}
              onClick={() => {
                setViewMode("channel");
                setSelectedChannel(platform);
              }}
            >
              {platform}
            </Button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Pending Payments"
          value={formatCurrency(filtered.filter((t) => t.status.toLowerCase() === "pending").reduce((s, t) => s + t.amount, 0))}
          tone="good"
        />
        <StatTile
          label="Overdue Payments"
          value={formatCurrency(filtered.filter((t) => t.status.toLowerCase() === "overdue").reduce((s, t) => s + t.amount, 0))}
        />
        <StatTile
          label="Total to Settle"
          value={formatCurrency(filtered.reduce((s, t) => s + t.amount, 0))}
          tone="good"
        />
        <StatTile label="Count" value={String(filtered.length)} />
      </div>

      <Card className="p-4">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Platform Breakdown</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {paymentPlatforms.map((platform) => (
            <div key={platform.platform} className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{platform.platform}</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mt-2">{formatCurrency(platform.totalRevenue)}</p>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                <p>Transactions: {platform.totalTransactions}</p>
                <p>Avg: {formatCurrency(platform.avgTransactionValue)}</p>
                <p>Fees: {formatCurrency(platform.totalFees)}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Filters</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Status</label>
            <div className="flex flex-wrap gap-2">
              {(["pending", "all"] as Filter[]).map((f) => (
                <Button
                  key={f}
                  variant={statusFilter === f ? "primary" : "secondary"}
                  onClick={() => setStatusFilter(f)}
                >
                  {f === "pending" ? "Pending & Overdue" : "All"}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Platform</label>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white"
            >
              {platforms.map((p) => (
                <option key={p} value={p}>
                  {p === "all" ? "All Platforms" : p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">From Date</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">To Date</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </Card>

      <Card className="p-0">
        <TableWrap>
          <thead>
            <tr>
              <Th>Date</Th>
              <Th>Platform</Th>
              <Th>Transaction ID</Th>
              <Th className="text-right">Amount</Th>
              <Th className="text-right">Fees</Th>
              <Th className="text-right">Net Proceeds</Th>
              <Th>Status</Th>
              <Th>Payment Method</Th>
              <Th>Notes</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((txn) => (
              <tr key={txn.id} className="border-t border-gray-200 dark:border-gray-700">
                <Td>{formatDate(txn.date)}</Td>
                <Td className="font-medium">{txn.platform}</Td>
                <Td className="font-mono text-sm">{txn.transactionId}</Td>
                <Td className="text-right tabular-nums">{formatCurrency(txn.amount)}</Td>
                <Td className="text-right tabular-nums text-yellow-600 dark:text-yellow-400">{formatCurrency(txn.fees)}</Td>
                <Td className="text-right tabular-nums font-medium text-green-600 dark:text-green-400">{formatCurrency(txn.netProceeds)}</Td>
                <Td>
                  <Badge tone={txn.status.toLowerCase() === "completed" ? "good" : "default"}>{txn.status}</Badge>
                </Td>
                <Td className="text-sm text-gray-600 dark:text-gray-400">{txn.paymentMethod || "—"}</Td>
                <Td className="text-sm text-gray-600 dark:text-gray-400">{txn.notes || "—"}</Td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <Td className="text-gray-600 dark:text-gray-400" colSpan={9}>
                  No transactions in this view.
                </Td>
              </tr>
            )}
          </tbody>
        </TableWrap>
      </Card>
    </div>
  );
}
