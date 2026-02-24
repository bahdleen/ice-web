"use server"

import { requireAuth } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { logAudit } from "@/lib/audit"
import { revalidatePath } from "next/cache"

export async function submitAccessRequest(formData: FormData) {
  const user = await requireAuth()
  const sql = getDb()

  const caseIdText = formData.get("case_id") as string
  const note = formData.get("note") as string

  if (!caseIdText) {
    return { error: "Case ID is required." }
  }

  const cases = await sql`SELECT id FROM cases WHERE case_id = ${caseIdText} LIMIT 1`
  if (cases.length === 0) {
    return { error: "No case found with that ID." }
  }

  const caseUuid = cases[0].id

  const existing = await sql`
    SELECT id, status FROM access_requests WHERE user_id = ${user.id} AND case_id = ${caseUuid} LIMIT 1
  `
  if (existing.length > 0) {
    return { error: `You already have an access request (${existing[0].status}).` }
  }

  const alreadyParticipant = await sql`
    SELECT id FROM case_participants WHERE user_id = ${user.id} AND case_id = ${caseUuid} LIMIT 1
  `
  if (alreadyParticipant.length > 0) {
    return { error: "You already have access to this case." }
  }

  await sql`
    INSERT INTO access_requests (user_id, case_id, status, note)
    VALUES (${user.id}, ${caseUuid}, 'pending', ${note || null})
  `

  await logAudit(user.id, "submit_access_request", "case", caseUuid)
  revalidatePath("/dashboard")
  revalidatePath("/access-requests")
  return { success: true }
}
