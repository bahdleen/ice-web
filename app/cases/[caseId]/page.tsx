import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getDb } from "@/lib/db"
import { FederalHeader } from "@/components/federal-header"
import { PortalFooter } from "@/components/portal-footer"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageSquare, MapPin, Calendar, User, FileText } from "lucide-react"

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ caseId: string }>
}) {
  const user = await getSession()
  if (!user) redirect("/login")

  const { caseId } = await params
  const sql = getDb()

  // Fetch case
  const caseRows = await sql`SELECT * FROM cases WHERE case_id = ${caseId} LIMIT 1`
  if (caseRows.length === 0) redirect("/cases")

  const caseData = caseRows[0]
  const isAdmin = user.role === "admin"

  // Verify access
  if (!isAdmin) {
    const access = await sql`
      SELECT id FROM case_participants
      WHERE case_id = ${caseData.id} AND user_id = ${user.id}
      LIMIT 1
    `
    if (access.length === 0) {
      await sql`
        INSERT INTO case_participants (case_id, user_id)
        VALUES (${caseData.id}, ${user.id})
        ON CONFLICT (case_id, user_id) DO NOTHING
      `
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <FederalHeader user={user} />
      <main className="flex-1 bg-secondary px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <h1 className="font-mono text-lg font-bold text-foreground">{caseData.case_id}</h1>
                <StatusBadge status={caseData.status} />
              </div>
              <h2 className="font-serif text-2xl font-bold text-foreground">{caseData.title}</h2>
            </div>
            <Link href={`/cases/${caseId}/chat`}>
              <Button className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Open Chat
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Person profile */}
            <Card className="border-border bg-card md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif text-base text-card-foreground">
                  <User className="h-4 w-4 text-primary" />
                  Person
                </CardTitle>
              </CardHeader>
              <CardContent>
                {caseData.person_photo_url && (
                  <div className="mb-3 aspect-square w-full overflow-hidden rounded-sm bg-muted">
                    <img
                      src={caseData.person_photo_url}
                      alt={`${caseData.person_name}`}
                      className="h-full w-full object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                )}
                <p className="font-serif text-lg font-bold text-card-foreground">
                  {caseData.person_name}
                </p>
              </CardContent>
            </Card>

            {/* Case metadata and details */}
            <div className="flex flex-col gap-6 md:col-span-2">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="font-serif text-base text-card-foreground">
                    Case Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="flex flex-col gap-3 text-sm">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <dt className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" /> Created
                      </dt>
                      <dd className="text-card-foreground">
                        {new Date(caseData.created_at).toLocaleDateString()}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <dt className="text-muted-foreground">Category</dt>
                      <dd className="capitalize text-card-foreground">{caseData.category}</dd>
                    </div>
                    {caseData.location_tag && (
                      <div className="flex items-center justify-between border-b border-border pb-2">
                        <dt className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" /> Location
                        </dt>
                        <dd className="text-card-foreground">{caseData.location_tag}</dd>
                      </div>
                    )}
                    {caseData.offence_category && (
                      <div className="flex items-center justify-between border-b border-border pb-2">
                        <dt className="text-muted-foreground">Charge Category</dt>
                        <dd className="capitalize text-card-foreground">
                          {caseData.offence_category}
                        </dd>
                      </div>
                    )}
                  </dl>
                </CardContent>
              </Card>

              {caseData.reason_summary && (
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-serif text-base text-card-foreground">
                      <FileText className="h-4 w-4 text-primary" />
                      Reason Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-card-foreground">
                      {caseData.reason_summary}
                    </p>
                  </CardContent>
                </Card>
              )}

              {caseData.offence_description && (
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="font-serif text-base text-card-foreground">
                      Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-card-foreground">
                      {caseData.offence_description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {isAdmin && caseData.summary_internal && (
                <Card className="border-accent/30 bg-accent/5">
                  <CardHeader>
                    <CardTitle className="font-serif text-base text-accent">
                      Internal Notes (Admin Only)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-foreground">
                      {caseData.summary_internal}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <PortalFooter />
    </div>
  )
}
