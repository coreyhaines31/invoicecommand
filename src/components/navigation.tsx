'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Logo } from './logo'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useUser } from '@/hooks/use-user'
import { signOut } from '@/lib/auth-client'
import Link from 'next/link'
import { ArrowRight, User, Settings, CreditCard, LogOut, LayoutDashboard, HelpCircle, Key, Webhook } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SupportWidget } from './support-widget'

export function Navigation() {
  const { user, loading } = useUser()
  const router = useRouter()
  const [supportOpen, setSupportOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  const getUserInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase()
  }

  if (loading) {
    return (
      <nav className="mb-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:gap-3"
          >
            <Logo width={24} height={24} className="text-primary" />
            <span className="text-base font-semibold whitespace-nowrap text-foreground sm:text-lg">Invoice Command</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-24 sm:w-32 h-9 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </nav>
    )
  }

  return (
    <>
    <nav className="mb-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:gap-3"
        >
          <Logo width={24} height={24} className="text-primary" />
          <span className="text-base font-semibold whitespace-nowrap text-foreground sm:text-lg">Invoice Command</span>
        </Link>

        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <Link href="/dashboard" className="hidden sm:inline-flex items-center gap-2 rounded-md text-primary hover:text-primary/80 font-medium transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full" aria-label="Open user menu">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                        {getUserInitials(user.email || 'U')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="truncate text-sm font-medium leading-none" title={user.email}>{user.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">Free Plan</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/api-keys" className="flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      API Keys
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/webhooks" className="flex items-center gap-2">
                      <Webhook className="w-4 h-4" />
                      Webhooks
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/billing" className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Billing
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/invoice-templates" className="group/browse hidden md:inline-flex items-center gap-2 rounded-md text-primary hover:text-primary/80 font-medium transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
                Browse 405+ Templates
                <ArrowRight className="w-4 h-4 transition-transform duration-(--motion-fast) ease-emphasized group-hover/browse:translate-x-0.5" />
              </Link>

              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground gap-1.5"
                onClick={() => setSupportOpen(true)}
              >
                <HelpCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Help</span>
              </Button>

              <Link
                href="/auth/login"
                className="inline-flex h-9 items-center rounded-md px-1 text-muted-foreground hover:text-foreground font-medium transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                Login
              </Link>

              <Button asChild>
                <Link href="/auth/signup" className="inline-flex items-center gap-2">
                  <User className="hidden w-4 h-4 sm:block" />
                  <span className="sm:hidden">Sign up</span>
                  <span className="hidden sm:inline">Create Free Account</span>
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>

    <SupportWidget open={supportOpen} onOpenChange={setSupportOpen} />
    </>
  )
}
