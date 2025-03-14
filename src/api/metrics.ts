import { axiosClient } from '.'

type User = {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  profilePicture?: string
  createdAt?: string
}

type ProductDetails = {
  size: string
  flavours: string[]
  topping: string
  layers: number
}

type Order = {
  _id: string
  productDetails?: ProductDetails
  user?: User
  amount: number
  status?: string
  createdAt: string
}

type Metrics = {
  revenue: {
    total: number
    percentChange: number
  }
  orders: {
    total: number
    percentChange: number
  }
  customers: {
    total: number
    percentChange: number
  }
  vendors: {
    total: number
    percentChange: number
  }
}

type RecentData = {
  customers: User[]
  orders: Order[]
}

type TopPerformerProduct = {
  _id: string
  orderCount: number
  totalAmount: number
  productId: string
  productName: string
  basePrice: number
  image: string
  vendorName: string
}

type TopPerformerVendor = {
  _id: string
  orderCount: number
  totalAmount: number
  vendorId: string
  businessName: string
  profilePicture?: string
}

type TopPerformers = {
  products: TopPerformerProduct[]
  vendors: TopPerformerVendor[]
}

type DashboardStatisticsResponse = {
  statusCode: number
  data: {
    metrics: Metrics
    recentData: RecentData
    topPerformers: TopPerformers
  }
  message: string
}

export const getAllMetrics = async () => {
  const response = await axiosClient.get<DashboardStatisticsResponse>(
    '/admin/dashboard/advanced'
  )
  return response.data
}
