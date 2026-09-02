export function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "good" | "warning" | "critical" }) {
  const colors = {
    default: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    good: "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200",
    warning: "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    critical: "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200",
  };
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${colors[tone]}`}>{children}</span>;
}
