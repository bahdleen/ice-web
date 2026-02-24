import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { FederalHeader } from "@/components/federal-header"
import { PortalFooter } from "@/components/portal-footer"
import { AdminCaseForm } from "@/components/admin/case-form"

export default async function AdminNewCasePage() {
  const user = await getSession()
  if (!user || user.role !== "admin") redirect("/login")

  return (
    <div className="flex min-h-screen flex-col">
      <FederalHeader user={user} />
      <main className="flex-1 bg-secondary px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="mb-1 font-serif text-3xl font-bold text-foreground">
              Create New Case
            </h1>
            <p className="text-muted-foreground">
              Register a new case in the system. A Case ID will be generated automatically.
            </p>
          </div>
          <AdminCaseForm />
        </div>
      </main>
      <PortalFooter />
    </div>
  )
}
