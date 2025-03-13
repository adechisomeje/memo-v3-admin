'use client'

import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function CustomersPageSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-10 w-64' />
      </div>

      <div className='grid gap-6 md:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <Skeleton className='h-5 w-32' />
          </CardHeader>
          <CardContent>
            <Skeleton className='h-8 w-16 mb-2' />
            <Skeleton className='h-4 w-32' />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className='pb-3'>
          <CardTitle>
            <Skeleton className='h-6 w-24' />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4'>
            <div className='flex items-center gap-2 w-full sm:w-auto'>
              <Skeleton className='h-10 w-[280px]' />
              <Skeleton className='h-10 w-24' />
            </div>
            <div className='flex items-center gap-2 w-full sm:w-auto'>
              <Skeleton className='h-10 w-[180px]' />
              <Skeleton className='h-10 w-10' />
            </div>
          </div>

          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[50px]'>
                    <Skeleton className='h-4 w-4' />
                  </TableHead>
                  <TableHead>
                    <Skeleton className='h-4 w-16' />
                  </TableHead>
                  <TableHead className='hidden md:table-cell'>
                    <Skeleton className='h-4 w-16' />
                  </TableHead>
                  <TableHead className='hidden md:table-cell'>
                    <Skeleton className='h-4 w-24' />
                  </TableHead>
                  <TableHead className='hidden md:table-cell'>
                    <Skeleton className='h-4 w-16' />
                  </TableHead>
                  <TableHead>
                    <Skeleton className='h-4 w-16' />
                  </TableHead>
                  <TableHead className='text-right'>
                    <Skeleton className='h-4 w-16 ml-auto' />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <CustomerRowSkeleton key={i} />
                ))}
              </TableBody>
            </Table>
          </div>

          <div className='flex items-center justify-between mt-4'>
            <Skeleton className='h-4 w-64' />
            <div className='flex items-center gap-2'>
              <Skeleton className='h-9 w-20' />
              <Skeleton className='h-9 w-20' />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CustomerRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className='h-4 w-4' />
      </TableCell>
      <TableCell>
        <div className='flex items-center gap-3'>
          <Skeleton className='h-10 w-10 rounded-full' />
          <div>
            <Skeleton className='h-5 w-36 mb-1' />
            <Skeleton className='h-3 w-24' />
          </div>
        </div>
      </TableCell>
      <TableCell className='hidden md:table-cell'>
        <div className='flex flex-col'>
          <Skeleton className='h-4 w-32 mb-1' />
          <Skeleton className='h-4 w-24' />
        </div>
      </TableCell>
      <TableCell className='hidden md:table-cell'>
        <Skeleton className='h-4 w-24' />
      </TableCell>
      <TableCell className='hidden md:table-cell'>
        <Skeleton className='h-4 w-8' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-6 w-16 rounded-full' />
      </TableCell>
      <TableCell className='text-right'>
        <Skeleton className='h-8 w-8 ml-auto' />
      </TableCell>
    </TableRow>
  )
}
