"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { ArrowLeft, Info, Plus, Save, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { useCategories } from "@/hooks/useCategories";
import { useSubCategories } from "@/hooks/useSubCategories";
import { useProducts } from "@/hooks/useProducts";
import SubmitButton from "../SubmitButton";
import { useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";

interface Price {
  original: number;
  discounted: number;
  currency: string;
}

interface FormData {
  name: string;
  description: string;
  price: Price;
  stock: number;
  category: { id: number | undefined; name: string };
  subcategory: { id: number | undefined; name: string };
  status?: string;
}

export default function ProductForm() {
  const {
    products,
    isCreatingProduct,
    isUpdatingProduct,
    createProduct,
    updateProduct,
  } = useProducts();

  const searchParams = useSearchParams();
  const pid = searchParams.get("pid");
  const product = useMemo(
    () => products?.find((p) => p.id === Number(pid)),
    [products, pid]
  );
  const isEditable = !pid || product?.createdBy === null; // Adjust logic as needed

  const statusOptions = [
    "live",
    "under review",
    "draft",
    "expired",
    "rejected",
  ];

  const defaultValues = product
    ? {
        name: product.name || "",
        description: product.description || "",
        price: {
          original: product.price?.original || 0,
          discounted: product.price?.discounted || 0,
          currency: product.price?.currency || "AED",
        },
        stock: product.stock || 0,
        category: {
          id: product.category?.id,
          name: product.category?.name || "",
        },
        subcategory: {
          id: product.subcategory?.id,
          name: product.subcategory?.name || "",
        },
        status: product.status || "",
      }
    : {
        name: "",
        description: "",
        price: { original: 0, discounted: 0, currency: "USD" },
        stock: 0,
        category: { id: undefined, name: "" },
        subcategory: { id: undefined, name: "" },
        status: "live",
      };

  // Initialize form with default values
  const {
    register,
    handleSubmit,
    control,
    setValue,
    // reset,
    formState: { errors },
    clearErrors,
  } = useForm<FormData>({ defaultValues });

  const [imgs, setImgs] = useState<{ file?: File; url: string }[]>(() =>
    product?.imgUrls ? product.imgUrls.map((url: string) => ({ url })) : []
  );
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { categories } = useCategories();
  const { subCategories } = useSubCategories();
  const [errImg, setErrImg] = useState("");

  // Track selected category id for filtering subcategories
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    product?.category?.id ?? null
  );

  // When category changes, reset subcategory if it doesn't belong to the new category
  useEffect(() => {
    if (!selectedCategoryId) return;
    setValue("category.id", selectedCategoryId);
    const currentSubCatId = control._formValues?.subcategory?.id;
    if (
      currentSubCatId &&
      subCategories &&
      !subCategories.some(
        (s) => s.id === currentSubCatId && s.category.id === selectedCategoryId
      )
    ) {
      setValue("subcategory.name", "");
      setValue("subcategory.id", undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryId, subCategories]);

  // When subcategory changes, auto-select category if not already set or mismatched
  useEffect(() => {
    // console.log("subcategog", selectedCategoryId);
    const subCatId = control._formValues?.subcategory?.id;
    if (subCatId && subCategories) {
      // console.log("entered the first if");
      const subCat = subCategories.find((s) => s.id === subCatId);
      if (
        subCat &&
        (!selectedCategoryId || selectedCategoryId !== subCat.category.id)
      ) {
        setSelectedCategoryId(subCat.category?.id);
        setValue("category.id", subCat.category.id);
        const cat = categories?.find((c) => c.id === subCat.category.id);
        if (cat) setValue("category.name", cat.name);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [control._formValues?.subcategory?.id, subCategories, categories]);

  // Filter subcategories: show all if no category selected, else only those in selected category
  const filteredSubCategories = useMemo(() => {
    if (!subCategories) return [];
    if (!selectedCategoryId) return subCategories;
    return subCategories.filter(
      (subCat) => subCat.category.id === selectedCategoryId
    );
  }, [subCategories, selectedCategoryId]);

  const onSubmit = (formData: FormData) => {
    if (!imgs.length) {
      setErrImg("Atleast one product image is required.");
      return null;
    }
    // Set discounted price to original price if not set
    const data = {
      ...formData,
      price: {
        ...formData.price,
        discounted: formData.price.discounted || formData.price.original,
      },
      imgs,
    };
    pid
      ? updateProduct({ ...data, id: pid, imgUrls: product?.imgUrls })
      : createProduct(data);
  };

  useEffect(() => {
    if (imgs?.length) setErrImg("");
  }, [imgs.length, imgs]);

  return (
    <div className="max-w-7xl p-6 bg-white">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="size-10 rounded-full hover:bg-blue-100 grid place-items-center"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </Link>
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-gray-700" />
              <h1 className="text-xl font-medium text-gray-700">
                {pid ? "Edit Product" : "Add New Product"}
              </h1>
            </div>
          </div>
          <div className="flex gap-4">
            {!pid && (
              <Button
                variant="outline"
                className="gap-2 rounded-full"
                disabled={!isEditable}
              >
                <Save className="h-5 w-5" />
                Save Draft
              </Button>
            )}
            <SubmitButton
              isLoading={pid ? isUpdatingProduct : isCreatingProduct}
              label={pid ? "Edit Product" : "Add Product"}
              disabled={!isEditable}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* General Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg mb-4 font-semibold">
                General Information
              </h2>
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="productName"
                    className="block mb-2 font-semibold"
                  >
                    Product Name
                  </Label>
                  <Input
                    id="productName"
                    className="bg-gray-100 border-0"
                    {...register("name", {
                      required: "Product name is required",
                    })}
                    placeholder="...Product name"
                    disabled={!isEditable}
                  />
                  {errors.name && (
                    <span className="text-red-500 text-xs">
                      {errors.name.message}
                    </span>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="productDescription"
                    className="block mb-2 font-semibold"
                  >
                    Product Description
                  </Label>
                  <Textarea
                    id="productDescription"
                    className="bg-gray-100 border-0 min-h-[120px]"
                    placeholder="...Description"
                    {...register("description", {
                      required: "Product description is required",
                    })}
                    disabled={!isEditable}
                  />
                  {errors.description && (
                    <span className="text-red-500 text-xs">
                      {errors.description.message}
                    </span>
                  )}
                </div>
                {/* Product Status (now part of General Information) */}
                <div>
                  <Label
                    htmlFor="productStatus"
                    className="block mb-2 font-semibold"
                  >
                    Product Status
                  </Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                        disabled={!isEditable}
                      >
                        <SelectTrigger className="bg-gray-100 border-0 w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem value={status} key={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.status && (
                    <span className="text-red-500 text-xs">
                      {errors.status.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg mb-4 font-semibold">Pricing & Stock</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="originalPrice"
                    className="block mb-2 font-semibold"
                  >
                    Original Price
                  </Label>
                  <Input
                    id="originalPrice"
                    className="bg-gray-100 border-0"
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    placeholder="...amount"
                    {...register("price.original", {
                      required: "Original price is required",
                      valueAsNumber: true,
                      validate: (v) =>
                        v > 0 || "Original price must be greater than 0",
                    })}
                    disabled={!isEditable}
                  />
                  {errors.price?.original && (
                    <span className="text-red-500 text-xs">
                      {errors.price.original.message}
                    </span>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="discountedPrice"
                    className="block mb-2 font-semibold"
                  >
                    Discounted Price
                  </Label>
                  <Input
                    id="discountedPrice"
                    className="bg-gray-100 border-0"
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    placeholder="...amount"
                    {...register("price.discounted", {
                      valueAsNumber: true,
                    })}
                    disabled={!isEditable}
                  />
                  {/* Discounted price is optional, so no error */}
                </div>
                <div>
                  <Label
                    htmlFor="currency"
                    className="block mb-2 font-semibold"
                  >
                    Currency
                  </Label>
                  <Input
                    id="currency"
                    className="bg-gray-100 border-0"
                    type="string"
                    placeholder="...currency"
                    {...register("price.currency", {
                      required: "Currency is required",
                    })}
                    disabled={!isEditable}
                  />
                  {errors.price?.currency && (
                    <span className="text-red-500 text-xs">
                      {errors.price.currency.message}
                    </span>
                  )}
                </div>
                <div>
                  <Label htmlFor="stock" className="block mb-2 font-semibold">
                    Stock
                  </Label>
                  <Input
                    id="stock"
                    defaultValue={300}
                    type="number"
                    className="bg-gray-100 border-0"
                    {...register("stock", {
                      required: "Stock is required",
                      valueAsNumber: true,
                      validate: (v) => v > 0 || "Stock must be greater than 0",
                    })}
                    disabled={!isEditable}
                  />
                  {errors.stock && (
                    <span className="text-red-500 text-xs">
                      {errors.stock.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Category Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg mb-4 font-semibold">
                Category Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="productCategory"
                    className="block mb-2 font-semibold"
                  >
                    Product Category
                  </Label>
                  <Controller
                    name="category.name"
                    control={control}
                    rules={{ required: "Category is required" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          const cat = categories?.find(
                            (c) => c.name.toLowerCase() === value.toLowerCase()
                          );
                          field.onChange(value);
                          setValue("category.id", cat?.id);
                          setSelectedCategoryId(cat?.id ?? null);
                          // Reset subcategory if it doesn't belong to this category
                          const currentSubCatId =
                            control._formValues?.subcategory?.id;
                          if (
                            currentSubCatId &&
                            subCategories &&
                            !subCategories.some(
                              (s) =>
                                s.id === currentSubCatId &&
                                s.category.id === cat?.id
                            )
                          ) {
                            setValue("subcategory.name", "");
                            setValue("subcategory.id", undefined);
                          }
                        }}
                        disabled={!isEditable}
                      >
                        <SelectTrigger className="bg-gray-100 border-0">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((cat) => (
                            <SelectItem value={cat.name} key={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category?.name && (
                    <span className="text-red-500 text-xs">
                      {errors.category.name.message}
                    </span>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="productSubCategory"
                    className="block mb-2 font-semibold"
                  >
                    Product Sub-Category
                  </Label>
                  <Controller
                    name="subcategory.name"
                    control={control}
                    rules={{ required: "Sub-category is required" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          const subCat = subCategories?.find(
                            (s) => s.name.toLowerCase() === value.toLowerCase()
                          );
                          field.onChange(value);
                          setValue("subcategory.id", subCat?.id);
                          // If category is not set or mismatched, set it to match subcategory
                          if (
                            subCat &&
                            (!selectedCategoryId ||
                              selectedCategoryId !== subCat.category.id)
                          ) {
                            setSelectedCategoryId(subCat.category?.id);
                            setValue("category.id", subCat.category?.id);
                            const cat = categories?.find(
                              (c) => c.id === subCat.category?.id
                            );
                            if (cat) setValue("category.name", cat.name);
                          }
                        }}
                        disabled={!isEditable}
                      >
                        <SelectTrigger className="bg-gray-100 border-0">
                          <SelectValue placeholder="Select sub-category" />
                        </SelectTrigger>
                        <SelectContent>
                          {(selectedCategoryId
                            ? filteredSubCategories
                            : subCategories
                          )?.map((subCat) => (
                            <SelectItem value={subCat.name} key={subCat.id}>
                              {subCat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.subcategory?.name && (
                    <span className="text-red-500 text-xs">
                      {errors.subcategory.name.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Uploads */}
          <div className="relative bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg mb-4 font-semibold">Uploads</h2>
            <div className="flex gap-2 flex-wrap">
              {imgs.map((sup, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-lg p-2 min-w-[80px] h-[80px] relative"
                >
                  <Image
                    width={40}
                    height={40}
                    src={sup.url}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-contain"
                  />
                  {!isEditable ? null : (
                    <button
                      className="size-[20px] rounded-full border border-black/60 flex justify-center items-center absolute top-0 right-0 text-xs hover:text-blue-500"
                      onClick={(e) => {
                        e.preventDefault();
                        const imgsCpy = [...imgs];
                        imgsCpy.splice(i, 1); // Remove the correct image
                        setImgs(imgsCpy);
                      }}
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
              <Input
                type="file"
                accept="image/*"
                ref={fileRef}
                style={{ display: "none" }}
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (imgs.length + files.length > 10) {
                    toast.error("Maximum amount of image reached");
                    return;
                  }
                  const newImgs = files.map((file) => ({
                    file,
                    url: URL.createObjectURL(file),
                  }));
                  setImgs((prev) => [...prev, ...newImgs]);
                  if (files.length > 0) clearErrors("imgUrls" as any);
                }}
                disabled={!isEditable}
              />
              <button
                className="border border-gray-200 rounded-lg p-2 min-w-[80px] h-[80px] flex items-center justify-center bg-gray-50"
                onClick={(e) => {
                  e.preventDefault();
                  if (!isEditable) return;
                  if (imgs.length >= 10) {
                    toast.error("Maximum amount of image reached");
                    return;
                  }
                  fileRef?.current?.click();
                }}
                type="button"
                disabled={!isEditable}
              >
                <Plus className="h-6 w-6 text-gray-400" />
              </button>
              {!imgs.length && (
                <span className="text-red-500 text-xs w-full block text-center mt-2">
                  {errImg}
                </span>
              )}
              <p className="absolute bottom-[10px] left-0 w-full flex items-center gap-1 justify-center">
                <Info className="text-gray-400 font-bold" />
                <span className="text-sm text-gray-400 font-semibold ">
                  A maximum of 10 images allowed !
                </span>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
