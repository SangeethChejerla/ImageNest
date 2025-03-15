import { createClient } from "@/lib/supabase/server"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ImageUpload from "@/components/images/image-upload"
import ImageGrid from "@/components/images/image-grid"
import { analyzeImage } from "@/lib/ai"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Get user's images
  const { data: images } = await supabase
    .from("images")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Pre-compute image URLs on the server
  const imagesWithUrls =
    images?.map((image) => {
      const { data } = supabase.storage.from("images").getPublicUrl(image.path)
      return {
        ...image,
        url: data.publicUrl,
      }
    }) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Upload, manage, and analyze your images securely.</p>
      </div>

      <Tabs defaultValue="gallery" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Images</CardTitle>
              <CardDescription>View and manage all your uploaded images.</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageGrid initialImages={imagesWithUrls} onAnalyzeImage={analyzeImage} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Image</CardTitle>
              <CardDescription>Upload a new image to your secure storage.</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

