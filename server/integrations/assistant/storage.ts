import { db } from "../../db";
import { assistantConversations, assistantMessages } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import type { AssistantConversation, AssistantMessage } from "@shared/schema";

export interface IAssistantStorage {
  getConversation(id: number): Promise<AssistantConversation | undefined>;
  getAllConversations(userId?: number): Promise<AssistantConversation[]>;
  createConversation(title: string, userId?: number): Promise<AssistantConversation>;
  deleteConversation(id: number): Promise<void>;
  getMessages(conversationId: number): Promise<AssistantMessage[]>;
  createMessage(conversationId: number, role: "user" | "assistant" | "system", content: string): Promise<AssistantMessage>;
}

export const assistantStorage: IAssistantStorage = {
  async getConversation(id) {
    const [conversation] = await db.select().from(assistantConversations).where(eq(assistantConversations.id, id));
    return conversation;
  },

  async getAllConversations(userId) {
    const query = db.select().from(assistantConversations).orderBy(desc(assistantConversations.createdAt));
    if (userId) {
      return query.where(eq(assistantConversations.userId, userId));
    }
    return query;
  },

  async createConversation(title, userId) {
    const [conversation] = await db.insert(assistantConversations).values({ title, userId }).returning();
    return conversation;
  },

  async deleteConversation(id) {
    await db.delete(assistantMessages).where(eq(assistantMessages.conversationId, id));
    await db.delete(assistantConversations).where(eq(assistantConversations.id, id));
  },

  async getMessages(conversationId) {
    return db.select()
      .from(assistantMessages)
      .where(eq(assistantMessages.conversationId, conversationId))
      .orderBy(assistantMessages.createdAt);
  },

  async createMessage(conversationId, role, content) {
    const [message] = await db.insert(assistantMessages).values({ conversationId, role, content }).returning();
    return message;
  },
};
