"use client";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  ChevronDown,
  Search,
  User,
  Lock,
  CreditCard,
  BellIcon,
  Globe,
  HelpCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useCustomers } from "@/hooks/useCustomers";
import { useQuery } from "@tanstack/react-query";
import { getCustomerByUUID } from "@/lib/api/customer";
import React, { useEffect, useState, useRef } from "react";

export default function Settings() {
  const { currentUser } = useAuth();
  const id = currentUser?.id;
  const { updateCustomerAdminMutate } = useCustomers();
  const {
    data: customer,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => getCustomerByUUID(id),
    enabled: !!id,
  });

  // Form state for controlled inputs
  const [form, setForm] = useState({
    name: "",
    email: "",
    location: "",
    img_url: "",
    role: "",
    verification_status: "",
  });
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (customer) {
      setForm({
        name: customer.name || "",
        email: customer.email || "",
        location: customer.location || "",
        img_url: customer.img_url || customer.imgUrl || "",
        role: customer.role || "",
        verification_status: customer.verificationStatus || "",
      });
      setPreviewUrl(customer.img_url || customer.imgUrl || "");
    }
  }, [customer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Only use snake_case for backend
    const patchData = {
      ...form,
    };
    console.log("form data", patchData);
    updateCustomerAdminMutate({
      id: customer?.id,
      data: patchData,
    });
  };

  // For image selection
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent triggering when clicking the hidden input
    if (e.target instanceof HTMLInputElement) return;
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, img_url: reader.result as string }));
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  console.log(form);

  if (isLoading) return <div>Loading...</div>;

  return (
    <main className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Settings</h2>
        <p className="text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64">
            <TabsList className="flex flex-col h-auto bg-transparent space-y-1">
              <TabsTrigger value="account" className="justify-start w-full">
                <User className="mr-2 h-4 w-4" />
                Account
              </TabsTrigger>

              <TabsTrigger
                value="notifications"
                className="justify-start w-full"
              >
                <BellIcon className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
              {/* <TabsTrigger value="appearance" className="justify-start w-full">
                <Globe className="mr-2 h-4 w-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="help" className="justify-start w-full">
                <HelpCircle className="mr-2 h-4 w-4" />
                Help & Support
              </TabsTrigger> */}
            </TabsList>
          </div>
          <div className="flex-1">
            <TabsContent value="account" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Update your account information and profile details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4 md:items-center mb-6">
                    <div
                      className="relative w-[100px] h-[100px] cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <img
                        src={previewUrl || "/logo.jpg"}
                        alt="avatar"
                        width={100}
                        height={100}
                        className="rounded-full object-cover"
                        style={{ width: 100, height: 100 }}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                        tabIndex={-1}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full pointer-events-none">
                        <span className="text-white text-xs">Change</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        JPG, GIF or PNG. Max size of 800K
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      disabled={true}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      disabled={true}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="verification_status">
                      Verification Status
                    </Label>
                    <Input
                      id="verification_status"
                      name="verification_status"
                      value={form.verification_status}
                      onChange={handleChange}
                    />
                  </div>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleSave}
                  >
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notifications" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-500">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Order Updates</p>
                        <p className="text-sm text-gray-500">
                          Receive updates about your orders
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing Emails</p>
                        <p className="text-sm text-gray-500">
                          Receive marketing emails and promotions
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Product Updates</p>
                        <p className="text-sm text-gray-500">
                          Receive updates about new products
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="billing" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>
                    Manage your billing information and payment methods.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-medium">Current Plan</p>
                          <p className="text-sm text-gray-500">
                            You are currently on the Pro plan
                          </p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">
                          Pro
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                          Next billing date: June 12, 2025
                        </p>
                        <Button variant="outline" size="sm">
                          Change Plan
                        </Button>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-medium">Payment Method</p>
                          <p className="text-sm text-gray-500">
                            Visa ending in 4242
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Change
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                          Expires: 12/2025
                        </p>
                        <Button variant="outline" size="sm">
                          Add New
                        </Button>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-medium">Billing Address</p>
                          <p className="text-sm text-gray-500">
                            123 Main St, New York, NY 10001
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </main>
  );
}
