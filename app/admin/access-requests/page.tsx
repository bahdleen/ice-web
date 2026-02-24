import { getSession } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { redirect } from "next/navigation"
import { FederalHeader } from "@/components/federal-header"
import { PortalFooter } from "@/components/portal-footer"
import { AccessRequestList } from "@/components/admin/access-request-list"

type AccessRequestRow = {
  id: string
  user_name: string
  user_email: string
  case_id: string
  case_title: string
  note: string | null
  status: string
  reviewer_name: string | null
  requested_at: string
  reviewed_at: string | null
}

export const metadata = {
  title: "Access Requests | Admin",
  description: "Manage access requests",
}

export default async function AdminAccessRequestsPage() {
  const session = await getSession()
  if (!session || session.role !== "admin") redirect("/login")
  const sql = getDb()

  const requests = await sql`
    SELECT ar.*,
      u.full_name as user_name, u.email as user_email,
      c.case_id, c.title as case_title,
      rv.full_name as reviewer_name
    FROM access_requests ar
    JOIN users u ON ar.user_id = u.id
    JOIN cases c ON ar.case_id = c.id
    LEFT JOIN users rv ON ar.reviewed_by = rv.id
    ORDER BY
      CASE ar.status WHEN 'pending' THEN 0 ELSE 1 END,
      ar.requested_at DESC
  `
  const requestRows = requests as AccessRequestRow[]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <FederalHeader user={session} />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">
              Access Requests
            </h1>
            <p className="text-muted-foreground mt-1">
              Review and manage case access requests from users
            </p>
          </div>
          <span className="text-sm text-muted-foreground">
            {requestRows.filter((r) => r.status === "pending").length} pending
          </span>
        </div>
        <AccessRequestList requests={requestRows} />
      </main>
      <PortalFooter />
    </div>
  )
}
