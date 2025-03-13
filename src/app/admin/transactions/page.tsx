import type React from 'react'
import {
  Search,
  Filter,
  Download,
  Eye,
  CreditCard,
  ArrowUp,
  ArrowDown,
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

// Sample transaction data based on the provided structure
const transactions = [
  {
    _id: '67d0240d57df6738a543cef6',
    order: {
      _id: '67d0240d57df6738a543cef2',
      productDetails: {
        size: '9 inches',
        flavours: ['Vanilla'],
        topping: 'Buttercream',
        layers: 2,
      },
      amount: 18528,
      status: 'new',
    },
    customer: {
      _id: '67c7118a4491d7591cc1f19f',
      firstName: 'Mariam',
      lastName: 'Ajanlekoko',
      email: 'Ajanlekokomotun@gmail.com',
    },
    vendor: {
      _id: '67c50621177fd2e236ad2c34',
      businessName: 'Quigley Group',
      email: 'braxton13@hotmail.com',
    },
    amount: 18528,
    paymentReference: 'MEMO-3d74aceb6f51422390c5000c62aa7ddb',
    paymentGateway: 'paystack',
    status: 'pending',
    type: 'order_payment',
    currency: 'NGN',
    createdAt: '2025-03-11T11:52:45.819Z',
    updatedAt: '2025-03-11T11:52:45.819Z',
    __v: 0,
  },
  {
    _id: '67d0240d57df6738a543cef7',
    order: {
      _id: '67d0240d57df6738a543cef3',
      productDetails: {
        size: '12 inches',
        flavours: ['Chocolate'],
        topping: 'Fondant',
        layers: 3,
      },
      amount: 25000,
      status: 'paid',
    },
    customer: {
      _id: '67c7118a4491d7591cc1f19e',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    },
    vendor: {
      _id: '67c50621177fd2e236ad2c35',
      businessName: 'Sweet Delights',
      email: 'info@sweetdelights.com',
    },
    amount: 25000,
    paymentReference: 'MEMO-4e85bcdf7f62533491d6111d73bb8eec',
    paymentGateway: 'paystack',
    status: 'successful',
    type: 'order_payment',
    currency: 'NGN',
    createdAt: '2025-03-10T15:30:22.456Z',
    updatedAt: '2025-03-10T15:30:22.456Z',
    __v: 0,
  },
  {
    _id: '67d0240d57df6738a543cef8',
    order: {
      _id: '67d0240d57df6738a543cef4',
      productDetails: {
        size: '8 inches',
        flavours: ['Red Velvet'],
        topping: 'Cream Cheese',
        layers: 2,
      },
      amount: 15000,
      status: 'processing',
    },
    customer: {
      _id: '67c7118a4491d7591cc1f19d',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.j@example.com',
    },
    vendor: {
      _id: '67c50621177fd2e236ad2c36',
      businessName: 'Cake Masters',
      email: 'orders@cakemasters.com',
    },
    amount: 15000,
    paymentReference: 'MEMO-5f96cdeg8g73644592e7222e84cc9ffd',
    paymentGateway: 'paystack',
    status: 'successful',
    type: 'order_payment',
    currency: 'NGN',
    createdAt: '2025-03-09T09:15:10.789Z',
    updatedAt: '2025-03-09T09:15:10.789Z',
    __v: 0,
  },
  {
    _id: '67d0240d57df6738a543cef9',
    order: {
      _id: '67d0240d57df6738a543cef5',
      productDetails: {
        size: '10 inches',
        flavours: ['Vanilla', 'Chocolate'],
        topping: 'Ganache',
        layers: 4,
      },
      amount: 30000,
      status: 'delivered',
    },
    customer: {
      _id: '67c7118a4491d7591cc1f19c',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.c@example.com',
    },
    vendor: {
      _id: '67c50621177fd2e236ad2c37',
      businessName: 'Ajasco Cakes',
      email: 'info@ajascocakes.com',
    },
    amount: 30000,
    paymentReference: 'MEMO-6g07dehh9h84755603f8333f95dda00e',
    paymentGateway: 'paystack',
    status: 'successful',
    type: 'order_payment',
    currency: 'NGN',
    createdAt: '2025-03-08T14:45:33.123Z',
    updatedAt: '2025-03-08T14:45:33.123Z',
    __v: 0,
  },
  {
    _id: '67d0240d57df6738a543cefa',
    order: {
      _id: '67d0240d57df6738a543cef6',
      productDetails: {
        size: '6 inches',
        flavours: ['Lemon'],
        topping: 'Meringue',
        layers: 1,
      },
      amount: 12000,
      status: 'cancelled',
    },
    customer: {
      _id: '67c7118a4491d7591cc1f19b',
      firstName: 'Emma',
      lastName: 'Wilson',
      email: 'emma.w@example.com',
    },
    vendor: {
      _id: '67c50621177fd2e236ad2c38',
      businessName: 'Fresh Delights',
      email: 'contact@freshdelights.com',
    },
    amount: 12000,
    paymentReference: 'MEMO-7h18efii0i95866714g9444g06eeb11f',
    paymentGateway: 'paystack',
    status: 'failed',
    type: 'order_payment',
    currency: 'NGN',
    createdAt: '2025-03-07T11:20:55.456Z',
    updatedAt: '2025-03-07T11:20:55.456Z',
    __v: 0,
  },
]

export default function TransactionsPage() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Transaction Management</h1>
        <Button variant='outline'>
          <Download className='mr-2 h-4 w-4' />
          Export Transactions
        </Button>
      </div>

      <div className='grid gap-6 md:grid-cols-4'>
        <TransactionMetricCard
          title='Total Transactions'
          value='24,543'
          icon={<CreditCard className='h-5 w-5' />}
          description='All time'
        />
        <TransactionMetricCard
          title='Total Revenue'
          value='₦1.2M'
          icon={<ArrowUp className='h-5 w-5' />}
          description='Platform earnings'
        />
        <TransactionMetricCard
          title='Vendor Payouts'
          value='₦980K'
          icon={<ArrowDown className='h-5 w-5' />}
          description='Paid to vendors'
        />
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>
              View and manage all financial transactions
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4'>
            <div className='flex items-center gap-2 w-full sm:w-auto'>
              <div className='relative w-full sm:w-[280px]'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  type='search'
                  placeholder='Search transactions...'
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
                  <SelectItem value='newest'>Newest First</SelectItem>
                  <SelectItem value='oldest'>Oldest First</SelectItem>
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
                  <TableHead>Reference</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Order Status</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead className='text-right'>Amount</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell className='font-medium'>
                      {transaction.paymentReference}
                    </TableCell>
                    <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                    <TableCell>
                      <TransactionTypeBadge type={transaction.type} />
                    </TableCell>
                    <TableCell>
                      <div className='flex flex-col'>
                        <div className='font-medium'>
                          {transaction.customer.firstName}{' '}
                          {transaction.customer.lastName}
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          {transaction.customer.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex flex-col'>
                        <div className='font-medium'>
                          {transaction.vendor.businessName}
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          {transaction.vendor.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={transaction.order.status} />
                    </TableCell>
                    <TableCell>
                      <TransactionStatusBadge status={transaction.status} />
                    </TableCell>
                    <TableCell className='text-right'>
                      <span className='font-medium'>
                        {transaction.currency}{' '}
                        {formatAmount(transaction.amount)}
                      </span>
                    </TableCell>
                    <TableCell className='text-right'>
                      <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                        <Eye className='h-4 w-4' />
                      </Button>
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
    </div>
  )
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Helper function to format amount
function formatAmount(amount: number): string {
  return (amount / 100).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

interface TransactionMetricCardProps {
  title: string
  value: string
  icon: React.ReactNode
  description: string
}

function TransactionMetricCard({
  title,
  value,
  icon,
  description,
}: TransactionMetricCardProps) {
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

interface TransactionTypeBadgeProps {
  type: string
}

function TransactionTypeBadge({ type }: TransactionTypeBadgeProps) {
  const variants: Record<string, string> = {
    order_payment: 'bg-green-100 text-green-800',
    vendor_payout: 'bg-blue-100 text-blue-800',
    refund: 'bg-yellow-100 text-yellow-800',
    fee: 'bg-purple-100 text-purple-800',
  }

  const displayNames: Record<string, string> = {
    order_payment: 'Order Payment',
    vendor_payout: 'Vendor Payout',
    refund: 'Refund',
    fee: 'Platform Fee',
  }

  const variant = variants[type] || 'bg-gray-100 text-gray-800'
  const displayName = displayNames[type] || type.replace('_', ' ')

  return (
    <Badge variant='outline' className={`${variant} border-none`}>
      {displayName}
    </Badge>
  )
}

interface OrderStatusBadgeProps {
  status: string
}

function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
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

interface TransactionStatusBadgeProps {
  status: string
}

function TransactionStatusBadge({ status }: TransactionStatusBadgeProps) {
  const variants: Record<string, string> = {
    successful: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
  }

  const variant = variants[status.toLowerCase()] || 'bg-gray-100 text-gray-800'

  return (
    <Badge variant='outline' className={`${variant} border-none`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}
