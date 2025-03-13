import Link from 'next/link'
import { ArrowLeft, ShoppingBag } from 'lucide-react'

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
  //   TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// interface CustomerPageParams {
//   id: string
// }

export default function CustomerOrdersPage() {
  // In a real app, you would fetch customer data and orders based on the ID
  //   const customer = users.find((user) => user.id === params.id) || users[0]

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
            <Avatar className='h-16 w-16'>
              <AvatarImage
                src=''
                alt='hi'
                //   {customer.name} customer
              />
              <AvatarFallback>
                {/* {getInitials(customer.name)} */}
                hi
              </AvatarFallback>
            </Avatar>
            <div>
              {/* <CardTitle>{customer.name}</CardTitle> */}
              <CardDescription>Customer</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {/* <div className='space-y-4'>
              <div className='flex items-center gap-2 text-sm'>
                <Mail className='h-4 w-4 text-muted-foreground' />
                <span>{customer.email}</span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <Phone className='h-4 w-4 text-muted-foreground' />
                <span>{customer.phone}</span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <Calendar className='h-4 w-4 text-muted-foreground' />
                <span>Joined on {customer.joinedDate}</span>
              </div>

              <div className='pt-4 flex flex-col gap-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Status</span>
                  <UserStatusBadge status={customer.status} />
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Total Orders</span>
                  <span className='text-sm'>{customer.orders}</span>
                </div>
              </div>
            </div> */}
            <div className=''>customer details in here</div>
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
            {customerOrders.length > 0 ? (
              <div className='rounded-md border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Delivery Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className='text-right'>Amount</TableHead>
                      <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* {customerOrders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className='font-medium'>
                          {order._id.substring(0, 8)}
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-3'>
                            <div className='h-10 w-10 overflow-hidden rounded-md bg-gray-100'>
                              <Image
                                src={
                                  order.product.images[0] || '/placeholder.svg'
                                }
                                alt={order.product.name}
                                className='h-full w-full object-cover'
                                width={40}
                                height={40}
                              />
                            </div>
                            <div>
                              <div className='font-medium'>
                                {order.product.name}
                              </div>
                              <div className='text-xs text-muted-foreground capitalize'>
                                {order.productCategory}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>{formatDate(order.deliveryDate)}</TableCell>
                        <TableCell>
                          <OrderStatusBadge status={order.status} />
                        </TableCell>
                        <TableCell className='text-right'>
                          ₦{formatAmount(order.amount)}
                        </TableCell>
                        <TableCell className='text-right'>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-8 w-8 p-0'
                          >
                            <Eye className='h-4 w-4' />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))} */}
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

// function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
//   const variants: Record<string, string> = {
//     new: 'bg-blue-100 text-blue-800',
//     paid: 'bg-yellow-100 text-yellow-800',
//     processing: 'bg-purple-100 text-purple-800',
//     delivered: 'bg-green-100 text-green-800',
//     cancelled: 'bg-red-100 text-red-800',
//   }

//   const variant = variants[status.toLowerCase()] || 'bg-gray-100 text-gray-800'

//   return (
//     <Badge variant='outline' className={`${variant} border-none`}>
//       {status.charAt(0).toUpperCase() + status.slice(1)}
//     </Badge>
//   )
// }

// Sample customer orders based on the provided structure
const customerOrders = [
  {
    _id: '67d0240d57df6738a543cef2',
    product: {
      _id: '67c50627177fd2e236ad2c89',
      name: 'Signature Black Forest Cake',
      images: [
        'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1562440499-64c9a111f713?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1535141192574-5d4897c12636?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      ],
      category: 'cake',
      productType: 'cake',
    },
    productCategory: 'cake',
    amount: 58492,
    deliveryDate: '2025-03-15T14:00:00.000Z',
    status: 'new',
    createdAt: '2025-03-10T14:17:08.010Z',
  },
  {
    _id: '67d0240d57df6738a543cef3',
    product: {
      _id: '67c50627177fd2e236ad2c90',
      name: 'Red Velvet Celebration Cake',
      images: [
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      ],
      category: 'cake',
      productType: 'cake',
    },
    productCategory: 'cake',
    amount: 42000,
    deliveryDate: '2025-03-05T10:00:00.000Z',
    status: 'delivered',
    createdAt: '2025-02-28T09:30:15.123Z',
  },
  {
    _id: '67d0240d57df6738a543cef4',
    product: {
      _id: '67c50627177fd2e236ad2c91',
      name: 'Luxury Flower Bouquet',
      images: [
        'https://images.unsplash.com/photo-1561181286-d3fee3785613?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      ],
      category: 'flowers',
      productType: 'flowers',
    },
    productCategory: 'flowers',
    amount: 25000,
    deliveryDate: '2025-02-14T12:00:00.000Z',
    status: 'delivered',
    createdAt: '2025-02-12T16:45:22.456Z',
  },
  {
    _id: '67d0240d57df6738a543cef5',
    product: {
      _id: '67c50627177fd2e236ad2c92',
      name: 'Birthday Gift Hamper',
      images: [
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      ],
      category: 'gifts',
      productType: 'gifts',
    },
    productCategory: 'gifts',
    amount: 35000,
    deliveryDate: '2025-01-20T15:30:00.000Z',
    status: 'delivered',
    createdAt: '2025-01-15T11:20:33.789Z',
  },
]
