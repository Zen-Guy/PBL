import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Moon, Sun, Wind, Brain, Coffee, Music } from "lucide-react";
import { motion } from "framer-motion";

const TIPS_DATA = {
  sleep: [
    {
      title: "The 10-3-2-1 Rule",
      desc: "No caffeine 10h before bed, no food 3h before, no work 2h before, no screens 1h before.",
    },
    {
      title: "Consistent Schedule",
      desc: "Go to bed and wake up at the same time every day, even on weekends.",
    },
    {
      title: "Create a Ritual",
      desc: "Read a book or take a warm bath to signal your body it's time to wind down.",
    },
  ],
  anxiety: [
    {
      title: "Box Breathing",
      desc: "Breathe in for 4s, hold for 4s, exhale for 4s, hold for 4s. Repeat 4 times.",
    },
    {
      title: "Grounding Technique",
      desc: "Identify 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.",
    },
    {
      title: "Limit Caffeine",
      desc: "Caffeine can trigger anxiety symptoms. Try herbal tea instead.",
    },
  ],
  mindfulness: [
    {
      title: "Mindful Walking",
      desc: "Focus entirely on the sensation of your feet touching the ground.",
    },
    {
      title: "Body Scan",
      desc: "Mentally scan your body from head to toe, noting tension and releasing it.",
    },
    {
      title: "Digital Detox",
      desc: "Take 30 minutes each day completely away from all screens.",
    },
  ],
};

export default function Tips() {
  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-12 px-4">
      <div className="container-width">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold font-display mb-4">
            Wellness Library
          </h1>
          <p className="text-muted-foreground text-lg">
            Simple, science-backed strategies to improve your daily mental
            well-being.
          </p>
        </div>

        <Tabs defaultValue="sleep" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="sleep" className="gap-2">
              <Moon className="h-4 w-4" /> Sleep
            </TabsTrigger>
            <TabsTrigger value="anxiety" className="gap-2">
              <Wind className="h-4 w-4" /> Anxiety
            </TabsTrigger>
            <TabsTrigger value="mindfulness" className="gap-2">
              <Sun className="h-4 w-4" /> Mindfulness
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sleep">
            <div className="grid md:grid-cols-3 gap-6">
              {TIPS_DATA.sleep.map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full border-t-4 border-t-indigo-500 shadow-md hover:shadow-xl transition-all">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Moon className="h-5 w-5 text-indigo-500" />
                        {tip.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{tip.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            {/* Unsplash image for visual interest */}
            <div className="mt-8 rounded-2xl overflow-hidden h-64 relative shadow-inner">
              {/* woman sleeping peacefully */}
              <img
                src="/images/sleep.png"
                alt="Sleep"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h3 className="text-white text-3xl font-bold font-display">
                  Rest is Productive
                </h3>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="anxiety">
            <div className="grid md:grid-cols-3 gap-6">
              {TIPS_DATA.anxiety.map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full border-t-4 border-t-teal-500 shadow-md hover:shadow-xl transition-all">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wind className="h-5 w-5 text-teal-500" />
                        {tip.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{tip.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl overflow-hidden h-64 relative shadow-inner">
              {/* calm water reflection */}
              <img
                src="/images/calm.png"
                alt="Calm"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h3 className="text-white text-3xl font-bold font-display">
                  Breathe Deeply
                </h3>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mindfulness">
            <div className="grid md:grid-cols-3 gap-6">
              {TIPS_DATA.mindfulness.map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full border-t-4 border-t-orange-500 shadow-md hover:shadow-xl transition-all">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sun className="h-5 w-5 text-orange-500" />
                        {tip.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{tip.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl overflow-hidden h-64 relative shadow-inner">
              {/* stones balanced zen */}
              <img
                src="/images/zen.png"
                alt="Zen"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h3 className="text-white text-3xl font-bold font-display">
                  Be Present
                </h3>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
