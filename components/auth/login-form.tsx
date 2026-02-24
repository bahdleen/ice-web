"use client"

import { useActionState } from "react"
import { loginAction } from "@/app/actions/auth"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import Link from "next/link"

export function LoginForm({ caseId }: { caseId?: string }) {
  const [state, action, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const result = await loginAction(formData)
      return result || null
    },
    null
  )

  return (
    <Card className="w-full max-w-md border-border bg-card shadow-none">
      <CardHeader>
        <div className="mb-3 flex h-12 w-12 items-center justify-center border border-primary bg-primary text-primary-foreground">
          <Shield className="h-6 w-6" />
        </div>
        <CardTitle className="font-serif text-2xl text-card-foreground">Sign In</CardTitle>
        <CardDescription>
          Access your case information and communications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-col gap-4">
          {state?.error && (
            <div className="border-l-4 border-destructive bg-destructive/5 p-3 text-sm text-destructive">
              {state.error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
            <Input id="email" name="email" type="email" required placeholder="you@example.com" className="border-border" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
            <Input id="password" name="password" type="password" required placeholder="Enter your password" className="border-border" />
          </div>

          <Button type="submit" disabled={pending} className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90">
            {pending ? "Signing in..." : "Sign In"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            {"Don't have an account? "}
            <Link
              href={caseId ? `/register?caseId=${caseId}` : "/register"}
              className="font-semibold text-primary underline underline-offset-4"
            >
              Create one
            </Link>
          </div>

        </form>
      </CardContent>
    </Card>
  )
}
