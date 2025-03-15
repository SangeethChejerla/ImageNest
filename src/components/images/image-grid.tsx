"use client"

import { useState } from "react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trash2, Maximize, MessageSquare } from "lucide-react"
import {toast} from 'sonner'
import { useRouter } from "next/navigation"

type ImageType = {
  id: string
  created_at: string
  user_id: string
  path: string
  name: string
  size: number
  type: string
  description: string | null
  ai_description: string | null
  url: string // Pre-computed URL from the server
}

interface ImageGridProps {
  initialImages: ImageType[]
  onAnalyzeImage: (imageId: string, imagePath: string) => Promise<any>
}

export default function ImageGrid({ initialImages, onAnalyzeImage }: ImageGridProps) {
  const [images, setImages] = useState<ImageType[]>(initialImages)
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleDelete = async (imageId: string, imagePath: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      setIsDeleting(true)

      try {
        // Delete from storage
        const { error: storageError } = await supabase.storage.from("images").remove([imagePath])

        if (storageError) {
          throw storageError
        }

        // Delete from database
        const { error: dbError } = await supabase.from("images").delete().eq("id", imageId)

        if (dbError) {
          throw dbError
        }

        // Update local state
        setImages(images.filter((img) => img.id !== imageId))

        toast(  "Image deleted successfully")

        // Close dialog if the deleted image is the selected one
        if (selectedImage && selectedImage.id === imageId) {
          setSelectedImage(null)
        }
      } catch (error: any) {
        toast('Error')
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const handleAnalyze = async (imageId: string, imagePath: string) => {
    if (!onAnalyzeImage) return

    setIsAnalyzing(true)

    try {
      await onAnalyzeImage(imageId, imagePath)

      // Refresh the page to get updated data
      router.refresh()

      toast( "Image analyzed successfully")
    } catch (error: any) {
      toast( "Error")
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (images.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No images uploaded yet. Upload your first image to get started!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <Card key={image.id} className="overflow-hidden group">
          <CardContent className="p-0 relative">
            <div className="aspect-square relative">
              <Image
                src={image.url || "/placeholder.svg"}
                alt={image.description || image.name}
                fill
                className="object-cover transition-all hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="icon" onClick={() => setSelectedImage(image)}>
                    <Maximize className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>{image.name}</DialogTitle>
                    <DialogDescription>{image.description || "No description provided"}</DialogDescription>
                  </DialogHeader>
                  <div className="relative aspect-video w-full">
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={image.description || image.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                    />
                  </div>
                  {image.ai_description && (
                    <div className="mt-4 p-4 bg-muted rounded-md">
                      <h4 className="font-medium mb-2 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        AI Analysis
                      </h4>
                      <p className="text-sm">{image.ai_description}</p>
                    </div>
                  )}
                  <div className="flex justify-between mt-4">
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(image.id, image.path)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                    {typeof onAnalyzeImage === 'function' && !image.ai_description && (
                      <Button onClick={() => handleAnalyze(image.id, image.path)} disabled={isAnalyzing}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Analyze with AI
                      </Button>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(image.id, image.path)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              {typeof onAnalyzeImage === 'function' && !image.ai_description && (
                <Button
                  variant="default"
                  size="icon"
                  onClick={() => handleAnalyze(image.id, image.path)}
                  disabled={isAnalyzing}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

