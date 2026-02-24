"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { approveAccessRequest, denyAccessRequest } from "@/app/actions/admin"
import { CheckCircle, XCircle, Clock, User, FileText } from "lucide-react"

interface AccessRequest {
  id: string
  user_name: string
  user_email: string
  case_id: string
  case_title: string
  note: string | null
  status: string
  reviewer_name: string | null
  requested_at: string
  reviewed_at: string | null
}

export function AccessRequestList({
  requests,
}: {
  requests: AccessRequest[]
}) {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleApprove(id: string) {
    setLoading(id)
    await approveAccessRequest(id)
    setLoading(null)
  }

  async function handleDeny(id: string) {
    setLoading(id)
    await denyAccessRequest(id)
    setLoading(null)
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Clock className="mx-auto h-10 w-10 mb-3 opacity-40" />
          <p>No access requests found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {requests.map((req) => (
        <Card
          key={req.id}
          className={req.status === "pending" ? "border-l-4 border-l-amber-500" : ""}
        >
          <CardContent className="py-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge
                    variant={
                      req.status === "pending"
                        ? "outline"
                        : req.status === "approved"
                          ? "default"
                          : "destructive"
                    }
                  >
                    {req.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                    {req.status === "approved" && <CheckCircle className="mr-1 h-3 w-3" />}
                    {req.status === "denied" && <XCircle className="mr-1 h-3 w-3" />}
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </Badge>
                  <span className="text-sm font-medium font-mono text-foreground">
                    {req.case_id}
                  </span>
                  <span className="text-sm text-muted-foreground">{req.case_title}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    {req.user_name} ({req.user_email})
                  </span>
                </div>
                {req.note && (
                  <p className="text-sm text-foreground/80 mt-1 flex items-start gap-1">
                    <FileText className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    {req.note}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Requested{" "}
                  {new Date(req.requested_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                  {req.reviewer_name &&
                    req.reviewed_at &&
                    ` | Reviewed by ${req.reviewer_name} on ${new Date(req.reviewed_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
                </p>
              </div>
              {req.status === "pending" && (
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" onClick={() => handleApprove(req.id)} disabled={loading === req.id}>
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeny(req.id)} disabled={loading === req.id}>
                    <XCircle className="mr-1 h-4 w-4" />
                    Deny
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
