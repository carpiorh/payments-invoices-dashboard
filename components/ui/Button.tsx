export function Button({
  children,
  variant = "secondary",
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-blue-400 disabled:hover:bg-blue-400",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 disabled:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-gray-100 dark:disabled:bg-gray-800 dark:disabled:text-gray-600 dark:disabled:hover:bg-gray-800",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${styles[variant]} ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
      {children}
    </button>
  );
}
