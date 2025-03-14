'use client'

import type React from 'react'
import {
  Search,
  Filter,
  Download,
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
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { queryKeys } from '@/lib/queries'
import { getAllTransactions } from '@/api/transactions'
import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import TransactionManagementSkeleton from './tnxLoading'
import {
  TransactionMetricCardProps,
  TransactionStatusBadgeProps,
  TransactionTypeBadgeProps,
} from '@/types/types'

export default function TransactionsPage() {
  const { status } = useSession()
  const { data: transactionsResponse, isPending } = useQuery({
    queryKey: [queryKeys.allTransactions],
    queryFn: () => getAllTransactions(),
    enabled: status === 'authenticated',
    staleTime: 5 * 60 * 1000,
  })

  if (isPending) {
    return <TransactionManagementSkeleton />
  }

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
          value={transactionsResponse?.total.toString() || '0'}
          icon={<CreditCard className='h-5 w-5' />}
          description='All time'
        />
        <TransactionMetricCard
          title='Total Revenue'
          value='₦500000'
          icon={<ArrowUp className='h-5 w-5' />}
          description='Platform earnings'
        />
        <TransactionMetricCard
          title='Vendor Payouts'
          value='₦410000'
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
            {/* <div className='flex items-center gap-2 w-full sm:w-auto'>
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
            </div> */}
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

                  <TableHead> Status</TableHead>
                  <TableHead className='text-right'>Amount</TableHead>
                  {/* <TableHead className='text-right'>Actions</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionsResponse?.data.map((transaction) => (
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
                      <TransactionStatusBadge status={transaction.status} />
                    </TableCell>
                    <TableCell className='text-right'>
                      <span className='font-medium'>
                        {transaction.currency}
                        {transaction.amount}
                      </span>
                    </TableCell>
                    {/* <TableCell className='text-right'>
                      <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                        <Eye className='h-4 w-4' />
                      </Button>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className='flex items-center justify-between mt-4'>
            <div className='text-sm text-muted-foreground'>
              Showing{' '}
              <strong>
                {((transactionsResponse?.page || 1) - 1) *
                  (transactionsResponse?.limit || 10) +
                  1}
              </strong>{' '}
              to{' '}
              <strong>
                {Math.min(
                  (transactionsResponse?.page || 1) *
                    (transactionsResponse?.limit || 10),
                  transactionsResponse?.total || 0
                )}
              </strong>{' '}
              of <strong>{transactionsResponse?.total || 0}</strong> results
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                disabled={
                  !transactionsResponse?.page || transactionsResponse.page <= 1
                }
              >
                Previous
              </Button>
              <Button
                variant='outline'
                size='sm'
                disabled={
                  !transactionsResponse?.total ||
                  (transactionsResponse?.page || 0) *
                    (transactionsResponse?.limit || 10) >=
                    transactionsResponse?.total
                }
              >
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
