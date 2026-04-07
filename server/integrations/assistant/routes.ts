import type { Express, Request, Response } from "express";
import OpenAI from "openai";
import { assistantStorage } from "./storage";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://mindfulpath.io",
    "X-Title": "MindfulPath Assistant",
  },
});

export function registerAssistantRoutes(app: Express): void {
  // List all conversations
  app.get("/api/assistant/conversations", async (req: Request, res: Response) => {
    try {
      const userId = req.isAuthenticated() ? (req.user as any).id : undefined;
      const conversations = await assistantStorage.getAllConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("[Assistant] Fetch error:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  // Get a single conversation
  app.get("/api/assistant/conversations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const conversation = await assistantStorage.getConversation(id);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      const messages = await assistantStorage.getMessages(id);
      res.json({ ...conversation, messages });
    } catch (error) {
      console.error("[Assistant] Fetch conversation error:", error);
      res.status(500).json({ error: "Failed to fetch conversation" });
    }
  });

  // Create a new conversation
  app.post("/api/assistant/conversations", async (req: Request, res: Response) => {
    try {
      const { title } = req.body;
      const userId = req.isAuthenticated() ? (req.user as any).id : undefined;
      const conversation = await assistantStorage.createConversation(title || "A New Reflection", userId);
      res.status(201).json(conversation);
    } catch (error) {
      console.error("[Assistant] Create error:", error);
      res.status(500).json({ error: "Failed to create conversation" });
    }
  });

  // Send message and get streaming response
  app.post("/api/assistant/conversations/:id/messages", async (req: Request, res: Response) => {
    const conversationId = parseInt(req.params.id as string);
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ error: "Message content is required" });
    }

    try {
      // 1. Save user message
      await assistantStorage.createMessage(conversationId, "user", content);

      // 2. Prepare history for AI
      const history = await assistantStorage.getMessages(conversationId);
      const messages = history.map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      }));

      // 3. Initiate OpenRouter Stream
      const stream = await openai.chat.completions.create({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are Mindful Assistant, a specialized mental health and wellness companion. 
Your core mission is to provide empathetic support, mindful exercises, and guidance for emotional well-being.

Strict Guidelines:
1. ONLY discuss topics related to mental health, wellness, meditation, stress management, and emotional support.
2. If a user asks about unrelated topics (e.g., coding, math, general news, trivia), politely redirect them to the assistant's purpose.
3. Be supportive, calm, and professional.
4. DO NOT provide medical or clinical diagnoses.
5. If a user is in crisis, prioritize suggesting professional help and emergency resources.`,
          },
          ...messages,
        ],
        stream: true,
      });

      // 4. Setup SSE
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      let assistantResponse = "";

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || "";
        if (delta) {
          assistantResponse += delta;
          res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
        }
      }

      // 5. Save assistant message after completion
      await assistantStorage.createMessage(conversationId, "assistant", assistantResponse);

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error: any) {
      console.error("[Assistant] OpenRouter Error:", error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: error.message || "Something went wrong" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: error.message || "Internal assistant error" });
      }
    }
  });

  // Delete a conversation
  app.delete("/api/assistant/conversations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      await assistantStorage.deleteConversation(id);
      res.status(204).send();
    } catch (error) {
      console.error("[Assistant] Delete error:", error);
      res.status(500).json({ error: "Failed to delete conversation" });
    }
  });
}
