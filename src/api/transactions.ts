import { axiosClient } from '.'

type User = {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
}

type Vendor = {
  _id: string
  businessName: string
  firstName?: string
  lastName?: string
  phone?: string
  email: string
}

type ProductDetails = {
  size: string
  flavours: string[]
  topping: string
  layers: number
}

type Order = {
  commissionAmount: number
  _id: string
  productDetails: ProductDetails
  amount: number
  status: string
}

type Transaction = {
  _id: string
  order: Order
  customer: User
  vendor: Vendor
  amount: number
  paymentReference: string
  paymentGateway: string
  status: string
  type: string
  currency: string
  createdAt: string
  updatedAt: string
  __v: number
}

type TransactionsResponse = {
  statusCode: number
  data: Transaction[]
  total: number
  page: number
  limit: number
  message: string
  totalRevenue: number,
  totalVendorPayouts: number,
  totalCommissions: number,
}

export const getAllTransactions = async () => {
  const response = await axiosClient.get<TransactionsResponse>(
    '/admin/transactions'
  )
  return response.data
}
