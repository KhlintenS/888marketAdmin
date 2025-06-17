"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Pencil, Trash, MoreVertical } from "lucide-react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import OrderType from "./type";
import { formatDate } from "@/lib/utils";
import { getProduct } from "@/lib/api/products";
import { updateOrderStatus } from "@/lib/api/order";

interface OrderComponentProps {
  order: OrderType;
  key: number;
}

export default function Order({ order }: OrderComponentProps) {
  const {
    id,
    status,
    createdAt,
    customer: { name: customerName, email, img_url: imgUrl },
    detail,
  } = order;
  const date = formatDate(createdAt);
  const items = detail?.length;
  const [totalFee, setTotalFee] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const queryClient = useQueryClient();

  const statusActions = [
    "Processing",
    "Shipped",
    "Completed",
    "Cancelled",
    "Refunded",
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-600  border border-green-600 hover:bg-green-100";
      case "processing":
        return "bg-blue-100 text-blue-600 border border-blue-600 hover:bg-blue-100";
      case "shipped":
        return "bg-yellow-100 text-yellow-600 border border-yellow-600 hover:bg-yellow-100";
      case "cancelled":
        return "bg-red-100 text-red-600 border border-red-600 hover:bg-red-100";
      case "refunded":
        return "bg-yellow-100 text-yellow-600 border border-yellow-600 hover:bg-yellow-100";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-600 hover:bg-gray-100";
    }
  };

  useEffect(() => {
    async function fetchTotal() {
      if (!detail?.length) {
        setTotalFee(0);
        return;
      }
      let sum = 0;
      for (const item of detail) {
        const products = await getProduct(item.product, "id");
        const product = products && products[0];
        // Use discounted price if available, else fallback to amount or 0
        const discounted =
          product?.price?.discounted ?? product?.price?.orignal ?? 0;
        sum += discounted * (item.quantity || 1);
      }
      setTotalFee(sum);
    }
    fetchTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail]);

  const { mutate: mutateOrderStatus, isPending: isUpdatingStatus } =
    useMutation({
      mutationFn: async (newStatus: string) => {
        await updateOrderStatus(order.id, newStatus);
      },
      onSuccess: () => {
        toast.success("Order status updated.");
        queryClient.invalidateQueries({ queryKey: ["orders"] });
      },
      onError: (err: any) => {
        toast.error("Failed to update order status.");
        console.error(err);
      },
    });

  const handleStatusChange = (newStatus: string) => {
    mutateOrderStatus(newStatus);
    setMenuOpen(false);
  };

  return (
    <tr key={id} className="border-b border-gray-100">
      <td className="p-4 text-xs font-semibold">{`#ORD-${order.id}`}</td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <Image
            src={imgUrl || ""}
            width={100}
            height={100}
            className="size-[40px] rounded-full object-cover"
            alt={`${customerName.slice(0, 4)}-img`}
          />
          <div>
            <div className="text-sm font-medium">{customerName}</div>
            <div className="text-xs text-gray-500">{email}</div>
          </div>
        </div>
      </td>
      <td className="p-4 text-sm">{items}</td>
      <td className="p-4 text-sm">{totalFee}</td>
      <td className="p-4 text-sm text-gray-500">{date}</td>
      <td className="p-4">
        {isUpdatingStatus ? (
          <div className="w-20 h-6">
            <div className="relative overflow-hidden bg-gray-200 rounded w-full h-full">
              <span className="absolute inset-0 block bg-gradient-to-r from-transparent via-gray-100 to-transparent animate-shimmer" />
            </div>
          </div>
        ) : (
          <Badge className={getStatusColor(order.status)}>{status}</Badge>
        )}
      </td>
      <td className="p-4 relative">
        <Button
          variant="ghost"
          size="icon"
          className="p-1"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <MoreVertical size={20} />
        </Button>
        {menuOpen && (
          <div className="absolute right-0 z-10 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg">
            <ul className="py-1">
              {statusActions.map((action) => (
                <li
                  key={action}
                  className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer
                    ${
                      action.toLowerCase() === status.toLowerCase()
                        ? getStatusColor(status) + " font-semibold"
                        : ""
                    }
                  `}
                  onClick={() => handleStatusChange(action)}
                >
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}
      </td>
    </tr>
  );
}
