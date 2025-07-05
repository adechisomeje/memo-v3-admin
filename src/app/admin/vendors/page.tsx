"use client";

import type React from "react";
import { MoreHorizontal, Search, Filter, Eye, Store, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries";
import {
  getAllVendors,
  searchVendors,
  OperatingHours,
  PaymentDetails,
  Stats,
} from "@/api/vendors";
import { useSession } from "next-auth/react";
import VendorsPageSkeleton from "./vendorsLoading";
import { VendorMetricCardProps, VendorStatusBadgeProps } from "@/types/types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function VendorsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { status } = useSession();
  const { data: vendorsResponse, isPending } = useQuery({
    queryKey: [queryKeys.allVendors, currentPage],
    queryFn: () => getAllVendors(currentPage),
    enabled: status === "authenticated" && !debouncedQuery,
    staleTime: 5 * 60 * 1000,
  });

  // Search query
  const { data: searchResponse, isPending: isSearching } = useQuery({
    queryKey: [queryKeys.vendorSearch, debouncedQuery, currentPage],
    queryFn: () => searchVendors(debouncedQuery, currentPage),
    enabled: status === "authenticated" && !!debouncedQuery,
    staleTime: 5 * 60 * 1000,
  });

  // Display the skeleton loading component when data is being fetched
  if (isPending) {
    return <VendorsPageSkeleton />;
  }

  console.log(vendorsResponse);

  const vendors = (vendorsResponse?.data || []) as Array<{
    _id: string;
    country: string;
    state: string;
    city: string;
    businessName: string;
    instagram: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    businessAddress: string;
    operatingHours: OperatingHours;
    paymentDetails: PaymentDetails;
    stats: Stats;
    profilePicture: string;
    isVerified: boolean;
    role: "VENDOR" | "CUSTOMER" | "ADMIN";
    productCategories: [];
    cityDeliveryPrices: [];
    createdAt: string;
    updatedAt: string;
    __v: number;
  }>;

  const totalVendors = vendorsResponse?.total || 0;
  const totalPages = Math.ceil(
    (vendorsResponse?.total || 0) / (vendorsResponse?.limit || 10)
  );

  const renderPaginationLinks = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // First page
        i === totalPages || // Last page
        (i >= currentPage - 1 && i <= currentPage + 1) // Pages around current page
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Vendor Management</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <VendorMetricCard
          title="Total Vendors"
          value={`${
            isSearchMode ? totalVendors : allVendorsResponse?.total || 0
          }`}
          icon={<Store className="h-5 w-5" />}
          description={isSearchMode ? "Search Results" : "All Vendors on Memo"}
        />
        <VendorMetricCard
          title="Pending Approval"
          value="0"
          icon={<Store className="h-5 w-5" />}
          description="Awaiting approval for withdrawal"
        />
        <VendorMetricCard
          title="Subscribed"
          value="0"
          icon={<Store className="h-5 w-5" />}
          description="Subscribed to the platform"
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Vendors</CardTitle>
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
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Products
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Orders</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((vendor) => (
                  <TableRow key={vendor._id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={vendor.profilePicture || ""} />
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
                    <TableCell className="hidden md:table-cell">
                      {vendor.stats.productCount}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {vendor.stats.orderCount}
                    </TableCell>
                    <TableCell>{vendor.stats.totalRevenue}</TableCell>
                    <TableCell>
                      <VendorStatusBadge
                        status={vendor.isVerified ? "active" : "pending"}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/vendors/${vendor._id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <X className="mr-2 h-4 w-4" />
                            <span>Block Vendor</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination section */}
          {!isLoading && vendors.length > 0 && (
            <div className="mt-10">
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
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to get initials from name
function getInitials(name: string = ""): string {
  return name
    .split(" ")
    .map((part) => part?.[0] || "")
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

function VendorMetricCard({
  title,
  value,
  icon,
  description,
}: VendorMetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-gray-100 p-1.5 text-gray-500">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="mt-1 text-xs text-muted-foreground">{description}</div>
      </CardContent>
    </Card>
  );
}

function VendorStatusBadge({ status }: VendorStatusBadgeProps) {
  const variants = {
    active: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    suspended: "bg-red-100 text-red-800",
  };

  return (
    <Badge variant="outline" className={`${variants[status]} border-none`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
