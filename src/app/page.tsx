import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Secure Image Manager</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Register</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Secure Image Management Made Simple
                </h2>
                <p className="text-muted-foreground md:text-xl">
                  Upload, store, and analyze your images securely with our platform. Powered by Supabase and AI
                  technology.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button asChild size="lg">
                    <Link href="/register">Get Started</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/login">Sign In</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-[350px] rounded-lg bg-muted p-2">
                  <div className="absolute left-4 top-4 h-40 w-40 rounded-md bg-primary/20"></div>
                  <div className="absolute bottom-4 right-4 h-40 w-40 rounded-md bg-primary/20"></div>
                  <div className="absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-primary/30 shadow-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="grid gap-4">
                <h3 className="text-xl font-bold">Secure Storage</h3>
                <p className="text-muted-foreground">
                  Your images are stored securely with enterprise-grade encryption.
                </p>
              </div>
              <div className="grid gap-4">
                <h3 className="text-xl font-bold">Easy Management</h3>
                <p className="text-muted-foreground">
                  Upload, view, and organize your images with our intuitive interface.
                </p>
              </div>
              <div className="grid gap-4">
                <h3 className="text-xl font-bold">AI Analysis</h3>
                <p className="text-muted-foreground">
                  Get intelligent insights about your images with our AI-powered analysis.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Secure Image Manager. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

