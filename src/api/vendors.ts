import { ApiResponse, axiosClient } from '.'

export interface OperatingHours {
  operatingDays: string[]
  orderRequestWindow: string[]
}

export interface Stats {
  productCount: number
  orderCount: number
  totalRevenue: number
}

export interface PaymentDetails {
  bankName: string
  bankCode: string
  accountNumber: string
  accountName: string
}

export interface VendorResponse {
  _id: string
  country: string
  state: string
  city: string
  businessName: string
  instagram: string
  firstName: string
  lastName: string
  phone: string
  email: string
  businessAddress: string
  operatingHours: OperatingHours
  paymentDetails: PaymentDetails
  stats: Stats
  profilePicture: string
  isVerified: boolean
  role: 'VENDOR' | 'CUSTOMER' | 'ADMIN'
  productCategories: []
  cityDeliveryPrices: []
  createdAt: string
  updatedAt: string
  __v: number
}

// New interfaces for deletion requests
export interface DeletionRequest {
  _id: string
  businessName: string
  firstName: string
  lastName: string
  phone: string
  email: string
  createdAt: string
  deletionReason: string
  deletionRequestedAt: string
}

export interface DeletionRequestDetail extends DeletionRequest {
  country: string
  state: string
  city: string
  businessAddress: string
  updatedAt: string
}

export interface DeletedVendor {
  _id: string
  businessName: string
  email: string
  isActive: boolean
  isDeleted: boolean
  deletedAt: string
}

interface VendorProduct {
  _id: string
  name: string
  basePrice: number
  status: 'active' | 'inactive'
  category: string
  images: string[]
}

type VendorOrder = {
  orderId: string
  customerName: string
  customerEmail: string
  date: string
  status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  amount: number
}

// Existing functions
export async function getAllVendors(page: number = 1) {
  const response = await axiosClient.get<ApiResponse<VendorResponse>>(
    `/admin/vendors?page=${page}`
  )
  return response.data
}

export async function getVendorDetails(vendorId: string) {
  const response = await axiosClient.get<ApiResponse<VendorResponse>>(
    `/admin/vendors/${vendorId}`
  )
  return response.data
}

export async function getVendorProducts(vendorId: string) {
  const response = await axiosClient.get<ApiResponse<VendorProduct>>(
    `/admin/vendors/${vendorId}/products`
  )
  return response.data
}

export async function getVendorOrders(vendorId: string) {
  const response = await axiosClient.get<ApiResponse<VendorOrder>>(
    `/admin/vendors/${vendorId}/orders`
  )
  return response.data
}

export async function getVendorPerformance(vendorId: string) {
  const response = await axiosClient.get<ApiResponse<VendorProduct>>(
    `/admin/vendors/${vendorId}/orders`
  )
  return response.data
}

// New deletion request functions
export async function getDeletionRequests() {
  const response = await axiosClient.get<ApiResponse<DeletionRequest[]>>(
    '/admin/vendors/deletion-requests'
  )
  return response.data
}

export async function getOneDeletionRequest(vendorId: string) {
  const response = await axiosClient.get<ApiResponse<DeletionRequestDetail>>(
    `/admin/vendors/${vendorId}/deletion-request`
  )
  return response.data
}

export async function deleteVendorAccount(vendorId: string) {
  const response = await axiosClient.delete<ApiResponse<DeletedVendor>>(
    `/admin/vendors/${vendorId}`
  )
  return response.data
}