import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Phone, Mail, Clock, Shield } from "lucide-react"

export function LandingCta() {
  return (
    <section className="relative overflow-hidden bg-card">
      <div className="mx-auto flex max-w-[1440px] flex-col lg:flex-row">
        {/* CTA content */}
        <div className="flex flex-1 flex-col justify-center px-5 py-14 sm:px-8 sm:py-20 lg:px-16 lg:py-28">
          <div className="mb-3 flex items-center gap-3">
            <div className="h-px w-8 bg-[#bf9b30] sm:w-10" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#bf9b30] sm:text-[11px] sm:tracking-[0.3em]">
              Get Started
            </span>
          </div>
          <h2 className="mb-3 font-serif text-2xl font-bold text-card-foreground sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
            Need to check on a case?
          </h2>
          <p className="mb-8 max-w-md text-sm leading-relaxed text-muted-foreground sm:mb-10">
            Access the portal now to look up case information, submit a new
            report, or sign in to your existing account for secure
            communication with support personnel.
          </p>

          <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:gap-4">
            <Link href="/case-lookup" className="sm:w-auto">
              <Button
                size="lg"
                className="w-full gap-2 bg-primary px-6 py-6 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/90 sm:w-auto sm:px-10 sm:py-7 sm:text-sm"
              >
                Lookup a Case
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register" className="sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full gap-2 border-2 border-border px-6 py-6 text-xs font-bold uppercase tracking-[0.2em] text-foreground hover:bg-secondary sm:w-auto sm:px-10 sm:py-7 sm:text-sm"
              >
                Create Account
              </Button>
            </Link>
          </div>

          {/* Contact details */}
          <div className="flex flex-col gap-3 border-t border-border pt-6 sm:gap-4 sm:pt-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
              Direct Contact
            </p>
            <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-8">
              {[
                { icon: Phone, value: "+1 202 290 8213" },
                { icon: Mail, value: "support@iaasecurity.org" },
                { icon: Clock, value: "24 / 7 Availability" },
              ].map((c) => (
                <div key={c.value} className="flex items-center gap-2">
                  <c.icon className="h-3.5 w-3.5 shrink-0 text-[#bf9b30]" />
                  <span className="text-sm text-card-foreground">{c.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Image column */}
        <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-auto lg:min-h-[auto] lg:w-[42%]">
          <Image
            src="/images/hero-bg.jpg"
            alt="Federal courthouse"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#0d0d2b]/50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <div className="flex h-16 w-16 items-center justify-center border-2 border-white/15 bg-white/5 backdrop-blur-md sm:h-20 sm:w-20">
                <Shield className="h-8 w-8 text-[#bf9b30] sm:h-10 sm:w-10" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50 sm:text-[11px] sm:tracking-[0.3em]">
                Authorized Access Only
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
