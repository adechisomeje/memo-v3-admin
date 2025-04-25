"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Edit,
  Save,
  Percent,
  Tag,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { queryKeys } from "@/lib/queries";
import {
  CommissionSetting,
  getAllCommissionSettings,
  getCommissionSettingByCategory,
  updateCommissionSetting,
  batchUpdateCommissionSettings,
} from "@/api/commissions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Form Schemas
const commissionSchema = z.object({
  productCategory: z.string().min(1, { message: "Category is required" }),
  commissionPercentage: z
    .number()
    .min(0)
    .max(100, { message: "Percentage must be between 0 and 100" }),
  isActive: z.boolean().default(true),
});

const batchUpdateSchema = z.object({
  commissionPercentage: z
    .number()
    .min(0)
    .max(100, { message: "Percentage must be between 0 and 100" }),
  isActive: z.boolean().default(true),
  applyToAll: z.boolean().default(true),
});

// Form value types
type CommissionFormValues = z.infer<typeof commissionSchema>;
type BatchUpdateFormValues = z.infer<typeof batchUpdateSchema>;

export default function CommissionsPage() {
  const { status } = useSession();
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false);
  const [editingCommission, setEditingCommission] =
    useState<CommissionSetting | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Queries
  const { data: commissionsResponse, isPending: isLoadingCommissions } =
    useQuery({
      queryKey: queryKeys.commissions.all,
      queryFn: () => getAllCommissionSettings(),
      enabled: status === "authenticated",
      staleTime: 5 * 60 * 1000,
    });

  // Mutations
  const updateCommissionMutation = useMutation({
    mutationFn: ({
      category,
      data,
    }: {
      category: string;
      data: Partial<CommissionFormValues>;
    }) => updateCommissionSetting(category, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.commissions.all,
      });
      toast.success("Commission setting updated successfully");
      setIsEditDialogOpen(false);
      setEditingCommission(null);
    },
    onError: (error) => {
      toast.error("Failed to update commission setting");
      console.error(error);
    },
  });

  const batchUpdateMutation = useMutation({
    mutationFn: (data: { commissionPercentage: number; isActive: boolean }) =>
      batchUpdateCommissionSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.commissions.all,
      });
      toast.success("Commission settings updated for all categories");
      setIsBatchDialogOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to update commission settings");
      console.error(error);
    },
  });

  // Forms
  const commissionForm = useForm<CommissionFormValues>({
    resolver: zodResolver(commissionSchema),
    defaultValues: {
      productCategory: "",
      commissionPercentage: 0,
      isActive: true,
    },
  });

  const batchUpdateForm = useForm<BatchUpdateFormValues>({
    resolver: zodResolver(batchUpdateSchema),
    defaultValues: {
      commissionPercentage: 0,
      applyToAll: true,
      isActive: true,
    },
  });

  // Commission edit handlers
  const handleOpenEditDialog = (commission: CommissionSetting) => {
    setEditingCommission(commission);
    commissionForm.reset({
      productCategory: commission.productCategory,
      commissionPercentage: commission.commissionPercentage,
      isActive: commission.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const onCommissionSubmit = (values: CommissionFormValues) => {
    if (editingCommission) {
      updateCommissionMutation.mutate({
        category: editingCommission.productCategory,
        data: {
          commissionPercentage: values.commissionPercentage,
          isActive: values.isActive,
        },
      });
    }
  };

  // Batch update handlers
  const handleOpenBatchDialog = () => {
    batchUpdateForm.reset({
      commissionPercentage: 0,
      applyToAll: true,
      isActive: true,
    });
    setIsBatchDialogOpen(true);
  };

  const onBatchUpdateSubmit = (values: BatchUpdateFormValues) => {
    batchUpdateMutation.mutate({
      commissionPercentage: values.commissionPercentage,
      isActive: values.isActive,
    });
  };

  // Filter commissions based on search term
  const filteredCommissions = commissionsResponse?.data.filter((commission) =>
    commission.productCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state
  if (isLoadingCommissions) {
    return <div>Loading commission settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Commission Management</h1>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Commission Information</AlertTitle>
        <AlertDescription>
          Commission settings determine the percentage fee that will be charged
          to vendors for each product category. Changes will apply to all future
          transactions.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Commission Settings</CardTitle>
            <CardDescription>
              Manage commission percentages by product category
            </CardDescription>
          </div>
          <Button onClick={handleOpenBatchDialog}>
            <Percent className="mr-2 h-4 w-4" />
            Batch Update
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search categories..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Commission (%)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommissions?.length ? (
                  filteredCommissions.map((commission) => (
                    <TableRow key={commission._id}>
                      <TableCell className="font-medium capitalize">
                        <div className="flex items-center">
                          <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                          {commission.productCategory}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-800 border-none"
                        >
                          {commission.commissionPercentage}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${
                            commission.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          } border-none`}
                        >
                          {commission.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleOpenEditDialog(commission)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit commission setting</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No commission settings found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-gray-50 px-6 py-3">
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-muted-foreground">
              Total Categories: {filteredCommissions?.length || 0}
            </p>
            <p className="text-sm text-muted-foreground">
              Last Updated:{" "}
              {filteredCommissions?.[0]?.updatedAt
                ? new Date(filteredCommissions[0].updatedAt).toLocaleDateString(
                    "en-US",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )
                : "N/A"}
            </p>
          </div>
        </CardFooter>
      </Card>

      {/* Edit Commission Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Commission Setting</DialogTitle>
            <DialogDescription>
              Update commission percentage for{" "}
              {editingCommission?.productCategory}
            </DialogDescription>
          </DialogHeader>
          <Form {...commissionForm}>
            <form
              onSubmit={commissionForm.handleSubmit(onCommissionSubmit)}
              className="space-y-4"
            >
              <FormField
                control={commissionForm.control}
                name="productCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled
                        className="capitalize bg-gray-50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={commissionForm.control}
                name="commissionPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commission Percentage</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="e.g. 10"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          min={0}
                          max={100}
                          step={0.1}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-gray-500">%</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter a value between 0% and 100%
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={commissionForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Enable or disable commission for this category
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateCommissionMutation.isPending}
                >
                  {updateCommissionMutation.isPending ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Batch Update Dialog */}
      <Dialog open={isBatchDialogOpen} onOpenChange={setIsBatchDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Batch Update Commission</DialogTitle>
            <DialogDescription>
              Set the same commission percentage for all product categories
            </DialogDescription>
          </DialogHeader>
          <Form {...batchUpdateForm}>
            <form
              onSubmit={batchUpdateForm.handleSubmit(onBatchUpdateSubmit)}
              className="space-y-4"
            >
              <FormField
                control={batchUpdateForm.control}
                name="commissionPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commission Percentage</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="e.g. 10"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          min={0}
                          max={100}
                          step={0.1}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-gray-500">%</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter a value between 0% and 100%
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={batchUpdateForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Set all categories to active or inactive
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  This action will update the commission percentage for all
                  product categories. This cannot be undone.
                </AlertDescription>
              </Alert>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsBatchDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={batchUpdateMutation.isPending}>
                  {batchUpdateMutation.isPending ? (
                    "Updating..."
                  ) : (
                    <>
                      <Percent className="mr-2 h-4 w-4" />
                      Apply to All Categories
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
