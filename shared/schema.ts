import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export * from "./models/chat";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(), // Used as ID/Email for login
  password: text("password").notNull(),
  name: text("name").notNull(),
  studentId: text("student_id"), // Optional, as it might not be relevant for non-students
  mobile: text("mobile"),
  role: text("role").default("user").notNull(),
});

export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id), // Nullable for anonymous if needed, but requirements say "logged-in users" for analytics
  score: integer("score").notNull(),
  category: text("category").notNull(), // 'fake', 'healthy', 'serious'
  timeTaken: integer("time_taken").notNull(), // in seconds
  responses: jsonb("responses").notNull(), // Store actual answers
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  quizResults: many(quizResults),
}));

export const quizResultsRelations = relations(quizResults, ({ one }) => ({
  user: one(users, {
    fields: [quizResults.userId],
    references: [users.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertQuizResultSchema = createInsertSchema(quizResults).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type QuizResult = typeof quizResults.$inferSelect;
export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;
