
import { GoogleGenAI } from "@google/genai";
import { Book, Epiphany } from "../types";

export class LibrarianService {
  // Fix: Ensure we use a clean initialization as per guidelines, preferably right before the call
  private get ai() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async recommendBooks(query: string, availableBooks: Book[]): Promise<string> {
    const bookList = availableBooks.map(b => `- ${b.title} by ${b.author} (${b.discipline}): ${b.description}`).join('\n');
    
    const prompt = `You are the AI Librarian of Athenaeum Arcanum. A seeker is looking for knowledge.
    
    User Query: "${query}"
    
    Current Archive Inventory:
    ${bookList}
    
    Respond in a solemn, wise, and helpful tone. Suggest specific books from the list that might help them on their journey. If no books match perfectly, guide them toward the disciplines that might be relevant. Keep it concise but profound.`;

    try {
      // Fix: Use the new instance and direct model generation call
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            temperature: 0.7,
            topP: 0.95
        }
      });
      // Fix: Direct access to .text property (not a method)
      return response.text || "The archives remain silent on this matter for now. Perhaps rephrase your inquiry?";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "The light in the archive flickers. Please try asking again in a moment.";
    }
  }

  async synthesizeEpiphanies(epiphanies: Epiphany[]): Promise<string> {
    if (epiphanies.length === 0) return "The Council is silent. No collective wisdom has been shared yet.";
    
    const text = epiphanies.map(e => `[${e.seeker}]: ${e.content}`).join('\n');
    const prompt = `You are the Sage of the Athenaeum Council. Here is a ledger of epiphanies shared by seekers who have emerged from their dark night of the soul:
    
    ${text}
    
    Synthesize these diverse voices into a single profound "State of the Collective Spirit" in 2-3 sentences. Use a classical, elevated, yet encouraging tone.`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text || "The voices are too disparate to weave into a single thread today.";
    } catch (error) {
      return "The collective consciousness is clouded. Revisit the Council later.";
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

      // Fix: Iterate through all parts to find the image part as recommended
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
