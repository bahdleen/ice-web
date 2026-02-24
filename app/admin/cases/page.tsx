import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getDb } from "@/lib/db"
import { FederalHeader } from "@/components/federal-header"
import { PortalFooter } from "@/components/portal-footer"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, ArrowRight, MessageSquare } from "lucide-react"

export default async function AdminCasesPage() {
  const user = await getSession()
  if (!user || user.role !== "admin") redirect("/login")

  const sql = getDb()
  const cases = await sql`
    SELECT
      c.id,
      c.case_id,
      c.title,
      c.category,
      c.location_tag,
      c.status,
      c.person_name,
      c.created_at,
      c.updated_at,
      (
        SELECT COUNT(*)::int
        FROM case_participants cp
        WHERE cp.case_id = c.id
      ) AS participant_count
    FROM cases c
    ORDER BY created_at DESC
  `

  return (
    <div className="flex min-h-screen flex-col">
      <FederalHeader user={user} />
      <main className="flex-1 bg-secondary px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="mb-1 font-serif text-3xl font-bold text-foreground">
                Case Management
              </h1>
              <p className="text-muted-foreground">{cases.length} cases in system</p>
            </div>
            <Link href="/admin/cases/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Case
              </Button>
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {cases.map((c) => (
              <Card key={c.id} className="border-border bg-card">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-medium text-card-foreground">
                          {c.case_id}
                        </span>
                        <StatusBadge status={c.status} />
                        <span className="rounded-sm bg-muted px-2 py-0.5 text-xs capitalize text-muted-foreground">
                          {c.category}
                        </span>
                      </div>
                      <span className="text-sm text-card-foreground">{c.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {c.person_name} {c.location_tag ? `- ${c.location_tag}` : ""}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {c.participant_count} participant{c.participant_count === 1 ? "" : "s"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {c.participant_count > 0 ? (
                        <Link href={`/cases/${c.case_id}/chat`}>
                          <Button size="sm" className="gap-1">
                            <MessageSquare className="h-3 w-3" />
                            Reply
                          </Button>
                        </Link>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          No Participant
                        </Button>
                      )}
                      <Link href={`/admin/cases/${c.id}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          Details <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <PortalFooter />
    </div>
  )
}
