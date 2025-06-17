"use client";

import {
  ArchiveX,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRef, useEffect, useState, useMemo } from "react";
import { useProducts } from "@/hooks/useProducts";
import Product from "@/components/products/Product";
import { useRouter } from "next/navigation";
import ProductTypes from "@/components/products/type";
import Error from "@/components/Error";
import Empty from "@/components/Empty";
import Modal from "@/components/Modal";
import { Skeleton } from "@/components/ui/skeleton";
import FilterMenu from "@/components/FilterMenu";

// Adjust the import path as needed

export default function Products() {
  const pageSize = 8; // Number of products per page

  const {
    products,
    isLoadingProducts,
    isError,
    isDeletingProducts,
    refetchProducts,
    deleteProducts,
  } = useProducts();
  const router = useRouter();
  const [isAllSelected, setIsSelectedAll] = useState<boolean>(false);
  const [deleteList, setDeleteList] = useState<number[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<any>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  // Close filter menu on click outside or ESC
  useEffect(() => {
    if (!showFilter) return;

    function handleClick(e: MouseEvent) {
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(e.target as Node)
      ) {
        setShowFilter(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowFilter(false);
        setFilters(null); // Clear all filters on ESC
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [showFilter]);

  // Filtering logic
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!filters) return products;

    let result = [...products];
    console.log("result", result);
    console.log("filters", filters);

    // Status filter
    if (filters.status && filters.status.length > 0) {
      result = result.filter((p) =>
        filters.status.includes((p.status || "").toLowerCase())
      );
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      result = result.filter((p) =>
        filters.categories.includes(p.category?.id)
      );
    }

    // Subcategory filter
    if (filters.subcategories && filters.subcategories.length > 0) {
      result = result.filter((p) =>
        filters.subcategories.includes(p.subcategory?.id)
      );
    }

    // Stock level filter
    if (filters.stockLevels && filters.stockLevels.length > 0) {
      result = result.filter((p) => {
        const stock = p.stock ?? 0;
        if (filters.stockLevels.includes("high") && stock > 20) return true;
        if (filters.stockLevels.includes("medium") && stock > 0 && stock <= 20)
          return true;
        if (filters.stockLevels.includes("low") && stock === 0) return true;
        return false;
      });
    }

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      result = result.filter((p) => {
        const price =
          p.price?.discounted ?? p.price?.orignal ?? p.price?.amount ?? 0;
        return price >= min && price <= max;
      });
    }

    return result;
  }, [products, filters]);

  // Calculate paginated products
  const paginatedProducts = useMemo(() => {
    if (!filteredProducts) return [];
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage]);

  const totalPages = filteredProducts
    ? Math.ceil(filteredProducts.length / pageSize)
    : 1;

  const removeFromDeleteList = (id: number) => {
    setDeleteList((prevList) => prevList.filter((item) => item !== id));
    if (deleteList.length === 1) setIsSelectedAll(false);
  };

  const handleDelete = () => {
    // console.log("Deleting products:", deleteList);
    deleteProducts(deleteList);
    setDeleteList([]);
    setIsModalVisible(false);
    setIsSelectedAll(false);
  };

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Products</h2>
          <p className="text-gray-500">Manage your product inventory</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => router.replace("/products/new")}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-4 relative">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <input
                disabled={isError || isLoadingProducts || !products?.length}
                type="text"
                placeholder="Search products..."
                className="pl-9 h-9 w-[250px] rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Filter Button (beside search) */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white hover:text-white w-[120px] text-left"
                onClick={() => setShowFilter((v) => !v)}
                disabled={isError || isLoadingProducts || !products?.length}
              >
                <Filter size={16} />
                Filter
              </Button>
              {showFilter && (
                <div
                  className="absolute -left-3 top-8 z-30"
                  ref={filterMenuRef}
                  tabIndex={-1}
                >
                  <FilterMenu
                    onApply={(appliedFilters: any) => {
                      setFilters(appliedFilters);
                      setShowFilter(false);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200"
              onClick={() => setIsModalVisible(true)}
              disabled={isError || isLoadingProducts || !products?.length}
            >
              <Trash2 size={16} className="mr-2" /> Delete
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isError || isLoadingProducts || !products?.length}
            >
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Showing dash */}
          {filteredProducts && filteredProducts.length > 7 && (
            <div className="px-4 py-2 text-sm text-gray-500">
              Showing {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, filteredProducts.length)} of{" "}
              {filteredProducts.length}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              {!isError && filteredProducts?.length ? (
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="w-10 p-4">
                      <Checkbox
                        onClick={() => {
                          setIsSelectedAll((state) => !state);
                          if (!isAllSelected) {
                            setDeleteList(
                              products?.map((product) => product.id) || []
                            );
                          }
                        }}
                        checked={isAllSelected}
                      />
                    </th>
                    <th className="p-4 text-left font-medium text-sm text-gray-500">
                      Product
                    </th>
                    <th className="p-4 text-left font-medium text-sm text-gray-500">
                      Category
                    </th>
                    <th className="p-4 text-left font-medium text-sm text-gray-500">
                      Sub-Category
                    </th>
                    <th className="p-4 text-left font-medium text-sm text-gray-500">
                      Price
                    </th>
                    <th className="p-4 text-left font-medium text-sm text-gray-500">
                      Stock
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
                {isLoadingProducts ? (
                  <>
                    {Array.from({ length: pageSize }).map((_, idx) => (
                      <tr key={idx}>
                        <td className="p-4">
                          <Skeleton className="h-4 w-6 rounded" />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Skeleton className="size-[40px] rounded-full" />
                            <Skeleton className="h-4 w-24 rounded" />
                          </div>
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-4 w-20 rounded" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-4 w-20 rounded" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-4 w-16 rounded" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-4 w-12 rounded" />
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
                        description="We encountered an error while fetching products. Please try again."
                        onRetry={refetchProducts}
                      />
                    </td>
                  </tr>
                ) : !filteredProducts?.length ? (
                  <tr>
                    <td colSpan={8}>
                      <Empty
                        title="No products available."
                        icon={<ArchiveX size={80} className="text-blue-500" />}
                        description="Get started by adding products."
                        action={{
                          label: "Add new Product",
                          onClick: () => router.push("/products/new"),
                        }}
                      />
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((product) => (
                    <Product
                      key={product.id}
                      product={product as ProductTypes}
                      checked={isAllSelected}
                      removeFromDeleteList={removeFromDeleteList}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          {filteredProducts && filteredProducts.length > pageSize && (
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

      {/* Modal */}
      <Modal
        isVisible={isModalVisible}
        title="Confirm Deletion"
        description="Are you sure you want to delete the selected products? This action cannot be undone."
        confirmLable="Delete"
        onConfirm={handleDelete}
        onCancel={() => setIsModalVisible(false)}
        isLoading={isDeletingProducts}
      />
    </main>
  );
}
