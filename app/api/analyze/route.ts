import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    const base64Data = image.includes(",") ? image.split(",")[1] : image;

    const { object } = await generateObject({
      model: google("models/gemini-1.5-flash"), // FIXED LINE
      schema: z.object({
        result: z.object({
          score: z.number(),
          smileMeter: z.number(),
          feedback: z.array(z.string()),
        }),
      }),
      system: "You are a witty dating photo analyst. Deduct points for big toothy smiles. Give a score 1-10, a smile percentage (0=neutral, 100=big smile), and 3 tips.",
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
    console.error("DEBUG:", error);
    return Response.json({ error: "Check Vercel Logs" }, { status: 500 });
  }
}
