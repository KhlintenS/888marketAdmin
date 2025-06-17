"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Maximize2 } from "lucide-react";
import Image from "next/image";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getCustomer, updateCustomerStatus } from "@/lib/api/customer";
import { useParams, useRouter } from "next/navigation";
import { X as CloseIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerDetail() {
  const queryClient = useQueryClient();
  const router = useRouter();
  // Remove this line to avoid unnecessary refetch on every render:
  // queryClient.invalidateQueries({ queryKey: ["customer"] });

  const { id } = useParams();
  const { data, isLoading, refetch } = useQuery<any>({
    queryKey: ["customer"],
    queryFn: () => getCustomer(Number(id)),
  });
  const customer = data;

  const status = customer?.verificationStatus?.toLowerCase();
  const imgUrl = customer?.imgUrl;
  const name = customer?.name;
  const email = customer?.email;
  const createdAt = customer?.createdAt;
  const idFront = customer?.idFront;
  const idBack = customer?.idBack;
  const videoUrl = customer?.videoUrl;
  const date = new Date(createdAt || Date.now()); // Automatically parses the timezone

  const joined = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "UTC", // or omit it to format in user's local time
  })?.format(date);

  // Collect all media for full screen viewer
  const mediaItems = [
    { type: "image", src: idFront || null, label: "Front Id" },
    { type: "video", src: videoUrl || null, label: "Facial Recognition" },
    { type: "image", src: idBack || null, label: "Back Id" },
  ].filter((item) => item.src);

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const openViewer = (idx: number) => {
    setViewerIndex(idx);
    setViewerOpen(true);
  };

  const closeViewer = () => setViewerOpen(false);

  const nextMedia = () =>
    setViewerIndex((idx) => (idx + 1) % mediaItems.length);

  const prevMedia = () =>
    setViewerIndex((idx) => (idx - 1 + mediaItems.length) % mediaItems.length);

  const { mutate: approveCustomer, isPending: isApproving } = useMutation({
    mutationFn: () => updateCustomerStatus(Number(id), "verified"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] });
      refetch();
      toast.success("Customer approved.");
    },
    onError: () => {
      toast.error("An error occurred while approving the customer.");
    },
  });

  const { mutate: rejectCustomer, isPending: isRejecting } = useMutation({
    mutationFn: () => updateCustomerStatus(Number(id), "rejected"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] });
      refetch();
      toast.success("Customer rejected.");
    },
    onError: () => {
      toast.error("An error occurred while rejecting the customer.");
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/10 to-blue-100/20 p-6">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto flex justify-end mb-4">
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => router.push("/customers")}
        >
          <ChevronLeft size={18} />
          Back to Customers
        </Button>
      </div>
      {/* Fullscreen Media Viewer */}
      {viewerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center">
          <button
            className="absolute top-10 right-10 text-white bg-black/30 hover:bg-black/40 rounded-full p-2 z-50"
            onClick={closeViewer}
            aria-label="Close"
          >
            <CloseIcon size={28} />
          </button>
          <div className="flex items-center justify-center w-full h-full">
            <button
              className="absolute left-10 top-1/2 -translate-x-1/2 text-white bg-black/30 hover:bg-black/40 rounded-full p-2"
              onClick={prevMedia}
              aria-label="Previous"
            >
              <ChevronLeft size={32} />
            </button>
            <div className="flex flex-col items-center">
              {mediaItems[viewerIndex].type === "image" ? (
                <Image
                  src={mediaItems[viewerIndex].src}
                  alt={mediaItems[viewerIndex].label}
                  width={600}
                  height={600}
                  className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg shadow-lg"
                />
              ) : (
                <video
                  src={mediaItems[viewerIndex].src}
                  controls
                  autoPlay
                  className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg bg-black"
                />
              )}
              <div className="mt-4 text-white text-lg font-semibold">
                {mediaItems[viewerIndex].label}
              </div>
            </div>
            <button
              className="absolute right-10 top-1/2 -translate-x-1/2 text-white bg-black/30 hover:bg-black/40 rounded-full p-2"
              onClick={nextMedia}
              aria-label="Next"
            >
              <ChevronRight size={32} />
            </button>
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold text-blue-900">Customer Detail</h1>
            {isLoading || isApproving || isRejecting ? (
              <Skeleton className="h-6 w-32 rounded" />
            ) : (
              <Badge
                variant="outline"
                className={
                  status === "requested"
                    ? "bg-blue-50 text-blue-700 border-blue-300 capitalize"
                    : status === "verified"
                    ? "bg-green-50 text-green-700 border-green-300 capitalize"
                    : status === "rejected"
                    ? "bg-red-50 text-red-700 border-red-300 capitalize"
                    : "bg-yellow-50 text-yellow-700 border-yellow-300 capitalize"
                }
              >
                {status === "requested" ? "Pending Review" : status}
              </Badge>
            )}
          </div>

          {/* Personal Information Section */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-blue-800 mb-6">
              1. PERSONAL INFORMATION
            </h2>
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-blue-600 mb-4">
                Profile Image
              </h2>
              <div className="flex items-center gap-6">
                {isLoading ? (
                  <Skeleton className="size-[100px] rounded-full" />
                ) : (
                  <Image
                    width={100}
                    height={100}
                    className="size-[100px] rounded-full object-cover"
                    src={imgUrl || null}
                    alt="user-img"
                  />
                )}
                <div className="text-sm text-gray-600">
                  <p className="font-semibold">Joined In</p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">
                    {isLoading ? (
                      <Skeleton className="h-4 w-32 rounded" />
                    ) : (
                      joined
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-blue-700">Name</div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-900">
                  {isLoading ? <Skeleton className="h-5 w-32" /> : name}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-semibold text-blue-700">Email</div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-900">
                  {isLoading ? <Skeleton className="h-5 w-40" /> : email}
                </div>
              </div>
            </div>
          </div>

          {/* Personal Documents Section */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-blue-800 mb-6">
              2. SUBMITTED DOCUMENTS
            </h2>

            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="border border-gray-100 p-3 rounded-md bg-gray-100">
                    {isLoading ? (
                      <Skeleton className="w-full h-[180px] rounded" />
                    ) : (
                      <>
                        <Image
                          src={idFront || null}
                          alt="user-Id"
                          width={300}
                          height={300}
                          className="size-full object-cover"
                        />
                        <div className="flex justify-center">
                          <div
                            className="flex justify-center mt-1 bg-black/15 hover:bg-black/20 size-[30px] rounded-full items-center cursor-pointer"
                            onClick={() => openViewer(0)}
                          >
                            <Maximize2 size={15} />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-center m-2 text-blue-800">
                    Front Id
                  </p>
                </div>
                <div>
                  <div className="border border-gray-100 p-3 rounded-md bg-gray-100">
                    {isLoading ? (
                      <Skeleton className="w-full h-[180px] rounded" />
                    ) : (
                      <>
                        <video
                          src={videoUrl || null}
                          muted
                          autoPlay
                          className="size-full"
                        />
                        <div className="flex justify-center">
                          <div
                            className="flex justify-center mt-1 bg-black/15 hover:bg-black/20 size-[30px] rounded-full items-center cursor-pointer"
                            onClick={() => openViewer(1)}
                          >
                            <Maximize2 size={15} />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-center m-2 text-blue-800">
                    Facial Recognition
                  </p>
                </div>
                <div>
                  <div className="border border-gray-100 p-3 rounded-md bg-gray-100">
                    {isLoading ? (
                      <Skeleton className="w-full h-[180px] rounded" />
                    ) : (
                      <>
                        <Image
                          src={idBack || null}
                          alt="user-Id"
                          width={300}
                          height={300}
                          className="size-full object-cover"
                        />
                        <div className="flex justify-center">
                          <div
                            className="flex justify-center mt-1 bg-black/15 hover:bg-black/20 size-[30px] rounded-full items-center cursor-pointer"
                            onClick={() => openViewer(2)}
                          >
                            <Maximize2 size={15} />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-center m-2 text-blue-800">
                    Back Id
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Validation Notes */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-blue-700 mb-4">
              VALIDATION NOTES
            </h3>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-700 text-sm">
                • Document appears to be authentic and unaltered
                <br />• All personal information matches the submitted data
                <br />• Document is within validity period
                <br />• Image quality is sufficient for verification
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-6 border-t border-blue-200">
            <Button
              variant="outline"
              size="lg"
              className="px-8 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
              onClick={() => rejectCustomer()}
              disabled={isRejecting || isLoading}
            >
              {isRejecting ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-red-400 border-t-transparent rounded-full"></span>
                  Rejecting...
                </span>
              ) : (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </>
              )}
            </Button>
            <Button
              size="lg"
              className="px-8 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => approveCustomer()}
              disabled={isApproving || isLoading}
            >
              {isApproving ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Approving...
                </span>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
