"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth/auth-context"
import { Button } from "@/components/ui/button"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { Calendar, User, LogOut } from "lucide-react"

export function Header() {
  const { user, signOut } = useAuth()

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            LuxeSalon
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/shop" className="text-sm font-medium hover:text-primary transition-colors">
              Shop
            </Link>
            <Link href="/appointments" className="text-sm font-medium hover:text-primary transition-colors">
              Appointments
            </Link>
            {user?.role === "admin" && (
              <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors">
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <CartDrawer />
            {user ? (
              <>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/appointments">
                    <Calendar className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/profile">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={signOut}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
