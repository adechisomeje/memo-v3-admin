'use client'

import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function DashboardSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-10 w-48' />
      </div>

      {/* Metric Cards Skeleton */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Card key={`metric-${i}`}>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <Skeleton className='h-5 w-32' />
                <Skeleton className='h-8 w-8 rounded-full' />
              </CardHeader>
              <CardContent>
                <Skeleton className='h-8 w-28 mb-2' />
                <Skeleton className='h-4 w-24' />
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Cards Grid Skeleton */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {/* Recent Customers Skeleton */}
        <Card className='lg:col-span-1'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <div className='space-y-1'>
              <Skeleton className='h-5 w-40' />
              <Skeleton className='h-4 w-48' />
            </div>
            <Skeleton className='h-4 w-16' />
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={`customer-${i}`}
                    className='flex items-center gap-4'
                  >
                    <Skeleton className='h-10 w-10 rounded-full' />
                    <div className='flex-1'>
                      <Skeleton className='h-4 w-28 mb-2' />
                      <Skeleton className='h-3 w-32' />
                    </div>
                    <Skeleton className='h-3 w-16' />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders Skeleton */}
        <Card className='lg:col-span-1'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <div className='space-y-1'>
              <Skeleton className='h-5 w-36' />
              <Skeleton className='h-4 w-52' />
            </div>
            <Skeleton className='h-4 w-16' />
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={`order-${i}`} className='flex items-center gap-4'>
                    <Skeleton className='h-10 w-10 rounded-full' />
                    <div className='flex-1'>
                      <Skeleton className='h-4 w-24 mb-2' />
                      <Skeleton className='h-3 w-32' />
                    </div>
                    <Skeleton className='h-4 w-16' />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Empty third column for layout consistency */}
        <div className='hidden lg:block'></div>
      </div>

      {/* Top sellers section skeleton */}
      <div className='grid gap-6 md:grid-cols-2'>
        {/* Top Products Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className='h-5 w-40 mb-2' />
            <Skeleton className='h-4 w-64' />
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={`product-${i}`} className='flex items-center gap-4'>
                    <Skeleton className='h-8 w-8 rounded-full' />
                    <Skeleton className='h-10 w-10 rounded-md' />
                    <div className='flex-1'>
                      <Skeleton className='h-4 w-32 mb-2' />
                      <Skeleton className='h-3 w-24' />
                    </div>
                    <div className='text-right'>
                      <Skeleton className='h-4 w-20 mb-2' />
                      <Skeleton className='h-3 w-16' />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Vendors Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className='h-5 w-48 mb-2' />
            <Skeleton className='h-4 w-56' />
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={`vendor-${i}`} className='flex items-center gap-4'>
                    <Skeleton className='h-8 w-8 rounded-full' />
                    <Skeleton className='h-10 w-10 rounded-full' />
                    <div className='flex-1'>
                      <Skeleton className='h-4 w-36 mb-1' />
                    </div>
                    <div className='text-right'>
                      <Skeleton className='h-4 w-20 mb-2' />
                      <Skeleton className='h-3 w-16' />
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
