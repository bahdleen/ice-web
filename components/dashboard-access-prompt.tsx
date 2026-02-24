"use client"

import { useState } from "react"
import { requestAccess } from "@/app/actions/cases"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function DashboardAccessRequestPrompt({ caseId }: { caseId: string }) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleRequest() {
    setLoading(true)
    const res = await requestAccess(caseId)
    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success("Access request submitted.")
      setSubmitted(true)
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <Card className="mb-6 border-primary/30 bg-primary/5">
        <CardContent className="p-4 text-sm text-primary">
          Access request for <strong className="font-mono">{caseId}</strong> has been submitted.
          An administrator will review your request.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-6 border-primary/30 bg-primary/5">
      <CardContent className="flex items-center justify-between p-4">
        <p className="text-sm text-primary">
          Request access to case <strong className="font-mono">{caseId}</strong>?
        </p>
        <Button size="sm" onClick={handleRequest} disabled={loading}>
          {loading ? "Requesting..." : "Request Access"}
        </Button>
      </CardContent>
    </Card>
  )
}
