import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getDb } from "@/lib/db"

export async function GET(
  _request: Request,
  context: { params: Promise<{ caseId: string }> }
) {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { caseId } = await context.params
  const sql = getDb()

  const caseRows = await sql`
    SELECT id, case_id, status
    FROM cases
    WHERE upper(case_id) = ${caseId.toUpperCase()}
    LIMIT 1
  `
  if (caseRows.length === 0) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 })
  }

  const caseData = caseRows[0]
  const isAdmin = user.role === "admin"

  if (!isAdmin) {
    const access = await sql`
      SELECT id
      FROM case_participants
      WHERE case_id = ${caseData.id} AND user_id = ${user.id}
      LIMIT 1
    `
    if (access.length === 0) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  }

  const messages = await sql`
    SELECT m.*, u.full_name as sender_name, att.file_url as image_url
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

  return NextResponse.json({
    caseId: caseData.case_id,
    caseStatus: caseData.status,
    messages,
  })
}
