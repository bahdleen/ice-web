import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getDb } from "@/lib/db"
import { FederalHeader } from "@/components/federal-header"
import { PortalFooter } from "@/components/portal-footer"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Briefcase, MessageSquare, ArrowRight } from "lucide-react"

export default async function MyCasesPage() {
  const user = await getSession()
  if (!user) redirect("/login")

  const sql = getDb()
  const cases =
    user.role === "admin"
      ? await sql`
          SELECT
            c.id,
            c.case_id,
            c.title,
            c.status,
            c.location_tag,
            c.updated_at,
            (
              SELECT COUNT(*)::int
              FROM case_participants cp
              WHERE cp.case_id = c.id
            ) AS participant_count
          FROM cases c
          ORDER BY c.updated_at DESC
        `
      : await sql`
          SELECT c.id, c.case_id, c.title, c.status, c.location_tag, c.updated_at
          FROM case_participants cp
          JOIN cases c ON c.id = cp.case_id
          WHERE cp.user_id = ${user.id}
          ORDER BY c.updated_at DESC
        `

  return (
    <div className="flex min-h-screen flex-col">
      <FederalHeader user={user} />
      <main className="flex-1 bg-secondary px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="mb-1 font-serif text-3xl font-bold text-foreground">My Cases</h1>
            <p className="text-muted-foreground">
              {user.role === "admin"
                ? "Admin view of all cases in the system."
                : "Cases you have been approved to access."}
            </p>
          </div>

          {cases.length === 0 ? (
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col items-center py-12 text-center">
                <Briefcase className="mb-4 h-10 w-10 text-muted-foreground" />
                <p className="mb-4 text-muted-foreground">
                  {user.role === "admin"
                    ? "No cases have been created yet."
                    : "You don&apos;t have access to any cases yet."}
                </p>
                <Link href="/case-lookup">
                  <Button variant="outline">Look Up a Case</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
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
                        </div>
                        <span className="text-sm text-muted-foreground">{c.title}</span>
                        {c.location_tag && (
                          <span className="text-xs text-muted-foreground">
                            {c.location_tag}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/cases/${c.case_id}`}>
                          <Button variant="outline" size="sm" className="gap-1">
                            Details <ArrowRight className="h-3 w-3" />
                          </Button>
                        </Link>
                        {user.role !== "admin" || c.participant_count > 0 ? (
                          <Link href={`/cases/${c.case_id}/chat`}>
                            <Button size="sm" className="gap-1">
                              <MessageSquare className="h-3 w-3" /> Chat
                            </Button>
                          </Link>
                        ) : (
                          <Button size="sm" variant="outline" disabled>
                            No Participant
                          </Button>
                        )}
                      </div>
                    </div>
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
