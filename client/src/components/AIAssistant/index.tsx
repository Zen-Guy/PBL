import { useState, useEffect } from "react";
import { MessageSquare, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ChatWindow } from "./ChatWindow.tsx";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.button
              key="button"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground p-4 rounded-full shadow-2xl flex items-center justify-center group relative overflow-hidden"
              aria-label="Open AI Assistant"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <MessageSquare className="h-6 w-6" />
            </motion.button>
          ) : (
            <motion.button
              key="close"
              initial={{ scale: 0, opacity: 0, rotate: -45 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0, rotate: 45 }}
              onClick={() => setIsOpen(false)}
              className="bg-muted hover:bg-muted/80 text-muted-foreground p-3 rounded-full shadow-xl flex items-center justify-center relative z-[60]"
              aria-label="Close Assistant"
            >
              <X className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(10px)" }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="absolute bottom-16 right-0"
            >
              <ChatWindow onClose={() => setIsOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
