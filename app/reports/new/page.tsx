import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { FederalHeader } from "@/components/federal-header"
import { PortalFooter } from "@/components/portal-footer"
import { ReportForm } from "@/components/report-form"

export default async function NewReportPage() {
  const user = await getSession()
  if (!user) redirect("/login")

  return (
    <div className="flex min-h-screen flex-col">
      <FederalHeader user={user} />
      <main className="flex-1 bg-secondary px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="mb-2 font-serif text-3xl font-bold text-foreground">
              Submit Report
            </h1>
            <p className="text-muted-foreground">
              Provide details about the incident or observation you wish to report.
            </p>
          </div>
          <ReportForm />
        </div>
      </main>
      <PortalFooter />
    </div>
  )
}
