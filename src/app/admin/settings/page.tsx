"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Store,
  Settings,
  AlertCircle,
  Loader2,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { axiosClient } from "@/api";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Type definitions
interface OrderAcceptanceSettings {
  originalVendorTimeoutMinutes: number;
  escalatedVendorTimeoutMinutes: number;
  maxConsecutiveDeclines: number;
  enableAutoEscalation: boolean;
  maxAlternativeVendors: number;
  lastUpdatedAt: string;
  lastUpdatedBy: string;
}

interface AwaitingOrder {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  vendor: {
    _id: string;
    businessName: string;
    email: string;
  };
  product: {
    _id: string;
    name: string;
    category: string;
    productType: string;
  };
  productCategory: string;
  amount: number;
  createdAt: string;
  acceptanceDeadline: string;
}

interface AccountabilitySummary {
  totalVendors: number;
  activeVendors: number;
  blacklistedVendors: number;
  vendorsWithDeclines: number;
}

interface BlacklistedVendor {
  _id: string;
  country: string;
  state: string;
  city: string;
  businessName: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  consecutiveDeclines: number;
}

interface WhitelistResponse {
  vendorId: string;
  businessName: string;
  canReceiveOrders: boolean;
  reason: string;
}

// Form schema for order acceptance settings
const settingsSchema = z.object({
  originalVendorTimeoutMinutes: z.number().min(1).max(1440),
  escalatedVendorTimeoutMinutes: z.number().min(1).max(1440),
  maxConsecutiveDeclines: z.number().min(1).max(10),
  enableAutoEscalation: z.boolean(),
  maxAlternativeVendors: z.number().min(1).max(20),
});

// API functions
const getOrderAcceptanceSettings = async () => {
  const response = await axiosClient.get<{ data: OrderAcceptanceSettings }>(
    "/admin/order-acceptance-settings"
  );
  return response.data.data;
};

const updateOrderAcceptanceSettings = async (
  data: z.infer<typeof settingsSchema>
) => {
  const response = await axiosClient.patch<{ data: OrderAcceptanceSettings }>(
    "/admin/order-acceptance-settings",
    data
  );
  return response.data.data;
};

const getAwaitingOrders = async () => {
  const response = await axiosClient.get<{ data: AwaitingOrder[] }>(
    "/admin/orders/awaiting-acceptance"
  );
  return response.data.data;
};

const getAccountabilitySummary = async () => {
  const response = await axiosClient.get<{ data: AccountabilitySummary }>(
    "/admin/vendors/accountability-summary"
  );
  return response.data.data;
};

const getBlacklistedVendors = async () => {
  const response = await axiosClient.get<{ data: BlacklistedVendor[] }>(
    "/admin/vendors/blacklisted"
  );
  return response.data.data;
};

const whitelistVendor = async (vendorId: string) => {
  const response = await axiosClient.patch<{ data: WhitelistResponse }>(
    `/admin/vendors/${vendorId}/whitelist`
  );
  return response.data.data;
};

// Skeleton component
const OrderManagementSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <Skeleton className="h-10 w-56" />
    </div>
    <div className="grid gap-6 md:grid-cols-2">
      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-8 w-8 rounded-full" />
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
        <div className="flex flex-col sm:flex-row  items-start sm:items-center justify-between mb-4 gap-4">
          <Skeleton className="h-10 w-[280px]" />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Deadline</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
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

