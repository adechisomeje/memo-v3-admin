import type React from 'react'
import type { Metadata } from 'next'
import { Bell, MessageSquare, Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { AdminSidebar } from '@/components/AdminSidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export const metadata: Metadata = {
  title: 'MEMO - Admin Dashboard',
  description: 'Admin dashboard for MEMO platform',
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    // <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    <div className='flex min-h-screen bg-background'>
      <AdminSidebar />
      <div className='flex-1 md:ml-64 p-4'>
        <header className='sticky top-0 z-30 border-b bg-background'>
          <div className='flex h-16 items-center justify-between px-4 md:px-6'>
            <Button variant='ghost' size='icon' className='md:hidden'>
              <Menu className='h-6 w-6' />
            </Button>
            <div className='ml-auto flex items-center gap-4'>
              <Button variant='ghost' size='icon'>
                <Bell className='h-5 w-5' />
              </Button>
              <Button variant='ghost' size='icon'>
                <MessageSquare className='h-5 w-5' />
              </Button>

              <Avatar>
                <AvatarImage src='' />
                <AvatarFallback>KG</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        <main className='flex-1 overflow-auto'>
          <div className='container py-6'>{children}</div>
        </main>
      </div>
    </div>
  )
}
