import { useState, useEffect } from "react";
import { useSubmitQuiz } from "@/hooks/use-quiz";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

const QUESTIONS = [
  { id: 1, text: "I often feel overwhelmed by my emotions." },
  { id: 2, text: "I have trouble sleeping or sleeping too much." },
  { id: 3, text: "I find it hard to focus on daily tasks." },
  { id: 4, text: "I feel lonely even when I'm around people." },
  { id: 5, text: "I worry excessively about things I can't control." },
  { id: 6, text: "I have lost interest in activities I used to enjoy." },
  { id: 7, text: "I feel tired or have little energy most days." },
  { id: 8, text: "I feel worthless or guilty often." },
  { id: 9, text: "I get agitated or irritable easily." },
  { id: 10, text: "I feel hopeful about my future." }, // Reverse coded in logic if needed, treating simple sum for now
];

const OPTIONS = [
  { label: "Never", value: 0 },
  { label: "Rarely", value: 1 },
  { label: "Sometimes", value: 2 },
  { label: "Often", value: 3 },
  { label: "Always", value: 4 },
];

export default function Quiz() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [startTime, setStartTime] = useState<number>(0);
  const { mutate: submit, isPending } = useSubmitQuiz();
  const [, setLocation] = useLocation();

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  const handleSelect = (value: number) => {
    setResponses(prev => ({ ...prev, [QUESTIONS[currentIdx].id]: value }));
    if (currentIdx < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentIdx(curr => curr + 1), 250); // Slight delay for visual feedback
    } else {
      finishQuiz({ ...responses, [QUESTIONS[currentIdx].id]: value });
    }
  };

  const finishQuiz = (finalResponses: Record<number, number>) => {
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTime) / 1000);
    const score = Object.values(finalResponses).reduce((a, b) => a + b, 0);
    
    // Logic for category
    let category = "healthy";
    const avgTime = timeTaken / QUESTIONS.length;
    
    if (avgTime < 2) {
      category = "fake";
    } else if (score > 25) {
      category = "serious";
    } else if (score > 15) {
      category = "moderate";
    }

    submit({
      score,
      category,
      timeTaken,
      responses: finalResponses,
    }, {
      onSuccess: () => setLocation(`/results?score=${score}&category=${category}`),
    });
  };

  const progress = ((currentIdx + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium text-muted-foreground mb-2">
            <span>Question {currentIdx + 1} of {QUESTIONS.length}</span>
            <span>{Math.round(progress)}% Completed</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-none shadow-xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
              <CardContent className="p-8 md:p-12 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 font-display leading-tight">
                  {QUESTIONS[currentIdx].text}
                </h2>
                
                <div className="grid gap-3">
                  {OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className={`
                        w-full p-4 rounded-xl border-2 text-left font-medium transition-all duration-200
                        flex items-center justify-between group
                        ${responses[QUESTIONS[currentIdx].id] === opt.value 
                          ? "border-primary bg-primary/5 text-primary" 
                          : "border-border hover:border-primary/50 hover:bg-muted"}
                      `}
                    >
                      {opt.label}
                      {responses[QUESTIONS[currentIdx].id] === opt.value && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {isPending && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold">Analyzing Results...</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
