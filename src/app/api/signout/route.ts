import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const supabase = await createClient()
  await supabase.auth.signOut()

  return NextResponse.redirect(new URL("/", req.url), {
    status: 302,
  })
}

