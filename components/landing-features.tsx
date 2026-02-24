import Image from "next/image"
import {
  Search,
  UserPlus,
  MessageSquare,
  Lock,
  Eye,
  FileCheck,
  ShieldCheck,
  Scale,
  Fingerprint,
} from "lucide-react"

export function LandingFeatures() {
  return (
    <>
      {/* ── Section 1: Split image + steps ── */}
      <section className="relative overflow-hidden bg-card">
        <div className="mx-auto flex max-w-[1440px] flex-col lg:flex-row">
          {/* Image column */}
          <div className="relative aspect-[16/9] w-full sm:aspect-[2/1] lg:aspect-auto lg:min-h-[600px] lg:w-[45%]">
            <Image
              src="/images/section-operations.jpg"
              alt="Security operations center"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/20 lg:bg-gradient-to-r lg:from-transparent lg:to-card/10" />
            {/* Floating badge */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2.5 border border-white/10 bg-[#0d0d2b]/70 px-4 py-2.5 backdrop-blur-md sm:bottom-6 sm:left-6 sm:gap-3 sm:px-5 sm:py-3">
              <div className="h-2 w-2 bg-[#bf9b30]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white sm:text-[11px] sm:tracking-[0.25em]">
                Case Management System
              </span>
            </div>
          </div>

          {/* Content column */}
          <div className="flex flex-1 flex-col justify-center px-5 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-24">
            <div className="mb-3 flex items-center gap-3">
              <div className="h-px w-8 bg-[#bf9b30] sm:w-10" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#bf9b30] sm:text-[11px] sm:tracking-[0.3em]">
                How It Works
              </span>
            </div>
            <h2 className="mb-3 font-serif text-2xl font-bold text-card-foreground sm:mb-4 sm:text-3xl md:text-4xl">
              Three Steps to Access
            </h2>
            <p className="mb-8 max-w-md text-sm leading-relaxed text-muted-foreground sm:mb-10">
              Follow the established protocol to access case information and
              communicate with assigned support personnel.
            </p>

            <div className="flex flex-col gap-0">
              {[
                {
                  step: "01",
                  icon: Search,
                  title: "Verify Your Case",
                  desc: "Enter your assigned Case ID to verify the case exists in our system and review its current status.",
                },
                {
                  step: "02",
                  icon: UserPlus,
                  title: "Request Clearance",
                  desc: "Create an authenticated account and submit an access request referencing your Case ID for review.",
                },
                {
                  step: "03",
                  icon: MessageSquare,
                  title: "Secure Communication",
                  desc: "Once approved, access full case details and communicate directly through encrypted channels.",
                },
              ].map((item, i) => (
                <div
                  key={item.step}
                  className={`group flex gap-4 py-5 sm:gap-5 sm:py-6 ${i < 2 ? "border-b border-border" : ""}`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="font-serif text-xl font-bold text-[#bf9b30] sm:text-2xl">
                      {item.step}
                    </span>
                    {i < 2 && <div className="h-full w-px bg-border" />}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1.5 flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center border border-[#bf9b30]/30 bg-[#bf9b30]/10 text-[#bf9b30] sm:h-8 sm:w-8">
                        <item.icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      </div>
                      <h3 className="font-serif text-sm font-bold text-card-foreground sm:text-base">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Full-width image — services ── */}
      <section className="relative overflow-hidden">
        <Image
          src="/images/section-filing.jpg"
          alt="Federal building interior"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#0d0d2b]/88" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d2b]/40 via-transparent to-[#0d0d2b]/60" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 md:py-32">
          <div className="mb-10 flex flex-col items-center text-center sm:mb-16">
            <div className="mb-4 flex items-center gap-3 sm:mb-5">
              <div className="h-px w-8 bg-[#bf9b30]/50 sm:w-12" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#bf9b30] sm:text-[11px] sm:tracking-[0.3em]">
                Portal Capabilities
              </span>
              <div className="h-px w-8 bg-[#bf9b30]/50 sm:w-12" />
            </div>
            <h2 className="mb-3 font-serif text-2xl font-bold text-white sm:mb-4 sm:text-3xl md:text-5xl">
              Core Services
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-white/45">
              Core capabilities available through this secure ICESecurity portal.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {[
              {
                icon: Eye,
                title: "Track Case Status",
                desc: "Monitor the progress of cases with real-time status updates, detailed timeline information, and milestone notifications.",
                stat: "Real-time",
                statLabel: "Updates",
              },
              {
                icon: FileCheck,
                title: "Submit Reports",
                desc: "File reports with detailed information, supporting documentation, relevant location data, and contextual evidence.",
                stat: "Encrypted",
                statLabel: "Submissions",
              },
              {
                icon: MessageSquare,
                title: "Secure Messaging",
                desc: "Communicate directly with assigned support personnel through authenticated and encrypted messaging channels.",
                stat: "E2E",
                statLabel: "Encrypted",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group border border-white/8 bg-white/[0.03] p-6 backdrop-blur-md transition-all hover:border-[#bf9b30]/20 hover:bg-white/[0.06] sm:p-8"
              >
                <div className="mb-5 flex items-center justify-between sm:mb-6">
                  <div className="flex h-10 w-10 items-center justify-center border border-[#bf9b30]/30 bg-[#bf9b30]/10 text-[#bf9b30] sm:h-12 sm:w-12">
                    <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="text-right">
                    <div className="font-serif text-base font-bold text-white sm:text-lg">
                      {item.stat}
                    </div>
                    <div className="text-[9px] uppercase tracking-[0.15em] text-white/30 sm:text-[10px]">
                      {item.statLabel}
                    </div>
                  </div>
                </div>
                <h3 className="mb-2 font-serif text-base font-bold text-white sm:mb-3 sm:text-lg">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/40">
                  {item.desc}
                </p>
                <div className="mt-5 h-px w-0 bg-[#bf9b30]/50 transition-all duration-500 group-hover:w-full sm:mt-6" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Split image reversed — Security ── */}
      <section className="relative overflow-hidden bg-card">
        <div className="mx-auto flex max-w-[1440px] flex-col-reverse lg:flex-row-reverse">
          {/* Image column */}
          <div className="relative aspect-[16/9] w-full sm:aspect-[2/1] lg:aspect-auto lg:min-h-[600px] lg:w-[45%]">
            <Image
              src="/images/section-secure.jpg"
              alt="Secure data center"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/20 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-card/10" />
            <div className="absolute bottom-4 right-4 flex items-center gap-2.5 border border-white/10 bg-[#0d0d2b]/70 px-4 py-2.5 backdrop-blur-md sm:bottom-6 sm:right-6 sm:gap-3 sm:px-5 sm:py-3">
              <div className="h-2 w-2 bg-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white sm:text-[11px] sm:tracking-[0.25em]">
                Systems Operational
              </span>
            </div>
          </div>

          {/* Content column */}
          <div className="flex flex-1 flex-col justify-center px-5 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-24">
            <div className="mb-3 flex items-center gap-3">
              <div className="h-px w-8 bg-[#bf9b30] sm:w-10" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#bf9b30] sm:text-[11px] sm:tracking-[0.3em]">
                Infrastructure
              </span>
            </div>
            <h2 className="mb-3 font-serif text-2xl font-bold text-card-foreground sm:mb-4 sm:text-3xl md:text-4xl">
              Enterprise-Grade Security
            </h2>
            <p className="mb-8 max-w-md text-sm leading-relaxed text-muted-foreground sm:mb-10">
              Enterprise security infrastructure built to strict compliance and
              operational reliability standards.
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {[
                {
                  icon: Lock,
                  title: "AES-256 Encryption",
                  desc: "All data encrypted at rest and in transit using TLS 1.3",
                },
                {
                  icon: ShieldCheck,
                  title: "Compliance Ready",
                  desc: "Aligned with modern cloud security standards",
                },
                {
                  icon: Scale,
                  title: "Security Framework",
                  desc: "Comprehensive controls and governance implementation",
                },
                {
                  icon: Fingerprint,
                  title: "Identity Verified",
                  desc: "Multi-factor authentication with role-based access",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="border border-border bg-secondary/50 p-4 transition-colors hover:bg-secondary sm:p-5"
                >
                  <div className="mb-2.5 flex h-8 w-8 items-center justify-center border border-primary/20 bg-primary/5 text-primary sm:mb-3 sm:h-9 sm:w-9">
                    <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <h3 className="mb-1 text-sm font-bold text-card-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: Stats banner with memorial image ── */}
      <section className="relative overflow-hidden">
        <Image
          src="/images/section-justice.jpg"
          alt="National landmark"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#0d0d2b]/85" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 md:py-28">
          <div className="mb-10 flex flex-col items-center text-center sm:mb-14">
            <h2 className="mb-3 font-serif text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Trusted by Security Teams Nationwide
            </h2>
            <p className="max-w-lg text-sm leading-relaxed text-white/40">
              A secure platform built to high standards of compliance and
              operational reliability.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-px border border-white/8 bg-white/8 md:grid-cols-4">
            {[
              { value: "99.99%", label: "Uptime SLA" },
              { value: "<200ms", label: "Avg. Response" },
              { value: "SOC 2", label: "Certified" },
              { value: "24/7/365", label: "Monitoring" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center bg-[#0d0d2b]/60 px-4 py-8 text-center backdrop-blur-sm sm:px-6 sm:py-10"
              >
                <div className="mb-1.5 font-serif text-xl font-bold text-[#bf9b30] sm:mb-2 sm:text-3xl md:text-4xl">
                  {stat.value}
                </div>
                <div className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/35 sm:text-[11px] sm:tracking-[0.2em]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
