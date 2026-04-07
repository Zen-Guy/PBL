import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  useAssistantConversations, 
  useCreateAssistantConversation, 
  useAssistantStream,
  useAssistantConversation
} from "@/hooks/use-assistant";

interface ChatWindowProps {
  onClose: () => void;
}

export function ChatWindow({ onClose }: ChatWindowProps) {
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { data: conversations } = useAssistantConversations();
  const { mutateAsync: createConv, isPending: isCreating } = useCreateAssistantConversation();
  const [activeId, setActiveId] = useState<number | null>(null);
  const initializationAttempted = useRef(false);

  // Initialize or fetch last conversation
  useEffect(() => {
    if (!conversations || activeId || initializationAttempted.current) return;

    if (conversations.length > 0) {
      setActiveId(conversations[0].id);
      initializationAttempted.current = true;
    } else if (!isCreating) {
      initializationAttempted.current = true;
      createConv("New Reflective Session").then((c) => {
        setActiveId(c.id);
      }).catch(err => {
        console.error("Initialization failed:", err);
        initializationAttempted.current = false;
      });
    }
  }, [conversations, activeId, createConv, isCreating]);

  const { data: conversation } = useAssistantConversation(activeId);
  const { sendMessage, isStreaming, streamedContent, error } = useAssistantStream(activeId || 0);

  const messages = conversation?.messages || [];

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamedContent]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isStreaming || !activeId) return;

    const content = inputValue;
    setInputValue("");
    try {
      await sendMessage(content);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="w-[380px] h-[550px] bg-background/80 backdrop-blur-xl border border-border shadow-2xl rounded-2xl flex flex-col overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="p-4 border-b bg-background/50 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Mindful Assistant</h3>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Online</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
        </Button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10 scrollbar-thin scrollbar-thumb-primary/10"
      >
        {!activeId || isCreating ? (
          <div className="h-full flex flex-col items-center justify-center opacity-50 space-y-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-xs">Preparing assistant...</p>
          </div>
        ) : (
          <>
            {messages.length === 0 && !streamedContent && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                <Bot className="h-10 w-10 mb-4" />
                <p className="text-sm font-medium">Hello, I'm here for you. How can I help you today?</p>
              </div>
            )}
            
            {messages.map((m) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={m.id}
                className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center ${m.role === "user" ? "bg-muted" : "bg-primary/20"}`}>
                  {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary" />}
                </div>
                <div className={`p-3 rounded-2xl text-sm leading-relaxed max-w-[80%] ${
                  m.role === "user" 
                    ? "bg-primary text-primary-foreground rounded-tr-sm" 
                    : "bg-muted/80 backdrop-blur-sm rounded-tl-sm"
                }`}>
                  {m.content}
                </div>
              </motion.div>
            ))}

            {streamedContent && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full shrink-0 flex items-center justify-center bg-primary/20">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="p-3 rounded-2xl text-sm leading-relaxed bg-muted/80 backdrop-blur-sm rounded-tl-sm max-w-[80%] whitespace-pre-wrap">
                  {streamedContent}
                </div>
              </div>
            )}

            {isStreaming && !streamedContent && (
              <div className="flex gap-3 italic text-xs text-muted-foreground animate-pulse">
                <Bot className="h-4 w-4" /> Assistant is reflecting...
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs border border-destructive/20 mx-2 text-center">
                {error}
              </div>
            )}
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-background/50 border-t relative z-10">
        <div className="relative flex items-center gap-2">
          <Input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isStreaming || !activeId}
            placeholder="Share what's on your mind..."
            className="bg-background/50 rounded-xl pr-10 focus-visible:ring-primary/20 border-border/50"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isStreaming || !inputValue.trim() || !activeId}
            className="absolute right-1 h-8 w-8 rounded-lg shadow-lg"
          >
            {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-[9px] text-center mt-2 text-muted-foreground uppercase tracking-widest font-medium opacity-50">
          Empowered by Mindful AI
        </p>
      </form>
    </div>
  );
}
