"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MoreVertical, Pencil, Trash } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "../ui/button";
import { SubCategoryType } from "./type";
import { useSubCategories } from "@/hooks/useSubCategories";
import Modal from "../Modal";

interface SubCategoryProps {
  subCategory: SubCategoryType;
  checked?: boolean;
  key: string;
  removeFromDeleteList?: (id: number) => void;
}

export default function SubCategory({
  subCategory,
  checked,
  removeFromDeleteList,
}: SubCategoryProps) {
  const {
    id,
    imgUrl,
    name,
    category: { name: categoryName },
  } = subCategory;

  const { deleteSubCategory, isDeletingSubCategory } = useSubCategories();
  const [checkedState, setCheckedState] = useState<boolean>(checked || false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <tr className="border-b border-gray-100">
      <td className="p-4">
        <Checkbox
          className="accent-blue-600"
          checked={checkedState}
          onClick={() => {
            setCheckedState((state) => !state);
            if (checkedState) removeFromDeleteList?.(id);
          }}
        />
      </td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-md">
            <Image
              src={
                imgUrl ||
                "https://w7.pngwing.com/pngs/454/1021/png-transparent-consumer-electronics-gadget-advanced-electronics-electronic-component-others-electronics-laptop-electronic-device-thumbnail.png"
              }
              alt={name}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </td>
      <td className="p-4 text-sm">{name}</td>
      <td className="p-4 text-sm">{categoryName}</td>
      <td className="p-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200"
            onClick={() => deleteSubCategory(id)}
          >
            <Trash size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-blue-600 border-blue-200"
          >
            <Pencil size={16} />
          </Button>
        </div>
      </td>
      {isModalVisible && (
        <td>
          <Modal
            isVisible={isModalVisible}
            title="Confirm Deletion"
            description="Are you sure you want to delete the product? This action cannot be undone."
            confirmLable="Delete"
            isLoading={isDeletingSubCategory}
            onConfirm={() => {
              deleteSubCategory(id);
            }}
            onCancel={() => setIsModalVisible(false)}
          />
        </td>
      )}
    </tr>
  );
}
