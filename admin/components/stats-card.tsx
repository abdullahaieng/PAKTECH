import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "success" | "warning" | "danger";
}

export function StatsCard({ title, value, icon: Icon, trend, variant = "default" }: StatsCardProps) {
  const colors = {
    default: "bg-indigo-50 text-indigo-600",
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
    danger: "bg-red-50 text-red-600",
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--muted)] font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {trend && <p className="text-xs text-[var(--muted)] mt-1">{trend}</p>}
        </div>
        <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", colors[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
