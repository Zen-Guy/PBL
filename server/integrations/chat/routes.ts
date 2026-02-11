import type { Express, Request, Response } from "express";
import OpenAI from "openai";
import { chatStorage } from "./storage";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export function registerChatRoutes(app: Express): void {
  app.post(
    "/api/conversations/:id/messages",
    async (req: Request, res: Response) => {
      try {
        const conversationId = Number(req.params.id);
        const content =
          typeof req.body.content === "string" ? req.body.content : "";

        if (!content.trim()) {
          return res.status(400).json({ error: "Message content is required" });
        }

        // Save user message
        await chatStorage.createMessage(conversationId, "user", content);

        const normalized = content.trim().toLowerCase();

        // Response

        // Set up SSE (THIS is what frontend expects)
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        let reply =
          normalized === "hi"
            ? "Hi, user! How may I help you?"
            : "Welcome to MindfulPath! Take assessment to monitor your mental health.";

        // Stream reply as SSE
        res.write(`data: ${JSON.stringify({ content: reply })}\n\n`);

        // Save assistant message
        await chatStorage.createMessage(conversationId, "assistant", reply);

        // Signal completion
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      } catch (error) {
        console.error("Error sending message:", error);

        if (res.headersSent) {
          res.write(
            `data: ${JSON.stringify({ error: "Failed to send message" })}\n\n`,
          );
          res.end();
        } else {
          res.status(500).json({ error: "Failed to send message" });
        }
      }
    },
  );
}
