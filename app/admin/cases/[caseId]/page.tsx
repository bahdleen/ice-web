import { getSession } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { redirect } from "next/navigation"
import { FederalHeader } from "@/components/federal-header"
import { PortalFooter } from "@/components/portal-footer"
import { StatusBadge } from "@/components/status-badge"
import { AdminCaseActions } from "@/components/admin/case-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Users, MessageSquare, Calendar, MapPin } from "lucide-react"

type ParticipantRow = {
  id: string
  full_name: string
  email: string
}

type CaseMessageRow = {
  id: string
  sender_name: string | null
  body: string
  is_internal_note: boolean
  created_at: string
}

export default async function AdminCaseDetailPage({
  params,
}: {
  params: Promise<{ caseId: string }>
}) {
  const { caseId } = await params
  const session = await getSession()
  if (!session || session.role !== "admin") redirect("/login")
  const sql = getDb()

  const cases = await sql`SELECT * FROM cases WHERE id = ${caseId}`
  if (cases.length === 0) redirect("/admin/cases")
  const c = cases[0]

  const participants = await sql`
    SELECT cp.*, u.full_name, u.email
    FROM case_participants cp
    JOIN users u ON cp.user_id = u.id
    WHERE cp.case_id = ${caseId}
  `
  const participantRows = participants as ParticipantRow[]

  const messages = await sql`
    SELECT m.*, u.full_name as sender_name
    FROM messages m
    LEFT JOIN users u ON m.sender_user_id = u.id
    WHERE m.case_id = ${caseId}
    ORDER BY m.created_at DESC
    LIMIT 10
  `
  const messageRows = messages as CaseMessageRow[]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <FederalHeader user={session} />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <Link
          href="/admin/cases"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cases
        </Link>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-serif font-bold text-foreground font-mono">
                  {c.case_id}
                </h1>
                <StatusBadge status={c.status} />
                <Badge variant="outline">{c.category}</Badge>
              </div>
              <h2 className="text-lg text-foreground/80">{c.title}</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {participantRows.length > 0 ? (
                <Link href={`/cases/${c.case_id}/chat`}>
                  <Button size="sm" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Reply in Chat
                  </Button>
                </Link>
              ) : (
                <Button size="sm" variant="outline" disabled>
                  No Participant Yet
                </Button>
              )}
              <AdminCaseActions caseId={caseId} currentStatus={c.status} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Case Details</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Person</p>
                    <p className="font-medium">{c.person_name}</p>
                  </div>
                  {c.location_tag && (
                    <div>
                      <p className="text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> Location
                      </p>
                      <p className="font-medium">{c.location_tag}</p>
                    </div>
                  )}
                  {c.offence_category && (
                    <div>
                      <p className="text-muted-foreground">Offence Category</p>
                      <p className="font-medium">{c.offence_category}</p>
                    </div>
                  )}
                  {c.reason_summary && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Reason Summary</p>
                      <p className="font-medium">{c.reason_summary}</p>
                    </div>
                  )}
                </div>

                {c.summary_public && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Public Summary</p>
                    <p className="text-sm text-foreground/80 whitespace-pre-wrap">{c.summary_public}</p>
                  </div>
                )}
                {c.summary_internal && (
                  <div className="border-t pt-3">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Internal Summary</p>
                    <p className="text-sm text-foreground/80 whitespace-pre-wrap">{c.summary_internal}</p>
                  </div>
                )}

                <div className="flex items-center gap-4 pt-3 border-t text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Created{" "}
                    {new Date(c.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Participants ({participantRows.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {participantRows.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No participants yet</p>
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {participantRows.map((p) => (
                        <li key={p.id} className="flex items-center justify-between text-sm">
                          <span>{p.full_name}</span>
                          <span className="text-xs text-muted-foreground">{p.email}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Recent Messages ({messageRows.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {messageRows.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No messages yet</p>
                  ) : (
                    <ul className="flex flex-col gap-3">
                      {messageRows.map((m) => (
                        <li key={m.id} className="text-sm">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-medium">
                              {m.sender_name || "System"}
                              {m.is_internal_note && (
                                <Badge variant="outline" className="ml-2 text-[10px]">Internal</Badge>
                              )}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(m.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="text-foreground/70 line-clamp-2">{m.body}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <PortalFooter />
    </div>
  )
}
