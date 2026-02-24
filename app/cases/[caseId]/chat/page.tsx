import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getDb } from "@/lib/db"
import { FederalHeader } from "@/components/federal-header"
import { StatusBadge } from "@/components/status-badge"
import { ChatThread } from "@/components/chat-thread"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function CaseChatPage({
  params,
}: {
  params: Promise<{ caseId: string }>
}) {
  const user = await getSession()
  if (!user) redirect("/login")

  const { caseId } = await params
  const sql = getDb()

  const caseRows = await sql`SELECT * FROM cases WHERE case_id = ${caseId} LIMIT 1`
  if (caseRows.length === 0) redirect("/cases")

  const caseData = caseRows[0]
  const isAdmin = user.role === "admin"
  let participantCountRows = await sql`
    SELECT COUNT(*)::int AS cnt
    FROM case_participants
    WHERE case_id = ${caseData.id}
  `

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
      participantCountRows = await sql`
        SELECT COUNT(*)::int AS cnt
        FROM case_participants
        WHERE case_id = ${caseData.id}
      `
    }
  }
  const participantCount = Number(participantCountRows[0]?.cnt ?? 0)

  const messages = await sql`
    SELECT m.*, u.full_name as sender_name
      , att.file_url as image_url
    FROM messages m
    LEFT JOIN users u ON u.id = m.sender_user_id
    LEFT JOIN LATERAL (
      SELECT a.file_url
      FROM attachments a
      WHERE a.owner_type = 'message' AND a.owner_id = m.id
      ORDER BY a.created_at DESC
      LIMIT 1
    ) att ON true
    WHERE m.case_id = ${caseData.id}
    AND (m.is_internal_note = false OR ${isAdmin})
    ORDER BY m.created_at ASC
  `

  return (
    <div className="flex min-h-screen flex-col">
      <FederalHeader user={user} />
      <main className="flex flex-1 flex-col bg-secondary">
        {/* Chat header */}
        <div className="border-b border-border bg-card px-4 py-3">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href={`/cases/${caseId}`}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
              <div className="h-4 w-px bg-border" />
              <span className="font-mono text-sm font-medium text-foreground">{caseId}</span>
            </div>
            <StatusBadge status={caseData.status} />
          </div>
        </div>

        {/* Chat thread */}
        <div className="flex-1">
          <ChatThread
            caseUuid={caseData.id}
            casePublicId={caseData.case_id}
            caseStatus={caseData.status}
            participantCount={participantCount}
            messages={messages as Array<{
              id: string
              sender_name: string | null
              sender_role: string
              body: string
              is_internal_note: boolean
              created_at: string
              sender_user_id: string | null
              image_url?: string | null
            }>}
            currentUserId={user.id}
            isAdmin={isAdmin}
          />
        </div>
      </main>
    </div>
  )
}
