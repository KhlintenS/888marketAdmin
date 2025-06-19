import camelCase from "@/utils/camelCase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createCustomer as crCustomer,
  deleteMultipleCustomers,
  getCustomerByUUID,
  getCustomers,
  deleteCustomer as removeCustomer,
  searchCustomer,
  updateCustomerAdmin,
} from "@/lib/api/customer";
import { useSearchParams } from "next/navigation";

export function useCustomers() {
  const queryClient = useQueryClient();

  const { mutate: createCustomer, isPending: isCreatingCustomer } = useMutation(
    {
      mutationFn: crCustomer,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["customers"] });
        toast.success("Product succesfully created.");
      },
      onError: (err: any) => {
        console.error("Login Error:", err?.message || "Unknown Error");
        toast.error("An error occured while trying to create the product.");
      },
    }
  );

  const { mutate: deleteCustomer, isPending: isDeletingCustomer } = useMutation(
    {
      mutationFn: removeCustomer,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["customers"] });
        toast.success("Customer removed succesfully.");
      },
      onError: (err: any) => {
        console.error("Login Error:", err?.message || "Unknown Error");
        toast.error("An error occured while trying to delete customer.");
      },
    }
  );
  const { mutate: deleteCustomers, isPending: isDeletingCustomers } =
    useMutation({
      mutationFn: deleteMultipleCustomers,
      onSuccess: (data: any[]) => {
        queryClient.invalidateQueries({ queryKey: ["customers"] });
        toast.success(`${data?.length ?? 0} Customers successfully deleted.`);
      },
      onError: (err: any) => {
        console.error("Bulk Delete Error:", err?.message || "Unknown Error");
        toast.error("An error occurred while deleting multiple customers.");
      },
    });

  const { mutate: updateCustomerAdminMutate, isPending: isUpdatingCustomer } =
    useMutation({
      mutationFn: ({ id, data }: { id: string; data: any }) =>
        updateCustomerAdmin(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["customers"] });
        toast.success("Customer updated succesfully.");
      },
      onError: (err: any) => {
        console.error("Login Error:", err?.message || "Unknown Error");
        toast.error("An error occured while trying to update customer.");
      },
    });

  const {
    isLoading: isLoadingCustomers,
    data,
    isError,
    refetch: refetchCustomers,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });
  const customers = data?.map((customer: any) => {
    return camelCase(customer);
  });

  const query = useSearchParams();
  const keyword = query.get("keyword");

  const {
    data: searchedCustomers,
    isLoading: isSearchingCustomers,
    refetch: researchCustomers,
    isError: isSearchError,
  } = useQuery({
    queryKey: ["searched-customers"],
    queryFn: () => searchCustomer(keyword || ""),
    enabled: !!keyword,
  });

  keyword && console.log("search result", searchedCustomers);

  return {
    createCustomer,
    deleteCustomer,
    refetchCustomers,
    deleteCustomers,
    updateCustomerAdminMutate,
    researchCustomers,
    isSearchingCustomers,
    isDeletingCustomers,
    isLoadingCustomers,
    isCreatingCustomer,
    isDeletingCustomer,
    customers,
    searchedCustomers,
    isError,
    isSearchError,
  };
}
