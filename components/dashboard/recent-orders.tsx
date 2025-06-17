import { MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useOrders } from "@/hooks/useOrders";
import Link from "next/link";

export function RecentOrders() {
  const { orders, isLoadingOrders } = useOrders();

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-600 hover:bg-green-100";
      case "processing":
        return "bg-blue-100 text-blue-600 hover:bg-blue-100";
      case "shipped":
        return "bg-purple-100 text-purple-600 hover:bg-purple-100";
      case "cancelled":
        return "bg-red-100 text-red-600 hover:bg-red-100";
      case "refunded":
        return "bg-yellow-100 text-yellow-600 hover:bg-yellow-100";
      default:
        return "bg-gray-100 text-gray-600 hover:bg-gray-100";
    }
  };

  // Show only the 5 most recent orders
  const recentOrders = orders?.slice(0, 5) || [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Recent Orders</CardTitle>
        <Link href={"/orders"} className="text-sm text-blue-600 font-medium">
          View All
        </Link>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="p-3 text-left font-medium text-sm text-gray-500">
                  Order ID
                </th>
                <th className="p-3 text-left font-medium text-sm text-gray-500">
                  Customer
                </th>
                <th className="p-3 text-left font-medium text-sm text-gray-500">
                  Items
                </th>
                <th className="p-3 text-left font-medium text-sm text-gray-500">
                  Date
                </th>
                <th className="p-3 text-left font-medium text-sm text-gray-500">
                  Status
                </th>
                <th className="p-3 text-left font-medium text-sm text-gray-500"></th>
              </tr>
            </thead>
            <tbody>
              {isLoadingOrders ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-400">
                    No recent orders.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100">
                    <td className="p-3 text-sm">{`#ORD-${order.id}`}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={order.customer?.img_url || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {order.customer?.name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">
                            {order.customer?.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.customer?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-sm">{order.detail?.length ?? 0}</td>
                    <td className="p-3 text-sm text-gray-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : ""}
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status?.charAt(0).toUpperCase() +
                          order.status?.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <button className="text-gray-500 hover:text-gray-700">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
