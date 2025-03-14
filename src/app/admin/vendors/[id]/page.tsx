'use client'

import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react'
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
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getVendorDetails, getVendorProducts } from '@/api/vendors'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

interface VendorProduct {
  _id: string
  name: string
  basePrice: number
  status: string
  category: string
  images: string[]
}

export default function VendorDetailsPage() {
  const { id } = useParams()
  const { data: vendorDetails } = useQuery({
    queryKey: ['vendorDetails', id],
    queryFn: () => getVendorDetails(id as string),
  })
  const vendor = vendorDetails?.data

  const { data: vendorProducts, isPending } = useQuery({
    queryKey: ['vendorProducts', id],
    queryFn: () => getVendorProducts(id as string),
  })

  console.log(vendorProducts)

  if (isPending) {
    return <div>Loading...</div>
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Button variant='outline' size='icon' asChild>
          <Link href='/admin/vendors'>
            <ArrowLeft className='h-4 w-4' />
          </Link>
        </Button>
        <h1 className='text-3xl font-bold'>Vendor Details</h1>
      </div>

      <div className='grid gap-6 md:grid-cols-3'>
        {/* vendor details card */}
        <Card className='md:col-span-1'>
          <CardHeader className='flex flex-row items-center gap-4 pb-2'>
            <Avatar className='h-16 w-16'>
              <AvatarImage
                src={vendor?.profilePicture || ''}
                alt={vendor?.businessName}
              />
              <AvatarFallback>
                {vendor?.firstName?.[0]}
                {vendor?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{vendor?.businessName}</CardTitle>
              <CardDescription>{vendor?.role}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center gap-2 text-sm'>
                <Mail className='h-4 w-4 text-muted-foreground' />
                <span>{vendor?.email}</span>
              </div>

              <div className='pt-4 flex flex-col gap-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Total Products</span>
                  <span className='text-sm'>{vendor?.stats.productCount}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Total Orders</span>
                  <span className='text-sm'>{vendor?.stats.orderCount}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Total Revenue</span>
                  <span className='text-sm'>₦{vendor?.stats.totalRevenue}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/*  */}
        <Card className='md:col-span-2'>
          <CardHeader>
            <Tabs defaultValue='products'>
              <TabsList>
                <TabsTrigger value='products'>Products</TabsTrigger>
                <TabsTrigger value='orders'>Orders</TabsTrigger>
                <TabsTrigger value='performance'>Performance</TabsTrigger>
              </TabsList>

              <CardContent>
                <TabsContent value='products' className='mt-0'>
                  <div className='rounded-md border'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.isArray(vendorProducts?.data)
                          ? vendorProducts.data.map(
                              (product: VendorProduct) => (
                                <TableRow key={product._id}>
                                  <TableCell>
                                    <div className='flex items-center gap-3'>
                                      <div className='h-10 w-10 overflow-hidden rounded-md bg-gray-100'>
                                        <Image
                                          src={
                                            product.images[0] ||
                                            '/placeholder.svg'
                                          }
                                          alt={product.name}
                                          className='h-full w-full object-cover'
                                          width={40}
                                          height={40}
                                        />
                                      </div>
                                      <div>
                                        <div className='font-medium'>
                                          {product.name}
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className='capitalize'>
                                    {product.category}
                                  </TableCell>
                                  <TableCell>
                                    ₦{product.basePrice.toLocaleString()}
                                  </TableCell>
                                </TableRow>
                              )
                            )
                          : null}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value='orders' className='mt-0'>
                  <div className='rounded-md border'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className='text-right'>Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* {vendorOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className='font-medium'>
                              {order.id}
                            </TableCell>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell>{order.date}</TableCell>
                            <TableCell>
                              <OrderStatusBadge status={order.status} />
                            </TableCell>
                            <TableCell className='text-right'>
                              ${order.amount}
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
                </TabsContent>

                <TabsContent value='performance' className='mt-0'>
                  <div className='space-y-6'>
                    <div className='grid gap-4 md:grid-cols-3'>
                      {/* <Card>
                        <CardHeader className='pb-2'>
                          <CardTitle className='text-sm font-medium'>
                            Monthly Revenue
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className='text-2xl font-bold'>
                            ${vendor.revenue}
                          </div>
                   
                        </CardContent>
                      </Card> */}
                      <Card>
                        <CardHeader className='pb-2'>
                          <CardTitle className='text-sm font-medium'>
                            Orders Received
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className='text-2xl font-bold'>
                            {/* {vendor.orders} */}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className='pb-2'>
                          <CardTitle className='text-sm font-medium'>
                            Reviews
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className='text-2xl font-bold'>4/5</div>
                          <p className='text-xs text-muted-foreground'>
                            Based on
                            {/* {vendor.orders} */} ratings
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Top Selling Products</CardTitle>
                        <CardDescription>
                          Products with the highest sales volume
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className='space-y-4'>
                          {/* {vendorProducts.slice(0, 3).map((product, index) => (
                            <div
                              key={product.id}
                              className='flex items-center gap-4'
                            >
                              <div className='flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-medium'>
                                {index + 1}
                              </div>
                              <div className='h-10 w-10 overflow-hidden rounded-md bg-gray-100'>
                                <Image
                                  src={product.image || '/placeholder.svg'}
                                  alt={product.name}
                                  className='h-full w-full object-cover'
                                  width={40}
                                  height={40}
                                />
                              </div>
                              <div className='flex-1'>
                                <h4 className='text-sm font-medium'>
                                  {product.name}
                                </h4>
                                <p className='text-xs text-muted-foreground'>
                                  {product.category}
                                </p>
                              </div>
                              <div className='text-right'>
                                <div className='text-sm font-medium'>
                                  ${Number.parseFloat(product.price) * 20}
                                </div>
                                <p className='text-xs text-muted-foreground'>
                                  20 orders
                                </p>
                              </div>
                            </div>
                          ))} */}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
