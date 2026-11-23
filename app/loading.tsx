import { ProductCardSkeleton } from "@/components/ProductCard";

export default function Loading() {
  return (
    <div className="container-x py-12">
      <div className="mb-10 h-12 w-72 animate-pulse rounded-xl bg-cream-100" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    </div>
  );
}
