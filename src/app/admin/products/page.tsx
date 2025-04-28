"use client";

import { Search, Filter, Download } from "lucide-react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { queryKeys } from "@/lib/queries";
import { getAllProducts } from "@/api/products";
import ProductsManagementSkeleton from "./productsLoading";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsPage() {
  const { status } = useSession();
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string>("all");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const {
    data: productsResponse,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: [queryKeys.allProducts, { page, category }],
    queryFn: () =>
      getAllProducts({
        page,
        limit: 15,
        category: category === "all" ? undefined : category,
      }),
    enabled: status === "authenticated",
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    setPage(1);
  }, [category]);

  useEffect(() => {
    if (!isPending && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [isPending, isInitialLoad]);

  if (isInitialLoad && isPending) {
    return <ProductsManagementSkeleton />;
  }

  // Calculate category counts
  const categoryCounts = {
    cake:
      productsResponse?.productsByCategory.find((c) => c.category === "cake")
        ?.count || 0,
    gift:
      productsResponse?.productsByCategory.find((c) => c.category === "gift")
        ?.count || 0,
    flower:
      productsResponse?.productsByCategory.find((c) => c.category === "flower")
        ?.count || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Product Management</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <ProductMetricCard
          title="Total Products"
          value={productsResponse?.totalProducts?.toString() || "0"}
          description="Across all vendors"
        />
        <ProductMetricCard
          title="Cakes"
          value={categoryCounts.cake.toString()}
          description="All cake products"
        />
        <ProductMetricCard
          title="Gifts"
          value={categoryCounts.gift.toString()}
          description="All gift products"
        />
        <ProductMetricCard
          title="Flowers"
          value={categoryCounts.flower.toString()}
          description="All flower products"
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <Tabs
            defaultValue="all"
            value={category}
            onValueChange={(value) => setCategory(value)}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Products</CardTitle>
                <CardDescription>
                  Manage all products available on the platform
                </CardDescription>
              </div>
              <TabsList>
                <TabsTrigger value="all">All Products</TabsTrigger>
                <TabsTrigger value="cake">Cakes</TabsTrigger>
                <TabsTrigger value="gift">Gifts</TabsTrigger>
                <TabsTrigger value="flower">Flowers</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-[280px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full pl-8"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select
                value={category}
                onValueChange={(value) => setCategory(value)}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="cake">Cakes</SelectItem>
                  <SelectItem value="gift">Gifts</SelectItem>
                  <SelectItem value="flower">Flowers</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
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
                  <TableHead>Product</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Category
                  </TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isFetching
                  ? Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={`skeleton-${index}`}>
                        <TableCell>
                          <Skeleton className="h-4 w-4 rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-[120px]" />
                              <Skeleton className="h-3 w-[80px]" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[80px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[60px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-[70px] rounded-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  : productsResponse?.data.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={product.image} />
                              <AvatarFallback>
                                {getInitials(product.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-xs text-muted-foreground">
                                ID: {product._id}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{product.vendorName}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {product.category.charAt(0).toUpperCase() +
                            product.category.slice(1)}
                        </TableCell>
                        <TableCell>
                          ₦{product.basePrice.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <ProductStatusBadge
                            status={product.isAvailable ? "active" : "inactive"}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              <strong>
                {((productsResponse?.page || 1) - 1) *
                  (productsResponse?.limit || 15) +
                  1}
              </strong>{" "}
              to{" "}
              <strong>
                {Math.min(
                  (productsResponse?.page || 1) *
                    (productsResponse?.limit || 15),
                  productsResponse?.total || 0
                )}
              </strong>{" "}
              of <strong>{productsResponse?.total || 0}</strong> products
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!productsResponse?.page || productsResponse.page <= 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={
                  !productsResponse?.total ||
                  (productsResponse?.page || 0) *
                    (productsResponse?.limit || 15) >=
                    (productsResponse?.total || 0)
                }
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ProductMetricCardProps {
  title: string;
  value: string;
  description: string;
}

function ProductMetricCard({
  title,
  value,
  description,
}: ProductMetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="mt-1 text-xs text-muted-foreground">{description}</div>
      </CardContent>
    </Card>
  );
}

interface ProductStatusBadgeProps {
  status: "active" | "inactive";
}

function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  const variants = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-red-100 text-red-800",
  };

  const labels = {
    active: "Active",
    inactive: "Inactive",
  };

  return (
    <Badge variant="outline" className={`${variants[status]} border-none`}>
      {labels[status]}
    </Badge>
  );
}
