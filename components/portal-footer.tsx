import { Shield } from "lucide-react"
import Link from "next/link"

export function PortalFooter() {
  return (
    <footer className="relative bg-[#070720] text-white">
      <div className="h-1 bg-[#bf9b30]" />

      <div className="mx-auto max-w-7xl px-5 pb-6 pt-12 sm:px-6 sm:pb-8 sm:pt-16">
        {/* Seal + tagline */}
        <div className="mb-10 flex flex-col items-center gap-3 text-center sm:mb-14 sm:gap-4">
          <div className="flex h-12 w-12 items-center justify-center border border-white/10 bg-white/[0.03] sm:h-14 sm:w-14">
            <Shield className="h-6 w-6 text-[#bf9b30] sm:h-7 sm:w-7" />
          </div>
          <div>
            <p className="font-serif text-base font-bold tracking-wide sm:text-lg">
              ICE Case Follow-Up Portal
            </p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 sm:text-[11px] sm:tracking-[0.3em]">
              U.S. Immigration & Customs Enforcement
            </p>
          </div>
        </div>

        {/* Link grid */}
        <div className="mb-10 grid grid-cols-2 gap-8 border-y border-white/6 py-8 sm:mb-14 sm:gap-10 sm:py-12 md:grid-cols-4">
          <div>
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#bf9b30] sm:mb-5">
              Services
            </h4>
            <ul className="flex flex-col gap-2.5 sm:gap-3">
              {[
                { href: "/case-lookup", label: "Case Lookup" },
                { href: "/reports/new", label: "Submit Report" },
                { href: "/dashboard", label: "My Dashboard" },
                { href: "/login", label: "Secure Sign In" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/40 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#bf9b30] sm:mb-5">
              Legal
            </h4>
            <ul className="flex flex-col gap-2.5 sm:gap-3">
              {[
                "Privacy Policy",
                "Accessibility",
                "FOIA Requests",
                "No FEAR Act",
              ].map((label) => (
                <li key={label}>
                  <span className="cursor-default text-sm text-white/40">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#bf9b30] sm:mb-5">
              Agency
            </h4>
            <ul className="flex flex-col gap-2.5 sm:gap-3">
              {[
                "About ICE",
                "DHS.gov",
                "USA.gov",
                "Inspector General",
              ].map((label) => (
                <li key={label}>
                  <span className="cursor-default text-sm text-white/40">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#bf9b30] sm:mb-5">
              Contact
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-white/40 sm:gap-3">
              <li>500 12th St SW</li>
              <li>Washington, DC 20536</li>
              <li className="mt-1 text-white/50">+1 202 290 8213</li>
              <li className="text-white/50">support@iaasecurity.org</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-[10px] text-white/20 sm:text-[11px]">
            U.S. Immigration & Customs Enforcement &middot; Department of
            Homeland Security
          </p>
          <p className="text-[10px] text-white/15 sm:text-[11px]">
            An official website of the U.S. Government
          </p>
        </div>
      </div>
    </footer>
  )
}
