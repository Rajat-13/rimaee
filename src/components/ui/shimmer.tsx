import { cn } from "@/lib/utils";

interface ShimmerProps {
  className?: string;
}

export const Shimmer = ({ className }: ShimmerProps) => (
  <div
    className={cn(
      "relative overflow-hidden rounded-md bg-muted",
      "before:absolute before:inset-0 before:-translate-x-full",
      "before:animate-shimmer before:bg-gradient-to-r",
      "before:from-transparent before:via-white/20 before:to-transparent",
      className
    )}
  />
);

export const ProductCardShimmer = () => (
  <div className="card-product min-w-[280px] md:min-w-[300px]">
    <Shimmer className="aspect-square w-full" />
    <div className="p-4 space-y-3">
      <Shimmer className="h-5 w-3/4 mx-auto" />
      <Shimmer className="h-4 w-1/2 mx-auto" />
    </div>
  </div>
);

export const ProductGridShimmer = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardShimmer key={i} />
    ))}
  </div>
);

export const CarouselShimmer = ({ count = 4 }: { count?: number }) => (
  <div className="flex gap-4 overflow-hidden">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardShimmer key={i} />
    ))}
  </div>
);

export const HeroShimmer = () => (
  <div className="relative h-[500px] md:h-[650px] w-full">
    <Shimmer className="h-full w-full rounded-none" />
    <div className="absolute bottom-8 left-8 space-y-4">
      <Shimmer className="h-12 w-64" />
      <Shimmer className="h-6 w-48" />
      <Shimmer className="h-12 w-36" />
    </div>
  </div>
);

export const TableRowShimmer = ({ cols = 5 }: { cols?: number }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="p-4">
        <Shimmer className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

export const TableShimmer = ({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) => (
  <div className="w-full overflow-hidden rounded-lg border border-border">
    <table className="w-full">
      <thead>
        <tr className="bg-muted">
          {Array.from({ length: cols }).map((_, i) => (
            <th key={i} className="p-4">
              <Shimmer className="h-4 w-20" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRowShimmer key={i} cols={cols} />
        ))}
      </tbody>
    </table>
  </div>
);

export const CardShimmer = () => (
  <div className="rounded-lg border border-border bg-card p-6 space-y-4">
    <Shimmer className="h-6 w-1/2" />
    <Shimmer className="h-4 w-full" />
    <Shimmer className="h-4 w-3/4" />
  </div>
);

export const StatCardShimmer = () => (
  <div className="rounded-lg border border-border bg-card p-6">
    <Shimmer className="h-4 w-24 mb-2" />
    <Shimmer className="h-8 w-16" />
  </div>
);

export const ProfileShimmer = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-4">
      <Shimmer className="h-20 w-20 rounded-full" />
      <div className="space-y-2 flex-1">
        <Shimmer className="h-6 w-48" />
        <Shimmer className="h-4 w-32" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCardShimmer />
      <StatCardShimmer />
      <StatCardShimmer />
    </div>
  </div>
);
