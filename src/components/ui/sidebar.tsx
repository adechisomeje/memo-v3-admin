'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r bg-background',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Sidebar.displayName = 'Sidebar'

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between space-y-2 px-6 py-4',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
SidebarHeader.displayName = 'SidebarHeader'

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn('flex-1 overflow-y-auto py-2', className)}
      ref={ref}
      {...props}
    />
  )
})
SidebarContent.displayName = 'SidebarContent'

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center space-y-2 px-6 py-4',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
SidebarFooter.displayName = 'SidebarFooter'

const SidebarNav = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div className={cn('mt-2 px-4', className)} ref={ref} {...props} />
})
SidebarNav.displayName = 'SidebarNav'

const SidebarNavHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn('mb-2 mt-4 px-2 text-sm font-semibold', className)}
      ref={ref}
      {...props}
    />
  )
})
SidebarNavHeader.displayName = 'SidebarNavHeader'

const SidebarNavList = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => {
  return <ul className={cn('space-y-1', className)} ref={ref} {...props} />
})
SidebarNavList.displayName = 'SidebarNavList'

interface SidebarNavLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  active?: boolean
  href: string
}

const SidebarNavLink = React.forwardRef<HTMLAnchorElement, SidebarNavLinkProps>(
  ({ className, active, href, ...props }, ref) => {
    return (
      <Link
        href={href}
        className={cn(
          'group flex items-center space-x-2 rounded-md px-2 py-1 font-medium transition-colors hover:bg-secondary hover:text-foreground',
          active ? 'bg-secondary text-foreground' : 'text-muted-foreground',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
SidebarNavLink.displayName = 'SidebarNavLink'

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:opacity-50 data-[state=open]:bg-secondary data-[state=open]:text-foreground',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
SidebarTrigger.displayName = 'SidebarTrigger'

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarNav,
  SidebarNavHeader,
  SidebarNavLink,
  SidebarNavList,
  SidebarTrigger,
}
