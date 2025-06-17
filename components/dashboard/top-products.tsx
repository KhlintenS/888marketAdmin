import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useProducts } from "@/hooks/useProducts";
import { useMemo } from "react";
import { Eye } from "lucide-react";
import Link from "next/link";

export function TopProducts() {
  const { products } = useProducts();

  console.log(products);

  // Compute top products by views * price (descending)
  const topProducts = useMemo(() => {
    if (!products) return [];
    return [...products]
      .sort((a: any, b: any) => {
        const aViews = a.views ?? 0;
        const bViews = b.views ?? 0;
        const aPrice =
          a.price?.discounted ?? a.price?.orignal ?? a.price?.amount ?? 0;
        const bPrice =
          b.price?.discounted ?? b.price?.orignal ?? b.price?.amount ?? 0;
        // Sort by (views * price) descending
        return bViews * bPrice - aViews * aPrice;
      })
      .slice(0, 4)
      .map((p: any) => ({
        name: p.name,
        image: p.imgUrls?.[0] || "/placeholder.svg",
        views: p.views ?? 0,
        price:
          "$" + (p.price?.discounted ?? p.price?.orignal ?? 0).toLocaleString(),
        total:
          "$" +
          (
            (p.views ?? 0) * (p.price?.discounted ?? p.price?.orignal ?? 0)
          ).toLocaleString(),
      }));
  }, [products]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Top Products</CardTitle>
        <Link href={"/products"} className="text-sm text-blue-600 font-medium">
          View All
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-md">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">{product.name}</h4>
                <div className="text-xs text-gray-500 flex gap-1">
                  <div className="flex gap-1 items-center">
                    <span>{product.views} </span>
                    <Eye size={14} /> &middot;
                  </div>
                  <span>{product.price}</span>
                </div>
              </div>
              <div className="text-sm font-medium">{product.total}</div>
            </div>
          ))}
          {topProducts.length === 0 && (
            <div className="text-gray-400 text-center py-6">
              No products found.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
