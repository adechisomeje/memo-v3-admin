import { ApiResponse, axiosClient } from '.'

export interface OperatingHours {
  operatingDays: string[]
  orderRequestWindow: string[]
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
  profilePicture: string
  isVerified: boolean
  role: 'VENDOR' | 'CUSTOMER' | 'ADMIN'
  productCategories: []
  cityDeliveryPrices: []
  createdAt: string
  updatedAt: string
  __v: number
}

export async function getAllVendors() {
  const response = await axiosClient.get<ApiResponse<VendorResponse>>(
    '/admin/vendors'
  )

  return response.data
}
