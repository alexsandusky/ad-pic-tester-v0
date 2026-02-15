import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    
    // This is the most likely cause of your 500 error. 
    // We must remove the browser header before sending to Gemini.
    const base64Data = image.includes(",") ? image.split(",")[1] : image;

    const { object } = await generateObject({
      model: google("gemini-1.5-flash"),
      schema: z.object({
        result: z.object({
          score: z.number(),
          smileMeter: z.number(),
          feedback: z.array(z.string()),
        }),
      }),
      system: "You are a dating photo expert. Deduct points for big toothy smiles. Give a score 1-10, a smile percentage, and 3 tips.",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Rate this photo." },
            { type: "image", image: base64Data },
          ],
        },
      ],
    });

    return Response.json(object);
  } catch (error) {
    // This will show up in your Vercel Logs tab so we can see what happened
    console.error("DEBUG:", error);
    return Response.json({ error: "Check Vercel Logs" }, { status: 500 });
  }
}
