import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Heart, HeartPulse, Shield, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent pt-24 pb-32">
        <div className="container-width relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary font-medium text-sm">
                <Heart className="h-4 w-4 fill-secondary" />
                Your Mental Health Matters
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight font-display text-foreground">
                Find Balance in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Your Journey</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Professional assessment tools, personalized wellness tips, and 24/7 support—all in a safe, anonymous space designed for your peace of mind.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/quiz">
                  <Button size="lg" className="rounded-full text-lg px-8 py-6 h-auto bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                    Start Assessment <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/tips">
                  <Button variant="outline" size="lg" className="rounded-full text-lg px-8 py-6 h-auto">
                    Explore Tips
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:w-1/2"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary to-secondary rounded-full opacity-20 blur-3xl animate-pulse" />
                {/* Abstract Visual Representation */}
                <img 
                  src="https://pixabay.com/get/g72e018da74152d55d26a2cdfa77c0cd983e8cdd9d83b8c26c3cf80a1639472c3c88e05897e32625370bab2abb2b92f0ffdc25e537ee698ea93a615b8f879d7ae_1280.jpg"
                  alt="Mindfulness and Peace"
                  className="rounded-3xl shadow-2xl border-4 border-white/50 relative z-10 w-full object-cover aspect-[4/3]"
                />
                
                {/* Floating Cards */}
                <div className="absolute -bottom-8 -left-8 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-border animate-float">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full text-green-600">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Daily Check-in</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section-padding bg-white dark:bg-slate-900">
        <div className="container-width">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Care Tools</h2>
            <p className="text-muted-foreground text-lg">Everything you need to monitor and improve your mental well-being in one place.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Private & Secure",
                desc: "Your data is encrypted and completely anonymous. We prioritize your privacy above all else."
              },
              {
                icon: HeartPulse,
                title: "Clinical Accuracy",
                desc: "Our assessments are based on standard psychological evaluation criteria used by professionals."
              },
              {
                icon: Users,
                title: "Community Support",
                desc: "Connect with helpful resources and professional helplines whenever you need them."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-muted/30 border border-border hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container-width relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to take the first step?</h2>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Join thousands of others who are prioritizing their mental health today. It takes less than 2 minutes.
          </p>
          <Link href="/auth">
            <Button size="lg" variant="secondary" className="rounded-full text-lg px-8 py-6 h-auto shadow-xl hover:scale-105 transition-transform">
              Join MindfulPath Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
