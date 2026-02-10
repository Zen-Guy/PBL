import { useQuizHistory } from "@/hooks/use-quiz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, Calendar, Award } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { format } from "date-fns";

export default function Analytics() {
  const { data: history, isLoading } = useQuizHistory();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Transform data for chart
  const chartData = history?.map(item => ({
    date: format(new Date(item.createdAt), 'MMM dd'),
    score: item.score,
  })).reverse() || []; // Assume API returns newest first

  const totalAssessments = history?.length || 0;
  const avgScore = totalAssessments > 0 
    ? Math.round(history!.reduce((acc, curr) => acc + curr.score, 0) / totalAssessments) 
    : 0;

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-12 px-4">
      <div className="container-width">
        <h1 className="text-3xl font-bold mb-8 font-display">Wellness Dashboard</h1>

        {/* Stats Row */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-xl text-primary">
                <TrendingUp className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Average Score</p>
                <h3 className="text-2xl font-bold">{avgScore} <span className="text-sm text-muted-foreground font-normal">/ 40</span></h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-secondary/10 p-3 rounded-xl text-secondary">
                <Calendar className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Assessments</p>
                <h3 className="text-2xl font-bold">{totalAssessments}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
                <Award className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Current Streak</p>
                <h3 className="text-2xl font-bold">{history && history.length > 0 ? "Active" : "None"}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Emotional Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="date" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 40]} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No data yet. Take your first assessment!
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {history?.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium capitalize">{item.category}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(item.createdAt!), 'MMM dd, yyyy • HH:mm')}
                      </p>
                    </div>
                    <div className="text-lg font-bold text-primary">
                      {item.score}
                    </div>
                  </div>
                ))}
                {(!history || history.length === 0) && (
                  <p className="text-muted-foreground text-center py-4">No history available.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
