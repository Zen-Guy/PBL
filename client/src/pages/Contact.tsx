import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Phone, Mail, MapPin, Globe, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-12 px-4">
      <div className="container-width">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold font-display mb-4 text-primary">
            Help is Available
          </h1>
          <p className="text-muted-foreground text-lg">
            If you or someone you know is in immediate danger, please call your
            local emergency number immediately.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Emergency Card */}
          <Card className="border-2 border-destructive/20 shadow-lg col-span-full md:col-span-1 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <Phone className="h-6 w-6" /> Emergency
              </CardTitle>
              <CardDescription>Immediate assistance 24/7</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border shadow-sm">
                <span className="font-bold">Emergency Services</span>
                <span className="text-xl font-bold text-destructive">112</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border shadow-sm">
                <span className="font-bold">Suicide & Crisis Lifeline</span>
                <span className="text-xl font-bold text-destructive">
                  14416
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Professional Support */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Globe className="h-6 w-6" /> Online Therapy
              </CardTitle>
              <CardDescription>
                Trusted platforms for professional help
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-bold mb-1">BetterHelp</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Professional therapy, accessible anywhere.
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a
                    href="https://www.betterhelp.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit Website <ExternalLink className="h-3 w-3 ml-2" />
                  </a>
                </Button>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-bold mb-1">Talkspace</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Online counseling and therapy services.
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a
                    href="https://www.talkspace.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit Website <ExternalLink className="h-3 w-3 ml-2" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Student Services */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-secondary">
                <MapPin className="h-6 w-6" /> Campus Support
              </CardTitle>
              <CardDescription>For students at the university</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Student Wellness Center</p>
                  <p className="text-sm text-muted-foreground">
                    Building A, Room 101
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Mon-Fri: 8am - 5pm
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Email Support</p>
                  <a
                    href="mailto:wellness@university.edu"
                    className="text-sm text-primary hover:underline"
                  >
                    wellness@university.edu
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
