
import { GoogleGenAI } from "@google/genai";

// Fix: Simplified initialization according to guidelines, which assume API_KEY is always present.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductDescription = async (productName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a short, appealing product description in Arabic for a grocery item named '${productName}'. Keep it under 20 words.`,
    });
    // Per coding guidelines, the generated text is accessed via the `text` property.
    return response.text;
  } catch (error) {
    console.error("Error generating product description:", error);
    return "Failed to generate description. Please try again.";
  }
};