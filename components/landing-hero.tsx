import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Search, FileText, ChevronRight, Shield, Clock, Lock } from "lucide-react"

export function LandingHero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden lg:min-h-[92vh]">
      {/* Capitol building background */}
      <Image
        src="/images/capitol-bg.jpg"
        alt=""
        fill
        className="object-cover"
        priority
      />
      {/* Multi-layer overlay */}
      <div className="absolute inset-0 bg-[#070720]/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#070720]/60 via-transparent to-[#070720]/70" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#070720] to-transparent md:h-64" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_30%_45%,rgba(191,155,48,0.05),transparent)]" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 py-20 sm:px-6 lg:min-h-[92vh] lg:py-24">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-20">
          {/* Left column */}
          <div className="flex-1">
            <div className="mb-6 inline-flex items-center gap-2.5 border border-[#bf9b30]/20 bg-[#bf9b30]/5 px-4 py-2 backdrop-blur-sm sm:gap-3 sm:px-5 sm:py-2.5">
              <Shield className="h-3.5 w-3.5 text-[#bf9b30] sm:h-4 sm:w-4" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#bf9b30] sm:text-[11px] sm:tracking-[0.3em]">
                ICESecurity.org
              </span>
            </div>

            <h1 className="mb-6 font-serif text-3xl font-bold leading-[1.1] text-white text-balance sm:text-4xl md:text-5xl lg:mb-8 lg:text-6xl xl:text-7xl">
              Case Follow-Up &{" "}
              <span className="relative inline-block text-[#bf9b30]">
                Support
                <span className="absolute -bottom-1.5 left-0 h-0.5 w-full bg-[#bf9b30]/50 sm:-bottom-2 sm:h-[3px]" />
              </span>{" "}
              Portal
            </h1>

            <p className="mb-8 max-w-lg text-sm leading-relaxed text-white/50 text-pretty sm:text-base lg:mb-10 lg:text-lg">
              Access case information, submit reports, and communicate securely
              with authorized support personnel through encrypted channels.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link href="/case-lookup" className="sm:w-auto">
                <Button
                  size="lg"
                  className="w-full gap-2 border-2 border-[#bf9b30] bg-[#bf9b30] px-6 py-6 text-xs font-bold uppercase tracking-[0.2em] text-[#0d0d2b] shadow-[0_0_30px_rgba(191,155,48,0.25)] transition-all hover:bg-[#d4ac35] hover:shadow-[0_0_40px_rgba(191,155,48,0.4)] sm:w-auto sm:px-10 sm:py-7 sm:text-sm"
                >
                  <Search className="h-4 w-4" />
                  Lookup a Case
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/reports/new" className="sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full gap-2 border-2 border-white/15 bg-white/5 px-6 py-6 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10 hover:text-white sm:w-auto sm:px-10 sm:py-7 sm:text-sm"
                >
                  <FileText className="h-4 w-4" />
                  Submit a Report
                </Button>
              </Link>
            </div>
          </div>

          {/* Right column -- stat cards */}
          <div className="flex flex-row gap-3 overflow-x-auto pb-2 lg:w-72 lg:flex-col lg:gap-4 lg:overflow-visible lg:pb-0">
            {[
              {
                icon: Clock,
                value: "24 / 7",
                label: "Portal Availability",
                sublabel: "Always operational",
              },
              {
                icon: Lock,
                value: "AES-256",
                label: "Encryption Standard",
                sublabel: "End-to-end encrypted",
              },
              {
                icon: Shield,
                value: "FedRAMP",
                label: "Compliance Level",
                sublabel: "Authorized",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="group flex min-w-[200px] shrink-0 items-start gap-3 border border-white/8 bg-white/[0.03] p-4 backdrop-blur-md transition-all hover:border-[#bf9b30]/20 hover:bg-white/[0.05] sm:gap-4 sm:p-5 lg:min-w-0 lg:shrink"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#bf9b30]/25 bg-[#bf9b30]/10 text-[#bf9b30] sm:h-10 sm:w-10">
                  <stat.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-serif text-lg font-bold text-white sm:text-xl">
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40 sm:text-[11px] sm:tracking-[0.15em]">
                    {stat.label}
                  </div>
                  <div className="text-[10px] text-white/25">{stat.sublabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gold strip */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-1 bg-[#bf9b30] shadow-[0_0_20px_rgba(191,155,48,0.4)] sm:h-1.5" />
    </section>
  )
}
