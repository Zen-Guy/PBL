import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Home from "@/pages/Home";
import AuthPage from "@/pages/AuthPage";
import Quiz from "@/pages/Quiz";
import Results from "@/pages/Results";
import Tips from "@/pages/Tips";
import Contact from "@/pages/Contact";
import Analytics from "@/pages/Analytics";
import NotFound from "@/pages/not-found";
import { Navigation } from "@/components/Navigation";
import { ChatBot } from "@/components/ChatBot";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={AuthPage} />
      
      <Route path="/quiz">
        <ProtectedRoute component={Quiz} />
      </Route>
      <Route path="/results">
        <ProtectedRoute component={Results} />
      </Route>
      <Route path="/analytics">
        <ProtectedRoute component={Analytics} />
      </Route>

      <Route path="/tips" component={Tips} />
      <Route path="/contact" component={Contact} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Navigation />
        <Router />
        <ChatBot />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
