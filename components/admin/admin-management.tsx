"use client"

import { useActionState } from "react"
import { promoteUserToAdmin } from "@/app/actions/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, UserPlus, Users } from "lucide-react"

type UserRow = {
  id: string
  full_name: string | null
  email: string
  role: string
  created_at: string
}

export function AdminManagement({
  admins,
  nonAdmins,
}: {
  admins: UserRow[]
  nonAdmins: UserRow[]
}) {
  const [state, formAction, pending] = useActionState(
    async (
      _prev: { error?: string; success?: string } | null,
      formData: FormData
    ) => {
      const result = await promoteUserToAdmin(formData)
      return result || null
    },
    null
  )

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Promote User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="identifier">Username or Email</Label>
              <Input
                id="identifier"
                name="identifier"
                placeholder="jimdavecute or jimdavecute@gmail.com"
                required
              />
            </div>
            <Button type="submit" disabled={pending}>
              {pending ? "Updating..." : "Grant Admin Access"}
            </Button>
          </form>
          {state?.error && (
            <p className="mt-4 rounded border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
              {state.error}
            </p>
          )}
          {state?.success && (
            <p className="mt-4 rounded border border-emerald-600/20 bg-emerald-600/5 p-3 text-sm text-emerald-700">
              {state.success}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Current Admins ({admins.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {admins.length === 0 ? (
            <p className="text-sm text-muted-foreground">No admin users found.</p>
          ) : (
            <div className="space-y-3">
              {admins.map((user) => (
                <div key={user.id} className="rounded border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {user.full_name || "Unnamed User"}
                      </p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <Badge>Admin</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Other Users ({nonAdmins.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {nonAdmins.length === 0 ? (
            <p className="text-sm text-muted-foreground">All users already have admin access.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {nonAdmins.map((user) => (
                <form
                  key={user.id}
                  action={formAction}
                  className="flex items-center justify-between gap-2 rounded border border-border p-3"
                >
                  <input type="hidden" name="identifier" value={user.email} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {user.full_name || "Unnamed User"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Button type="submit" size="sm" variant="outline" disabled={pending}>
                    Add
                  </Button>
                </form>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
