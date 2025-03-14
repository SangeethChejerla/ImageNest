"use server"

import { createClient } from "@/lib/supabase/server"

export async function analyzeImage(imageId: string, imageUrl: string) {
  try {
    const supabase = await createClient()

    // Get the image data
    const { data: imageData, error: imageError } = await supabase.from("images").select("*").eq("id", imageId).single()

    if (imageError) throw imageError

    // Fetch the image as base64 if imageUrl is an external URL
    let imageBase64
    if (imageUrl.startsWith('http')) {
      const imageResponse = await fetch(imageUrl)
      if (!imageResponse.ok) throw new Error(`Failed to fetch image: ${imageResponse.statusText}`)
      const imageBuffer = await imageResponse.arrayBuffer()
      imageBase64 = Buffer.from(imageBuffer).toString('base64')
    } else {
      // Assume it's already base64
      imageBase64 = imageUrl.replace(/^data:image\/\w+;base64,/, '')
    }

    // Call Gemini API to analyze the image using gemini-2.0-flash model
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v2/models/gemini-2.0-flash:generateContent",
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
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
          generation_config: {
            temperature: 0.4,
            top_k: 32,
            top_p: 1,
            max_output_tokens: 1024,
          },
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`)
    }

    const result = await response.json()
    
    // Extract the response text from the correct path in the response structure
    const aiDescription = result.candidates?.[0]?.content?.parts?.[0]?.text || "No analysis available"

    // Update the image record with the AI description
    const { error: updateError } = await supabase
      .from("images")
      .update({ ai_description: aiDescription, analyzed_at: new Date().toISOString() })
      .eq("id", imageId)

    if (updateError) throw updateError

    return { success: true, description: aiDescription }
  } catch (error: any) {
    console.error("Error analyzing image:", error)
    return { success: false, error: error.message }
  }
}