import LoginForm from "@/components/auth/login-form"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { message?: string }
}) {
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
        {searchParams?.message && (
          <div className="mb-4 p-3 text-sm text-center bg-primary/10 text-primary rounded">{searchParams.message}</div>
        )}
        <LoginForm />
      </div>
    </div>
  )
}

