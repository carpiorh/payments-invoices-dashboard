export function StatTile({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "good" | "critical" }) {
  const toneStyles = {
    default: "text-gray-900 dark:text-white",
    good: "text-green-600 dark:text-green-400",
    critical: "text-red-600 dark:text-red-400",
  };

  const borderStyles = {
    default: "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900",
    good: "border-green-200 dark:border-green-800/30 bg-green-50 dark:bg-green-950/20",
    critical: "border-red-200 dark:border-red-800/30 bg-red-50 dark:bg-red-950/20",
  };

  return (
    <div className={`rounded-lg border ${borderStyles[tone]} p-4`}>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      <p className={`text-2xl font-semibold mt-2 ${toneStyles[tone]}`}>
        {value}
      </p>
    </div>
  );
}
