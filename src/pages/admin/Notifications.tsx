import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, MessageSquare, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const notifications = [
  { id: 1, type: "feedback", from: "Rahul S.", message: "Amazing fragrance! Lasted all day.", date: "2 hours ago" },
  { id: 2, type: "feedback", from: "Priya M.", message: "Love the custom perfume feature!", date: "5 hours ago" },
  { id: 3, type: "alert", from: "System", message: "Low stock alert: Sandalwood", date: "1 day ago" },
];

const Notifications = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-charcoal">Notifications & Feedback</h1>
        <p className="text-muted-foreground">Manage customer feedback and send broadcasts</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><MessageSquare className="w-5 h-5" />Recent Feedback</h3>
            <div className="space-y-4">
              {notifications.map((n) => (
                <div key={n.id} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{n.from}</span>
                    <span className="text-xs text-muted-foreground">{n.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{n.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Send className="w-5 h-5" />Broadcast Notification</h3>
            <Textarea placeholder="Write your message to all customers..." className="mb-4" rows={4} />
            <Button className="w-full"><Bell className="w-4 h-4 mr-2" />Send Broadcast</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
