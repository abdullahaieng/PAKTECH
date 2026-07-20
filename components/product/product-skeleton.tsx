import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="rounded-3xl border border-border/40 bg-card p-5 space-y-4 shadow-sm animate-pulse">
      <Skeleton className="aspect-square w-full rounded-2xl bg-secondary/80" />
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Skeleton className="h-3.5 w-16 bg-secondary/85 rounded-full" />
          <Skeleton className="h-4.5 w-8 bg-secondary/85 rounded-full" />
        </div>
        <Skeleton className="h-4.5 w-full bg-secondary/85 rounded-lg" />
        <Skeleton className="h-4 w-3/4 bg-secondary/85 rounded-lg" />
        <Skeleton className="h-5 w-24 bg-secondary/85 rounded-lg pt-1" />
      </div>
    </div>
  );
}
 
export function ProductDetailSkeleton() {
  return (
    <div className="grid gap-12 lg:grid-cols-2 py-8">
      <Skeleton className="aspect-square w-full rounded-3xl bg-secondary/80" />
      <div className="space-y-6">
        <Skeleton className="h-4 w-20 bg-secondary/85 rounded-full" />
        <Skeleton className="h-10 w-3/4 bg-secondary/85 rounded-xl" />
        <Skeleton className="h-7 w-32 bg-secondary/85 rounded-lg" />
        <Skeleton className="h-24 w-full bg-secondary/85 rounded-2xl" />
        <Skeleton className="h-14 w-full bg-secondary/85 rounded-2xl" />
        <Skeleton className="h-14 w-full bg-secondary/85 rounded-2xl" />
      </div>
    </div>
  );
}
