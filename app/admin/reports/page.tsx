import { getSession } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { redirect } from "next/navigation"
import { FederalHeader } from "@/components/federal-header"
import { PortalFooter } from "@/components/portal-footer"
import { AdminReportList } from "@/components/admin/report-list"

type ReportRow = {
  id: string
  report_ref: string
  report_type: string
  description: string
  location_tag: string | null
  incident_datetime: string | null
  reporter_name: string | null
  reporter_email: string | null
  status: string
  created_at: string
}

export const metadata = {
  title: "Reports | Admin",
  description: "Manage submitted reports",
}

export default async function AdminReportsPage() {
  const session = await getSession()
  if (!session || session.role !== "admin") redirect("/login")
  const sql = getDb()

  const reports = await sql`
    SELECT r.*, u.full_name as reporter_name, u.email as reporter_email
    FROM reports r
    LEFT JOIN users u ON r.user_id = u.id
    ORDER BY
      CASE r.status WHEN 'received' THEN 0 WHEN 'under_review' THEN 1 ELSE 2 END,
      r.created_at DESC
  `
  const reportRows = reports as ReportRow[]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <FederalHeader user={session} />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">
              Submitted Reports
            </h1>
            <p className="text-muted-foreground mt-1">
              Review and manage submitted reports
            </p>
          </div>
          <span className="text-sm text-muted-foreground">
            {reportRows.filter((r) => r.status === "received").length} new
          </span>
        </div>
        <AdminReportList reports={reportRows} />
      </main>
      <PortalFooter />
    </div>
  )
}
