import { GoogleGenAI } from "@google/genai";

const resolveApiKey = (): string => {
  const browserEnv = typeof import.meta !== 'undefined' ? import.meta.env : undefined;

  return (
    browserEnv?.VITE_GEMINI_API_KEY ||
    browserEnv?.GEMINI_API_KEY ||
    (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : undefined) ||
    (typeof process !== 'undefined' ? process.env.API_KEY : undefined) ||
    ''
  );
};

const apiKey = resolveApiKey();

export const generateProductDescription = async (productName: string, keywords: string): Promise<string> => {
  if (!apiKey) {
    console.error("API Key missing");
    return "Error: API Key is missing. Please check your environment variables.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      Act as a professional e-commerce copywriter. 
      Write a compelling, SEO-friendly product description (HTML format, no markdown code blocks) for a product named "${productName}".
      Include these keywords/features: ${keywords}.
      Keep it under 200 words. Use paragraph tags and bold tags for emphasis.
      Tone: Persuasive and professional.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating content. Please try again.";
  }
};

export const analyzeSalesTrend = async (salesData: any[]): Promise<string> => {
  if (!apiKey) return "AI insights unavailable without API Key.";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      Analyze the following simulated sales data and provide a brief 2-sentence insight about the trend:
      ${JSON.stringify(salesData)}
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No insights available.";
  } catch (error) {
    return "Could not analyze data.";
  }
};