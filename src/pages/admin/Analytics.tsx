import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const salesData = [
  { name: "Jan", custom: 4000, readymade: 2400 },
  { name: "Feb", custom: 3000, readymade: 1398 },
  { name: "Mar", custom: 5000, readymade: 9800 },
  { name: "Apr", custom: 4500, readymade: 3908 },
  { name: "May", custom: 6000, readymade: 4800 },
  { name: "Jun", custom: 5500, readymade: 3800 },
];

const retentionData = [
  { name: "New", value: 400, color: "#8884d8" },
  { name: "Returning", value: 300, color: "#82ca9d" },
  { name: "VIP", value: 100, color: "#ffc658" },
];

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-charcoal">Analytics & Reports</h1>
        <p className="text-muted-foreground">Detailed insights into your business performance</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle>Custom vs Ready-made Sales</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="custom" stroke="hsl(345, 60%, 30%)" strokeWidth={2} />
                <Line type="monotone" dataKey="readymade" stroke="hsl(43, 60%, 50%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle>Customer Retention</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={retentionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {retentionData.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
