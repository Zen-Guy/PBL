import { ThemeToggle } from "@/components/ThemeToggle";
import { Link, useLocation } from "wouter";
import { useUser, useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  HeartPulse,
  Home,
  BookOpen,
  BarChart2,
  Phone,
  LogIn,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { data: user } = useUser();
  const { mutate: logout } = useLogout();

  const routes = [
    { href: "/", label: "Home", icon: Home },
    { href: "/quiz", label: "Assessment", icon: HeartPulse },
    { href: "/tips", label: "Wellness Tips", icon: BookOpen },
    { href: "/contact", label: "Helpline", icon: Phone },
    ...(user
      ? [{ href: "/analytics", label: "Dashboard", icon: BarChart2 }]
      : []),
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-border">
      <div className="container-width">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-xl font-bold text-primary hover:opacity-80 transition-opacity"
          >
            <HeartPulse className="h-8 w-8 text-primary" />
            <span className="hidden sm:inline">MindfulPath</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {routes.map((route) => (
              <Link key={route.href} href={route.href}>
                <div
                  className={`
                  flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary cursor-pointer
                  ${location === route.href ? "text-primary font-bold" : "text-muted-foreground"}
                `}
                >
                  {route.label}
                </div>
              </Link>
            ))}

            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l">
                <span className="text-sm font-medium text-foreground">
                  {user.name}
                </span>
                <Button variant="ghost" size="sm" onClick={() => logout()}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/auth">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b bg-background"
          >
            <div className="container-width py-4 flex flex-col gap-4">
              {routes.map((route) => (
                <Link key={route.href} href={route.href}>
                  <div
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
                      ${location === route.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}
                    `}
                  >
                    <route.icon className="h-5 w-5" />
                    {route.label}
                  </div>
                </Link>
              ))}
              <div className="border-t pt-4 mt-2">
                <ThemeToggle />
                {user ? (
                  <Button
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={() => logout()}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                ) : (
                  <Link href="/auth">
                    <Button className="w-full justify-start">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In / Register
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
