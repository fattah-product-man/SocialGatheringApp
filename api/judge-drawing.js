import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ai = process.env.GEMINI_API_KEY 
    ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) 
    : null;

  if (!ai) {
    return res.status(503).json({ error: "AI service unavailable" });
  }

  const { image } = req.body;

  try {
    const prompt = "You are Hashem, a strict but funny art critic. Rate this drawing of 'Hashem' (it can be anything, just judge the artistic skill) from 1 to 10. Be savage but funny. Keep it short (max 2 sentences). Return JSON format: { \"score\": number, \"comment\": \"string\" }";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { data: image, mimeType: "image/png" } }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    res.status(200).json(JSON.parse(text));
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to judge drawing" });
  }
}
