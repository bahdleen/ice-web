import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getDb } from "@/lib/db"
import { FederalHeader } from "@/components/federal-header"
import { PortalFooter } from "@/components/portal-footer"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"

export default async function AccessRequestsPage() {
  const user = await getSession()
  if (!user) redirect("/login")

  const sql = getDb()
  const requests = await sql`
    SELECT ar.id, ar.status, ar.requested_at, ar.reviewed_at, c.case_id
    FROM access_requests ar
    JOIN cases c ON c.id = ar.case_id
    WHERE ar.user_id = ${user.id}
    ORDER BY ar.requested_at DESC
  `

  return (
    <div className="flex min-h-screen flex-col">
      <FederalHeader user={user} />
      <main className="flex-1 bg-secondary px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="mb-1 font-serif text-3xl font-bold text-foreground">
              My Access Requests
            </h1>
            <p className="text-muted-foreground">
              Track the status of your case access requests.
            </p>
          </div>

          {requests.length === 0 ? (
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col items-center py-12 text-center">
                <Clock className="mb-4 h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground">No access requests yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {requests.map((r) => (
                <Card key={r.id} className="border-border bg-card">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-sm font-medium text-card-foreground">
                        {r.case_id}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Requested {new Date(r.requested_at).toLocaleDateString()}
                        {r.reviewed_at &&
                          ` - Reviewed ${new Date(r.reviewed_at).toLocaleDateString()}`}
                      </span>
                    </div>
                    <StatusBadge status={r.status} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <PortalFooter />
    </div>
  )
}
