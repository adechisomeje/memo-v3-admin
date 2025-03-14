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
  date: string // You can use `Date` if you plan to parse it into a Date object
  status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled' // Adjust based on possible statuses
  amount: number
}

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
