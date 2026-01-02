
import { GoogleGenAI } from "@google/genai";
import { Book } from "../types";

export class LibrarianService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async recommendBooks(query: string, availableBooks: Book[]): Promise<string> {
    const bookList = availableBooks.map(b => `- ${b.title} by ${b.author} (${b.discipline}): ${b.description}`).join('\n');
    
    const prompt = `You are the AI Librarian of BemLib Archives. A seeker is looking for knowledge.
    
    User Query: "${query}"
    
    Current Archive Inventory:
    ${bookList}
    
    Respond in a solemn, wise, and helpful tone. Suggest specific books from the list that might help them on their journey. If no books match perfectly, guide them toward the disciplines that might be relevant. Keep it concise but profound.`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            temperature: 0.7,
            topP: 0.95
        }
      });
      return response.text || "The archives remain silent on this matter for now. Perhaps rephrase your inquiry?";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "The light in the archive flickers. Please try asking again in a moment.";
    }
  }

  async generateCoverImage(title: string, discipline: string): Promise<string> {
    const prompt = `A professional, aesthetic, and minimalist book cover illustration for a text titled "${title}" in the discipline of "${discipline}". Classical, scholarly style, high contrast, textured parchment, muted gold and midnight tones. No text on the cover, purely symbolic and atmospheric.`;
    
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          }
        }
      }
      return '';
    } catch (error) {
      console.error("Gemini Image Generation Error:", error);
      return '';
    }
  }
}

export const librarian = new LibrarianService();
