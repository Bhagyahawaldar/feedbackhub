import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface FeedbackAnalysis {
  sentiment: "Positive" | "Neutral" | "Negative";
  summary: string;
}

export async function analyzeFeedback(message: string): Promise<FeedbackAnalysis> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following feedback and provide a sentiment (Positive, Neutral, or Negative) and a one-sentence summary.
      
      Feedback: "${message}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: {
              type: Type.STRING,
              enum: ["Positive", "Neutral", "Negative"],
              description: "The overall sentiment of the feedback."
            },
            summary: {
              type: Type.STRING,
              description: "A concise one-sentence summary of the feedback."
            }
          },
          required: ["sentiment", "summary"]
        }
      }
    });

    if (!response.text) {
      throw new Error("Empty response from Gemini");
    }

    return JSON.parse(response.text.trim()) as FeedbackAnalysis;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      sentiment: "Neutral",
      summary: "Analysis failed."
    };
  }
}
