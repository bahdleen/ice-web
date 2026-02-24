"use server"

import { getDb } from "@/lib/db"
import { requireAuth, requireAdmin } from "@/lib/auth"
import { logAudit } from "@/lib/audit"
import { revalidatePath } from "next/cache"

export async function createReport(formData: FormData) {
  const user = await requireAuth()
  const sql = getDb()

  const reportType = formData.get("report_type") as string
  const locationTag = formData.get("location_tag") as string
  const incidentDatetime = formData.get("incident_datetime") as string
  const description = formData.get("description") as string
  const relatedCaseId = formData.get("related_case_id") as string
  const consent = formData.get("consent")

  if (!reportType || !description) {
    return { error: "Report type and description are required." }
  }

  if (!consent) {
    return { error: "You must consent to the terms to submit a report." }
  }

  // Generate report ref
  const year = new Date().getFullYear()
  const countRows = await sql`SELECT COUNT(*) as cnt FROM reports WHERE report_ref LIKE ${"REP-" + year + "-%"}`
  const count = parseInt(countRows[0].cnt) + 1
  const reportRef = `REP-${year}-${String(count).padStart(6, "0")}`

  let relatedCaseUuid: string | null = null
  if (relatedCaseId) {
    const caseRows = await sql`SELECT id FROM cases WHERE case_id = ${relatedCaseId} LIMIT 1`
    if (caseRows.length > 0) relatedCaseUuid = caseRows[0].id
  }

  await sql`
    INSERT INTO reports (report_ref, user_id, related_case_uuid, report_type, location_tag, incident_datetime, description, status)
    VALUES (${reportRef}, ${user.id}, ${relatedCaseUuid}, ${reportType}, ${locationTag || null}, ${incidentDatetime || null}, ${description}, 'received')
  `

  revalidatePath("/reports")
  return { success: true, reportRef }
}

export async function updateReportStatus(reportId: string, newStatus: string) {
  const admin = await requireAdmin()
  const sql = getDb()

  await sql`UPDATE reports SET status = ${newStatus} WHERE id = ${reportId}`
  await logAudit(admin.id, "update_report_status", "report", reportId, { status: newStatus })

  revalidatePath("/admin/reports")
  return { success: true }
}
