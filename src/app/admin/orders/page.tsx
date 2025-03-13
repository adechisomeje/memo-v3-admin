'use client'

import type React from 'react'

import { useState } from 'react'
import {
  MoreHorizontal,
  Search,
  Filter,
  Download,
  Eye,
  ShoppingCart,
  MapPin,
  Calendar,
  Phone,
  User,
  Store,
  CreditCard,
  X,
  Clock,
  Cake,
  Package,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Image from 'next/image'

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsSheetOpen(true)
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Order Management</h1>
        <Button variant='outline'>
          <Download className='mr-2 h-4 w-4' />
          Export Orders
        </Button>
      </div>

      <div className='grid gap-6 md:grid-cols-4'>
        <OrderMetricCard
          title='Total Orders'
          value='12,543'
          icon={<ShoppingCart className='h-5 w-5' />}
          description='All time'
        />
        <OrderMetricCard
          title='PAID'
          value='243'
          icon={<ShoppingCart className='h-5 w-5' />}
          description='Payment received'
        />
        <OrderMetricCard
          title='PROCESSING'
          value='84'
          icon={<ShoppingCart className='h-5 w-5' />}
          description='In preparation'
        />
        <OrderMetricCard
          title='DELIVERED'
          value='11,982'
          icon={<ShoppingCart className='h-5 w-5' />}
          description='Successfully delivered'
        />
      </div>

      <Card>
        <CardHeader>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
            <div>
              <CardTitle>Orders</CardTitle>
              <CardDescription>
                View and manage all orders across the platform
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4'>
            <div className='flex items-center gap-2 w-full sm:w-auto'>
              <div className='relative w-full sm:w-[280px]'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  type='search'
                  placeholder='Search orders...'
                  className='w-full pl-8'
                />
              </div>
              <Button variant='outline' size='sm'>
                <Filter className='mr-2 h-4 w-4' />
                Filter
              </Button>
            </div>
            <div className='flex items-center gap-2 w-full sm:w-auto'>
              <Select defaultValue='newest'>
                <SelectTrigger className='w-full sm:w-[180px]'>
                  <SelectValue placeholder='Sort by' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='newest'>Total</SelectItem>
                  <SelectItem value='oldest'>Paid</SelectItem>
                  <SelectItem value='amount-high'>
                    Amount (High to Low)
                  </SelectItem>
                  <SelectItem value='amount-low'>
                    Amount (Low to High)
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button variant='outline' size='icon'>
                <Download className='h-4 w-4' />
              </Button>
            </div>
          </div>

          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead className='hidden md:table-cell'>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='hidden md:table-cell'>Items</TableHead>
                  <TableHead className='text-right'>Amount</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className='font-medium'>{order.id}</TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <div className='h-8 w-8 overflow-hidden rounded-full bg-gray-100'>
                          <Image
                            src={order.customer.avatar || '/placeholder.svg'}
                            alt={order.customer.name}
                            className='h-full w-full object-cover'
                            width={32}
                            height={32}
                          />
                        </div>
                        <div>
                          <div className='font-medium'>
                            {order.customer.name}
                          </div>
                          <div className='text-xs text-muted-foreground'>
                            {order.customer.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{order.vendor}</TableCell>
                    <TableCell className='hidden md:table-cell'>
                      {order.date}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className='hidden md:table-cell'>
                      {order.items}
                    </TableCell>
                    <TableCell className='text-right'>
                      ${order.amount}
                    </TableCell>
                    <TableCell className='text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-8 w-8 p-0'
                          >
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(order)}
                          >
                            <Eye className='mr-2 h-4 w-4' />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className='mr-2 h-4 w-4' />
                            <span>Contact Customer</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className='flex items-center justify-between mt-4'>
            <div className='text-sm text-muted-foreground'>
              Showing <strong>1</strong> to <strong>10</strong> of{' '}
              <strong>100</strong> results
            </div>
            <div className='flex items-center gap-2'>
              <Button variant='outline' size='sm' disabled>
                Previous
              </Button>
              <Button variant='outline' size='sm'>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <OrderDetailsSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        order={selectedOrder}
      />
    </div>
  )
}

interface OrderMetricCardProps {
  title: string
  value: string
  icon: React.ReactNode
  description: string
}

function OrderMetricCard({
  title,
  value,
  icon,
  description,
}: OrderMetricCardProps) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <div className='h-8 w-8 rounded-full bg-gray-100 p-1.5 text-gray-500'>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        <div className='mt-1 text-xs text-muted-foreground'>{description}</div>
      </CardContent>
    </Card>
  )
}

interface OrderStatusBadgeProps {
  status: 'PAID' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED' | 'new'
}

