import { ApiResponse, axiosClient } from '.'

export interface CustomerResponse {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: 'CUSTOMER' | 'ADMIN' | 'VENDOR'
  isVerified: boolean
  profilePicture: string
  createdAt: string
  updatedAt: string
  __v: number
}
type OrderHistoryItem = {
  orderId: string
  productName: string
  vendorName: string
  createdAt: string
  status: 'new' | 'processing' | 'shipped' | 'delivered' | 'canceled'
  amount: number
  deliveryDate: string
  recipientName: string
  productCategory: string
  productImage: string
}

type CustomerDetailsResponse = {
  statusCode: number
  data: {
    userDetails: CustomerResponse
    orderHistory: OrderHistoryItem[]
  }
  message: string
}

interface CustomerListResponse extends ApiResponse<CustomerResponse> {
  page: number
  limit: number
  total: number
}

export async function getAllCustomers(page: number = 1) {
  const response = await axiosClient.get<CustomerListResponse>(
    `/admin/users?page=${page}`
  )

  return response.data
}

export async function getCustomerDetails(customerId: string) {
  const response = await axiosClient.get<CustomerDetailsResponse>(
    `/admin/users/${customerId}/details`
  )
  return response.data
}
