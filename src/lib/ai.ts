"use server"

import { createClient } from "@/lib/supabase/server"

export async function analyzeImage(imageId: string, imageUrl: string) {
  try {
    const supabase = await createClient()

    // Get the image data
    const { data: imageData, error: imageError } = await supabase.from("images").select("*").eq("id", imageId).single()

    if (imageError) throw imageError

    // Call Gemini API to analyze the image
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY || "",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Analyze this image and provide a detailed description of what you see. Include details about objects, people, scenery, colors, and any notable elements.",
                },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: imageUrl,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 1024,
          },
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`)
    }

    const result = await response.json()
    const aiDescription = result.candidates[0]?.content?.parts[0]?.text || "No analysis available"

    // Update the image record with the AI description
    const { error: updateError } = await supabase
      .from("images")
      .update({ ai_description: aiDescription })
      .eq("id", imageId)

    if (updateError) throw updateError

    return { success: true, description: aiDescription }
  } catch (error: any) {
    console.error("Error analyzing image:", error)
    return { success: false, error: error.message }
  }
}

