"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  UserX,
  Search,
  Filter,
  Trash2,
  X,
  AlertTriangle,
  Clock,
  ChevronRight,
  Loader2,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { queryKeys } from "@/lib/queries";
import {
  getDeletionRequests,
  getOneDeletionRequest,
  deleteVendorAccount,
  type DeletionRequest,
  type DeletionRequestDetail,
} from "@/api/vendors";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const DeletionRequestsSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-64" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-5 w-32" />
              <div className="h-8 w-8 rounded-full bg-gray-100 p-1.5 text-gray-300">
                <UserX className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>
            <Skeleton className="h-6 w-56" />
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
                  <TableHead>Request Date</TableHead>
                  <TableHead>Reason</TableHead>
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
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
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

export default function DeletionRequestsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] =
    useState<DeletionRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] =
    useState<DeletionRequest | null>(null);
  const queryClient = useQueryClient();

  // Fetch deletion requests
  const { data: deletionRequestsResponse, isPending } = useQuery({
    queryKey: queryKeys.deletionRequests.all,
    queryFn: getDeletionRequests,
    staleTime: 5 * 60 * 1000,
  });

  const deletionRequests = (deletionRequestsResponse?.data ||
    []) as DeletionRequest[];

  // Fetch single deletion request details
  const { data: requestDetailResponse, isPending: isDetailLoading } = useQuery({
    queryKey: queryKeys.deletionRequests.detail(selectedRequest?._id || ""),
    queryFn: () => getOneDeletionRequest(selectedRequest?._id || ""),
    enabled: !!selectedRequest?._id,
    staleTime: 5 * 60 * 1000,
  });

  const requestDetail = requestDetailResponse?.data as DeletionRequestDetail;

  // Mutation for deleting vendor account
  const deleteMutation = useMutation({
    mutationFn: (vendorId: string) => deleteVendorAccount(vendorId),
    onSuccess: (data) => {
      toast.success("Account Deleted Successfully", {
        description: `${data.data.businessName}'s account has been permanently deleted.`,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.deletionRequests.all,
      });
      setIsDeleteModalOpen(false);
      setRequestToDelete(null);
    },
    onError: (error) => {
      toast.error("Failed to delete vendor account", {
        description: "Please try again later.",
      });
      console.error("Error deleting vendor:", error);
    },
  });

  // Handle opening detail modal
  const openDetailModal = (request: DeletionRequest) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  // Handle opening delete confirmation modal
  const openDeleteModal = (request: DeletionRequest) => {
    setRequestToDelete(request);
    setIsDeleteModalOpen(true);
  };

  // Handle delete confirmation
  const handleDelete = () => {
    if (!requestToDelete) return;
    deleteMutation.mutate(requestToDelete._id);
  };

  // Handle reject (close modal without action)
  const handleReject = () => {
    setIsDeleteModalOpen(false);
    setRequestToDelete(null);
    toast.info("Deletion request rejected", {
      description: "The vendor account deletion request has been rejected.",
    });
  };

  // Filter deletion requests based on search term
  const filteredRequests = deletionRequests.filter((request) => {
    const matchesSearch =
      searchTerm === "" ||
      request.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${request.firstName} ${request.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      request.deletionReason.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Helper function to get initials from name
  function getInitials(name: string = ""): string {
    return name
      .split(" ")
      .map((part) => part?.[0] || "")
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }

  // Format date to more readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate days since request
  const getDaysSinceRequest = (dateString: string) => {
    const requestDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - requestDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isPending) {
    return <DeletionRequestsSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Account Deletion Requests</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Requests
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-orange-100 p-1.5 text-orange-500">
              <Clock className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deletionRequests.length}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Awaiting review
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Urgent Requests
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-red-100 p-1.5 text-red-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                deletionRequests.filter(
                  (req) => getDaysSinceRequest(req.deletionRequestedAt) > 7
                ).length
              }
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Over 7 days old
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Deletion Requests Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-[280px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search requests..."
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

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <UserX className="h-8 w-8 text-muted-foreground opacity-50" />
                        <p className="text-lg font-medium">No requests found</p>
                        <p className="text-sm text-muted-foreground">
                          {searchTerm
                            ? "No deletion requests match your search."
                            : "There are no pending deletion requests."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => {
                    const daysSinceRequest = getDaysSinceRequest(
                      request.deletionRequestedAt
                    );
                    const isUrgent = daysSinceRequest > 7;

                    return (
                      <TableRow key={request._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {getInitials(
                                  `${request.firstName} ${request.lastName}`
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {request.businessName}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {request.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {formatDate(request.deletionRequestedAt)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {daysSinceRequest} day
                            {daysSinceRequest !== 1 ? "s" : ""} ago
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            className="max-w-[150px] truncate"
                            title={request.deletionReason}
                          >
                            {request.deletionReason}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={isUrgent ? "destructive" : "secondary"}
                          >
                            {isUrgent ? "Urgent" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDetailModal(request)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200"
                              onClick={() => openDeleteModal(request)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Deletion Request Details</DialogTitle>
            <DialogDescription>
              Review the complete information for this deletion request.
            </DialogDescription>
          </DialogHeader>

          {isDetailLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : requestDetail ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                    Business Name
                  </h4>
                  <p className="font-medium">{requestDetail.businessName}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                    Owner Name
                  </h4>
                  <p className="font-medium">
                    {requestDetail.firstName} {requestDetail.lastName}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                    Email
                  </h4>
                  <p className="font-medium">{requestDetail.email}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                    Phone
                  </h4>
                  <p className="font-medium">{requestDetail.phone}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                    Location
                  </h4>
                  <p className="font-medium">
                    {requestDetail.city}, {requestDetail.state},{" "}
                    {requestDetail.country}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                    Business Address
                  </h4>
                  <p className="font-medium">{requestDetail.businessAddress}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                  Deletion Reason
                </h4>
                <p className="font-medium">{requestDetail.deletionReason}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                    Request Date
                  </h4>
                  <p className="font-medium">
                    {formatDate(requestDetail.deletionRequestedAt)}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                    Days Since Request
                  </h4>
                  <p className="font-medium">
                    {getDaysSinceRequest(requestDetail.deletionRequestedAt)} day
                    {getDaysSinceRequest(requestDetail.deletionRequestedAt) !==
                    1
                      ? "s"
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <p className="text-lg font-medium">No details available</p>
              <p className="text-sm">
                This deletion request may have been removed or does not exist.
              </p>
            </div>
          )}
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Account Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete{" "}
              {requestToDelete?.businessName}'s account? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              All associated data including products, orders, and customer
              information will be permanently removed.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleReject}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              style={{ color: "white" }}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Permanently
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
