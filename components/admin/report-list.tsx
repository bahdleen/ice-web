"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateReportStatus } from "@/app/actions/admin"
import { AlertTriangle, FileText, MapPin, Calendar } from "lucide-react"

interface Report {
  id: string
  report_ref: string
  report_type: string
  description: string
  location_tag: string | null
  incident_datetime: string | null
  reporter_name: string | null
  reporter_email: string | null
  status: string
  created_at: string
}

const statusColors: Record<string, "outline" | "secondary" | "default" | "destructive"> = {
  received: "outline",
  under_review: "secondary",
  resolved: "default",
  dismissed: "destructive",
}

export function AdminReportList({ reports }: { reports: Report[] }) {
  const [updating, setUpdating] = useState<string | null>(null)

  async function handleStatusChange(reportId: string, status: string) {
    setUpdating(reportId)
    await updateReportStatus(reportId, status)
    setUpdating(null)
  }

  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <FileText className="mx-auto h-10 w-10 mb-3 opacity-40" />
          <p>No reports submitted yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {reports.map((report) => (
        <Card
          key={report.id}
          className={report.status === "received" ? "border-l-4 border-l-destructive" : ""}
        >
          <CardContent className="py-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant={statusColors[report.status] || "outline"}>
                    {report.status === "received" && <AlertTriangle className="mr-1 h-3 w-3" />}
                    {report.status.replace("_", " ").charAt(0).toUpperCase() +
                      report.status.replace("_", " ").slice(1)}
                  </Badge>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    {report.report_ref}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    {report.report_type.replace("_", " ")}
                  </span>
                </div>
                <p className="text-sm text-foreground/80 line-clamp-3">
                  {report.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                  {report.location_tag && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {report.location_tag}
                    </span>
                  )}
                  {report.incident_datetime && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Incident: {new Date(report.incident_datetime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  )}
                  {report.reporter_name && (
                    <span>By: {report.reporter_name} ({report.reporter_email})</span>
                  )}
                  <span>
                    Submitted{" "}
                    {new Date(report.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              <div className="shrink-0 w-44">
                <Select
                  defaultValue={report.status}
                  onValueChange={(val) => handleStatusChange(report.id, val)}
                  disabled={updating === report.id}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="received">Received</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="dismissed">Dismissed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
