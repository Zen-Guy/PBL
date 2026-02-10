import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";
import { registerChatRoutes } from "./integrations/chat";
import { setupAuth } from "./auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  // Setup Authentication (Passport)
  setupAuth(app);

  // Register Chat Integration Routes
  registerChatRoutes(app);

  // === API Routes ===

  // Quiz: Submit Result
  app.post(api.quiz.submit.path, async (req, res) => {
    // Check auth for submitting? Requirements say "Store quiz results for each user".
    // If not logged in, maybe we can't store it linked to a user?
    // Let's assume we allow anonymous for now but if logged in we link it.
    // Or strict: must be logged in. The requirements say "Sign In... Store user data".
    // Let's allow anonymous submission but maybe it won't show in analytics.
    // Actually, `userId` in schema is nullable? No, I made it nullable in my thought but let's check schema.
    // In shared/schema.ts I put `userId: integer("user_id").references(() => users.id)`. It is nullable by default in drizzle if not `.notNull()`.
    // Let's check my schema write...
    // `userId: integer("user_id").references(() => users.id)` -> Default is nullable.

    try {
      const input = api.quiz.submit.input.parse(req.body);

      // If user is logged in, link it
      const resultData = {
        ...input,
        userId: req.isAuthenticated() ? (req.user as any).id : null,
      };

      const result = await storage.createQuizResult(resultData);
      res.status(201).json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      throw err;
    }
  });

  // Quiz: History (Analytics)
  app.get(api.quiz.history.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = (req.user as any).id;
    const history = await storage.getQuizResultsByUser(userId);
    res.json(history);
  });

  return httpServer;
}
