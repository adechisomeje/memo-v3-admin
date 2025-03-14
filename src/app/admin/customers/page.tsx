'use client'

import {
  MoreHorizontal,
  Search,
  Filter,
  Download,
  Eye,
  Mail,
  Phone,
} from 'lucide-react'
import Link from 'next/link'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDate, getInitials } from '@/lib/utils'
import { getAllCustomers } from '@/api/customers'
import { queryKeys } from '@/lib/queries'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import CustomersPageSkeleton from './customerLoading'
import { UserMetricCardProps, UserStatusBadgeProps } from '@/types/types'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination'
import { useState } from 'react'

export default function CustomersPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const { status } = useSession()
  const { data: customersResponse, isPending } = useQuery({
    queryKey: [queryKeys.allCustomers, currentPage],
    queryFn: () => getAllCustomers(currentPage),
    enabled: status === 'authenticated',
    staleTime: 5 * 60 * 1000,
  })

  // Extract customer data with proper typing
  const customers = (customersResponse?.data || []) as Array<{
    _id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    isVerified: boolean
    profilePicture: string
    createdAt: string
    updatedAt: string
  }>

  const totalCustomers = customersResponse?.total || 0
  const totalCustomerPages = Math.ceil(
    (customersResponse?.total || 0) / (customersResponse?.limit || 10)
  )

  const renderPaginationLinks = () => {
    const pages = []
    for (let i = 1; i <= totalCustomerPages; i++) {
      if (
        i === 1 || // First page
        i === totalCustomerPages || // Last page
        (i >= currentPage - 1 && i <= currentPage + 1) // Pages around current page
      ) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              href='#'
              isActive={i === currentPage}
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage(i)
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      } else if (
        (i === currentPage - 2 && currentPage > 3) ||
        (i === currentPage + 2 && currentPage < totalCustomerPages - 2)
      ) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
    }
    return pages
  }

  if (isPending) {
    return <CustomersPageSkeleton />
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Customer Management</h1>
        <div className='flex items-center gap-2'>
          <Button variant='default' size='sm'>
            Export Data
          </Button>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-4'>
        <UserMetricCard
          title='Total Customers'
          value={`${totalCustomers}`}
          description='All registered users'
        />

        {/* <UserMetricCard
          title='Avg. Order Value'
          value='$85.40'
          description='Per customer'
        /> */}
      </div>

      <Card>
        <CardHeader className='pb-3'>
          <CardTitle>Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4'>
            <div className='flex items-center gap-2 w-full sm:w-auto'>
              <div className='relative w-full sm:w-[280px]'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  type='search'
                  placeholder='Search customers...'
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
                  {/* <SelectItem value='name-asc'>Name (A-Z)</SelectItem>
                  <SelectItem value='name-desc'>Name (Z-A)</SelectItem>
                  <SelectItem value='orders'>Most Orders</SelectItem> */}
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
                  <TableHead className='w-[50px]'>
                    <input
                      type='checkbox'
                      className='h-4 w-4 rounded border-gray-300'
                    />
                  </TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className='hidden md:table-cell'>
                    Contact
                  </TableHead>
                  <TableHead className='hidden md:table-cell'>
                    Joined Date
                  </TableHead>
                  <TableHead className='hidden md:table-cell'>
                    Verified
                  </TableHead>

                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className='text-center py-4'>
                      No customers found
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer) => (
                    <TableRow key={customer._id}>
                      <TableCell>
                        <input
                          type='checkbox'
                          className='h-4 w-4 rounded border-gray-300'
                        />
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-3'>
                          <Avatar>
                            <AvatarImage src={customer.profilePicture || ''} />
                            <AvatarFallback>
                              {getInitials(
                                `${customer.firstName} ${customer.lastName}`
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className='font-medium'>
                              {customer.firstName} {customer.lastName}
                            </div>
                            <div className='text-xs text-muted-foreground'>
                              {customer.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='hidden md:table-cell'>
                        <div className='flex flex-col'>
                          <div className='flex items-center text-xs'>
                            <Mail className='mr-1 h-3 w-3 text-muted-foreground' />
                            {customer.email}
                          </div>
                          <div className='flex items-center text-xs mt-1'>
                            <Phone className='mr-1 h-3 w-3 text-muted-foreground' />
                            {customer.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='hidden md:table-cell'>
                        {formatDate(customer.createdAt)}
                      </TableCell>
                      <TableCell className='hidden md:table-cell'>
                        {customer.isVerified ? 'Yes' : 'No'}
                      </TableCell>

                      <TableCell>
                        <UserStatusBadge
                          status={
                            customer.isVerified
                              ? 'active'
                              : new Date(customer.createdAt) >
                                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                              ? 'new'
                              : 'inactive'
                          }
                        />
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
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/admin/customers/${customer._id}`}
                                // href='#'
                              >
                                <Eye className='mr-2 h-4 w-4' />
                                <span>View Details</span>
                              </Link>
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem>
                              <X className='mr-2 h-4 w-4' />
                              <span>Block Customer</span>
                            </DropdownMenuItem> */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className='mt-10'>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href='#'
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) {
                        setCurrentPage(currentPage - 1)
                      }
                    }}
                  />
                </PaginationItem>

                {renderPaginationLinks()}

                <PaginationItem>
                  <PaginationNext
                    href='#'
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalCustomerPages) {
                        setCurrentPage(currentPage + 1)
                      }
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function UserMetricCard({ title, value, description }: UserMetricCardProps) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        <div className='mt-1 text-xs text-muted-foreground'>{description}</div>
      </CardContent>
    </Card>
  )
}

function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const variants = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    new: 'bg-blue-100 text-blue-800',
  }

  return (
    <Badge variant='outline' className={`${variants[status]} border-none`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}
