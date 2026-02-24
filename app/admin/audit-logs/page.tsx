import { getSession } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { redirect } from "next/navigation"
import { FederalHeader } from "@/components/federal-header"
import { PortalFooter } from "@/components/portal-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Shield, Clock } from "lucide-react"

type AuditLogRow = {
  id: string
  created_at: string
  user_name: string | null
  user_email: string | null
  action: string
  target_type: string | null
  target_id: string | null
}

export const metadata = {
  title: "Audit Logs | Admin",
  description: "System audit trail",
}

export default async function AdminAuditLogsPage() {
  const session = await getSession()
  if (!session || session.role !== "admin") redirect("/login")
  const sql = getDb()

  const logs = await sql`
    SELECT al.*, u.full_name as user_name, u.email as user_email
    FROM audit_logs al
    LEFT JOIN users u ON al.actor_user_id = u.id
    ORDER BY al.created_at DESC
    LIMIT 200
  `
  const auditRows = logs as AuditLogRow[]

  const actionColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    login: "default",
    register: "secondary",
    create_case: "default",
    update_status: "secondary",
    approve_access: "default",
    deny_access: "destructive",
    submit_access_request: "outline",
    submit_report: "outline",
    update_report_status: "secondary",
    send_message: "outline",
    update_branding: "secondary",
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <FederalHeader user={session} />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Audit Logs
            </h1>
            <p className="text-muted-foreground mt-1">
              Complete activity trail of system actions
            </p>
          </div>
          <span className="text-sm text-muted-foreground">
            Showing last 200 entries
          </span>
        </div>

        {auditRows.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Clock className="mx-auto h-10 w-10 mb-3 opacity-40" />
              <p>No audit logs recorded yet.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-44">Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead className="w-48">Target ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditRows.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(log.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">{log.user_name || "System"}</p>
                            <p className="text-xs text-muted-foreground">{log.user_email || ""}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={actionColors[log.action] || "outline"}>
                            {log.action.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm capitalize">
                          {log.target_type?.replace(/_/g, " ") || "-"}
                        </TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground truncate max-w-48">
                          {log.target_id ? log.target_id.substring(0, 12) + "..." : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      <PortalFooter />
    </div>
  )
}
