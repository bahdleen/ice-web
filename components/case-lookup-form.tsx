"use client"

import { useState } from "react"
import { publicCaseLookup } from "@/app/actions/cases"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { Search, MapPin, UserPlus, LogIn, MessageSquare } from "lucide-react"
import Link from "next/link"

type LookupResult = {
  found?: boolean
  case_id?: string
  status?: string
  location_tag?: string
  summary_public?: string
  can_chat?: boolean
  error?: string
}

export function CaseLookupForm({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [result, setResult] = useState<LookupResult | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLookup(formData: FormData) {
    setLoading(true)
    setResult(null)
    const res = await publicCaseLookup(formData)
    setResult(res)
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <form action={handleLookup} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="case_id">Case ID</Label>
              <div className="flex gap-2">
                <Input
                  id="case_id"
                  name="case_id"
                  placeholder="ICE-2026-000001"
                  className="font-mono"
                  required
                />
                <Button type="submit" disabled={loading} className="gap-2">
                  <Search className="h-4 w-4" />
                  {loading ? "Searching..." : "Lookup"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter the full Case ID in format ICE-YYYY-NNNNNN
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      {result?.error && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-6 text-sm text-destructive">{result.error}</CardContent>
        </Card>
      )}

      {result && !result.error && !result.found && (
        <Card className="border-border bg-card">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              No case found matching the provided ID. Please verify and try again.
            </p>
          </CardContent>
        </Card>
      )}

      {result?.found && (
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-card-foreground">
                Case Found
              </h3>
              <StatusBadge status={result.status || "Open"} />
            </div>

            <dl className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <dt className="font-medium text-muted-foreground">Case ID</dt>
                <dd className="font-mono text-card-foreground">{result.case_id}</dd>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-2">
                <dt className="font-medium text-muted-foreground">Status</dt>
                <dd className="text-card-foreground">{result.status}</dd>
              </div>
              {result.location_tag && (
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <dt className="flex items-center gap-1 font-medium text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> Location
                  </dt>
                  <dd className="text-card-foreground">{result.location_tag}</dd>
                </div>
              )}
              {result.summary_public && (
                <div className="pt-1">
                  <dt className="mb-1 font-medium text-muted-foreground">Summary</dt>
                  <dd className="text-card-foreground">{result.summary_public}</dd>
                </div>
              )}
            </dl>

            <div className="mt-6 flex flex-col gap-2 border-t border-border pt-4 sm:flex-row">
              {isLoggedIn ? (
                <Link href={`/cases/${result.case_id}/chat`}>
                  <Button className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Start Chat with Admin
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href={`/register?caseId=${result.case_id}`}>
                    <Button className="gap-2">
                      <UserPlus className="h-4 w-4" />
                      Create Account to Follow Up
                    </Button>
                  </Link>
                  <Link href={`/login?caseId=${result.case_id}`}>
                    <Button variant="outline" className="gap-2">
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
