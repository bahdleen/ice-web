"use server"

import { getDb } from "@/lib/db"
import { createSession, destroySession } from "@/lib/auth"
import { rateLimit } from "@/lib/rate-limit"
import { redirect } from "next/navigation"
import crypto from "crypto"

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

function verifyPassword(password: string, hash: string): boolean {
  const hashed = crypto.createHash("sha256").update(password).digest("hex")
  return hashed === hash
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required." }
  }

  const rl = rateLimit(`login:${email}`, 5, 60000)
  if (!rl.success) {
    return { error: "Too many login attempts. Please try again later." }
  }

  const sql = getDb()
  const rows = await sql`SELECT id, password_hash, role FROM users WHERE email = ${email} LIMIT 1`

  if (rows.length === 0) {
    return { error: "Invalid email or password." }
  }

  const user = rows[0]

  if (!verifyPassword(password, user.password_hash)) {
    return { error: "Invalid email or password." }
  }

  await createSession(user.id)

  if (user.role === "admin") {
    redirect("/admin")
  }
  redirect("/dashboard")
}

export async function registerAction(formData: FormData) {
  const fullName = formData.get("full_name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirm_password") as string
  const caseId = formData.get("case_id") as string | null

  if (!fullName || !email || !password) {
    return { error: "All fields are required." }
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." }
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." }
  }

  const sql = getDb()
  const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`
  if (existing.length > 0) {
    return { error: "An account with this email already exists." }
  }

  const passwordHash = hashPassword(password)

  const result = await sql`
    INSERT INTO users (full_name, email, password_hash, role)
    VALUES (${fullName}, ${email}, ${passwordHash}, 'user')
    RETURNING id
  `

  await createSession(result[0].id)

  if (caseId) {
    redirect(`/dashboard?caseId=${encodeURIComponent(caseId)}`)
  }
  redirect("/dashboard")
}

export async function logoutAction() {
  await destroySession()
  redirect("/")
}
