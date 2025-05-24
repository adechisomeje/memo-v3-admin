'use client'

import Link from 'next/link'
import { ArrowLeft, ShoppingBag, Mail, Phone, Calendar } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  //   TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useQuery } from '@tanstack/react-query'
import { getCustomerDetails } from '@/api/customers'
import { useParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

// interface CustomerPageParams {
//   id: string
// }

export default function CustomerOrdersPage() {
  const { id } = useParams()
  const { data: customerDetails } = useQuery({
    queryKey: ['customerDetails', id],
    queryFn: () => getCustomerDetails(id as string),
  })
  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Button variant='outline' size='icon' asChild>
          <Link href='/admin/customers'>
            <ArrowLeft className='h-4 w-4' />
          </Link>
        </Button>
        <h1 className='text-3xl font-bold'>Customer Orders</h1>
      </div>

      <div className='grid gap-6 md:grid-cols-3'>
        <Card className='md:col-span-1'>
          <CardHeader className='flex flex-row items-center gap-4 pb-2'>
            <Avatar className='h-9 w-9'>
              <AvatarImage
                src={customerDetails?.data.userDetails.profilePicture || ''}
                alt={`${customerDetails?.data.userDetails.firstName} ${customerDetails?.data.userDetails.lastName}`}
              />
              <AvatarFallback>
                {customerDetails?.data.userDetails.firstName[0]}
                {customerDetails?.data.userDetails.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>
                {customerDetails?.data.userDetails.firstName}{' '}
                {customerDetails?.data.userDetails.lastName}
              </CardTitle>
              <CardDescription>Customer</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center gap-2 text-sm'>
                <Mail className='h-4 w-4 text-muted-foreground' />
                <span>{customerDetails?.data.userDetails.email}</span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <Phone className='h-4 w-4 text-muted-foreground' />
                <span>{customerDetails?.data.userDetails.phone}</span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <Calendar className='h-4 w-4 text-muted-foreground' />
                <span>
                  Joined on{' '}
                  {customerDetails?.data.userDetails.createdAt
                    ? new Date(
                        customerDetails.data.userDetails.createdAt
                      ).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>

              <div className='pt-4 flex flex-col gap-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>
                    Verification Status
                  </span>
                  <Badge
                    variant='outline'
                    className={`${
                      customerDetails?.data.userDetails.isVerified
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-600'
                    } border-none`}
                  >
                    {customerDetails?.data.userDetails.isVerified
                      ? 'Verified'
                      : 'Unverified'}
                  </Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Total Orders</span>
                  <span className='text-sm'>
                    {customerDetails?.data.orderHistory.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>
              All orders placed by this customer
            </CardDescription>
          </CardHeader>
          <CardContent>
            {customerDetails?.data?.orderHistory?.length || 0 ? (
              <div className='rounded-md border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className='text-right'>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerDetails?.data.orderHistory.map((order) => (
                      <TableRow key={order.orderId}>
                        <TableCell className='font-medium'>
                          {order.orderId.substring(0, 8)}
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-3'>
                            <div className='h-10 w-10 overflow-hidden rounded-md bg-gray-100'>
                              <Image
                                src={order.productImage || '/placeholder.svg'}
                                alt={order.productName}
                                className='h-full w-full object-cover'
                                width={40}
                                height={40}
                              />
                            </div>
                            <div>
                              <div className='font-medium'>
                                {order.productName}
                              </div>
                              <div className='text-xs text-muted-foreground capitalize'>
                                {order.productCategory}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <OrderStatusBadge status={order.status} />
                        </TableCell>
                        <TableCell className='text-right'>
                          ₦{order.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center py-12 text-center'>
                <ShoppingBag className='h-12 w-12 text-muted-foreground mb-4' />
                <h3 className='text-lg font-medium'>No orders yet</h3>
                <p className='text-sm text-muted-foreground mt-1'>
                  This customer hasn&apos;t placed any orders yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// interface UserStatusBadgeProps {
//   status: 'active' | 'inactive' | 'new'
// }

// function UserStatusBadge({ status }: UserStatusBadgeProps) {
//   const variants = {
//     active: 'bg-green-100 text-green-800',
//     inactive: 'bg-gray-100 text-gray-800',
//     new: 'bg-blue-100 text-blue-800',
//   }

// interface OrderStatusBadgeProps {
//   status: string
// }

function OrderStatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    paid: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  const variant = variants[status.toLowerCase()] || 'bg-gray-100 text-gray-800'

  return (
    <Badge variant='outline' className={`${variant} border-none`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}
