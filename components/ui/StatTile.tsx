export function StatTile({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "good" }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      <p className={`text-2xl font-semibold mt-2 ${tone === "good" ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"}`}>
        {value}
      </p>
    </div>
  );
}
