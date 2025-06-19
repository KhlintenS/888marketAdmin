import { getOrders } from "@/lib/api/order";
import camelCase from "@/utils/camelCase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { deleteOrder as removeOrder } from "@/lib/api/order";

export function useOrders() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const keyword = searchParams.get("_filt") || "All";
  const queryString = searchParams.toString();

  const {
    isLoading: isLoadingOrders,
    data,
    isError,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ["orders", queryString],
    queryFn: () => getOrders(keyword),
    enabled: !!keyword,
    staleTime: 1000 * 60 * 2, // cache for 2 minutes to avoid refetching too often
    // keepPreviousData: true,
  });

  const orders = data?.map((order: any) => camelCase(order));

  const { mutate: deleteOrder, isPending: isDeletingOrder } = useMutation({
    mutationFn: removeOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order successfully deleted.");
    },
    onError: (err: any) => {
      console.error("Delete Error:", err?.message || "Unknown Error");
      toast.error("An error occurred while deleting the order.");
    },
  });

  return {
    deleteOrder,
    refetchOrders,
    isLoadingOrders,
    isDeletingOrder,
    orders,
    isError,
  };
}
