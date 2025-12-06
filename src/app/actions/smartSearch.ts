'use server';

import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getSmartRecommendations(userDescription: string): Promise<string[]> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  try {
    const prompt = `
      You are a movie and TV series expert assistant. Analyze the user's request and respond accordingly:

      User request: "${userDescription}"

      INSTRUCTIONS:
      1. If the user is asking for a SPECIFIC movie/series (e.g., "the best SpongeBob movie", "Spider-Man with Tom Holland", "the latest Batman movie"):
        - Return 1-3 exact titles that match their specific request
        - Prioritize the most relevant or highly-rated options

      2. If the user is asking for RECOMMENDATIONS based on preferences (e.g., "movies like Inception", "action movies", "something funny"):
        - Return 3-6 movie or series titles that match their taste
        - Diversify your recommendations to give variety
      
      Return ONLY a JSON array of strings, where each string is the exact title of a movie or series. 
      Do not include any markdown formatting, just the raw JSON array.
      Example: ["The Matrix", "Inception", "Interstellar"]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;

    const cleanedText = text ? text.replace(/```json/g, '').replace(/```/g, '').trim() : '[]';

    try {
      const titles = JSON.parse(cleanedText);
      if (Array.isArray(titles)) {
        return titles;
      } else {
        console.error('Gemini response is not an array:', titles);
        return [];
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text, parseError);
      return [];
    }
  } catch (error: unknown) {
    console.error('Error generating recommendations:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to get recommendations: ${errorMessage}`);
  }
}