function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const variants: Record<string, string> = {
    PAID: 'bg-yellow-100 text-yellow-800',
    PROCESSING: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    new: 'bg-blue-100 text-blue-800',
  }

  const displayStatus = status === 'new' ? 'NEW' : status

  return (
    <Badge variant='outline' className={`${variants[status]} border-none`}>
      {displayStatus}
    </Badge>
  )
}

interface OrderDetailsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
}

function OrderDetailsSheet({
  open,
  onOpenChange,
  order,
}: OrderDetailsSheetProps) {
  if (!order) return null

  // Format currency
  const formatCurrency = (amount: number | string) => {
    const numAmount =
      typeof amount === 'string' ? Number.parseFloat(amount) : amount
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(numAmount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-full sm:max-w-xl md:max-w-2xl overflow-y-auto'>
        <SheetHeader className='pb-4'>
          <SheetTitle className='text-xl flex items-center justify-between'>
            <span>Order Details</span>
            <OrderStatusBadge status={order.status} />
          </SheetTitle>
          <SheetDescription>
            Order ID: <span className='font-medium'>{order.id}</span>
          </SheetDescription>
        </SheetHeader>

        <div className='space-y-6 py-4'>
          {/* Order Summary */}
          <div>
            <h3 className='text-lg font-medium mb-2'>Order Summary</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-1'>
                <p className='text-sm text-muted-foreground'>Date Placed</p>
                <p className='font-medium'>{order.date}</p>
              </div>
              <div className='space-y-1'>
                <p className='text-sm text-muted-foreground'>Total Amount</p>
                <p className='font-medium'>${order.amount}</p>
              </div>
              <div className='space-y-1'>
                <p className='text-sm text-muted-foreground'>
                  Payment Reference
                </p>
                <p className='font-medium'>
                  {detailedOrder.paymentReference || 'N/A'}
                </p>
              </div>
              <div className='space-y-1'>
                <p className='text-sm text-muted-foreground'>Items</p>
                <p className='font-medium'>{order.items}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Customer Information */}
          <div>
            <h3 className='text-lg font-medium mb-2 flex items-center'>
              <User className='mr-2 h-5 w-5 text-muted-foreground' />
              Customer Information
            </h3>
            <div className='flex items-center gap-3 mb-3'>
              <Avatar>
                <AvatarImage src={order.customer.avatar} />
                <AvatarFallback>
                  {getInitials(order.customer.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className='font-medium'>{order.customer.name}</p>
                <p className='text-sm text-muted-foreground'>
                  {order.customer.email}
                </p>
              </div>
            </div>
            <div className='space-y-1'>
              <div className='flex items-center gap-2'>
                <Phone className='h-4 w-4 text-muted-foreground' />
                <p className='text-sm'>
                  {detailedOrder.recipientPhone || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Vendor Information */}
          <div>
            <h3 className='text-lg font-medium mb-2 flex items-center'>
              <Store className='mr-2 h-5 w-5 text-muted-foreground' />
              Vendor Information
            </h3>
            <div className='space-y-1'>
              <p className='font-medium'>{order.vendor}</p>
              {detailedOrder.vendor && (
                <div className='text-sm text-muted-foreground'>
                  <p>
                    {detailedOrder.vendor.city}, {detailedOrder.vendor.state},{' '}
                    {detailedOrder.vendor.country}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Product Details */}
          <div>
            <h3 className='text-lg font-medium mb-2 flex items-center'>
              <Package className='mr-2 h-5 w-5 text-muted-foreground' />
              Product Details
            </h3>

            {/* Main Product */}
            {detailedOrder.product && (
              <div className='mb-4'>
                <div className='flex gap-3 mb-2'>
                  <div className='h-16 w-16 overflow-hidden rounded-md bg-gray-100'>
                    <Image
                      src={
                        detailedOrder.product.images?.[0] || '/placeholder.svg'
                      }
                      alt={detailedOrder.product.name}
                      className='h-full w-full object-cover'
                      width={64}
                      height={64}
                    />
                  </div>
                  <div>
                    <p className='font-medium'>{detailedOrder.product.name}</p>
                    <p className='text-sm text-muted-foreground capitalize'>
                      {detailedOrder.productCategory}
                    </p>
                    <p className='text-sm font-medium mt-1'>
                      {formatCurrency(detailedOrder.amount / 100)}
                    </p>
                  </div>
                </div>

                {/* Product Specifications */}
                {detailedOrder.productDetails && (
                  <div className='bg-muted p-3 rounded-md mt-2'>
                    <h4 className='text-sm font-medium mb-2 flex items-center'>
                      <Cake className='mr-2 h-4 w-4' />
                      Specifications
                    </h4>
                    <div className='grid grid-cols-2 gap-2 text-sm'>
                      <div>
                        <span className='text-muted-foreground'>Size:</span>{' '}
                        <span className='font-medium'>
                          {detailedOrder.productDetails.size}
                        </span>
                      </div>
                      <div>
                        <span className='text-muted-foreground'>Layers:</span>{' '}
                        <span className='font-medium'>
                          {detailedOrder.productDetails.layers}
                        </span>
                      </div>
                      <div>
                        <span className='text-muted-foreground'>Topping:</span>{' '}
                        <span className='font-medium'>
                          {detailedOrder.productDetails.topping}
                        </span>
                      </div>
                      <div>
                        <span className='text-muted-foreground'>Flavors:</span>{' '}
                        <span className='font-medium'>
                          {detailedOrder.productDetails.flavours?.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Additional Products */}
            {detailedOrder.additionalProducts &&
              detailedOrder.additionalProducts.length > 0 && (
                <div>
                  <h4 className='text-sm font-medium mb-2'>
                    Additional Products
                  </h4>
                  {detailedOrder.additionalProducts.map((item, index) => (
                    <div key={index} className='flex gap-3 mb-2 border-t pt-2'>
                      <div className='h-12 w-12 overflow-hidden rounded-md bg-gray-100'>
                        <Image
                          src={item.product.images?.[0] || '/placeholder.svg'}
                          alt={item.product.name}
                          className='h-full w-full object-cover'
                          width={48}
                          height={48}
                        />
                      </div>
                      <div>
                        <p className='font-medium'>{item.product.name}</p>
                        <p className='text-sm text-muted-foreground capitalize'>
                          {item.category}
                        </p>
                        <div className='flex justify-between text-sm'>
                          <span>Qty: {item.quantity}</span>
                          <span className='font-medium'>
                            {formatCurrency(item.price / 100)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>

          <Separator />

          {/* Delivery Information */}
          <div>
            <h3 className='text-lg font-medium mb-2 flex items-center'>
              <MapPin className='mr-2 h-5 w-5 text-muted-foreground' />
              Delivery Information
            </h3>

            {detailedOrder.deliveryAddress && (
              <div className='space-y-2'>
                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>Recipient</p>
                  <p className='font-medium'>{detailedOrder.recipientName}</p>
                </div>

                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>Address</p>
                  <p className='font-medium'>
                    {detailedOrder.deliveryAddress.address},{' '}
                    {detailedOrder.deliveryAddress.city},{' '}
                    {detailedOrder.deliveryAddress.state},{' '}
                    {detailedOrder.deliveryAddress.country}
                  </p>
                </div>

                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>Delivery Date</p>
                  <p className='font-medium flex items-center'>
                    <Calendar className='mr-2 h-4 w-4 text-muted-foreground' />
                    {formatDate(detailedOrder.deliveryDate)}
                  </p>
                </div>

                {detailedOrder.note && (
                  <div className='space-y-1'>
                    <p className='text-sm text-muted-foreground'>
                      Special Instructions
                    </p>
                    <p className='bg-muted p-2 rounded-md text-sm'>
                      {detailedOrder.note}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Payment Information */}
          <div>
            <h3 className='text-lg font-medium mb-2 flex items-center'>
              <CreditCard className='mr-2 h-5 w-5 text-muted-foreground' />
              Payment Summary
            </h3>

            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Subtotal:</span>
                <span>
                  {formatCurrency(
                    (detailedOrder.amount - (detailedOrder.deliveryFee || 0)) /
                      100
                  )}
                </span>
              </div>

              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Delivery Fee:</span>
                <span>
                  {formatCurrency((detailedOrder.deliveryFee || 0) / 100)}
                </span>
              </div>

              <div className='flex justify-between font-medium text-lg'>
                <span>Total:</span>
                <span>{formatCurrency(detailedOrder.amount / 100)}</span>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div>
            <h3 className='text-lg font-medium mb-2 flex items-center'>
              <Clock className='mr-2 h-5 w-5 text-muted-foreground' />
              Order Timeline
            </h3>

            <div className='space-y-3'>
              <div className='flex gap-3'>
                <div className='h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center'>
                  <div className='h-2 w-2 rounded-full bg-blue-600'></div>
                </div>
                <div>
                  <p className='font-medium'>Order Placed</p>
                  <p className='text-sm text-muted-foreground'>
                    {formatDate(detailedOrder.createdAt)}
                  </p>
                </div>
              </div>

              {order.status !== 'new' && (
                <div className='flex gap-3'>
                  <div className='h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center'>
                    <div className='h-2 w-2 rounded-full bg-yellow-600'></div>
                  </div>
                  <div>
                    <p className='font-medium'>Payment Received</p>
                    <p className='text-sm text-muted-foreground'>
                      {formatDate(detailedOrder.updatedAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className='flex justify-end gap-2 pt-4'>
            <Button variant='outline' onClick={() => onOpenChange(false)}>
              <X className='mr-2 h-4 w-4' />
              Close
            </Button>
            <Button>Update Status</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Helper function to get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Types
interface Order {
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
}

// Sample order data
const orders = [
  {
    id: 'ORD-7829',
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      avatar: '/placeholder.svg?height=32&width=32',
    },
    vendor: 'Ajasco Cakes',
    date: 'Mar 14, 2023',
    status: 'DELIVERED' as const,
    items: 3,
    amount: '120.00',
  },
  {
    id: 'ORD-7828',
    customer: {
      name: 'Michael Chen',
      email: 'michael.c@example.com',
      avatar: '/placeholder.svg?height=32&width=32',
    },
    vendor: 'Fresh Delights',
    date: 'Mar 14, 2023',
    status: 'PROCESSING' as const,
    items: 2,
    amount: '85.50',
  },
  {
    id: 'ORD-7827',
    customer: {
      name: 'Aisha Patel',
      email: 'aisha.p@example.com',
      avatar: '/placeholder.svg?height=32&width=32',
    },
    vendor: 'Tasty Treats',
    date: 'Mar 13, 2023',
    status: 'PAID' as const,
    items: 1,
    amount: '45.75',
  },
  {
    id: 'ORD-7826',
    customer: {
      name: 'Carlos Rodriguez',
      email: 'carlos.r@example.com',
      avatar: '/placeholder.svg?height=32&width=32',
    },
    vendor: 'Ajasco Cakes',
    date: 'Mar 13, 2023',
    status: 'PAID' as const,
    items: 4,
    amount: '210.25',
  },
  {
    id: 'ORD-7825',
    customer: {
      name: 'Emma Wilson',
      email: 'emma.w@example.com',
      avatar: '/placeholder.svg?height=32&width=32',
    },
    vendor: 'Sweet Delicacies',
    date: 'Mar 12, 2023',
    status: 'CANCELLED' as const,
    items: 2,
    amount: '65.30',
  },
]

// Detailed order data based on the provided structure
const detailedOrder = {
  _id: '67cef4644508ad87d3685720',
  user: '67c5061d177fd2e236ad2c19',
  vendor: {
    _id: '67c50621177fd2e236ad2c36',
    country: 'Nigeria',
    state: 'Rivers',
    city: 'Port Harcourt',
    businessName: 'Jacobson Inc',
    profilePicture: '',
  },
  product: {
    _id: '67c50627177fd2e236ad2c89',
    name: 'Signature Black Forest Cake',
    description:
      'Conturbo sol animus sapiente nesciunt administratio tutis alo. This delicious cake is perfect for birthdays. Advoco usitas caterva creta debitis sed ut. Derideo despecto amissio patrocinor.',
    images: [
      'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1562440499-64c9a111f713?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1535141192574-5d4897c12636?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    ],
    category: 'cake',
    productType: 'cake',
  },
  productCategory: 'cake',
  productDetails: {
    size: '10 inches',
    flavours: ['RedVelvet', 'Strawberry'],
    topping: 'Fondant',
    layers: 3,
  },
  amount: 58492,
  deliveryAddress: {
    address: '12B Admiralty Way, Lekki Phase 1',
    city: 'Lagos',
    state: 'Lagos',
    country: 'Nigeria',
  },
  deliveryDate: '2025-03-15T14:00:00.000Z',
  recipientName: 'John Doe',
  recipientPhone: '+2348012345678',
  note: 'Please include a birthday card',
  status: 'new',
  additionalProducts: [
    {
      product: {
        _id: '67c50627177fd2e236ad2c87',
        name: 'Buttercream Birthday Cake',
        images: [
          'https://images.unsplash.com/photo-1535141192574-5d4897c12636?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1562440499-64c9a111f713?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        ],
        category: 'cake',
        productType: 'cake',
      },
      category: 'cake',
      quantity: 1,
      price: 20676,
      _id: '67cef4644508ad87d368571f',
    },
  ],
  deliveryFee: 120,
  createdAt: '2025-03-10T14:17:08.010Z',
  updatedAt: '2025-03-10T14:17:08.855Z',
  __v: 0,
  paymentReference: 'MEMO-b27e7aab5cf0455ca8e76a172075cc88',
}
