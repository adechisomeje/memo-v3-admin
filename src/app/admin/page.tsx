"use client";

import type React from "react";
import Link from "next/link";
import {
  ArrowUp,
  ArrowDown,
  Users,
  Store,
  DollarSign,
  ShoppingCart,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { getAllMetrics } from "@/api/metrics";
import { getAllTransactions } from "@/api/transactions";
import { getAllOrders } from "@/api/orders";
import { getAllCustomers } from "@/api/customers";
import { getAllVendors } from "@/api/vendors";
import { queryKeys } from "@/lib/queries";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { DashboardSkeleton } from "@/lib/dashboardLoader";

export default function AdminDashboard() {
  const { status } = useSession();

  const { data: metricsResponse, isPending: isMetricsPending } = useQuery({
    queryKey: [queryKeys.allMetrics],
    queryFn: () => getAllMetrics(),
    enabled: status === "authenticated",
    staleTime: 5 * 60 * 1000,
  });

  const { data: transactionsResponse, isPending: isTransactionsPending } =
    useQuery({
      queryKey: [queryKeys.allTransactions],
      queryFn: () => getAllTransactions(),
      enabled: status === "authenticated",
      staleTime: 5 * 60 * 1000,
    });

  const { data: ordersResponse, isPending: isOrdersPending } = useQuery({
    queryKey: [queryKeys.allOrders],
    queryFn: () => getAllOrders(),
    enabled: status === "authenticated",
    staleTime: 5 * 60 * 1000,
  });

  const { data: customersResponse, isPending: isCustomersPending } = useQuery({
    queryKey: [queryKeys.allCustomers],
    queryFn: () => getAllCustomers(),
    enabled: status === "authenticated",
    staleTime: 5 * 60 * 1000,
  });

  const { data: vendorsResponse, isPending: isVendorsPending } = useQuery({
    queryKey: [queryKeys.allVendors],
    queryFn: () => getAllVendors(),
    enabled: status === "authenticated",
    staleTime: 5 * 60 * 1000,
  });

  const metrics = metricsResponse?.data.metrics;
  const recentData = metricsResponse?.data.recentData;
  const topPerformers = metricsResponse?.data.topPerformers;
  const totalRevenue = transactionsResponse?.totalRevenue || 0;
  const totalOrders = ordersResponse?.total || 0;
  const totalCustomers = customersResponse?.total || 0;
  const totalVendors = vendorsResponse?.total || 0;

  if (
    isMetricsPending ||
    isTransactionsPending ||
    isOrdersPending ||
    isCustomersPending ||
    isVendorsPending ||
    status === "loading"
  ) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Hello, Admin</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={` ₦${totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          change={0} // Placeholder for percent change
          period="All time"
        />
        <MetricCard
          title="Total Orders"
          value={totalOrders.toLocaleString()}
          icon={<ShoppingCart className="h-5 w-5" />}
          change={0} // Placeholder for percent change
          period="All time"
        />
        <MetricCard
          title="Active Customers"
          value={totalCustomers.toLocaleString()}
          icon={<Users className="h-5 w-5" />}
          change={0} // Placeholder for percent change
          period="All time"
        />
        <MetricCard
          title="Active Vendors"
          value={totalVendors.toLocaleString()}
          icon={<Store className="h-5 w-5" />}
          change={0} // Placeholder for percent change
          period="All time"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Recent Customers</CardTitle>
              <CardDescription>Newly registered customers</CardDescription>
            </div>
            <Link
              href="/admin/customers"
              className="text-sm font-medium text-primary"
            >
              View All
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentData?.customers.map((user) => (
                <div key={user._id} className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={user.profilePicture || ""} />
                    <AvatarFallback>
                      {getInitials(`${user.firstName} ${user.lastName}`)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{`${user.firstName} ${user.lastName}`}</h4>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "-"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Latest orders across all vendors
              </CardDescription>
            </div>
            <Link
              href="/admin/orders"
              className="text-sm font-medium text-primary"
            >
              View All
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentData?.orders.map((order) => (
                <div key={order._id} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    <ShoppingCart className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">
                      Order #{order._id.slice(-5)}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {order.user
                        ? `${order.user.firstName} ${order.user.lastName}`
                        : "Unknown User"}
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    ₦{order.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* <Card className='lg:col-span-1'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <div className='space-y-1'>
              <CardTitle>Issues Requiring Attention</CardTitle>
              <CardDescription>Items that need your review</CardDescription>
            </div>
            <Link
              href='/admin/issues'
              className='text-sm font-medium text-primary'
            >
              View All
            </Link>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {issues.map((issue) => (
                <div key={issue.id} className='flex items-center gap-4'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-red-100'>
                    <AlertTriangle className='h-5 w-5 text-red-500' />
                  </div>
                  <div className='flex-1'>
                    <h4 className='text-sm font-medium'>{issue.title}</h4>
                    <p className='text-xs text-muted-foreground'>
                      {issue.description}
                    </p>
                  </div>
                  <Badge
                    variant='outline'
                    className={
                      issue.priority === 'High'
                        ? 'bg-red-100 text-red-800 border-none'
                        : 'bg-yellow-100 text-yellow-800 border-none'
                    }
                  >
                    {issue.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>
              Best performing products across all vendors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers?.products.map((product, index) => (
                <div key={product._id} className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="h-10 w-10 overflow-hidden rounded-md bg-gray-100">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.productName}
                      className="h-full w-full object-cover"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">
                      {product.productName}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {product.vendorName}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      ₦{product.totalAmount.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {product.orderCount} orders
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Vendors</CardTitle>
            <CardDescription>Vendors with the highest revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers?.vendors.map((vendor, index) => (
                <div key={vendor._id} className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium">
                    {index + 1}
                  </div>
                  <Avatar>
                    <AvatarImage src={vendor.profilePicture || ""} />
                    <AvatarFallback>
                      {getInitials(`${vendor.businessName}`)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">
                      {vendor.businessName}
                    </h4>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      ₦{vendor.totalAmount.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {vendor.orderCount} orders
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: number;
  period: string;
}

function MetricCard({ title, value, icon, change, period }: MetricCardProps) {
  const isPositive = change > 0;

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
        <div className="mt-1 flex items-center text-xs">
          <span className={isPositive ? "text-green-600" : "text-red-600"}>
            {isPositive ? (
              <ArrowUp className="mr-1 h-3 w-3" />
            ) : (
              <ArrowDown className="mr-1 h-3 w-3" />
            )}
            {change}%
          </span>
          <span className="ml-1 text-muted-foreground">{period}</span>
        </div>
      </CardContent>
    </Card>
  );
}
