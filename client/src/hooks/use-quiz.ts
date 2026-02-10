import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type InsertQuizResult } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useQuizHistory() {
  return useQuery({
    queryKey: [api.quiz.history.path],
    queryFn: async () => {
      const res = await fetch(api.quiz.history.path);
      if (!res.ok) throw new Error("Failed to fetch quiz history");
      return await res.json();
    },
  });
}

export function useSubmitQuiz() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertQuizResult) => {
      const res = await fetch(api.quiz.submit.path, {
        method: api.quiz.submit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to submit quiz");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.quiz.history.path] });
      toast({
        title: "Assessment Completed",
        description: "Your results have been saved to your history.",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
