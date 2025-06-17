import { ArrowDown, ArrowUp, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProducts";
import { useCustomers } from "@/hooks/useCustomers";
import { useOrders } from "@/hooks/useOrders";
import { useMemo } from "react";

export function DashboardMetrics() {
  const { products } = useProducts();
  const { customers } = useCustomers();
  const { orders } = useOrders();

  // Calculate total sales (sum of all product sales, using discounted price if available)
  const totalSales = useMemo(() => {
    if (!products) return 0;
    return products.reduce((sum: number, p: any) => {
      const price =
        p.price?.discounted ?? p.price?.orignal ?? p.price?.amount ?? 0;
      return sum + price * (p.stock ?? 0);
    }, 0);
  }, [products]);

  // Calculate total orders
  const totalOrders = orders?.length ?? 0;

  // Calculate total revenue (sum of all order totals)
  const totalRevenue = useMemo(() => {
    if (!orders) return 0;
    let revenue = 0;
    for (const order of orders) {
      if (!order.detail) continue;
      for (const item of order.detail) {
        // Try to find product price
        const product = products?.find((p: any) => p.id === item.product);
        const price =
          product?.price?.discounted ??
          product?.price?.orignal ??
          product?.price?.amount ??
          0;
        revenue += price * (item.quantity ?? 1);
      }
    }
    return revenue;
  }, [orders, products]);

  // Calculate total customers
  const totalCustomers = customers?.length ?? 0;

  // Calculate total products (number of products)
  const totalProducts = products?.length ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Total Sales
          </CardTitle>
          <MoreVertical size={16} className="text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            $
            {totalSales.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="flex items-center mt-1">
            <Badge className="bg-green-100 text-green-600 hover:bg-green-100 mr-2">
              <ArrowUp className="mr-1 h-3 w-3" />
              14%
            </Badge>
            <span className="text-sm text-gray-500">vs. last month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Total Products
          </CardTitle>
          <MoreVertical size={16} className="text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalProducts.toLocaleString()}
          </div>
          <div className="flex items-center mt-1">
            <Badge className="bg-red-100 text-red-600 hover:bg-red-100 mr-2">
              <ArrowDown className="mr-1 h-3 w-3" />
              17%
            </Badge>
            <span className="text-sm text-gray-500">vs. last month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Total Revenue
          </CardTitle>
          <MoreVertical size={16} className="text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            $
            {totalRevenue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="flex items-center mt-1">
            <Badge className="bg-green-100 text-green-600 hover:bg-green-100 mr-2">
              <ArrowUp className="mr-1 h-3 w-3" />
              14%
            </Badge>
            <span className="text-sm text-gray-500">vs. last month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Total Customers
          </CardTitle>
          <MoreVertical size={16} className="text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalCustomers.toLocaleString()}
          </div>
          <div className="flex items-center mt-1">
            <Badge className="bg-red-100 text-red-600 hover:bg-red-100 mr-2">
              <ArrowDown className="mr-1 h-3 w-3" />
              11%
            </Badge>
            <span className="text-sm text-gray-500">vs. last month</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
