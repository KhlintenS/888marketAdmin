"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, X, FileText, CreditCard, Car } from "lucide-react";

export default function Component() {
  const [selectedDocument, setSelectedDocument] = useState<string>("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "female",
    countryOfOrigin: "",
    countryOfResidence: "",
    icNumber: "",
  });

  const documentTypes = [
    {
      id: "passport",
      title: "PASSPORT",
      icon: FileText,
      image: "/placeholder.svg?height=120&width=80",
    },
    {
      id: "identity",
      title: "IDENTITY CARD",
      icon: CreditCard,
      image: "/placeholder.svg?height=80&width=120",
    },
    {
      id: "driver",
      title: "DRIVER LICENSE",
      icon: Car,
      image: "/placeholder.svg?height=80&width=120",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-blue-900 mb-8">
            SUBMIT VERIFICATION DOCUMENTS
          </h1>

          {/* Personal Information Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-blue-800 mb-6">
              1. PERSONAL INFORMATION
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-blue-700">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="bg-blue-50 border-blue-200 focus:border-blue-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="countryOrigin" className="text-blue-700">
                  Country of Origin
                </Label>
                <Select
                  value={formData.countryOfOrigin}
                  onValueChange={(value) =>
                    setFormData({ ...formData, countryOfOrigin: value })
                  }
                >
                  <SelectTrigger className="bg-blue-50 border-blue-200 focus:border-blue-400">
                    <SelectValue placeholder="Choose..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-blue-700">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="bg-blue-50 border-blue-200 focus:border-blue-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="countryResidence" className="text-blue-700">
                  Country of Residence
                </Label>
                <Select
                  value={formData.countryOfResidence}
                  onValueChange={(value) =>
                    setFormData({ ...formData, countryOfResidence: value })
                  }
                >
                  <SelectTrigger className="bg-blue-50 border-blue-200 focus:border-blue-400">
                    <SelectValue placeholder="Choose..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6">
              <Label className="text-blue-700 mb-3 block">Gender</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData({ ...formData, gender: value })
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="male"
                    id="male"
                    className="border-blue-400 text-blue-600"
                  />
                  <Label htmlFor="male" className="text-blue-700">
                    Male
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="female"
                    id="female"
                    className="border-blue-400 text-blue-600"
                  />
                  <Label htmlFor="female" className="text-blue-700">
                    Female
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Personal Documents Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-blue-800 mb-6">
              2. PERSONAL DOCUMENTS
            </h2>

            <div className="mb-6">
              <h3 className="text-md font-medium text-blue-700 mb-2">
                SELECT DOCUMENTS
              </h3>
              <p className="text-blue-600 mb-6">
                Select Personal Document Type That You Would Like To Submit
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {documentTypes.map((doc) => {
                  const IconComponent = doc.icon;
                  return (
                    <Card
                      key={doc.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedDocument === doc.id
                          ? "ring-2 ring-blue-500 bg-blue-50"
                          : "hover:bg-blue-25 border-blue-200"
                      }`}
                      onClick={() => setSelectedDocument(doc.id)}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="mb-4 flex justify-center">
                          <div className="w-24 h-32 bg-blue-100 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-12 h-12 text-blue-600" />
                          </div>
                        </div>
                        <h4 className="font-medium text-blue-800">
                          {doc.title}
                        </h4>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="space-y-2">
                <Label htmlFor="icNumber" className="text-blue-700">
                  Enter IC Number
                </Label>
                <Input
                  id="icNumber"
                  value={formData.icNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, icNumber: e.target.value })
                  }
                  className="bg-blue-50 border-blue-200 focus:border-blue-400"
                  placeholder="Enter your identification number"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-6 border-t border-blue-200">
            <Button
              variant="outline"
              size="lg"
              className="px-8 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
            >
              <X className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button
              size="lg"
              className="px-8 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              Approve
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
