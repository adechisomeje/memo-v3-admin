"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Store,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { axiosClient } from "@/api";
import { queryKeys } from "@/lib/queries";
import { getAllVendors } from "@/api/vendors";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import SearchFilter from "@/components/ui/search-filter";

// Type definition for business verification
interface BusinessVerification {
  isVerified: boolean;
  verificationType: string | null;
  verificationNumber: string | null;
  submittedAt: string | null;
  verifiedAt: string | null;
  rejectionReason: string | null;
}

// Type definition for vendor
interface Vendor {
  _id: string;
  businessName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePicture: string;
  country: string;
  state: string;
  city: string;
  businessAddress: string;
  createdAt: string;
  isVerified: boolean;
  businessVerification: BusinessVerification;
}

const VendorVerificationSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-56" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-5 w-24" />
              <div className="h-8 w-8 rounded-full bg-gray-100 p-1.5 text-gray-300">
                <Store className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Skeleton className="h-10 w-[280px]" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div>
                          <Skeleton className="h-5 w-32 mb-1" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-24 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function VendorVerificationPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("unverified");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const rejectionReasonRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();

  // Fetch vendors
  const { data: vendorsResponse, isPending } = useQuery({
    queryKey: [queryKeys.allVendors, currentPage],
    queryFn: () => getAllVendors(currentPage),
    staleTime: 5 * 60 * 1000,
  });

  const vendors = (vendorsResponse?.data || []) as Array<Vendor>;
  //   const totalVendors = vendorsResponse?.total || 0;
  const totalPages = Math.ceil(
    (vendorsResponse?.total || 0) / (vendorsResponse?.limit || 10)
  );

  // Mutation for accepting vendor verification
  const acceptMutation = useMutation({
    mutationFn: (vendorId: string) =>
      axiosClient.patch(`/admin/vendors/${vendorId}/verification`, {
        isVerified: true,
      }),
    onSuccess: () => {
      toast.success("Verification Approved", {
        description: "Vendor has been successfully verified.",
      });
      queryClient.invalidateQueries({ queryKey: [queryKeys.allVendors] });
    },
    onError: (error) => {
      toast.error("Failed to approve vendor verification", {
        description: "Please try again.",
      });
    },
  });

  // Mutation for rejecting vendor verification
  const rejectMutation = useMutation({
    mutationFn: ({ vendorId, reason }: { vendorId: string; reason: string }) =>
      axiosClient.patch(`/admin/vendors/${vendorId}/verification`, {
        isVerified: false,
        rejectionReason: reason,
      }),
    onSuccess: () => {
      toast.success("Verification Rejected", {
        description: "Vendor verification has been rejected.",
      });
      queryClient.invalidateQueries({ queryKey: [queryKeys.allVendors] });
      setIsRejectionModalOpen(false);
      if (rejectionReasonRef.current) {
        rejectionReasonRef.current.value = "";
      }
    },
    onError: (error) => {
      toast.error("Failed to reject vendor verification", {
        description: "Please try again.",
      });
    },
  });

  // Handle vendor verification accept
  const handleAccept = (vendor: Vendor) => {
    acceptMutation.mutate(vendor._id);
  };

  // Open rejection modal
  const openRejectionModal = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsRejectionModalOpen(true);
  };

  // Handle vendor verification reject
  const handleReject = () => {
    if (!selectedVendor || !rejectionReasonRef.current?.value.trim()) return;

    rejectMutation.mutate({
      vendorId: selectedVendor._id,
      reason: rejectionReasonRef.current.value.trim(),
    });
  };

  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    const filtered = vendors.filter((vendor) => {
      const matchesSearch =
        searchTerm === "" ||
        vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${vendor.firstName} ${vendor.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === "verified") {
        return vendor.businessVerification?.isVerified === true;
      } else if (activeTab === "rejected") {
        return (
          vendor.businessVerification?.rejectionReason !== null &&
          vendor.businessVerification?.rejectionReason !== undefined &&
          vendor.businessVerification?.rejectionReason !== ""
        );
      } else {
        return (
          vendor.businessVerification?.isVerified === false &&
          (!vendor.businessVerification?.rejectionReason ||
            vendor.businessVerification?.rejectionReason === "")
        );
      }
    });

    setFilteredVendors(filtered);
  }, [vendors, searchTerm, activeTab]);

  // Helper function to get initials from name
  function getInitials(name: string = ""): string {
    return name
      .split(" ")
      .map((part) => part?.[0] || "")
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }

  // Render pagination links
  const renderPaginationLinks = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={i === currentPage}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (
        (i === currentPage - 2 && currentPage > 3) ||
        (i === currentPage + 2 && currentPage < totalPages - 2)
      ) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }
    return pages;
  };

  // Format date to more readable format
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isPending) {
    return <VendorVerificationSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Vendor Verification</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card
          className={`cursor-pointer border-l-4 ${
            activeTab === "unverified"
              ? "border-l-yellow-500"
              : "border-l-transparent"
          }`}
          onClick={() => setActiveTab("unverified")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Verification
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-yellow-100 p-1.5 text-yellow-500">
              <AlertCircle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                vendors.filter(
                  (v) =>
                    v.businessVerification?.isVerified === false &&
                    (!v.businessVerification?.rejectionReason ||
                      v.businessVerification?.rejectionReason === "")
                ).length
              }
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Awaiting review
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer border-l-4 ${
            activeTab === "verified"
              ? "border-l-green-500"
              : "border-l-transparent"
          }`}
          onClick={() => setActiveTab("verified")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Verified Vendors
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-100 p-1.5 text-green-500">
              <CheckCircle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                vendors.filter(
                  (v) => v.businessVerification?.isVerified === true
                ).length
              }
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Approved vendors
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer border-l-4 ${
            activeTab === "rejected"
              ? "border-l-red-500"
              : "border-l-transparent"
          }`}
          onClick={() => setActiveTab("rejected")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Rejected Verifications
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-red-100 p-1.5 text-red-500">
              <XCircle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                vendors.filter(
                  (v) =>
                    v.businessVerification?.rejectionReason !== null &&
                    v.businessVerification?.rejectionReason !== undefined &&
                    v.businessVerification?.rejectionReason !== ""
                ).length
              }
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Previously rejected
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Vendor Verification Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-[280px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search vendors..."
                  className="w-full pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4 grid w-full grid-cols-3">
              <TabsTrigger value="unverified">Pending</TabsTrigger>
              <TabsTrigger value="verified">Verified</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Registration Date</TableHead>
                      {activeTab === "rejected" && (
                        <TableHead>Rejection Reason</TableHead>
                      )}
                      {activeTab === "verified" && (
                        <TableHead>Verification Date</TableHead>
                      )}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVendors.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={
                            activeTab === "rejected" || activeTab === "verified"
                              ? 5
                              : 4
                          }
                          className="text-center py-8"
                        >
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Store className="h-8 w-8 text-muted-foreground opacity-50" />
                            <p className="text-lg font-medium">
                              No vendors found
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {activeTab === "unverified"
                                ? "There are no pending verification requests."
                                : activeTab === "verified"
                                ? "There are no verified vendors yet."
                                : "There are no rejected vendors."}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredVendors.map((vendor) => (
                        <TableRow key={vendor._id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage
                                  src={vendor.profilePicture || ""}
                                />
                                <AvatarFallback>
                                  {getInitials(
                                    `${vendor.firstName} ${vendor.lastName}`
                                  )}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {vendor.businessName}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {vendor.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {vendor.city || vendor.state}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {vendor.country}
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(vendor.createdAt)}</TableCell>

                          {activeTab === "rejected" && (
                            <TableCell>
                              <div
                                className="max-w-[250px] truncate"
                                title={
                                  vendor.businessVerification
                                    ?.rejectionReason || ""
                                }
                              >
                                {vendor.businessVerification?.rejectionReason ||
                                  "N/A"}
                              </div>
                            </TableCell>
                          )}

                          {activeTab === "verified" && (
                            <TableCell>
                              {formatDate(
                                vendor.businessVerification?.verifiedAt
                              )}
                            </TableCell>
                          )}

                          <TableCell className="text-right">
                            {activeTab === "unverified" && (
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-200"
                                  onClick={() => openRejectionModal(vendor)}
                                >
                                  Reject
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-green-600 border-green-200"
                                  onClick={() => handleAccept(vendor)}
                                  disabled={acceptMutation.isPending}
                                >
                                  {acceptMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    "Approve"
                                  )}
                                </Button>
                              </div>
                            )}

                            {(activeTab === "verified" ||
                              activeTab === "rejected") && (
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/admin/vendors/${vendor._id}`}>
                                  <span>View Details</span>
                                  <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) {
                              setCurrentPage(currentPage - 1);
                            }
                          }}
                        />
                      </PaginationItem>

                      {renderPaginationLinks()}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) {
                              setCurrentPage(currentPage + 1);
                            }
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Rejection Modal */}
      <Dialog
        open={isRejectionModalOpen}
        onOpenChange={setIsRejectionModalOpen}
      >
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (rejectionReasonRef.current?.value.trim()) {
                handleReject();
              }
            }}
          >
            <DialogHeader>
              <DialogTitle>Reject Vendor Verification</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting{" "}
                {selectedVendor?.businessName}&apos;s verification request. This
                reason will be visible to the vendor.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <textarea
                ref={rejectionReasonRef}
                required
                placeholder="Enter rejection reason..."
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRejectionModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="text-white"
                type="submit"
              >
                {rejectMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Reject Verification"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
