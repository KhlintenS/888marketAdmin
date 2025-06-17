"use client";
import {
  LayoutGrid,
  ShoppingBag,
  Users,
  ShoppingCart,
  SettingsIcon,
  LogOut,
  ChartNoAxesCombined,
  HelpCircle,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import SideBarLinksContainer from "./SideBarLinksContainer";
import ThirdPartyConfigDropdown from "./ThirdPartConfigInSideNav";
import { useEffect } from "react";
import Link from "next/link";

export default function SidebarCmzed() {
  const router = useRouter();
  const pathName = usePathname();
  const activeTab = pathName.slice(pathName.indexOf("/") + 1);
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.replace("/login");
    toast.success("Logged out successfully");
  };

  return (
    <div
      className="w-64 border-r border-gray-100 p-4 flex flex-col h-screen overflow-scroll scrollbar-none"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <div className="flex items-center gap-6 mb-12">
        <Link
          className="text-blue-600 font-bold text-xl flex items-center"
          href="/"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
              fill="currentColor"
            />
            <path
              d="M12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z"
              fill="currentColor"
            />
            <path
              d="M12 13C9.33 13 7 14.67 7 17H17C17 14.67 14.67 13 12 13Z"
              fill="currentColor"
            />
          </svg>
          888Market
        </Link>
      </div>

      <nav className="space-y-4 flex-1">
        <SideBarLinksContainer
          label="Main"
          childLinks={[
            {
              href: "/dashboard",
              label: "Dashboard",
              icon: <LayoutGrid size={20} />,
            },
          ]}
        />
        <SideBarLinksContainer
          label="Product Managment"
          childLinks={[
            {
              label: "Products",
              icon: <ShoppingBag size={20} />,
              href: "/products",
            },
            {
              label: "Categories",
              icon: <LayoutGrid size={20} />,
              childLinks: [
                { label: "Category", href: "categoriees" },
                { label: "Sub Category", href: "subcategories" },
              ],
              href: "",
            },
          ]}
        />
        <SideBarLinksContainer
          label="Order Managment"
          childLinks={[
            {
              href: "/orders",
              label: "Orders",
              icon: <ShoppingCart size={20} />,
            },
          ]}
        />
        {/* customer managment */}
        <SideBarLinksContainer
          label="Customer Managment"
          childLinks={[
            {
              href: "/customers",
              label: "Customers",
              icon: <Users size={20} />,
            },
          ]}
        />

        {/* approval managment */}
        {/* <SideBarLinksContainer
          label="Approval Managment"
          childLinks={[
            {
              href: "/approval/customers",
              label: "Customers",
              icon: <Users size={20} />,
            },
            {
              href: "/approval/products",
              label: "Products",
              icon: <ShoppingBag size={20} />,
            },
          ]}
        /> */}

        {/* Account Settings */}
        <SideBarLinksContainer
          label="Settings"
          childLinks={[
            {
              href: "/settings",
              label: "Settings",
              icon: <SettingsIcon size={20} />,
            },
          ]}
        />

        {/* Shops customization */}
        <SideBarLinksContainer
          label="Shops"
          childLinks={[
            {
              label: "Shops",
              icon: <ShoppingBag size={20} />,
              href: "/shops",
            },
          ]}
        />
        {/* Page customization */}
        <SideBarLinksContainer
          label={"Customizing Pages"}
          childLinks={[
            {
              icon: <LayoutGrid />,
              label: "Customizing Pages",
              href: "customizing-pages",
            },
          ]}
        />
        <SideBarLinksContainer
          label="Help & Support"
          childLinks={[
            {
              label: "Help Request",
              icon: <HelpCircle size={20} />,
              childLinks: [
                { label: "Help Notes", href: "help-notes" },
                { label: "Help Request", href: "help-requests" },
              ],
              href: "",
            },
          ]}
        />

        <ThirdPartyConfigDropdown activeTab={activeTab} />
        <div className="mt-auto pt-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2 text-gray-500 rounded-md hover:bg-gray-100"
          >
            <LogOut size={20} />
            <span>Log out</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
