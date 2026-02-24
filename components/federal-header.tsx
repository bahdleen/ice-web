"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield, Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

type FederalHeaderProps = {
  user?: { full_name: string | null; role: string } | null
}

export function FederalHeader({ user }: FederalHeaderProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/case-lookup", label: "Case Lookup" },
    { href: "/reports/new", label: "Submit Report" },
  ]

  const userLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/cases", label: "My Cases" },
    { href: "/reports", label: "My Reports" },
    { href: "/access-requests", label: "Access Requests" },
  ]

  const adminLinks = [
    { href: "/admin", label: "Admin" },
    { href: "/admin/cases", label: "Cases" },
    { href: "/admin/access-requests", label: "Requests" },
    { href: "/admin/reports", label: "Reports" },
    { href: "/admin/audit-logs", label: "Audit" },
    { href: "/admin/admins", label: "Admins" },
    { href: "/admin/branding", label: "Branding" },
  ]

  const links = user
    ? user.role === "admin"
      ? [...publicLinks.slice(0, 1), ...adminLinks, ...userLinks.slice(1)]
      : [...publicLinks, ...userLinks]
    : publicLinks

  return (
    <header className="sticky top-0 z-50">
      {/* ── Official gov banner ── */}
      <div className="bg-[#1b1b1b] px-4 py-1.5">
        <div className="mx-auto flex max-w-7xl items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="11"
            viewBox="0 0 16 11"
            className="shrink-0"
            aria-hidden="true"
          >
            <rect width="16" height="11" fill="#002868" rx="1" />
            <rect y="0" width="16" height="0.85" fill="#BF0A30" />
            <rect y="1.69" width="16" height="0.85" fill="#BF0A30" />
            <rect y="3.38" width="16" height="0.85" fill="#BF0A30" />
            <rect y="5.08" width="16" height="0.85" fill="#BF0A30" />
            <rect y="6.77" width="16" height="0.85" fill="#BF0A30" />
            <rect y="8.46" width="16" height="0.85" fill="#BF0A30" />
            <rect y="10.15" width="16" height="0.85" fill="#BF0A30" />
            <rect width="6.4" height="5.5" fill="#002868" />
          </svg>
          <span className="text-[10px] leading-none text-white/70 sm:text-[11px]">
            An official website of the United States Government
          </span>
          <button className="ml-1 hidden items-center gap-0.5 text-[11px] text-white/50 underline underline-offset-2 hover:text-white/70 sm:flex">
            {"Here's how you know"}
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* ── Gold stripe ── */}
      <div className="h-0.5 bg-accent sm:h-1" />

      {/* ── Main nav ── */}
      <div className="border-b border-primary-foreground/10 bg-primary text-primary-foreground shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="flex h-9 w-9 items-center justify-center border-2 border-accent/50 bg-accent/10 shadow-[0_0_8px_rgba(191,155,48,0.15)] sm:h-11 sm:w-11">
              <Shield className="h-5 w-5 text-accent sm:h-6 sm:w-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-base font-bold leading-tight tracking-tight sm:text-xl">
                ICE Portal
              </span>
              <span className="hidden text-[10px] uppercase tracking-[0.2em] text-primary-foreground/40 sm:block">
                Case Follow-Up & Communication
              </span>
            </div>
          </Link>

          {/* Desktop nav -- hidden below xl to avoid overflow */}
          <nav className="hidden items-center gap-0.5 xl:flex">
            {links.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-2.5 py-2 text-[13px] transition-colors ${
                    active
                      ? "font-semibold text-primary-foreground"
                      : "text-primary-foreground/60 hover:text-primary-foreground"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-4/5 -translate-x-1/2 bg-accent" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Auth buttons -- desktop */}
          <div className="hidden items-center gap-2.5 xl:flex">
            {user ? (
              <>
                <div className="flex items-center gap-2 border-l border-primary-foreground/10 pl-3">
                  <div className="flex h-7 w-7 items-center justify-center bg-accent/15 text-[11px] font-bold text-accent">
                    {user.full_name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="max-w-[120px] truncate text-xs text-primary-foreground/50">
                    {user.full_name}
                  </span>
                </div>
                <form action="/api/auth/logout" method="POST">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary-foreground/15 bg-transparent text-xs text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  >
                    Sign Out
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary-foreground/15 bg-transparent text-xs text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-accent text-xs font-semibold text-accent-foreground shadow-[0_2px_8px_rgba(191,155,48,0.25)] hover:bg-accent/90"
                  >
                    Create Account
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Hamburger -- visible below xl */}
          <button
            className="flex h-9 w-9 items-center justify-center xl:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile / tablet nav ── */}
      {mobileOpen && (
        <nav className="border-b border-primary-foreground/10 bg-primary px-4 py-2 xl:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-0.5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2.5 text-sm transition-colors ${
                  pathname === link.href
                    ? "border-l-2 border-accent bg-primary-foreground/5 font-semibold text-primary-foreground"
                    : "border-l-2 border-transparent text-primary-foreground/60 hover:bg-primary-foreground/5 hover:text-primary-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 border-t border-primary-foreground/10 pt-3 pb-2">
              {user ? (
                <form
                  action="/api/auth/logout"
                  method="POST"
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-primary-foreground/15 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  >
                    Sign Out
                  </Button>
                </form>
              ) : (
                <>
                  <Link href="/login" className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-primary-foreground/15 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" className="flex-1">
                    <Button
                      size="sm"
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
