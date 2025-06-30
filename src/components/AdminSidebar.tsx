"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Store,
  Settings,
  LogOut,
  ShoppingCart,
  CreditCard,
  MapPin,
  Percent,
  Verified,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarNav,
  SidebarNavHeader,
  SidebarNavLink,
  SidebarNavList,
} from "@/components/ui/sidebar";
import { Dancing_Script } from "next/font/google";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import { cn } from "@/lib/utils";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

export function AdminSidebar() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const sidebarContent = (
    <>
      <SidebarHeader className="border-b px-6 py-3">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/assets/images/icon.png"
            alt="Eazi Gifting"
            width={24}
            height={24}
            className="object-contain"
          />
          <span className={cn(dancingScript.className, "text-lg")}>
            Eazi Gifting Admin
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex flex-col py-2">
        <SidebarNav>
          <SidebarNavList>
            <SidebarNavLink href="/admin" active={pathname === "/admin"}>
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </SidebarNavLink>
          </SidebarNavList>
        </SidebarNav>

        <SidebarNav>
          <SidebarNavHeader>Marketplace</SidebarNavHeader>
          <SidebarNavList>
            <SidebarNavLink
              href="/admin/customers"
              active={pathname === "/admin/customers"}
            >
              <Users className="h-4 w-4" />
              <span>Customers</span>
            </SidebarNavLink>
            <SidebarNavLink
              href="/admin/vendors"
              active={pathname === "/admin/vendors"}
            >
              <Store className="h-4 w-4" />
              <span>Vendors</span>
            </SidebarNavLink>
            <SidebarNavLink
              href="/admin/products"
              active={pathname === "/admin/products"}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Products</span>
            </SidebarNavLink>
            <SidebarNavLink
              href="/admin/orders"
              active={pathname === "/admin/orders"}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Orders</span>
            </SidebarNavLink>
          </SidebarNavList>
        </SidebarNav>

        <SidebarNav>
          <SidebarNavHeader>Finance</SidebarNavHeader>
          <SidebarNavList>
            <SidebarNavLink
              href="/admin/transactions"
              active={pathname === "/admin/transactions"}
            >
              <CreditCard className="h-4 w-4" />
              <span>Transactions</span>
            </SidebarNavLink>
          </SidebarNavList>
        </SidebarNav>

        <SidebarNav>
          <SidebarNavHeader>Revenue</SidebarNavHeader>
          <SidebarNavList>
            <SidebarNavLink
              href="/admin/commissions"
              active={pathname === "/admin/commissions"}
            >
              <Percent className="h-4 w-4" />
              <span>Commissions</span>
            </SidebarNavLink>
          </SidebarNavList>
        </SidebarNav>

        <SidebarNav>
          <SidebarNavHeader>Settings</SidebarNavHeader>
          <SidebarNavList>
            <SidebarNavLink
              href="/admin/verification"
              active={pathname === "/admin/verification"}
            >
              <Verified className="h-4 w-4" />
              <span>Verification</span>
            </SidebarNavLink>
            <SidebarNavLink
              href="/admin/deletion-requests"
              active={pathname === "/admin/deletion-requests"}
            >
              <UserX className="h-4 w-4" />
              <span>Deletion Requests</span>
            </SidebarNavLink>
            <SidebarNavLink
              href="/admin/locations"
              active={pathname === "/admin/locations"}
            >
              <MapPin className="h-4 w-4" />
              <span>Locations</span>
            </SidebarNavLink>
            <SidebarNavLink
              href="/admin/settings"
              active={pathname === "/admin/settings"}
            >
              <Settings className="h-4 w-4" />
              <span> Settings</span>
            </SidebarNavLink>
          </SidebarNavList>
        </SidebarNav>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-rose-600"
          asChild
        >
          <LogOut className="mr-2 h-4 w-4" />
          <Button
            className="w-full cursor-pointer"
            type="submit"
            onClick={async () => {
              setLoading(true);
              const data = await signOut({
                redirect: false,
                callbackUrl: "/",
              });
              setLoading(false);

              if (data.url) {
                router.push(data.url);
              }
            }}
          >
            {loading ? "Logging out..." : "Log Out"}
          </Button>
        </Button>
      </SidebarFooter>
    </>
  );

  if (isMobile) {
    return (
      <>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden fixed left-4 top-3 z-50"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar className="relative border-none">
              {sidebarContent}
            </Sidebar>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return <Sidebar className="hidden md:flex">{sidebarContent}</Sidebar>;
}
