import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getDb } from "@/lib/db"
import { FederalHeader } from "@/components/federal-header"
import { PortalFooter } from "@/components/portal-footer"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Briefcase, FileText, Clock, Search, ArrowRight } from "lucide-react"
import { DashboardAccessRequestPrompt } from "@/components/dashboard-access-prompt"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ caseId?: string }>
}) {
  const user = await getSession()
  if (!user) redirect("/login")
  if (user.role === "admin") redirect("/admin")

  const params = await searchParams
  const sql = getDb()

  const [approvedCases, pendingRequests, reportsCount] = await Promise.all([
    sql`
      SELECT c.case_id, c.title, c.status, c.updated_at
      FROM case_participants cp
      JOIN cases c ON c.id = cp.case_id
      WHERE cp.user_id = ${user.id}
      ORDER BY c.updated_at DESC
      LIMIT 5
    `,
    sql`SELECT COUNT(*) as cnt FROM access_requests WHERE user_id = ${user.id} AND status = 'pending'`,
    sql`SELECT COUNT(*) as cnt FROM reports WHERE user_id = ${user.id}`,
  ])

  return (
    <div className="flex min-h-screen flex-col">
      <FederalHeader user={user} />
      <main className="flex-1 bg-secondary px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="mb-1 font-serif text-3xl font-bold text-foreground">
              Welcome, {user.full_name || "User"}
            </h1>
            <p className="text-muted-foreground">Your case follow-up dashboard.</p>
          </div>

          {params.caseId && <DashboardAccessRequestPrompt caseId={params.caseId} />}

          {/* Stat cards */}
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary text-primary-foreground">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">
                    {approvedCases.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Approved Cases</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-accent text-accent-foreground">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">
                    {pendingRequests[0].cnt}
                  </p>
                  <p className="text-sm text-muted-foreground">Pending Requests</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary text-primary-foreground">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">
                    {reportsCount[0].cnt}
                  </p>
                  <p className="text-sm text-muted-foreground">My Reports</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent cases */}
          <Card className="mb-6 border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-serif text-lg text-card-foreground">
                My Approved Cases
              </CardTitle>
              <Link href="/cases">
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                  View All <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {approvedCases.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No approved cases yet. Use Case Lookup to find and request access.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {approvedCases.map((c) => (
                    <Link
                      key={c.case_id}
                      href={`/cases/${c.case_id}`}
                      className="flex items-center justify-between rounded-sm border border-border p-3 transition-colors hover:bg-secondary"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-sm font-medium text-card-foreground">
                          {c.case_id}
                        </span>
                        <span className="text-xs text-muted-foreground">{c.title}</span>
                      </div>
                      <StatusBadge status={c.status} />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick actions */}
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/case-lookup">
              <Card className="border-border bg-card transition-colors hover:bg-secondary">
                <CardContent className="flex items-center gap-4 p-5">
                  <Search className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-serif font-bold text-card-foreground">Quick Case Lookup</p>
                    <p className="text-sm text-muted-foreground">Search for a case by ID</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/reports/new">
              <Card className="border-border bg-card transition-colors hover:bg-secondary">
                <CardContent className="flex items-center gap-4 p-5">
                  <FileText className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-serif font-bold text-card-foreground">Submit a Report</p>
                    <p className="text-sm text-muted-foreground">File a new report</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
      <PortalFooter />
    </div>
  )
}
