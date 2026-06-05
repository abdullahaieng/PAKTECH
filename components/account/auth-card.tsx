import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ title, subtitle, children, className }: AuthCardProps) {
  return (
    <div className={cn("max-w-md mx-auto", className)}>
      <div className="text-center mb-8">
        <div className="h-14 w-14 rounded-2xl gradient-bg flex items-center justify-center font-bold text-white text-lg mx-auto mb-4 shadow-lg">
          PT
        </div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      <div className="rounded-2xl border bg-card p-6 shadow-sm">{children}</div>
    </div>
  );
}
