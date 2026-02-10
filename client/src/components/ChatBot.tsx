import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  useCreateConversation,
  useChatStream,
  useConversations,
  useConversation,
} from "@/hooks/use-chat";

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: conversations } = useConversations();
  const { mutateAsync: createConv } = useCreateConversation();
  const [activeConvId, setActiveConvId] = useState<number | null>(null);

  // Initialize conversation
  useEffect(() => {
    if (isOpen && !activeConvId) {
      if (conversations && conversations.length > 0) {
        setActiveConvId(conversations[0].id);
      } else {
        createConv("Support Chat").then((c) => setActiveConvId(c.id));
      }
    }
  }, [isOpen, conversations, activeConvId, createConv]);

  // ✅ THIS WAS MISSING
  const { data: activeConversation } = useConversation(activeConvId);
  const messages = activeConversation?.messages || [];

  const { sendMessage, isStreaming, streamedContent } = useChatStream(
    activeConvId || 0,
  );

  const handleSend = async () => {
    if (!inputValue.trim() || !activeConvId) return;
    const msg = inputValue;
    setInputValue("");
    await sendMessage(msg);
  };

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamedContent, isOpen]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border flex flex-col z-50"
          >
            {/* Header */}
            <div className="bg-primary p-4 flex justify-between text-primary-foreground">
              <div className="flex items-center gap-2">
                <Bot />
                <h3 className="font-bold">Mindful Assistant</h3>
              </div>
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                <X />
              </Button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    {msg.role === "user" ? <User /> : <Bot />}
                  </div>
                  <div className="p-3 rounded-2xl bg-muted max-w-[80%]">
                    {msg.content}
                  </div>
                </div>
              ))}

              {streamedContent && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <Bot />
                  </div>
                  <div className="p-3 rounded-2xl bg-muted max-w-[80%]">
                    {streamedContent}
                  </div>
                </div>
              )}

              {isStreaming && !streamedContent && (
                <div className="flex items-center gap-2 text-xs opacity-70">
                  <Loader2 className="animate-spin h-3 w-3" /> Thinking…
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-4 flex gap-2 border-t"
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message…"
                disabled={isStreaming}
              />
              <Button
                type="submit"
                disabled={isStreaming || !inputValue.trim()}
              >
                <Send />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-white flex items-center justify-center"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>
    </>
  );
}
