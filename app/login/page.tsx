import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { FederalHeader } from "@/components/federal-header"
import { PortalFooter } from "@/components/portal-footer"
import { LoginForm } from "@/components/auth/login-form"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ caseId?: string }>
}) {
  const user = await getSession()
  if (user) redirect(user.role === "admin" ? "/admin" : "/dashboard")

  const params = await searchParams

  return (
    <div className="flex min-h-screen flex-col">
      <FederalHeader user={null} />
      <main className="flex flex-1 items-center justify-center bg-secondary px-4 py-16">
        <LoginForm caseId={params.caseId} />
      </main>
      <PortalFooter />
    </div>
  )
}
