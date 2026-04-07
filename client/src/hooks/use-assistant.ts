import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Message {
  id: number;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

interface Conversation {
  id: number;
  title: string;
  messages?: Message[];
}

export function useAssistantConversations() {
  return useQuery<Conversation[]>({
    queryKey: ["/api/assistant/conversations"],
    queryFn: async () => {
      const res = await fetch("/api/assistant/conversations");
      if (!res.ok) throw new Error("Failed to fetch conversations");
      return res.json();
    },
  });
}

export function useAssistantConversation(id: number | null) {
  return useQuery<Conversation>({
    queryKey: [`/api/assistant/conversations/${id}`],
    queryFn: async () => {
      if (!id) return null!;
      const res = await fetch(`/api/assistant/conversations/${id}`);
      if (!res.ok) throw new Error("Failed to fetch conversation");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCreateAssistantConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (title: string) => {
      const res = await fetch("/api/assistant/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Failed to create conversation");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assistant/conversations"] });
    },
  });
}

export function useAssistantStream(conversationId: number) {
  const queryClient = useQueryClient();
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      setIsStreaming(true);
      setStreamedContent("");
      setError(null);

      // Optimistic update for UI feel
      const tempId = Date.now();
      queryClient.setQueryData<Conversation>(
        [`/api/assistant/conversations/${conversationId}`],
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
        const res = await fetch(`/api/assistant/conversations/${conversationId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to connect to the assistant");
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("Response body is not readable");

        const decoder = new TextDecoder();
        let assistantMessage = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");

          // Keep the last partial line in the buffer
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                assistantMessage += data.content;
                setStreamedContent(assistantMessage);
              }
              if (data.error) throw new Error(data.error);
            } catch (e: any) {
              console.error("SSE Parse Error:", e);
            }
          }
        }
      } catch (err: any) {
        console.error("Assistant Stream Error:", err);
        setError(err.message);
        throw err;
      } finally {
        setIsStreaming(false);
        setStreamedContent("");
        queryClient.invalidateQueries({
          queryKey: [`/api/assistant/conversations/${conversationId}`],
        });
      }
    },
    [conversationId, queryClient],
  );

  return { sendMessage, isStreaming, streamedContent, error };
}
