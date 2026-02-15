import { google } from "@ai-sdk/google"; // You need this import
import { generateObject } from "ai";
import { z } from "zod";

const vibeSchema = z.object({
  score: z.number().describe("Overall dating photo vibe score from 1 to 10"),
  smileMeter: z.number().describe("Smile intensity percentage from 0 to 100"),
  feedback: z.array(z.string()).describe("Exactly 3 short, helpful bullet points"),
});

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    const { object } = await generateObject({
      model: google("gemini-1.5-flash"), // Correct way to call Gemini
      schema: vibeSchema,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are a fun, witty dating profile photo analyst. Analyze this photo for dating app potential.
              
              Rate the photo on these criteria:
              - score: 1 to 10 (be honest, focus on high-status vibes)
              - smileMeter: 0 to 100 (0 = neutral/smirk, 100 = full teeth)
              - feedback: 3 punchy bullet points under 15 words each.
              
              CRITICAL RULE: Deduct points if the man is smiling with too much teeth. We prefer a 'smirk' or a 'brooding' neutral look.`,
            },
            {
              type: "image",
              image, // This expects the base64 string
            },
          ],
        },
      ],
    });

    // We return { result: object } because your page.tsx calls data.result
    return Response.json({ result: object });
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return Response.json({ error: "Failed to analyze image" }, { status: 500 });
  }
}
