"use server"

import { getDb } from "@/lib/db"
import { getSession, requireAuth, requireAdmin } from "@/lib/auth"
import { logAudit } from "@/lib/audit"
import { rateLimit } from "@/lib/rate-limit"
import { revalidatePath } from "next/cache"
import { saveImageToPublic } from "@/lib/uploads"

export async function publicCaseLookup(formData: FormData) {
  const caseIdInput = (formData.get("case_id") as string)?.trim()?.toUpperCase()

  if (!caseIdInput) {
    return { error: "Please enter a Case ID." }
  }

  const rl = rateLimit(`lookup:${caseIdInput}`, 10, 60000)
  if (!rl.success) {
    return { error: "Too many lookups. Please try again later." }
  }

  const sql = getDb()
  const rows = await sql`
    SELECT id, case_id, status, location_tag, summary_public
    FROM cases
    WHERE upper(case_id) = ${caseIdInput}
    LIMIT 1
  `

  if (rows.length === 0) {
    return { found: false }
  }

  const caseData = rows[0]
  const session = await getSession()
  const canChat = !!session

  return {
    found: true,
    case_id: caseData.case_id,
    status: caseData.status,
    location_tag: caseData.location_tag,
    summary_public: caseData.summary_public,
    can_chat: canChat,
  }
}

export async function requestAccess(caseIdText: string) {
  const user = await requireAuth()
  const sql = getDb()

  const caseRows = await sql`SELECT id FROM cases WHERE case_id = ${caseIdText} LIMIT 1`
  if (caseRows.length === 0) {
    return { error: "Case not found." }
  }

  const caseUuid = caseRows[0].id

  // Check if already requested
  const existing = await sql`
    SELECT id, status FROM access_requests
    WHERE case_id = ${caseUuid} AND user_id = ${user.id}
    LIMIT 1
  `
  if (existing.length > 0) {
    return { error: `Access request already ${existing[0].status}.` }
  }

  // Check if already participant
  const participant = await sql`
    SELECT id FROM case_participants
    WHERE case_id = ${caseUuid} AND user_id = ${user.id}
    LIMIT 1
  `
  if (participant.length > 0) {
    return { error: "You already have access to this case." }
  }

  await sql`
    INSERT INTO access_requests (case_id, user_id, status)
    VALUES (${caseUuid}, ${user.id}, 'pending')
  `

  revalidatePath("/access-requests")
  revalidatePath("/admin/access-requests")
  return { success: true }
}

