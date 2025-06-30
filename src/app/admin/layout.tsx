'use client'

import type React from 'react'

import { Bell } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { AdminSidebar } from '@/components/AdminSidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session } = useSession()
  // const [loading, setLoading] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  useEffect(() => {
    if (session?.user) {
      setFirstName(
        session.user.firstName
          ? session.user.firstName.charAt(0).toUpperCase() +
              session.user.firstName.slice(1)
          : ''
      )
      setLastName(
        session.user.lastName
          ? session.user.lastName.charAt(0).toUpperCase() +
              session.user.lastName.slice(1)
          : ''
      )
    }
  }, [session])
  return (
    // <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    <div className='flex min-h-screen bg-background'>
      <AdminSidebar />
      <div className='flex-1 md:ml-64 p-4'>
        <header className='sticky top-0 z-30 border-b bg-background'>
          <div className='flex h-16 items-center justify-between px-4 md:px-6'>
            <div className='ml-auto flex items-center gap-4'>
              <Button variant='ghost' size='icon'>
                <Bell className='h-5 w-5' />
              </Button>

              <Avatar>
                <AvatarImage src='' />
                <AvatarFallback>
                  {firstName.charAt(0)}
                  {lastName.charAt(0)}
                </AvatarFallback>
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
