"use client"

import { useActionState } from "react"
import { registerAction } from "@/app/actions/auth"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import Link from "next/link"

export function RegisterForm({ caseId }: { caseId?: string }) {
  const [state, action, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const result = await registerAction(formData)
      return result || null
    },
    null
  )

  return (
    <Card className="w-full max-w-md border-border bg-card shadow-none">
      <CardHeader>
        <div className="mb-3 flex h-12 w-12 items-center justify-center border border-primary bg-primary text-primary-foreground">
          <UserPlus className="h-6 w-6" />
        </div>
        <CardTitle className="font-serif text-2xl text-card-foreground">Create Account</CardTitle>
        <CardDescription>
          Register to access case details and submit access requests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-col gap-4">
          {state?.error && (
            <div className="border-l-4 border-destructive bg-destructive/5 p-3 text-sm text-destructive">
              {state.error}
            </div>
          )}

          {caseId && <input type="hidden" name="case_id" value={caseId} />}

          {caseId && (
            <div className="border-l-4 border-primary bg-primary/5 p-3 text-sm text-foreground">
              You will be able to request access to case <strong className="font-mono">{caseId}</strong> after registration.
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="full_name" className="text-sm font-semibold">Full Name</Label>
            <Input id="full_name" name="full_name" required placeholder="Your full name" className="border-border" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
            <Input id="email" name="email" type="email" required placeholder="you@example.com" className="border-border" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
            <Input id="password" name="password" type="password" required placeholder="Minimum 6 characters" className="border-border" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirm_password" className="text-sm font-semibold">Confirm Password</Label>
            <Input id="confirm_password" name="confirm_password" type="password" required placeholder="Repeat password" className="border-border" />
          </div>

          <Button type="submit" disabled={pending} className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90">
            {pending ? "Creating account..." : "Create Account"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href={caseId ? `/login?caseId=${caseId}` : "/login"}
              className="font-semibold text-primary underline underline-offset-4"
            >
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
