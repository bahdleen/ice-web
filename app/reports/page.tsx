import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getDb } from "@/lib/db"
import { FederalHeader } from "@/components/federal-header"
import { PortalFooter } from "@/components/portal-footer"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, Plus } from "lucide-react"

export default async function ReportsPage() {
  const user = await getSession()
  if (!user) redirect("/login")

  const sql = getDb()
  const reports = await sql`
    SELECT id, report_ref, report_type, location_tag, status, created_at
    FROM reports
    WHERE user_id = ${user.id}
    ORDER BY created_at DESC
  `

  return (
    <div className="flex min-h-screen flex-col">
      <FederalHeader user={user} />
      <main className="flex-1 bg-secondary px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="mb-1 font-serif text-3xl font-bold text-foreground">My Reports</h1>
              <p className="text-muted-foreground">Reports you have submitted.</p>
            </div>
            <Link href="/reports/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Report
              </Button>
            </Link>
          </div>

          {reports.length === 0 ? (
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col items-center py-12 text-center">
                <FileText className="mb-4 h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground">You have not submitted any reports yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {reports.map((r) => (
                <Card key={r.id} className="border-border bg-card">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-sm font-medium text-card-foreground">
                        {r.report_ref}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {r.report_type} {r.location_tag ? `- ${r.location_tag}` : ""} -{" "}
                        {new Date(r.created_at).toLocaleDateString()}
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
