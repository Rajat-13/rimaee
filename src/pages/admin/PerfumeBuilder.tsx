import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const notePopularity = [
  { name: "Sandalwood", value: 245, color: "#8B4513" },
  { name: "Rose", value: 198, color: "#FF69B4" },
  { name: "Oud", value: 167, color: "#4A4A4A" },
  { name: "Vanilla", value: 134, color: "#F3E5AB" },
  { name: "Musk", value: 112, color: "#C4A484" },
];

const PerfumeBuilder = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-charcoal">Perfume Builder Settings</h1>
        <p className="text-muted-foreground">Configure MYOP builder logic and view analytics</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle>Builder Configuration</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between"><span>Max Top Notes</span><span className="font-bold">3</span></div>
              <Slider defaultValue={[3]} max={5} min={1} />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between"><span>Max Middle Notes</span><span className="font-bold">3</span></div>
              <Slider defaultValue={[3]} max={5} min={1} />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between"><span>Max Base Notes</span><span className="font-bold">3</span></div>
              <Slider defaultValue={[3]} max={5} min={1} />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between"><span>Base Price (₹)</span><span className="font-bold">500</span></div>
              <Slider defaultValue={[500]} max={2000} min={100} step={50} />
            </div>
            <Button className="w-full">Save Configuration</Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle>Most Selected Notes</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={notePopularity} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {notePopularity.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
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

export default PerfumeBuilder;
