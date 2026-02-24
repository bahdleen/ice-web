"use server"

import { requireAdmin } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { logAudit } from "@/lib/audit"
import { revalidatePath } from "next/cache"

export async function approveAccessRequest(requestId: string) {
  const admin = await requireAdmin()
  const sql = getDb()

  const rows = await sql`
    SELECT ar.id, ar.case_id, ar.user_id
    FROM access_requests ar
    WHERE ar.id = ${requestId} AND ar.status = 'pending'
    LIMIT 1
  `
  if (rows.length === 0) return { error: "Request not found or already processed." }

  const req = rows[0]

  await sql`
    UPDATE access_requests SET status = 'approved', reviewed_at = now(), reviewed_by = ${admin.id}
    WHERE id = ${requestId}
  `

  await sql`
    INSERT INTO case_participants (case_id, user_id)
    VALUES (${req.case_id}, ${req.user_id})
    ON CONFLICT (case_id, user_id) DO NOTHING
  `

  await logAudit(admin.id, "approve_access", "access_request", requestId)
  revalidatePath("/admin/access-requests")
  revalidatePath("/access-requests")
  return { success: true }
}

export async function denyAccessRequest(requestId: string) {
  const admin = await requireAdmin()
  const sql = getDb()

  await sql`
    UPDATE access_requests SET status = 'denied', reviewed_at = now(), reviewed_by = ${admin.id}
    WHERE id = ${requestId} AND status = 'pending'
  `

  await logAudit(admin.id, "deny_access", "access_request", requestId)
  revalidatePath("/admin/access-requests")
  revalidatePath("/access-requests")
  return { success: true }
}

export async function updateCaseStatus(caseUuid: string, newStatus: string) {
  const admin = await requireAdmin()
  const sql = getDb()

  await sql`UPDATE cases SET status = ${newStatus}, updated_at = now() WHERE id = ${caseUuid}`
  await logAudit(admin.id, "update_status", "case", caseUuid, { status: newStatus })

  revalidatePath("/admin/cases")
  revalidatePath("/cases")
  return { success: true }
}

export async function updateReportStatus(reportId: string, newStatus: string) {
  const admin = await requireAdmin()
  const sql = getDb()

  await sql`UPDATE reports SET status = ${newStatus} WHERE id = ${reportId}`
  await logAudit(admin.id, "update_report_status", "report", reportId, { status: newStatus })

  revalidatePath("/admin/reports")
  return { success: true }
}

export async function updateBrandingConfig(formData: FormData) {
  const admin = await requireAdmin()
  const sql = getDb()

  const isActive = formData.get("is_active") === "true"

  const existing = await sql`SELECT id FROM branding_config LIMIT 1`

  if (existing.length > 0) {
    await sql`UPDATE branding_config SET is_active = ${isActive} WHERE id = ${existing[0].id}`
  } else {
    await sql`INSERT INTO branding_config (is_active) VALUES (${isActive})`
  }

  await logAudit(admin.id, "update_branding", "branding_config", existing[0]?.id)
  revalidatePath("/admin/branding")
  return { success: true }
}

export async function promoteUserToAdmin(formData: FormData) {
  const admin = await requireAdmin()
  const sql = getDb()

  const rawIdentifier = formData.get("identifier")
  const identifier = typeof rawIdentifier === "string" ? rawIdentifier.trim().toLowerCase() : ""

  if (!identifier) {
    return { error: "Enter a username or email." }
  }

  const users = await sql`
    SELECT id, full_name, email, role
    FROM users
    WHERE
      lower(email) = ${identifier}
      OR split_part(lower(email), '@', 1) = ${identifier}
      OR lower(coalesce(full_name, '')) = ${identifier}
    LIMIT 1
  `

  if (users.length === 0) {
    return { error: "No matching user was found." }
  }

  const target = users[0]
  if (target.role === "admin") {
    return { error: `${target.email} is already an admin.` }
  }

  await sql`UPDATE users SET role = 'admin' WHERE id = ${target.id}`
  await logAudit(admin.id, "grant_admin", "user", target.id, {
    email: target.email,
    identifier,
  })

  revalidatePath("/admin")
  revalidatePath("/admin/admins")
  return { success: `Admin access granted to ${target.email}.` }
}
