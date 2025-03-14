export interface Order {
  id: string
  customer: {
    name: string
    email: string
    avatar: string
  }
  vendor: string
  date: string
  status: 'PAID' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED' | 'new'
  items: number
  amount: string
  rawData: APIOrder
}

export interface APIOrder {
  _id: string
  user: User
  vendor: Vendor
  product: Product
  productCategory: string
  productDetails?: ProductDetails
  additionalProducts: AdditionalProduct[]
  amount: number
  status: string
  createdAt: string
  updatedAt: string
  deliveryDate: string
  deliveryAddress: DeliveryAddress
  deliveryFee?: number
  recipientName: string
  recipientPhone?: string
  paymentReference?: string
  note?: string
}

interface ProductDetails {
  size: string
  layers: string
  topping: string
  flavours?: string[]
}

interface Product {
  name: string
  images?: string[]
}

export interface AdditionalProduct {
  category: string
  quantity: number
  price: number
}

interface DeliveryAddress {
  address: string
  city: string
  state: string
  country: string
}

interface Vendor {
  businessName: string
  city?: string
  state?: string
  country?: string
  email: string
  phone: string
}

interface User {
  firstName: string
  lastName: string
  email: string
  phone?: string
}

export interface UserStatusBadgeProps {
  status: 'active' | 'inactive' | 'new'
}

export interface UserMetricCardProps {
  title: string
  value: string
  description: string
}

export interface TransactionMetricCardProps {
  title: string
  value: string
  icon: React.ReactNode
  description: string
}

export interface TransactionTypeBadgeProps {
  type: string
}

export interface OrderStatusBadgeProps {
  status: string
}

export interface TransactionStatusBadgeProps {
  status: string
}

export interface VendorStatusBadgeProps {
  status: 'active' | 'pending' | 'suspended'
}

export interface VendorMetricCardProps {
  title: string
  value: string
  icon: React.ReactNode
  description: string
}
