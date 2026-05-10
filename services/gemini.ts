import { GoogleGenAI } from "@google/genai"

const apiKey = process.env.GEMINI_API_KEY;

let genAI: GoogleGenAI | null = null;

export function getGemini() {
  if (!genAI) {
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is missing. AI features will be disabled.");
      return null;
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

export async function askAssistant(prompt: string, context?: string) {
  const ai = getGemini();
  if (!ai) return "AI assistance is currently unavailable. Please check configuration.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: `You are IGNIS AI, the elite tournament assistant for the IGNIS Esports platform. 
        You help players with Free Fire tournament details, registration help, and community rules.
        Aesthetic: Futuristic, professional, slightly aggressive but helpful (esports vibe). 
        Context: ${context || "No additional context provided."}`,
        temperature: 0.7,
      },
    });

      return response.text || "I'm having trouble processing that command, operative.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Protocol error. Neural link disconnected.";
  }
}
