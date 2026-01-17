import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status?: string; // ← allow undefined
  className?: string;
}

const statusConfig = {
  operational: {
    label: "Operational",
    classes: "status-operational",
  },
  warning: {
    label: "Warning",
    classes: "status-warning",
  },
  critical: {
    label: "Critical",
    classes: "status-critical",
  },
} as const;

export function StatusBadge({ status, className }: StatusBadgeProps) {
  // ✅ normalize + fallback
  const normalizedStatus =
    typeof status === "string"
      ? status.toLowerCase()
      : "operational";

  const config =
    statusConfig[normalizedStatus as keyof typeof statusConfig] ??
    statusConfig.operational;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.classes,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse-slow" />
      {config.label}
    </span>
  );
}