export default function OrderManagementPage() {
  const [activeTab, setActiveTab] = useState("awaiting");
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] =
    useState<BlacklistedVendor | null>(null);
  const [isWhitelistModalOpen, setIsWhitelistModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Form setup
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      originalVendorTimeoutMinutes: 40,
      escalatedVendorTimeoutMinutes: 20,
      maxConsecutiveDeclines: 3,
      enableAutoEscalation: true,
      maxAlternativeVendors: 5,
    },
  });

  // Queries
  const { isPending: isSettingsPending } = useQuery({
    queryKey: ["orderAcceptanceSettings"],
    queryFn: getOrderAcceptanceSettings,
  });

  const { data: awaitingOrders, isPending: isOrdersPending } = useQuery({
    queryKey: ["awaitingOrders"],
    queryFn: getAwaitingOrders,
  });

  const { data: accountabilitySummary, isPending: isSummaryPending } = useQuery(
    {
      queryKey: ["accountabilitySummary"],
      queryFn: getAccountabilitySummary,
    }
  );

  const { data: blacklistedVendors, isPending: isBlacklistPending } = useQuery({
    queryKey: ["blacklistedVendors"],
    queryFn: getBlacklistedVendors,
  });

  // Mutation for updating settings
  const settingsMutation = useMutation({
    mutationFn: updateOrderAcceptanceSettings,
    onSuccess: () => {
      toast.success("Settings Updated", {
        description:
          "Order acceptance settings have been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["orderAcceptanceSettings"] });
      setIsSettingsModalOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to update settings", {
        description: "Please try again.",
      });
      console.error("Error updating settings:", error);
    },
  });

  // Mutation for whitelisting vendor
  const whitelistMutation = useMutation({
    mutationFn: whitelistVendor,
    onSuccess: () => {
      toast.success("Vendor Whitelisted", {
        description: "Vendor has been successfully whitelisted.",
      });
      queryClient.invalidateQueries({ queryKey: ["blacklistedVendors"] });
      queryClient.invalidateQueries({ queryKey: ["accountabilitySummary"] });
      setIsWhitelistModalOpen(false);
      setSelectedVendor(null);
    },
    onError: (error) => {
      toast.error("Failed to whitelist vendor", {
        description: "Please try again.",
      });
      console.error("Error whitelisting vendor:", error);
    },
  });

  // Handle whitelist action
  const handleWhitelist = (vendor: BlacklistedVendor) => {
    setSelectedVendor(vendor);
    setIsWhitelistModalOpen(true);
  };

  const confirmWhitelist = () => {
    if (selectedVendor) {
      whitelistMutation.mutate(selectedVendor._id);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (
    isSettingsPending ||
    isOrdersPending ||
    isSummaryPending ||
    isBlacklistPending
  ) {
    return <OrderManagementSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Order Management</h1>
        <Button onClick={() => setIsSettingsModalOpen(true)}>
          <Settings className="mr-2 h-4 w-4" />
          Configure Settings
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Vendor Accountability
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 p-1.5 text-blue-500">
              <Store className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accountabilitySummary?.totalVendors || 0}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Total Vendors
            </div>
            <div className="mt-2 text-sm">
              Active: {accountabilitySummary?.activeVendors || 0}
              <br />
              Blacklisted: {accountabilitySummary?.blacklistedVendors || 0}
              <br />
              With Declines: {accountabilitySummary?.vendorsWithDeclines || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Orders Awaiting Acceptance
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-yellow-100 p-1.5 text-yellow-500">
              <AlertCircle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {awaitingOrders?.length || 0}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Pending Orders
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Order Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4 grid w-full grid-cols-2">
              <TabsTrigger value="awaiting">Awaiting Acceptance</TabsTrigger>
              <TabsTrigger value="blacklisted">Blacklisted Vendors</TabsTrigger>
            </TabsList>

            <TabsContent value="awaiting">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Deadline</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {awaitingOrders?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Store className="h-8 w-8 text-muted-foreground opacity-50" />
                            <p className="text-lg font-medium">
                              No orders awaiting acceptance
                            </p>
                            <p className="text-sm text-muted-foreground">
                              There are no pending orders at the moment.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      awaitingOrders?.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell>
                            <div className="font-medium">
                              {order.product.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {order._id}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {order.vendor.businessName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {order.vendor.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {order.user.firstName} {order.user.lastName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {order.user.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            ₦{order.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {formatDate(order.acceptanceDeadline)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="blacklisted">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Consecutive Declines</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blacklistedVendors?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Store className="h-8 w-8 text-muted-foreground opacity-50" />
                            <p className="text-lg font-medium">
                              No blacklisted vendors
                            </p>
                            <p className="text-sm text-muted-foreground">
                              There are no blacklisted vendors at the moment.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      blacklistedVendors?.map((vendor) => (
                        <TableRow key={vendor._id}>
                          <TableCell>
                            <div className="font-medium">
                              {vendor.businessName}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {vendor.city}, {vendor.state}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {vendor.country}
                            </div>
                          </TableCell>
                          <TableCell>{vendor.email}</TableCell>
                          <TableCell>{vendor.consecutiveDeclines}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 border-green-200"
                                onClick={() => handleWhitelist(vendor)}
                                disabled={whitelistMutation.isPending}
                              >
                                {whitelistMutation.isPending &&
                                selectedVendor?._id === vendor._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  "Whitelist"
                                )}
                              </Button>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/admin/vendors/${vendor._id}`}>
                                  <span>View Details</span>
                                  <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Settings Modal */}
      <Dialog open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen}>
        <DialogContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) =>
                settingsMutation.mutate(data)
              )}
              className="space-y-4"
            >
              <DialogHeader>
                <DialogTitle>Order Acceptance Settings</DialogTitle>
                <DialogDescription>
                  Configure settings for order acceptance and escalation.
                </DialogDescription>
              </DialogHeader>

              <FormField
                control={form.control}
                name="originalVendorTimeoutMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Vendor Timeout (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="escalatedVendorTimeoutMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Escalated Vendor Timeout (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxConsecutiveDeclines"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Consecutive Declines</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enableAutoEscalation"
                render={({ field }) => (
                  <FormItem className="flex items-center space-y-0">
                    <FormLabel className="mr-2">
                      Enable Auto Escalation
                    </FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxAlternativeVendors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Alternative Vendors</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSettingsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={settingsMutation.isPending}>
                  {settingsMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save Settings"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Whitelist Confirmation Modal */}
      <Dialog
        open={isWhitelistModalOpen}
        onOpenChange={setIsWhitelistModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Vendor Whitelisting</DialogTitle>
            <DialogDescription>
              Are you sure you want to whitelist {selectedVendor?.businessName}?
              This will allow the vendor to receive orders again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsWhitelistModalOpen(false);
                setSelectedVendor(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmWhitelist}
              disabled={whitelistMutation.isPending}
            >
              {whitelistMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Confirm Whitelist"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
