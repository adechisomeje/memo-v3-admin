'use client'

import type React from 'react'

import { useState, useMemo } from 'react'
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
import { getAllOrders } from '@/api/orders'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { queryKeys } from '@/lib/queries'
import OrderManagementSkeleton from './orderLoading'
import { formatDate } from '@/lib/utils'
import { AdditionalProduct, APIOrder, Order } from '@/types/types'

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleViewDetails = (order: {
    id: string
    customer: { name: string; email: string; avatar: string }
    vendor: string
    date: string
    status: 'PAID' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED' | 'new'
    items: number
    amount: string
    rawData: APIOrder
  }) => {
    setSelectedOrder(order)
    setIsSheetOpen(true)
  }

  const { status } = useSession()
  const { data: ordersResponse, isPending } = useQuery({
    queryKey: [queryKeys.allOrders],
    queryFn: () => getAllOrders(),
    enabled: status === 'authenticated',
    staleTime: 5 * 60 * 1000,
  })

  // Map API orders to UI format
  const orders = useMemo(() => {
    if (!ordersResponse?.data) return []

    return (ordersResponse.data as unknown as APIOrder[]).map(
      (order: APIOrder) => ({
        id: order._id,
        customer: {
          name: `${order.user.firstName} ${order.user.lastName}`,
          email: order.user.email,
          avatar: '/placeholder.svg?height=32&width=32',
        },
        vendor: order.vendor.businessName,
        date: new Date(order.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        status: order.status.toUpperCase() as
          | 'PAID'
          | 'PROCESSING'
          | 'DELIVERED'
          | 'CANCELLED'
          | 'new',
        items: order.additionalProducts.length + 1,
        amount: order.amount.toFixed(2),
        rawData: order,
      })
    )
  }, [ordersResponse])

  // Calculate metrics
  const metrics = useMemo(() => {
    if (!ordersResponse?.data) {
      return {
        total: 0,
        paid: 0,
        processing: 0,
        delivered: 0,
      }
    }

    const total = ordersResponse.total || ordersResponse.data.length
    const statusCounts = ordersResponse.data.reduce(
      (acc, order) => {
        const status = order.status.toUpperCase()
        if (status === 'PAID') acc.paid++
        if (status === 'PROCESSING') acc.processing++
        if (status === 'DELIVERED') acc.delivered++
        return acc
      },
      { paid: 0, processing: 0, delivered: 0 }
    )

    return {
      total,
      ...statusCounts,
    }
  }, [ordersResponse])

  // Pagination info
  const pagination = useMemo(() => {
    if (!ordersResponse) return { page: 1, limit: 10, total: 0 }

    const { page, limit, total } = ordersResponse
    return { page, limit, total }
  }, [ordersResponse])

  if (isPending) {
    return <OrderManagementSkeleton />
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
          value={metrics.total.toString()}
          icon={<ShoppingCart className='h-5 w-5' />}
          description='All time'
        />
        <OrderMetricCard
          title='PAID'
          value={metrics.paid.toString()}
          icon={<ShoppingCart className='h-5 w-5' />}
          description='Payment received'
        />
        <OrderMetricCard
          title='PROCESSING'
          value={metrics.processing.toString()}
          icon={<ShoppingCart className='h-5 w-5' />}
          description='In preparation'
        />
        <OrderMetricCard
          title='DELIVERED'
          value={metrics.delivered.toString()}
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
                  <TableHead className='text-right'>Amount</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className='text-center py-8'>
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className='font-medium'>{order.id}</TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <Avatar>
                            <AvatarImage src='/placeholder.svg' />
                            <AvatarFallback>
                              {getInitials(`${order.customer.name}`)}
                            </AvatarFallback>
                          </Avatar>
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
                      <TableCell className='text-right'>
                        ₦{order.amount}
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className='flex items-center justify-between mt-4'>
            <div className='text-sm text-muted-foreground'>
              Showing{' '}
              <strong>{(pagination.page - 1) * pagination.limit + 1}</strong> to{' '}
              <strong>
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </strong>{' '}
              of <strong>{pagination.total}</strong> results
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              <Button
                variant='outline'
                size='sm'
                disabled={
                  pagination.page * pagination.limit >= pagination.total
                }
              >
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
    new: 'bg-blue-900 text-blue-800',
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
  if (!order?.rawData) return null

  const orderData = order.rawData

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-full sm:max-w-xl md:max-w-2xl overflow-y-auto p-4'>
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
                <p className='font-medium'>{formatDate(orderData.createdAt)}</p>
              </div>
              <div className='space-y-1'>
                <p className='text-sm text-muted-foreground'>Total Amount</p>
                <p className='font-medium'>₦{order.amount}</p>
              </div>
              <div className='space-y-1'>
                <p className='text-sm text-muted-foreground'>
                  Payment Reference
                </p>
                <p className='font-medium'>
                  {orderData.paymentReference || 'N/A'}
                </p>
              </div>
              <div className='space-y-1'>
                <p className='text-sm text-muted-foreground'>Items</p>
                <p className='font-medium'>
                  {orderData.additionalProducts.length + 1}
                </p>
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
                <AvatarImage src='/placeholder.svg' />
                <AvatarFallback>
                  {getInitials(
                    `${orderData.user.firstName} ${orderData.user.lastName}`
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className='font-medium'>{`${orderData.user.firstName} ${orderData.user.lastName}`}</p>
                <p className='text-sm text-muted-foreground'>
                  {orderData.user.email}
                </p>
              </div>
            </div>
            <div className='space-y-1'>
              <div className='flex items-center gap-2'>
                <Phone className='h-4 w-4 text-muted-foreground' />
                <p className='text-sm'>
                  {orderData.recipientPhone || orderData.user.phone || 'N/A'}
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
              <p className='font-medium'>{orderData.vendor.businessName}</p>
              <div className='text-sm text-muted-foreground'>
                <p>
                  {orderData.vendor.city || ''} {orderData.vendor.state || ''}{' '}
                  {orderData.vendor.country || ''}
                </p>
                <p className='mt-1'>{orderData.vendor.email}</p>
                <p>{orderData.vendor.phone}</p>
              </div>
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
            <div className='mb-4'>
              <div className='flex gap-3 mb-2'>
                <div className='h-16 w-16 overflow-hidden rounded-md bg-gray-100'>
                  <Image
                    src={orderData.product.images?.[0] || '/placeholder.svg'}
                    alt={orderData.product.name}
                    className='h-full w-full object-cover'
                    width={64}
                    height={64}
                  />
                </div>
                <div>
                  <p className='font-medium'>{orderData.product.name}</p>
                  <p className='text-sm text-muted-foreground capitalize'>
                    {orderData.productCategory}
                  </p>
                  <p className='text-sm font-medium mt-1'>
                    ₦
                    {(
                      orderData.amount -
                      orderData.additionalProducts.reduce(
                        (sum: number, p: AdditionalProduct) => sum + p.price,
                        0
                      )
                    ).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Product Specifications */}
              {orderData.productDetails && (
                <div className='bg-muted p-3 rounded-md mt-2'>
                  <h4 className='text-sm font-medium mb-2 flex items-center'>
                    <Cake className='mr-2 h-4 w-4' />
                    Specifications
                  </h4>
                  <div className='grid grid-cols-2 gap-2 text-sm'>
                    <div>
                      <span className='text-muted-foreground'>Size:</span>{' '}
                      <span className='font-medium'>
                        {orderData.productDetails.size}
                      </span>
                    </div>
                    <div>
                      <span className='text-muted-foreground'>Layers:</span>{' '}
                      <span className='font-medium'>
                        {orderData.productDetails.layers}
                      </span>
                    </div>
                    <div>
                      <span className='text-muted-foreground'>Topping:</span>{' '}
                      <span className='font-medium'>
                        {orderData.productDetails.topping}
                      </span>
                    </div>
                    <div>
                      <span className='text-muted-foreground'>Flavors:</span>{' '}
                      <span className='font-medium'>
                        {orderData.productDetails.flavours?.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Products */}
            {orderData.additionalProducts &&
              orderData.additionalProducts.length > 0 && (
                <div>
                  <h4 className='text-sm font-medium mb-2'>
                    Additional Products
                  </h4>
                  {orderData.additionalProducts.map(
                    (item: AdditionalProduct, index: number) => (
                      <div
                        key={index}
                        className='flex gap-3 mb-2 border-t pt-2'
                      >
                        <div className='h-12 w-12 overflow-hidden rounded-md bg-gray-100'>
                          {/* Image may not be available for additional products depending on API response structure */}
                          <div className='h-full w-full bg-gray-200 flex items-center justify-center text-gray-400'>
                            <Package className='h-6 w-6' />
                          </div>
                        </div>
                        <div>
                          <p className='font-medium'>
                            Additional Item {index + 1}
                          </p>
                          <p className='text-sm text-muted-foreground capitalize'>
                            {item.category}
                          </p>
                          <div className='flex justify-between text-sm'>
                            <span>Qty: {item.quantity}</span>
                            <span className='font-medium'>
                              ₦{item.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  )}
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

            {orderData.deliveryAddress && (
              <div className='space-y-2'>
                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>Recipient</p>
                  <p className='font-medium'>{orderData.recipientName}</p>
                </div>

                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>Address</p>
                  <p className='font-medium'>
                    {orderData.deliveryAddress.address},{' '}
                    {orderData.deliveryAddress.city},{' '}
                    {orderData.deliveryAddress.state},{' '}
                    {orderData.deliveryAddress.country}
                  </p>
                </div>

                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>Delivery Date</p>
                  <p className='font-medium flex items-center'>
                    <Calendar className='mr-2 h-4 w-4 text-muted-foreground' />
                    {formatDate(orderData.deliveryDate)}
                  </p>
                </div>

                {orderData.note && (
                  <div className='space-y-1'>
                    <p className='text-sm text-muted-foreground'>
                      Special Instructions
                    </p>
                    <p className='bg-muted p-2 rounded-md text-sm'>
                      {orderData.note}
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
                  ₦
                  {(orderData.amount - (orderData.deliveryFee || 0)).toFixed(2)}
                </span>
              </div>

              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Delivery Fee:</span>
                <span>₦{(orderData.deliveryFee || 0).toFixed(2)}</span>
              </div>

              <div className='flex justify-between font-medium text-lg'>
                <span>Total:</span>
                <span>₦{orderData.amount.toFixed(2)}</span>
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
                    {formatDate(orderData.createdAt)}
                  </p>
                </div>
              </div>

              {orderData.status !== 'new' && (
                <div className='flex gap-3'>
                  <div className='h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center'>
                    <div className='h-2 w-2 rounded-full bg-yellow-600'></div>
                  </div>
                  <div>
                    <p className='font-medium'>Payment Received</p>
                    <p className='text-sm text-muted-foreground'>
                      {formatDate(orderData.updatedAt)}
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
