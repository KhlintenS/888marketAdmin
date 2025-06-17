"use client";
import {
  CalendarX2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/useOrders";
import Empty from "@/components/Empty";
import Error from "@/components/Error";
import Order from "@/components/orders/Order";
import OrderType from "@/components/orders/type";
import { useState, useMemo, useEffect } from "react";
// import { getOrders } from "@/lib/api/order";
import { getProduct } from "@/lib/api/products";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrderList() {
  const { orders, isLoadingOrders, isError, refetchOrders } = useOrders();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;
  const [filter, setFilter] = useState<string>("All");
  const [search, setSearch] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const statusOptions: string[] = [
    "All",
    "Processing",
    "Shipped",
    "Completed",
    "Cancelled",
    "Refunded",
  ];

  // Update URL on filter change
  useEffect(() => {
    filter?.toLowerCase() === "all"
      ? params.delete("_filt")
      : params.set("_filt", filter.toLowerCase());
    router.push(`?${params.toString()}`);
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Fast in-memory filter and search
  const filteredAndSearchedOrders = useMemo(() => {
    if (!orders) return [];
    let filtered =
      filter === "All"
        ? orders
        : orders.filter(
            (order: any) => order.status?.toLowerCase() === filter.toLowerCase()
          );
    if (search.trim() === "") return filtered;
    const term = search.trim().toLowerCase();
    return filtered.filter((order: any) => {
      const orderId = `#ORD-${order.id}`.toLowerCase();
      const customerName = order.customer?.name?.toLowerCase() || "";
      const customerEmail = order.customer?.email?.toLowerCase() || "";
      return (
        orderId.includes(term) ||
        customerName.includes(term) ||
        customerEmail.includes(term)
      );
    });
  }, [orders, filter, search]);

  // Paginate after filtering/searching
  const paginatedOrders = useMemo(() => {
    if (!filteredAndSearchedOrders) return [];
    const start = (currentPage - 1) * pageSize;
    return filteredAndSearchedOrders.slice(start, start + pageSize);
  }, [filteredAndSearchedOrders, currentPage]);

  const totalPages =
    filteredAndSearchedOrders && filteredAndSearchedOrders.length > 0
      ? Math.ceil(filteredAndSearchedOrders.length / pageSize)
      : 1;

  // CSV Export Functionality (only fetch product details for visible orders)
  const exportToCSV = async () => {
    const source = filteredAndSearchedOrders;
    if (!source || !source.length) return;

    const headers = [
      "Order ID",
      "Customer Name",
      "Product Name",
      "Product Price",
      "Quantity",
      "Total",
      "Status",
    ];

    const rows: string[][] = [];
    for (const order of source) {
      const { id, status, customer, detail } = order;
      const customerName = customer?.name || "";
      if (!detail || !detail.length) {
        rows.push([`#ORD-${id}`, customerName, "", "", "", "", status]);
        continue;
      }
      for (const item of detail) {
        // Only fetch product details for the current page
        // eslint-disable-next-line no-await-in-loop
        const products = await getProduct(item.product, "id");
        const product = products && products[0];
        const productName = product?.name || "";
        const productPrice =
          product?.price?.discounted ?? product?.price?.orignal ?? "";
        const quantity = item.quantity || 1;
        const total = productPrice ? Number(productPrice) * quantity : "";
        rows.push([
          `#ORD-${id}`,
          customerName,
          productName,
          productPrice.toString(),
          quantity.toString(),
          total.toString(),
          status,
        ]);
      }
    }

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
      )
      .join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders_export.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Orders</h2>
          <p className="text-gray-500">View and manage customer orders</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-3.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search by order-id | name | email..."
                className="pl-9 h-12 w-[280px] rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={(e) => {
                  setCurrentPage(1);
                  setSearch(e.target.value);
                }}
                disabled={isError || isLoadingOrders || !orders?.length}
              />
            </div>
            {/* Filter Dropdown with Icon using shadcn Select */}
            <div className="flex gap-2 items-center ml-2 w-[150px]">
              <Filter className="h-6 w-6 text-gray-500 pointer-events-none" />
              <Select
                value={filter}
                onValueChange={(value: string) => {
                  setCurrentPage(1);
                  setFilter(value);
                }}
              >
                <SelectTrigger className="h-12 w-full pl-12 rounded-md border border-gray-200 bg-white text-sm px-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Filter Status" className="pl-8" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={isError || isLoadingOrders || !orders?.length}
            onClick={exportToCSV}
          >
            Export
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {(filteredAndSearchedOrders?.length ?? 0) > 7 && (
            <div className="px-4 py-2 text-sm text-gray-500">
              Showing {(currentPage - 1) * pageSize + 1}-
              {Math.min(
                currentPage * pageSize,
                filteredAndSearchedOrders?.length ?? 0
              )}{" "}
              of {filteredAndSearchedOrders?.length ?? 0}
            </div>
          )}
          <div>
            <table className="w-full">
              {!isError && filteredAndSearchedOrders?.length ? (
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="p-4 text-left font-medium text-sm text-gray-500">
                      Order ID
                    </th>
                    <th className="p-4 text-left font-medium text-sm text-gray-500">
                      Customer
                    </th>
                    <th className="p-4 text-left font-medium text-sm text-gray-500">
                      Items
                    </th>
                    <th className="p-4 text-left font-medium text-sm text-gray-500">
                      Total
                    </th>
                    <th className="p-4 text-left font-medium text-sm text-gray-500">
                      Date
                    </th>
                    <th className="p-4 text-left font-medium text-sm text-gray-500">
                      Status
                    </th>
                    <th className="p-4 text-left font-medium text-sm text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
              ) : null}
              <tbody>
                {isLoadingOrders ? (
                  <>
                    {Array.from({ length: pageSize }).map((_, idx) => (
                      <tr key={idx}>
                        <td className="p-4">
                          <Skeleton className="h-4 w-24 rounded" />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Skeleton className="size-[40px] rounded-full" />
                            <div>
                              <Skeleton className="h-4 w-24 mb-1 rounded" />
                              <Skeleton className="h-3 w-20 rounded" />
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-4 w-8 rounded" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-4 w-12 rounded" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-4 w-16 rounded" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-6 w-16 rounded" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-8 w-16 rounded" />
                        </td>
                      </tr>
                    ))}
                  </>
                ) : isError ? (
                  <tr>
                    <td colSpan={8}>
                      <Error
                        description="We encountered an error while fetching orders. Please try again."
                        onRetry={refetchOrders}
                      />
                    </td>
                  </tr>
                ) : !filteredAndSearchedOrders?.length ? (
                  <tr>
                    <td colSpan={8}>
                      <Empty
                        title="No Orders available."
                        icon={
                          <CalendarX2 size={80} className="text-blue-500" />
                        }
                        description="Currently there are no orders available."
                      />
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order: any) => (
                    <Order order={order as OrderType} key={order.id} />
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          {(filteredAndSearchedOrders?.length ?? 0) > pageSize && (
            <div className="flex justify-center items-center gap-2 py-4">
              <Button
                className="size-[35px] rounded-full grid place-items-center"
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    className={`size-[35px] rounded-full text-center grid place-items-center ${
                      page === currentPage
                        ? "bg-blue-600 text-white hover:!bg-blue-700"
                        : ""
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                className="size-[35px] rounded-full grid place-items-center"
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
