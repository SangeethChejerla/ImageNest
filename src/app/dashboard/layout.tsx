import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Header from "@/components/header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} />
      <main className="flex-1 container py-6">{children}</main>
    </div>
  )
}

