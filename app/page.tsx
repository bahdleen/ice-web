import { getSession } from "@/lib/auth"
import { FederalHeader } from "@/components/federal-header"
import { PortalFooter } from "@/components/portal-footer"
import { LandingHero } from "@/components/landing-hero"
import { LandingFeatures } from "@/components/landing-features"
import { LandingCta } from "@/components/landing-cta"

export default async function HomePage() {
  const user = await getSession()

  return (
    <div className="flex min-h-screen flex-col">
      <FederalHeader user={user} />
      <main className="flex-1">
        <LandingHero />
        <LandingFeatures />
        <LandingCta />
      </main>
      <PortalFooter />
    </div>
  )
}
