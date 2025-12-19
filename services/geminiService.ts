
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const enhanceDescription = async (text: string, type: 'LOST' | 'FOUND'): Promise<string> => {
  const ai = getAI();
  const prompt = `
    You are an AI assistant for a professional Lost and Found portal. 
    The user is reporting a ${type} item with the following rough description: "${text}".
    
    Task:
    1. Rewrite this into a professional, clear, and detailed description.
    2. Focus on physical characteristics (color, brand, material, unique marks).
    3. Ensure the tone is helpful and concise.
    4. Do not include personal contact information.
    
    Return only the enhanced description text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return text;
  }
};

export const searchLocations = async (query: string, userLat?: number, userLng?: number) => {
  const ai = getAI();
  const contents = `Help me find specific locations or landmarks near: ${query}`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: (userLat && userLng) ? {
              latitude: userLat,
              longitude: userLng
            } : undefined
          }
        }
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const text = response.text || "";

    return {
      text,
      links: groundingChunks
        .filter((chunk: any) => chunk.maps?.uri)
        .map((chunk: any) => ({
          title: chunk.maps.title,
          url: chunk.maps.uri
        }))
    };
  } catch (error) {
    console.error("Maps Grounding Error:", error);
    return { text: "Search currently unavailable.", links: [] };
  }
};
