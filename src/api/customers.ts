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

export async function getAllCustomers() {
  const response = await axiosClient.get<ApiResponse<CustomerResponse>>(
    '/admin/users'
  )

  return response.data
}
