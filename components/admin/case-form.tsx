"use client"

import { useActionState } from "react"
import { createCase } from "@/app/actions/cases"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Briefcase } from "lucide-react"

type State = { error?: string; success?: boolean; caseId?: string } | null

export function AdminCaseForm() {
  const [state, action, pending] = useActionState(
    async (_prev: State, formData: FormData) => {
      const result = await createCase(formData)
      return result as State
    },
    null
  )

  if (state?.success) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="p-8 text-center">
          <Briefcase className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h2 className="mb-2 font-serif text-2xl font-bold text-card-foreground">
            Case Created
          </h2>
          <p className="mb-4 text-muted-foreground">
            The case has been registered with ID:
          </p>
          <p className="font-mono text-lg font-bold text-primary">{state.caseId}</p>
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
          <p className="text-xs text-muted-foreground">
            Case ID is generated automatically when you create the case.
          </p>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Case Title</Label>
            <Input id="title" name="title" required placeholder="e.g., Documentation Review - Martinez" />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category">Category</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="detention">Detention</SelectItem>
                  <SelectItem value="customs">Customs</SelectItem>
                  <SelectItem value="documentation">Documentation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="status">Initial Status</Label>
              <Select name="status" defaultValue="Open">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Escalated">Escalated</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="location_tag">Location Tag</Label>
            <Input id="location_tag" name="location_tag" placeholder="e.g., Southwest Region" />
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="mb-3 font-serif text-sm font-bold text-card-foreground">Person Details</h3>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="person_name">Person Name</Label>
                <Input id="person_name" name="person_name" required placeholder="Full name" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="person_photo">Photo Upload (optional)</Label>
                <Input id="person_photo" name="person_photo" type="file" accept="image/*" />
                <p className="text-xs text-muted-foreground">
                  Upload an image file instead of a URL.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="mb-3 font-serif text-sm font-bold text-card-foreground">Case Details</h3>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="reason_summary">Reason Summary</Label>
                <Textarea id="reason_summary" name="reason_summary" rows={3} placeholder="Brief reason for the case..." />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="offence_category">Charge Category</Label>
                  <Select name="offence_category">
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="documentation">Documentation</SelectItem>
                      <SelectItem value="customs">Customs Violation</SelectItem>
                      <SelectItem value="detention">Detention</SelectItem>
                      <SelectItem value="fraud">Fraud</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="offence_description">Charge Description</Label>
                <Textarea id="offence_description" name="offence_description" rows={3} placeholder="Detailed description..." />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="summary_public">Public Summary (safe, minimal)</Label>
                <Textarea id="summary_public" name="summary_public" rows={2} placeholder="Publicly visible summary..." />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="summary_internal">Internal Summary (admin only)</Label>
                <Textarea id="summary_internal" name="summary_internal" rows={3} placeholder="Internal notes for administrators..." />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={pending} className="mt-2">
            {pending ? "Creating..." : "Create Case"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
