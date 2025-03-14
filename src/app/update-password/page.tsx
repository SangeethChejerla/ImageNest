import UpdatePasswordForm from "@/components/auth/update-password-form"
import Link from "next/link"

export default function UpdatePasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Link href="/" className="absolute left-8 top-8 text-muted-foreground hover:text-foreground">
        ← Back to home
      </Link>
      <div className="w-full max-w-md">
        <UpdatePasswordForm />
      </div>
    </div>
  )
}

