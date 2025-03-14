import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ResetPasswordForm from "@/components/auth/reset-password"

export default async function ResetPasswordPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Link href="/" className="absolute left-8 top-8 text-muted-foreground hover:text-foreground">
        ← Back to home
      </Link>
      <div className="w-full max-w-md">
        <ResetPasswordForm />
      </div>
    </div>
  )
}

