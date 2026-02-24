"use client"

import { useActionState } from "react"
import { createReport } from "@/app/actions/reports"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText } from "lucide-react"

type State = { error?: string; success?: boolean; reportRef?: string } | null

export function ReportForm() {
  const [state, action, pending] = useActionState(
    async (_prev: State, formData: FormData) => {
      const result = await createReport(formData)
      return result as State
    },
    null
  )

  if (state?.success) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="p-8 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h2 className="mb-2 font-serif text-2xl font-bold text-card-foreground">
            Report Submitted
          </h2>
          <p className="mb-4 text-muted-foreground">
            Your report has been received and assigned reference number:
          </p>
          <p className="font-mono text-lg font-bold text-primary">{state.reportRef}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            You can track this report from your dashboard.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6">
        <form action={action} className="flex flex-col gap-5">
          {state?.error && (
            <div className="rounded-sm border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {state.error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="report_type">Report Type</Label>
            <Select name="report_type" required>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tip">Tip / Observation</SelectItem>
                <SelectItem value="complaint">Complaint</SelectItem>
                <SelectItem value="inquiry">General Inquiry</SelectItem>
                <SelectItem value="fraud">Fraud Report</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="location_tag">Location (optional)</Label>
            <Input id="location_tag" name="location_tag" placeholder="e.g., Southwest Region" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="incident_datetime">Incident Date & Time (optional)</Label>
            <Input id="incident_datetime" name="incident_datetime" type="datetime-local" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              required
              rows={5}
              placeholder="Provide a detailed description of the incident or observation..."
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="related_case_id">Related Case ID (optional)</Label>
            <Input
              id="related_case_id"
              name="related_case_id"
              placeholder="ICE-2026-000001"
              className="font-mono"
            />
          </div>

          <div className="flex items-start gap-2">
            <Checkbox id="consent" name="consent" value="yes" required />
            <Label htmlFor="consent" className="text-sm leading-relaxed text-muted-foreground">
              I confirm that the information provided is accurate to the best of my
              knowledge and consent to its use for investigative purposes.
            </Label>
          </div>

          <Button type="submit" disabled={pending} className="mt-2">
            {pending ? "Submitting..." : "Submit Report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