export async function approveAccessRequest(requestId: string) {
  const admin = await requireAdmin()
  const sql = getDb()

  const rows = await sql`
    SELECT ar.id, ar.case_id, ar.user_id
    FROM access_requests ar
    WHERE ar.id = ${requestId} AND ar.status = 'pending'
    LIMIT 1
  `
  if (rows.length === 0) {
    return { error: "Request not found or already processed." }
  }

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

export async function createCase(formData: FormData) {
  const admin = await requireAdmin()
  const sql = getDb()

  const title = formData.get("title") as string
  const category = formData.get("category") as string
  const locationTag = formData.get("location_tag") as string
  const status = (formData.get("status") as string) || "Open"
  const personName = formData.get("person_name") as string
  const personPhoto = formData.get("person_photo")
  const reasonSummary = formData.get("reason_summary") as string
  const offenceCategory = formData.get("offence_category") as string
  const offenceDescription = formData.get("offence_description") as string
  const summaryPublic = formData.get("summary_public") as string
  const summaryInternal = formData.get("summary_internal") as string

  if (!title || !category || !personName) {
    return { error: "Title, category, and person name are required." }
  }

  let personPhotoUrl: string | null = null
  if (personPhoto instanceof File && personPhoto.size > 0) {
    try {
      const uploaded = await saveImageToPublic(personPhoto, "cases")
      personPhotoUrl = uploaded.url
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Photo upload failed." }
    }
  }

  const year = new Date().getFullYear()
  const latestRows = await sql`
    SELECT case_id
    FROM cases
    WHERE case_id LIKE ${`ICE-${year}-%`}
    ORDER BY case_id DESC
    LIMIT 1
  `
  const latestCaseId = (latestRows[0]?.case_id as string | undefined) || null
  const latestSeq = latestCaseId ? Number(latestCaseId.split("-")[2]) : 0
  const nextSeq = Number.isFinite(latestSeq) ? latestSeq + 1 : 1
  let caseId = `ICE-${year}-${String(nextSeq).padStart(6, "0")}`

  let result: Array<{ id: string }> = []
  try {
    result = await sql`
      INSERT INTO cases (case_id, title, category, location_tag, status, person_name, person_photo_url, reason_summary, offence_category, offence_description, summary_public, summary_internal, created_by)
      VALUES (${caseId}, ${title}, ${category}, ${locationTag || null}, ${status}, ${personName}, ${personPhotoUrl}, ${reasonSummary || null}, ${offenceCategory || null}, ${offenceDescription || null}, ${summaryPublic || null}, ${summaryInternal || null}, ${admin.id})
      RETURNING id
    ` as Array<{ id: string }>
  } catch (error) {
    const err = error as { code?: string }
    if (err.code !== "23505") {
      throw error
    }

    caseId = `ICE-${year}-${String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0")}`
    result = await sql`
      INSERT INTO cases (case_id, title, category, location_tag, status, person_name, person_photo_url, reason_summary, offence_category, offence_description, summary_public, summary_internal, created_by)
      VALUES (${caseId}, ${title}, ${category}, ${locationTag || null}, ${status}, ${personName}, ${personPhotoUrl}, ${reasonSummary || null}, ${offenceCategory || null}, ${offenceDescription || null}, ${summaryPublic || null}, ${summaryInternal || null}, ${admin.id})
      RETURNING id
    ` as Array<{ id: string }>
  }

  await logAudit(admin.id, "create_case", "case", result[0].id, { case_id: caseId })

  revalidatePath("/admin/cases")
  revalidatePath(`/cases/${caseId}`)
  return { success: true, caseId }
}

export async function updateCaseStatus(caseUuid: string, newStatus: string) {
  const admin = await requireAdmin()
  const sql = getDb()

  await sql`UPDATE cases SET status = ${newStatus}, updated_at = now() WHERE id = ${caseUuid}`
  await logAudit(admin.id, "update_status", "case", caseUuid, { status: newStatus })

  revalidatePath("/admin/cases")
  revalidatePath(`/cases`)
  return { success: true }
}

export async function sendMessage(formData: FormData) {
  const user = await requireAuth()
  const sql = getDb()

  const caseUuid = formData.get("case_id") as string
  const bodyInput = formData.get("body")
  const body = typeof bodyInput === "string" ? bodyInput.trim() : ""
  const image = formData.get("image")
  const isInternal = formData.get("is_internal") === "true"

  const imageFile = image instanceof File ? image : null
  const hasImage = !!imageFile && imageFile.size > 0
  if (!body && !hasImage) {
    return { error: "Message cannot be empty. Add text or an image." }
  }

  // Check if case is closed and user is not admin
  const caseRows = await sql`SELECT case_id, status FROM cases WHERE id = ${caseUuid} LIMIT 1`
  if (caseRows.length === 0) return { error: "Case not found." }

  if (caseRows[0].status === "Closed" && user.role !== "admin") {
    return { error: "Cannot send messages on a closed case." }
  }

  // Only admin can post internal notes
  if (isInternal && user.role !== "admin") {
    return { error: "Only administrators can post internal notes." }
  }

  // Verify user has access, and ensure admins only reply when a participant exists.
  if (user.role === "admin") {
    const participantCountRows = await sql`
      SELECT COUNT(*)::int AS cnt
      FROM case_participants
      WHERE case_id = ${caseUuid}
    `
    const participantCount = Number(participantCountRows[0]?.cnt ?? 0)
    if (participantCount === 0) {
      return { error: "Cannot reply until this case has at least one participant." }
    }
  } else {
    const access = await sql`
      SELECT id FROM case_participants
      WHERE case_id = ${caseUuid} AND user_id = ${user.id}
      LIMIT 1
    `
    if (access.length === 0) return { error: "Access denied." }
  }

  let uploadedImage:
    | { url: string; fileName: string; mimeType: string; size: number }
    | null = null

  if (imageFile && imageFile.size > 0) {
    try {
      uploadedImage = await saveImageToPublic(imageFile, `chat/${caseRows[0].case_id}`)
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Image upload failed." }
    }
  }

  const messageBody = body || "[Image attachment]"

  const inserted = await sql`
    INSERT INTO messages (case_id, sender_user_id, sender_role, body, is_internal_note)
    VALUES (${caseUuid}, ${user.id}, ${user.role}, ${messageBody}, ${isInternal})
    RETURNING id
  `

  if (uploadedImage) {
    await sql`
      INSERT INTO attachments (owner_type, owner_id, file_url, file_name, mime_type)
      VALUES ('message', ${inserted[0].id}, ${uploadedImage.url}, ${uploadedImage.fileName}, ${uploadedImage.mimeType})
    `
  }

  await logAudit(user.id, "send_message", "case", caseUuid, {
    is_internal: isInternal,
    has_image: !!uploadedImage,
  })

  revalidatePath(`/cases/${caseRows[0].case_id}/chat`)
  return { success: true }
}
