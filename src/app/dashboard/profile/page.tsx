import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  async function updateProfile(formData: FormData) {
    "use server"

    const supabase = await createClient()

    const fullName = formData.get("fullName") as string
    const username = formData.get("username") as string

    await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        username: username,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user?.id ?? "")

    redirect("/dashboard/profile?updated=true")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and profile information.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your account profile information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} disabled readOnly />
              <p className="text-xs text-muted-foreground">Your email cannot be changed.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" defaultValue={profile?.full_name || ""} placeholder="John Doe" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" defaultValue={profile?.username || ""} placeholder="johndoe" />
            </div>

            <Button type="submit">Update Profile</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <a href="/reset-password">Reset Password</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

