import type React from 'react'
import Link from 'next/link'
import {
  ArrowUp,
  ArrowDown,
  Users,
  Store,
  DollarSign,
  Calendar,
  ShoppingCart,
  AlertTriangle,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

const recentUsers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    avatar: '/assets/images/naomi.png',
    joinedAt: '2 hours ago',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.c@example.com',
    avatar: '/assets/images/naomi.png',
    joinedAt: '5 hours ago',
  },
  {
    id: '3',
    name: 'Aisha Patel',
    email: 'aisha.p@example.com',
    avatar: '/assets/images/naomi.png',
    joinedAt: '1 day ago',
  },
  {
    id: '4',
    name: 'Carlos Rodriguez',
    email: 'carlos.r@example.com',
    avatar: '/assets/images/naomi.png',
    joinedAt: '2 days ago',
  },
]

const recentOrders = [
  {
    id: '7829',
    customer: 'Sarah Johnson',
    vendor: 'Ajasco Cakes',
    amount: '120.00',
    date: 'Today, 2:30 PM',
  },
  {
    id: '7828',
    customer: 'Michael Chen',
    vendor: 'Fresh Delights',
    amount: '85.50',
    date: 'Today, 1:15 PM',
  },
  {
    id: '7827',
    customer: 'Aisha Patel',
    vendor: 'Tasty Treats',
    amount: '45.75',
    date: 'Today, 11:30 AM',
  },
  {
    id: '7826',
    customer: 'Carlos Rodriguez',
    vendor: 'Ajasco Cakes',
    amount: '210.25',
    date: 'Yesterday, 4:45 PM',
  },
]

const issues = [
  {
    id: '1',
    title: 'Vendor Payout Failed',
    description: 'Ajasco Cakes payout failed due to invalid bank details',
    priority: 'High',
  },
  {
    id: '2',
    title: 'Customer Refund Request',
    description: 'Order #7820 refund request pending for 48 hours',
    priority: 'High',
  },
  {
    id: '3',
    title: 'Product Stock Alert',
    description: '5 products are out of stock for more than 7 days',
    priority: 'Medium',
  },
  {
    id: '4',
    title: 'Vendor Verification Pending',
    description: '3 new vendors awaiting document verification',
    priority: 'Medium',
  },
]

const topProducts = [
  {
    id: '1',
    name: 'Chocolate Cake',
    vendor: 'Ajasco Cakes',
    image: '/placeholder.svg?height=40&width=40',
    revenue: '12,450',
    orders: 415,
  },
  {
    id: '2',
    name: 'Vanilla Cupcakes',
    vendor: 'Fresh Delights',
    image: '/placeholder.svg?height=40&width=40',
    revenue: '8,320',
    orders: 640,
  },
  {
    id: '3',
    name: 'Red Velvet Cake',
    vendor: 'Ajasco Cakes',
    image: '/placeholder.svg?height=40&width=40',
    revenue: '7,890',
    orders: 263,
  },
  {
    id: '4',
    name: 'Sourdough Bread',
    vendor: 'Tasty Treats',
    image: '/placeholder.svg?height=40&width=40',
    revenue: '6,540',
    orders: 1005,
  },
  {
    id: '5',
    name: 'Tiramisu',
    vendor: 'Sweet Delicacies',
    image: '/placeholder.svg?height=40&width=40',
    revenue: '5,980',
    orders: 207,
  },
]

const topVendors = [
  {
    id: '1',
    name: 'Ajasco Cakes',
    category: 'Bakery & Desserts',
    logo: '/placeholder.svg?height=40&width=40',
    revenue: '45,320',
    orders: 1250,
  },
  {
    id: '2',
    name: 'Fresh Delights',
    category: 'Pastries & Confections',
    logo: '/placeholder.svg?height=40&width=40',
    revenue: '28,450',
    orders: 876,
  },
  {
    id: '3',
    name: 'Tasty Treats',
    category: 'Bakery & Bread',
    logo: '/placeholder.svg?height=40&width=40',
    revenue: '15,780',
    orders: 543,
  },
  {
    id: '4',
    name: 'Sweet Delicacies',
    category: 'Desserts & Cakes',
    logo: '/placeholder.svg?height=40&width=40',
    revenue: '12,340',
    orders: 389,
  },
  {
    id: '5',
    name: 'Gourmet Bites',
    category: 'Specialty Foods',
    logo: '/placeholder.svg?height=40&width=40',
    revenue: '9,870',
    orders: 321,
  },
]

