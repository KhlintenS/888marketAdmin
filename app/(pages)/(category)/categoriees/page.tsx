"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

import {
  ArchiveX,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

import { useCategories } from "@/hooks/useCategories";
import Category from "@/components/categories/Category";
import Empty from "@/components/Empty";
import Error from "@/components/Error";
import { CategoryType } from "@/components/categories/type";
import Modal from "@/components/Modal";

export default function Categories() {
  const router = useRouter();
  const {
    categories,
    isError,
    isLoadingCategories,
    refetchCategories,
    deleteCateogries,
    isDeletingCategories,
  } = useCategories();
  const [isAllSelected, setIsSelectedAll] = useState<boolean>(false);
  const [deleteList, setDeleteList] = useState<number[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7; // You can adjust this as needed

  // Calculate paginated categories
  const paginatedCategories = useMemo(() => {
    if (!categories) return [];
    const start = (currentPage - 1) * pageSize;
    return categories.slice(start, start + pageSize);
  }, [categories, currentPage]);

  const totalPages = categories ? Math.ceil(categories.length / pageSize) : 1;

  const removeFromDeleteList = (id: number) => {
    setDeleteList((prevList) => prevList.filter((item) => item !== id));
    if (deleteList.length === 1) setIsSelectedAll(false);
  };

  const handleDelete = () => {
    deleteCateogries(deleteList);
    setDeleteList([]);
    setIsModalVisible(false);
    setIsSelectedAll(false);
  };

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Categories</h2>
          <p className="text-gray-500">Manage your product categories.</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => router.push("/categoriees/new")}
        >
          <Plus className="mr-2 h-4 w-4 capitalize" /> Create New
        </Button>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search categories..."
                className="pl-9 h-9 w-[250px] rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200"
              onClick={() => setIsModalVisible(true)}
              disabled={isError || isLoadingCategories || !categories?.length}
            >
              <Trash2 size={16} className="mr-2" /> Delete
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isError || isLoadingCategories || !categories?.length}
            >
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Showing dash */}
          {categories && categories.length > 7 && (
            <div className="px-4 py-2 text-sm text-gray-500">
              Showing {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, categories.length)} of{" "}
              {categories.length}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              {!isError && categories?.length ? (
                <thead>
                  {!isError && (
                    <tr className="border-b border-gray-100">
                      <th className="w-10 p-4">
                        <Checkbox
                          onClick={() => {
                            setIsSelectedAll((state) => !state);
                            if (!isAllSelected) {
                              setDeleteList(
                                categories?.map((category) => category.id) || []
                              );
                            } else {
                              setDeleteList([]);
                            }
                          }}
                          checked={isAllSelected}
                        />
                      </th>
                      <th className="p-4 text-left font-medium text-sm text-gray-500">
                        Thumbnail
                      </th>
                      <th className="p-4 text-left font-medium text-sm text-gray-500">
                        Icon
                      </th>
                      <th className="p-4 text-left font-medium text-sm text-gray-500">
                        Name
                      </th>
                      <th className="p-4 text-left font-medium text-sm text-gray-500">
                        Actions
                      </th>
                    </tr>
                  )}
                </thead>
              ) : null}
              <tbody>
                {isLoadingCategories ? (
                  <>
                    {Array.from({ length: pageSize }).map((_, idx) => (
                      <tr key={idx}>
                        <td className="p-4">
                          <Skeleton className="h-4 w-6 rounded" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="size-[40px] rounded" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="size-[32px] rounded" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-4 w-32 rounded" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-8 w-16 rounded" />
                        </td>
                      </tr>
                    ))}
                  </>
                ) : isError ? (
                  <tr>
                    <td colSpan={7}>
                      <Error
                        description="We encountered an error while fetching categories. Please try again."
                        onRetry={refetchCategories}
                      />
                    </td>
                  </tr>
                ) : !categories?.length ? (
                  <tr>
                    <td colSpan={7}>
                      <Empty
                        title="No categories available."
                        icon={<ArchiveX size={80} className="text-blue-500" />}
                        description="Get started by adding a new category."
                        action={{
                          label: "Add new Category",
                          onClick: () => router.push("/categoriees/new"),
                        }}
                      />
                    </td>
                  </tr>
                ) : (
                  paginatedCategories.map((category) => (
                    <Category
                      key={category.id}
                      category={category as CategoryType}
                      checked={deleteList.includes(category.id)}
                      removeFromDeleteList={removeFromDeleteList}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          {categories && categories.length > pageSize && (
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
      {isModalVisible && (
        <Modal
          isVisible={isModalVisible}
          title="Confirm Delete"
          description="Are you sure you want to delete the selected categories?"
          onConfirm={handleDelete}
          onCancel={() => setIsModalVisible(false)}
          isLoading={isDeletingCategories}
        />
      )}
    </main>
  );
}
