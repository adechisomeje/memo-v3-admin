'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'

import AxiosInterceptor from '@/lib/axios-interceptor'
import { getQueryClient } from '@/lib/query-client'

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <AxiosInterceptor />
        <ReactQueryDevtools />
        <Toaster position='top-right' richColors closeButton />
      </QueryClientProvider>
    </SessionProvider>
  )
}