export default function AdminDashboard() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Hello, Admin</h1>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm'>
            <Calendar className='mr-2 h-4 w-4' />
            <span>Filter by Date</span>
          </Button>
          <Button variant='default' size='sm'>
            Export Data
          </Button>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <MetricCard
          title='Total Revenue'
          value='$1.2M'
          icon={<DollarSign className='h-5 w-5' />}
          change={12}
          period='from last month'
        />
        <MetricCard
          title='Total Orders'
          value='12,543'
          icon={<ShoppingCart className='h-5 w-5' />}
          change={24}
          period='from last month'
        />
        <MetricCard
          title='Active Customers'
          value='5,231'
          icon={<Users className='h-5 w-5' />}
          change={8}
          period='from last month'
        />
        <MetricCard
          title='Active Vendors'
          value='328'
          icon={<Store className='h-5 w-5' />}
          change={18}
          period='from last month'
        />
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <Card className='lg:col-span-1'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <div className='space-y-1'>
              <CardTitle>Recent Customers</CardTitle>
              <CardDescription>Newly registered customers</CardDescription>
            </div>
            <Link
              href='/admin/users'
              className='text-sm font-medium text-primary'
            >
              View All
            </Link>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {recentUsers.map((user) => (
                <div key={user.id} className='flex items-center gap-4'>
                  <div className='h-10 w-10 overflow-hidden rounded-full bg-gray-100'>
                    <Image
                      src={user.avatar || '/placeholder.svg'}
                      alt={user.name}
                      className='h-full w-full object-cover'
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className='flex-1'>
                    <h4 className='text-sm font-medium'>{user.name}</h4>
                    <p className='text-xs text-muted-foreground'>
                      {user.email}
                    </p>
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    {user.joinedAt}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className='lg:col-span-1'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <div className='space-y-1'>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Latest orders across all vendors
              </CardDescription>
            </div>
            <Link
              href='/admin/orders'
              className='text-sm font-medium text-primary'
            >
              View All
            </Link>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {recentOrders.map((order) => (
                <div key={order.id} className='flex items-center gap-4'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-100'>
                    <ShoppingCart className='h-5 w-5 text-gray-500' />
                  </div>
                  <div className='flex-1'>
                    <h4 className='text-sm font-medium'>Order #{order.id}</h4>
                    <p className='text-xs text-muted-foreground'>
                      {order.customer}
                    </p>
                  </div>
                  <div className='text-sm font-medium'>${order.amount}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className='lg:col-span-1'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <div className='space-y-1'>
              <CardTitle>Issues Requiring Attention</CardTitle>
              <CardDescription>Items that need your review</CardDescription>
            </div>
            <Link
              href='/admin/issues'
              className='text-sm font-medium text-primary'
            >
              View All
            </Link>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {issues.map((issue) => (
                <div key={issue.id} className='flex items-center gap-4'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-red-100'>
                    <AlertTriangle className='h-5 w-5 text-red-500' />
                  </div>
                  <div className='flex-1'>
                    <h4 className='text-sm font-medium'>{issue.title}</h4>
                    <p className='text-xs text-muted-foreground'>
                      {issue.description}
                    </p>
                  </div>
                  <Badge
                    variant='outline'
                    className={
                      issue.priority === 'High'
                        ? 'bg-red-100 text-red-800 border-none'
                        : 'bg-yellow-100 text-yellow-800 border-none'
                    }
                  >
                    {issue.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>
              Best performing products across all vendors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {topProducts.map((product, index) => (
                <div key={product.id} className='flex items-center gap-4'>
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
                    <h4 className='text-sm font-medium'>{product.name}</h4>
                    <p className='text-xs text-muted-foreground'>
                      {product.vendor}
                    </p>
                  </div>
                  <div className='text-right'>
                    <div className='text-sm font-medium'>
                      ${product.revenue}
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      {product.orders} orders
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Vendors</CardTitle>
            <CardDescription>Vendors with the highest revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {topVendors.map((vendor, index) => (
                <div key={vendor.id} className='flex items-center gap-4'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium'>
                    {index + 1}
                  </div>
                  <div className='h-10 w-10 overflow-hidden rounded-full bg-gray-100'>
                    <Image
                      src={vendor.logo || '/placeholder.svg'}
                      alt={vendor.name}
                      className='h-full w-full object-cover'
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className='flex-1'>
                    <h4 className='text-sm font-medium'>{vendor.name}</h4>
                    <p className='text-xs text-muted-foreground'>
                      {vendor.category}
                    </p>
                  </div>
                  <div className='text-right'>
                    <div className='text-sm font-medium'>${vendor.revenue}</div>
                    <p className='text-xs text-muted-foreground'>
                      {vendor.orders} orders
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  icon: React.ReactNode
  change: number
  period: string
}

function MetricCard({ title, value, icon, change, period }: MetricCardProps) {
  const isPositive = change > 0

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
        <div className='mt-1 flex items-center text-xs'>
          <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
            {isPositive ? (
              <ArrowUp className='mr-1 h-3 w-3' />
            ) : (
              <ArrowDown className='mr-1 h-3 w-3' />
            )}
            {change}%
          </span>
          <span className='ml-1 text-muted-foreground'>{period}</span>
        </div>
      </CardContent>
    </Card>
  )
}
