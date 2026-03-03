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

  const { viewer, match, hostName } = req.body;

  try {
    const prompt = `
      You are ${hostName || 'Hashem'}, a warm, playful, and friendly host of a Ramadan gathering.
      Generate a connection explanation for two guests: ${viewer.name} and ${match.name}.
      
      Viewer Profile:
      - Interests: ${viewer.interests.join(', ')}
      - Goals: ${viewer.goals.join(', ')}
      - Energy: ${viewer.energy_level}
      - Answers: ${JSON.stringify(viewer.answers)}

      Match Profile:
      - Interests: ${match.interests.join(', ')}
      - Goals: ${match.goals.join(', ')}
      - Energy: ${match.energy_level}
      - Answers: ${JSON.stringify(match.answers)}

      Shared Interests: ${viewer.interests.filter((i) => match.interests.includes(i)).join(', ')}

      Output JSON ONLY:
      {
        "common": ["tag1", "tag2", "tag3"], // Max 6 shared tags
        "why_short": "3 short, punchy sentences explaining why they should connect. Warm tone. No romance.",
        "more": ["Conversation starter 1", "Shared topic angle", "Question to ask"]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    res.status(200).json(JSON.parse(text));
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to generate explanation" });
  }
}
