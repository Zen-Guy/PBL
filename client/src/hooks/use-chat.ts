import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types matching backend structure
interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

interface Conversation {
  id: number;
  title: string;
  messages?: Message[];
}

export function useConversations() {
  return useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
    queryFn: async () => {
      const res = await fetch("/api/conversations");
      if (!res.ok) throw new Error("Failed to fetch conversations");
      return res.json();
    },
  });
}

export function useConversation(id: number | null) {
  return useQuery<Conversation>({
    queryKey: [`/api/conversations/${id}`],
    queryFn: async () => {
      if (!id) return null;
      const res = await fetch(`/api/conversations/${id}`);
      if (!res.ok) throw new Error("Failed to fetch conversation");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (title: string) => {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Failed to create conversation");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    },
  });
}

export function useChatStream(conversationId: number) {
  const queryClient = useQueryClient();
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");

  const sendMessage = useCallback(
    async (content: string) => {
      setIsStreaming(true);
      setStreamedContent("");

      // Optimistic update for user message
      const tempId = Date.now();
      queryClient.setQueryData<Conversation>(
        [`/api/conversations/${conversationId}`],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            messages: [
              ...(old.messages || []),
              {
                id: tempId,
                role: "user",
                content,
                createdAt: new Date().toISOString(),
              } as Message,
            ],
          };
        },
      );

      try {
        const res = await fetch(
          `/api/conversations/${conversationId}/messages`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content }),
          },
        );

        if (!res.ok) throw new Error("Failed to send message");

        // 🔴 IMPORTANT FIX: handle non-stream JSON responses
        if (!res.body) {
          const data = await res.json();
          if (data?.content) {
            queryClient.setQueryData<Conversation>(
              [`/api/conversations/${conversationId}`],
              (old) => {
                if (!old) return old;
                return {
                  ...old,
                  messages: [
                    ...(old.messages || []),
                    {
                      id: Date.now(),
                      role: "assistant",
                      content: data.content,
                      createdAt: new Date().toISOString(),
                    } as Message,
                  ],
                };
              },
            );
          }
          return;
        }

        // 🔵 Streaming path (OpenAI / SSE)
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n\n");

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;

            const data = JSON.parse(line.slice(6));

            if (data.content) {
              assistantMessage += data.content;
              setStreamedContent(assistantMessage);
            }
          }
        }
      } catch (error) {
        console.error("Chat error:", error);
      } finally {
        setIsStreaming(false);
        setStreamedContent("");
        queryClient.invalidateQueries({
          queryKey: [`/api/conversations/${conversationId}`],
        });
      }
    },
    [conversationId, queryClient],
  );

  return { sendMessage, isStreaming, streamedContent };
}
