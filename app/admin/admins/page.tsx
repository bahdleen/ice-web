import { getSession } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { redirect } from "next/navigation"
import { FederalHeader } from "@/components/federal-header"
import { PortalFooter } from "@/components/portal-footer"
import { AdminManagement } from "@/components/admin/admin-management"

type UserRow = {
  id: string
  full_name: string | null
  email: string
  role: string
  created_at: string
}

export const metadata = {
  title: "Admin Access | Admin",
  description: "Manage administrator access",
}

export default async function AdminAccessManagementPage() {
  const session = await getSession()
  if (!session || session.role !== "admin") redirect("/login")

  const sql = getDb()
  const [admins, nonAdmins] = await Promise.all([
    sql`
      SELECT id, full_name, email, role, created_at
      FROM users
      WHERE role = 'admin'
      ORDER BY created_at DESC
    `,
    sql`
      SELECT id, full_name, email, role, created_at
      FROM users
      WHERE role != 'admin'
      ORDER BY created_at DESC
      LIMIT 50
    `,
  ])

  const adminUsers = admins as UserRow[]
  const regularUsers = nonAdmins as UserRow[]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <FederalHeader user={session} />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-bold text-foreground">Admin Access</h1>
          <p className="mt-1 text-muted-foreground">
            Grant admin privileges and review current administrators.
          </p>
        </div>
        <AdminManagement admins={adminUsers} nonAdmins={regularUsers} />
      </main>
      <PortalFooter />
    </div>
  )
}
