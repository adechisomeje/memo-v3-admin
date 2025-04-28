import { axiosClient } from '.'

type Vendor = {
  _id: string
  businessName: string
  firstName?: string
  lastName?: string
  phone?: string
  email: string
}

export type Product = {
  _id: string
  vendor: string | Vendor
  name: string
  basePrice: number
  status: string
  category: string
  isAvailable: boolean
  createdAt: string
  image: string
  vendorName: string
}

type ProductsResponse = {
  statusCode: number
  data: Product[]
  total: number
  page: number
  limit: number
  totalProducts: number
  productsByCategory: Array<{
    category: string
    count: number
  }>
  message: string
}

type GetProductsParams = {
  page?: number
  limit?: number
  category?: 'cake' | 'gift' | 'flower' | string
  search?: string
}

export const getAllProducts = async (params?: GetProductsParams) => {
  const response = await axiosClient.get<ProductsResponse>('/admin/products', {
    params
  })
  return response.data
}