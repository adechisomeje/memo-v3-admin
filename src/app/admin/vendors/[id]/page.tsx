import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'

export default function VendorDetailsPage() {
  // In a real app, you would fetch vendor data based on the ID
  //   const vendor = vendors.find((vendor) => vendor.id === params.id) || vendors[0]

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
        {/* <Card className='md:col-span-1'>
          <CardHeader className='flex flex-row items-center gap-4 pb-2'>
            <Avatar className='h-16 w-16'>
              <AvatarImage src='' alt={vendor.name} />
              <AvatarFallback>{getInitials(vendor.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{vendor.name}</CardTitle>
              <CardDescription>Vendor</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center gap-2 text-sm'>
                <Mail className='h-4 w-4 text-muted-foreground' />
                <span>{vendor.email}</span>
              </div>

              <div className='pt-4 flex flex-col gap-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Status</span>
                  <VendorStatusBadge status={vendor.status} />
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Total Products</span>
                  <span className='text-sm'>{vendor.products}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Total Orders</span>
                  <span className='text-sm'>{vendor.orders}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Total Revenue</span>
                  <span className='text-sm'>${vendor.revenue}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}

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
                          <TableHead>Stock</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className='text-right'>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* {vendorProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className='flex items-center gap-3'>
                                <div className='h-10 w-10 overflow-hidden rounded-md bg-gray-100'>
                                  <Image
                                    src={product.image || '/placeholder.svg'}
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
                                  <div className='text-xs text-muted-foreground'>
                                    SKU: {product.sku}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>${product.price}</TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell>
                              <ProductStatusBadge status={product.status} />
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
                          <TableHead className='text-right'>Actions</TableHead>
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
                          {vendorProducts.slice(0, 3).map((product, index) => (
                            <div
                              key={product.id}
                              className='flex items-center gap-4'
                            >
                              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium'>
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
                          ))}
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

// Sample vendor data

// Sample product data for a vendor
const vendorProducts = [
  {
    id: '1',
    name: 'Chocolate Cake',
    sku: 'CAKE-001',
    image:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Cakes',
    price: '35.99',
    stock: 24,
    status: 'in-stock' as const,
  },
  {
    id: '2',
    name: 'Vanilla Cupcakes (6 Pack)',
    sku: 'CUP-002',
    image:
      'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Cupcakes',
    price: '12.99',
    stock: 36,
    status: 'in-stock' as const,
  },
  {
    id: '3',
    name: 'Birthday Gift Box',
    sku: 'GIFT-003',
    image:
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Gift Boxes',
    price: '49.99',
    stock: 15,
    status: 'in-stock' as const,
  },
  {
    id: '4',
    name: 'Red Velvet Cake',
    sku: 'CAKE-005',
    image:
      'https://images.unsplash.com/photo-1586788680434-30d324626f9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Cakes',
    price: '42.99',
    stock: 8,
    status: 'low-stock' as const,
  },
  {
    id: '5',
    name: 'Chocolate Chip Cookies (12 Pack)',
    sku: 'COOKIE-006',
    image:
      'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Cookies',
    price: '15.99',
    stock: 0,
    status: 'out-of-stock' as const,
  },
]
