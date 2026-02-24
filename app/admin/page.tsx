import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getDb } from "@/lib/db"
import { FederalHeader } from "@/components/federal-header"
import { PortalFooter } from "@/components/portal-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Briefcase,
  FileText,
  Clock,
  Plus,
  ArrowRight,
  Users,
  Shield,
  ClipboardList,
} from "lucide-react"

export default async function AdminDashboard() {
  const user = await getSession()
  if (!user) redirect("/login")
  if (user.role !== "admin") redirect("/dashboard")

  const sql = getDb()
  const [openCases, newReports, pendingRequests, totalUsers] = await Promise.all([
    sql`SELECT COUNT(*) as cnt FROM cases WHERE status != 'Closed'`,
    sql`SELECT COUNT(*) as cnt FROM reports WHERE status = 'received'`,
    sql`SELECT COUNT(*) as cnt FROM access_requests WHERE status = 'pending'`,
    sql`SELECT COUNT(*) as cnt FROM users`,
  ])

  return (
    <div className="flex min-h-screen flex-col">
      <FederalHeader user={user} />
      <main className="flex-1 bg-secondary px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="mb-1 font-serif text-3xl font-bold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">System overview and quick actions.</p>
            </div>
            <Link href="/admin/cases/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Case
              </Button>
            </Link>
          </div>

          {/* Stats grid */}
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            {[
              {
                icon: Briefcase,
                label: "Open Cases",
                value: openCases[0].cnt,
                color: "bg-primary text-primary-foreground",
              },
              {
                icon: FileText,
                label: "New Reports",
                value: newReports[0].cnt,
                color: "bg-accent text-accent-foreground",
              },
              {
                icon: Clock,
                label: "Pending Requests",
                value: pendingRequests[0].cnt,
                color: "bg-chart-4 text-foreground",
              },
              {
                icon: Users,
                label: "Total Users",
                value: totalUsers[0].cnt,
                color: "bg-primary text-primary-foreground",
              },
            ].map((stat) => (
              <Card key={stat.label} className="border-border bg-card">
                <CardContent className="flex items-center gap-4 p-5">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-sm ${stat.color}`}
                  >
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick actions */}
          <h2 className="mb-4 font-serif text-xl font-bold text-foreground">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                href: "/admin/cases",
                icon: Briefcase,
                title: "Manage Cases",
                desc: "View, create, and manage all cases",
              },
              {
                href: "/admin/access-requests",
                icon: Clock,
                title: "Review Access Requests",
                desc: "Approve or deny pending requests",
              },
              {
                href: "/admin/reports",
                icon: FileText,
                title: "Review Reports",
                desc: "Review submitted reports",
              },
              {
                href: "/admin/audit-logs",
                icon: ClipboardList,
                title: "Audit Logs",
                desc: "View admin action history",
              },
              {
                href: "/admin/admins",
                icon: Users,
                title: "Manage Admins",
                desc: "Grant admin access to users",
              },
              {
                href: "/admin/cases/new",
                icon: Plus,
                title: "Create New Case",
                desc: "Register a new case in the system",
              },
              {
                href: "/case-lookup",
                icon: Shield,
                title: "Public Case Lookup",
                desc: "Test the public lookup interface",
              },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <Card className="border-border bg-card transition-colors hover:bg-secondary">
                  <CardContent className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-serif font-bold text-card-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <PortalFooter />
    </div>
  )
}
