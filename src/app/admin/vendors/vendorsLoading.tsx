'use client'

import React from 'react'
import { Store } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

export function VendorsPageSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-10 w-56' />
        {/* Skeleton for Add button if needed 
        <Skeleton className='h-10 w-32' /> */}
      </div>

      <div className='grid gap-6 md:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <Skeleton className='h-5 w-24' />
              <div className='h-8 w-8 rounded-full bg-gray-100 p-1.5 text-gray-300'>
                <Store className='h-5 w-5' />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className='h-8 w-16 mb-2' />
              <Skeleton className='h-4 w-32' />
            </CardContent>
          </Card>
        ))}
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
                    <Skeleton className='h-4 w-20' />
                  </TableHead>
                  <TableHead className='hidden md:table-cell'>
                    <Skeleton className='h-4 w-16' />
                  </TableHead>
                  <TableHead>
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
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className='h-4 w-4' />
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <Skeleton className='h-10 w-10 rounded-full' />
                        <div>
                          <Skeleton className='h-5 w-32 mb-1' />
                          <Skeleton className='h-3 w-24' />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className='hidden md:table-cell'>
                      <Skeleton className='h-4 w-8' />
                    </TableCell>
                    <TableCell className='hidden md:table-cell'>
                      <Skeleton className='h-4 w-8' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-4 w-12' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-6 w-16 rounded-full' />
                    </TableCell>
                    <TableCell className='text-right'>
                      <Skeleton className='h-8 w-8 ml-auto' />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className='flex items-center justify-between mt-4'>
            <Skeleton className='h-4 w-52' />
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

export default VendorsPageSkeleton
