"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Filter,
  FilterIcon,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useCategories } from "@/hooks/useCategories";
import { useSubCategories } from "@/hooks/useSubCategories";

export default function FilterMenu({
  onApply,
}: {
  onApply?: (filters: any) => void;
}) {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const { categories } = useCategories();
  const { subCategories } = useSubCategories();

  // Filter states
  const [statusFilters, setStatusFilters] = useState({
    live: false,
    "under review": false,
    draft: false,
    rejected: false,
    expired: false,
  });

  const [stockLevelFilters, setStockLevelFilters] = useState({
    high: false,
    medium: false,
    low: false,
  });

  type SectionKey =
    | "status"
    | "category"
    | "subcategory"
    | "stockLevel"
    | "price";

  const [expandedSections, setExpandedSections] = useState<
    Record<SectionKey, boolean>
  >({
    status: true,
    category: false,
    subcategory: false,
    stockLevel: false,
    price: false,
  });

  // Only one section can be expanded at a time
  const toggleSection = (section: SectionKey) => {
    setExpandedSections((prev) => {
      const newState: Record<SectionKey, boolean> = {
        status: false,
        category: false,
        subcategory: false,
        stockLevel: false,
        price: false,
      };
      newState[section] = !prev[section];
      return newState;
    });
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    setStatusFilters((prev) => ({ ...prev, [status]: checked }));
  };

  // Track checked categories/subcategories by id
  const [categoryChecked, setCategoryChecked] = useState<{
    [id: number]: boolean;
  }>({});
  const [subcategoryChecked, setSubcategoryChecked] = useState<{
    [id: number]: boolean;
  }>({});

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    setCategoryChecked((prev) => ({ ...prev, [categoryId]: checked }));
  };

  const handleSubcategoryChange = (subcategory: any, checked: boolean) => {
    setSubcategoryChecked((prev) => ({ ...prev, [subcategory.id]: checked }));
  };

  const handleStockLevelChange = (level: string, checked: boolean) => {
    setStockLevelFilters((prev) => ({ ...prev, [level]: checked }));
  };

  const handleApply = () => {
    const filters = {
      status: Object.entries(statusFilters)
        .filter(([_, checked]) => checked)
        .map(([status]) => status),
      categories: Object.entries(categoryChecked)
        .filter(([_, checked]) => checked)
        .map(([id]) => Number(id)),
      subcategories: Object.entries(subcategoryChecked)
        .filter(([_, checked]) => checked)
        .map(([id]) => Number(id)),
      stockLevels: Object.entries(stockLevelFilters)
        .filter(([_, checked]) => checked)
        .map(([level]) => level),
      priceRange,
    };
    onApply?.(filters);
  };

  return (
    <div className="w-[480px] max-w-7xl mx-auto p-4 space-y-4">
      {/* Filter Panel */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="flex justify-between items-center mb-1 border-b border-gray-200 px-6 py-3">
          <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
          <Button
            variant="ghost"
            className="text-blue-600 hover:text-blue-700"
            onClick={handleApply}
          >
            <FilterIcon />
          </Button>
        </div>

        <div className="p-6 py-0">
          {/* Status Filter */}
          <Collapsible
            open={expandedSections.status}
            onOpenChange={() => toggleSection("status")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-left">
              <span className=" font-medium text-gray-900 text-sm">Status</span>
              {expandedSections.status ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pb-4">
              {/* <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="Search status" className="pl-9 py-2" />
                </div> */}
              {Object.entries(statusFilters).map(([status, checked]) => (
                <div key={status} className="flex items-center space-x-3">
                  <Checkbox
                    id={`status-${status}`}
                    checked={checked}
                    onCheckedChange={(checked) =>
                      handleStatusChange(status, checked as boolean)
                    }
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label
                    htmlFor={`status-${status}`}
                    className="text-gray-700 capitalize"
                  >
                    {status}
                  </Label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
          {/* Category Filter */}
          <Collapsible
            open={expandedSections.category}
            onOpenChange={() => toggleSection("category")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-left border-t border-gray-100">
              <span className="text-sm font-medium text-gray-900">
                Category
              </span>
              {expandedSections.category ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="max-h-60 overflow-y-auto space-y-3 pb-4 pr-2">
                {categories?.map((category) => (
                  <div
                    key={category?.id}
                    className="flex items-center space-x-3"
                  >
                    <Checkbox
                      id={`category-${category.name}`}
                      checked={!!categoryChecked[category.id]}
                      onCheckedChange={(checked) =>
                        handleCategoryChange(category.id, checked as boolean)
                      }
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label
                      htmlFor={`category-${category}`}
                      className="text-gray-700 capitalize"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
          {/* Subcategory Filter */}
          <Collapsible
            open={expandedSections.subcategory}
            onOpenChange={() => toggleSection("subcategory")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-left border-t border-gray-100">
              <span className="text-sm font-medium text-gray-900">
                Subcategory
              </span>
              {expandedSections.subcategory ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="max-h-60 overflow-y-auto space-y-3 pb-4 pr-2">
                {subCategories?.map((subcategory: any) => (
                  <div
                    key={subcategory.id}
                    className="flex items-center space-x-3"
                  >
                    <Checkbox
                      id={`subcategory-${subcategory.name}`}
                      checked={!!subcategoryChecked[subcategory.id]}
                      onCheckedChange={(checked) =>
                        handleSubcategoryChange(subcategory, checked as boolean)
                      }
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label
                      htmlFor={`subcategory-${subcategory.name}`}
                      className="text-gray-700 capitalize"
                    >
                      {subcategory.name}
                    </Label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
          {/* Stock Level Filter */}
          <Collapsible
            open={expandedSections.stockLevel}
            onOpenChange={() => toggleSection("stockLevel")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-left border-t border-gray-100">
              <span className="text-sm font-medium text-gray-900">
                Stock Level
              </span>
              {expandedSections.stockLevel ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pb-4">
              {Object.entries(stockLevelFilters).map(([level, checked]) => (
                <div key={level} className="flex items-center space-x-3">
                  <Checkbox
                    id={`stock-${level}`}
                    checked={checked}
                    onCheckedChange={(checked) =>
                      handleStockLevelChange(level, checked as boolean)
                    }
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label
                    htmlFor={`stock-${level}`}
                    className="text-gray-700 capitalize"
                  >
                    {level}
                  </Label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
          {/* Price Range Filter */}
          <Collapsible
            open={expandedSections.price}
            onOpenChange={() => toggleSection("price")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-left border-t border-gray-100">
              <span className="text-sm font-medium text-gray-900">
                Price Range
              </span>
              {expandedSections.price ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pb-4">
              <div className="px-2">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={1000}
                  min={0}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="min-price" className="text-xs text-gray-600">
                    Min
                  </Label>
                  <Input
                    id="min-price"
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([
                        Number.parseInt(e.target.value) || 0,
                        priceRange[1],
                      ])
                    }
                    className="mt-1"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="max-price" className="text-xs text-gray-600">
                    Max
                  </Label>
                  <Input
                    id="max-price"
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([
                        priceRange[0],
                        Number.parseInt(e.target.value) || 1000,
                      ])
                    }
                    className="mt-1"
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <div className="flex justify-center gap-4 p-4">
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700 font-semibold"
            onClick={handleApply}
          >
            Apply Filters
          </Button>
          <Button
            className="bg-gray-50 text-gray-800 border border-gray-200 hover:bg-gray-100"
            onClick={() => {
              setCategoryChecked({});
              setSubcategoryChecked({});
              setStatusFilters({
                live: false,
                "under review": false,
                draft: false,
                rejected: false,
                expired: false,
              });
              setStockLevelFilters({
                high: true,
                medium: false,
                low: true,
              });
              setPriceRange([0, 1000]);
              onApply?.(null);
            }}
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
