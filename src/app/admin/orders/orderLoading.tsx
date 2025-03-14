'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function OrderManagementSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-9 w-52' />
        <Skeleton className='h-10 w-36' />
      </div>

      {/* Metric Cards */}
      <div className='grid gap-6 md:grid-cols-4'>
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <Skeleton className='h-5 w-24' />
              <Skeleton className='h-8 w-8 rounded-full' />
            </CardHeader>
            <CardContent>
              <Skeleton className='h-8 w-16 mb-1' />
              <Skeleton className='h-4 w-32' />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Orders Table Card */}
      <Card>
        <CardHeader>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
            <div>
              <CardTitle>
                <Skeleton className='h-6 w-20' />
              </CardTitle>
              <Skeleton className='h-4 w-64 mt-1' />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4'>
            <div className='flex items-center gap-2 w-full sm:w-auto'>
              <Skeleton className='h-10 w-72' />
              <Skeleton className='h-10 w-24' />
            </div>
            <div className='flex items-center gap-2 w-full sm:w-auto'>
              <Skeleton className='h-10 w-36' />
              <Skeleton className='h-10 w-10' />
            </div>
          </div>

          {/* Table */}
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Skeleton className='h-4 w-20' />
                  </TableHead>
                  <TableHead>
                    <Skeleton className='h-4 w-24' />
                  </TableHead>
                  <TableHead>
                    <Skeleton className='h-4 w-20' />
                  </TableHead>
                  <TableHead className='hidden md:table-cell'>
                    <Skeleton className='h-4 w-16' />
                  </TableHead>
                  <TableHead>
                    <Skeleton className='h-4 w-20' />
                  </TableHead>
                  <TableHead className='text-right'>
                    <Skeleton className='h-4 w-16 ml-auto' />
                  </TableHead>
                  <TableHead className='text-right'>
                    <Skeleton className='h-4 w-16 ml-auto' />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className='h-4 w-16' />
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Skeleton className='h-8 w-8 rounded-full' />
                        <div>
                          <Skeleton className='h-4 w-32 mb-1' />
                          <Skeleton className='h-3 w-24' />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-4 w-24' />
                    </TableCell>
                    <TableCell className='hidden md:table-cell'>
                      <Skeleton className='h-4 w-20' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-6 w-20 rounded-full' />
                    </TableCell>
                    <TableCell className='text-right'>
                      <Skeleton className='h-4 w-16 ml-auto' />
                    </TableCell>
                    <TableCell className='text-right'>
                      <Skeleton className='h-8 w-8 rounded-sm ml-auto' />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className='flex items-center justify-between mt-4'>
            <Skeleton className='h-4 w-64' />
            <div className='flex items-center gap-2'>
              <Skeleton className='h-8 w-20' />
              <Skeleton className='h-8 w-20' />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default OrderManagementSkeleton
