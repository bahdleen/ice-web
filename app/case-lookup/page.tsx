import { getSession } from "@/lib/auth"
import { FederalHeader } from "@/components/federal-header"
import { PortalFooter } from "@/components/portal-footer"
import { CaseLookupForm } from "@/components/case-lookup-form"

export default async function CaseLookupPage() {
  const user = await getSession()

  return (
    <div className="flex min-h-screen flex-col">
      <FederalHeader user={user} />
      <main className="flex-1 bg-secondary px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 font-serif text-3xl font-bold text-foreground">
              Case Lookup
            </h1>
            <p className="text-muted-foreground">
              Enter a Case ID to check its current status. No account required.
            </p>
          </div>
          <CaseLookupForm isLoggedIn={!!user} />
        </div>
      </main>
      <PortalFooter />
    </div>
  )
}
