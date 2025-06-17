"use client";

import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Trash2,
  UsersRound,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCustomers } from "@/hooks/useCustomers";
import Error from "@/components/Error";
import Empty from "@/components/Empty";
import { useRouter, useSearchParams } from "next/navigation";
import Customer from "@/components/customer/Customer";
import { Checkbox } from "@/components/ui/checkbox";
import Modal from "@/components/Modal";
import { useState, useMemo, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Customers() {
  const {
    isLoadingCustomers,
    customers: result, // just for avoiding naming conflict
    searchedCustomers,
    isError,
    isDeletingCustomer,
    isSearchingCustomers,
    refetchCustomers,
    deleteCustomers,
    researchCustomers,
  } = useCustomers();

  const [search, setSearch] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const keyword = searchParams.get("keyword");

  const [isAllSelected, setIsSelectedAll] = useState<boolean>(false);
  const [deleteList, setDeleteList] = useState<number[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;
  const customers = keyword ? searchedCustomers : result;
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>("All");

  const verificationStatusOptions = [
    "All",
    "verified",
    "unrequested",
    "requested",
    "rejected",
  ];

  // Add filtering logic
  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    if (filter === "All") return customers;
    return customers.filter(
      (c: any) =>
        (c.verificationStatus || c.verficationStatus || "").toLowerCase() ===
        filter.toLowerCase()
    );
  }, [customers, filter]);

  // Calculate paginated customers (use filteredCustomers)
  const paginatedCustomers = useMemo(() => {
    if (!filteredCustomers) return [];
    const start = (currentPage - 1) * pageSize;
    return filteredCustomers.slice(start, start + pageSize);
  }, [filteredCustomers, currentPage]);

  const totalPages = filteredCustomers
    ? Math.ceil(filteredCustomers.length / pageSize)
    : 1;

  const removeFromDeleteList = (id: number) => {
    setDeleteList((prevList) => prevList.filter((item) => item !== id));
    if (deleteList.length === 1) setIsSelectedAll(false);
  };

  const handleDelete = () => {
    deleteCustomers(deleteList);
    setDeleteList([]);
    setIsModalVisible(false);
    setIsSelectedAll(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    queryClient.invalidateQueries({ queryKey: ["searched-customers"] });
    setSearch(e.target.value);

    if (e.target.value.length > 1) {
      params.set("keyword", e.target.value);
    } else {
      // queryClient.invalidateQueries({ queryKey: ["searched-customers"] });
      params.delete("keyword");
    }
    router.push(`?${params.toString()}`);
    researchCustomers();
  };

  // useEffect(
  //   () =>
  //     search.length > 1
  //       ? params.set("keyword", search)
  //       : params.delete("keyword"),
  //   [search]
  // );

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Customers</h2>
          <p className="text-gray-500">Manage your customer database</p>
        </div>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-4">
            {/* Filter Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <Select
                value={filter}
                onValueChange={(value: string) => {
                  setCurrentPage(1);
                  setFilter(value);
                }}
                disabled={isError || isLoadingCustomers || !customers?.length}
              >
                <SelectTrigger className="h-9 w-[140px] rounded-md border border-gray-200 bg-white text-sm px-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  {verificationStatusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <input
                value={search}
                onChange={handleSearch}
                type="text"
                placeholder="Search customers..."
                className="pl-9 h-9 w-[250px] rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isError || isLoadingCustomers || !customers?.length}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200"
              onClick={() => setIsModalVisible(true)}
              disabled={isError || isLoadingCustomers || !customers?.length}
            >
              <Trash2 size={16} className="mr-2" /> Delete
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isError || isLoadingCustomers || !customers?.length}
            >
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredCustomers && filteredCustomers.length > 7 && (
            <div className="px-4 py-2 text-sm text-gray-500">
              Showing {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, filteredCustomers.length)} of{" "}
              {filteredCustomers.length}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              {!isError && customers?.length ? (
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="w-10 p-4">
                      <Checkbox
                        onClick={() => {
                          setIsSelectedAll((state) => !state);
                          setDeleteList(
                            customers?.map((customer: any) => customer.id) || []
                          );
                        }}
                        checked={isAllSelected}
                      />
                    </th>
                    <th className="p-4 text-left font-medium text-sm text-gray-500">
                      Customer
                    </th>
                    <th className="p-4 text-left font-medium text-sm text-gray-500">
                      Location
                    </th>
                    {/* <th className="p-4 text-left font-medium text-sm text-gray-500">
                      Spent
                    </th> */}
                    <th className="p-4 text-left font-medium text-sm text-gray-500">
                      Joined
                    </th>
                    <th className="p-4 text-left font-medium text-sm text-gray-500">
                      Verification Status
                    </th>
                    {/* <th className="p-4 text-left font-medium text-sm text-gray-500">
                      Actions
                    </th> */}
                  </tr>
                </thead>
              ) : null}

              <tbody>
                {isLoadingCustomers || isSearchingCustomers ? (
                  <>
                    {Array.from({ length: pageSize }).map((_, idx) => (
                      <tr key={idx}>
                        <td className="p-4">
                          <Skeleton className="h-4 w-6 rounded" />
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
                          <Skeleton className="h-4 w-16 rounded" />
                        </td>
                        {/* <td className="p-4">
                          <Skeleton className="h-4 w-16 rounded" />
                        </td> */}
                        <td className="p-4">
                          <Skeleton className="h-4 w-20 rounded" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-6 w-20 rounded" />
                        </td>
                        {/* <td className="p-4">
                          <Skeleton className="h-8 w-16 rounded" />
                        </td> */}
                      </tr>
                    ))}
                  </>
                ) : isError ? (
                  <tr>
                    <td colSpan={8}>
                      <Error
                        description="We encountered an error while fetching customers. Please try again."
                        onRetry={refetchCustomers}
                      />
                    </td>
                  </tr>
                ) : !filteredCustomers?.length ? (
                  <tr>
                    <td colSpan={8}>
                      <Empty
                        title="No Customer available."
                        icon={
                          <UsersRound size={80} className="text-blue-500" />
                        }
                        description="Currently there are no customers in the system."
                      />
                    </td>
                  </tr>
                ) : (
                  paginatedCustomers.map((customer: any) => (
                    <Customer
                      key={customer.id}
                      customer={customer}
                      removeFromDeleteList={removeFromDeleteList}
                      checked={isAllSelected}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          {filteredCustomers && filteredCustomers.length > pageSize && (
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
                      page === currentPage ? "bg-blue-600 text-white" : ""
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
      {isModalVisible && (
        <Modal
          isVisible={isModalVisible}
          title="Confirm Deletion"
          description="Are you sure you want to delete the selected customers?"
          confirmLable="Delete"
          onConfirm={handleDelete}
          onCancel={() => setIsModalVisible(false)}
          isLoading={isDeletingCustomer}
        />
      )}
    </main>
  );
}
