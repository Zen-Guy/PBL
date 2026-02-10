import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Info, ArrowRight, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function Results() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const score = parseInt(searchParams.get("score") || "0");
  const category = searchParams.get("category") || "healthy";

  const getResultContent = () => {
    switch (category) {
      case "fake":
        return {
          icon: RefreshCcw,
          color: "text-orange-500",
          bg: "bg-orange-50",
          title: "Assessment Inconclusive",
          desc: "It seems you rushed through the questions. For accurate results, please take your time to reflect on each question.",
          action: "Retake Quiz",
          link: "/quiz",
          resources: false
        };
      case "serious":
        return {
          icon: AlertCircle,
          color: "text-red-500",
          bg: "bg-red-50",
          title: "Professional Support Recommended",
          desc: "Your responses suggest you might be going through a difficult time. We strongly recommend speaking with a mental health professional.",
          action: "Get Help Now",
          link: "/contact",
          resources: true
        };
      case "moderate":
        return {
          icon: Info,
          color: "text-yellow-500",
          bg: "bg-yellow-50",
          title: "Moderate Stress Levels",
          desc: "You seem to be experiencing some stress. Learning mindfulness and stress-management techniques could be very beneficial.",
          action: "View Wellness Tips",
          link: "/tips",
          resources: true
        };
      default: // healthy
        return {
          icon: CheckCircle2,
          color: "text-green-500",
          bg: "bg-green-50",
          title: "You're Doing Well!",
          desc: "Your responses indicate a healthy mental state. Keep up your positive habits and self-care routines.",
          action: "Explore Tips",
          link: "/tips",
          resources: true
        };
    }
  };

  const content = getResultContent();

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none shadow-xl overflow-hidden text-center mb-8">
            <div className={`h-32 ${content.bg} flex items-center justify-center`}>
              <content.icon className={`h-16 w-16 ${content.color}`} />
            </div>
            <CardContent className="p-8 md:p-12">
              <h1 className="text-3xl font-bold mb-4 font-display">{content.title}</h1>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                {content.desc}
              </p>
              
              <div className="flex justify-center gap-4">
                <Button asChild size="lg" className="rounded-full px-8">
                  <a href={content.link}>
                    {content.action} <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {content.resources && (
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-primary" onClick={() => window.location.href='/tips'}>
              <CardHeader>
                <CardTitle className="text-lg">Self-Care Library</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Browse our collection of guides on sleep, anxiety, and mindfulness.</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-secondary" onClick={() => window.location.href='/analytics'}>
              <CardHeader>
                <CardTitle className="text-lg">Track Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">View your assessment history and monitor your emotional trends.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
