import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const payments = [
  { id: "TXN001", order: "#ORD-2024001", customer: "Rahul S.", amount: "₹2,499", status: "Success", date: "2024-01-15" },
  { id: "TXN002", order: "#ORD-2024002", customer: "Priya M.", amount: "₹899", status: "Success", date: "2024-01-15" },
  { id: "TXN003", order: "#ORD-2024003", customer: "Amit K.", amount: "₹3,199", status: "Failed", date: "2024-01-14" },
  { id: "TXN004", order: "#ORD-2024004", customer: "Neha R.", amount: "₹1,999", status: "Refunded", date: "2024-01-14" },
];

const Payments = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-charcoal">Payments & Revenue</h1>
          <p className="text-muted-foreground">Track transactions and download reports</p>
        </div>
        <Button><Download className="w-4 h-4 mr-2" />Export CSV</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Revenue</p><p className="text-2xl font-bold">₹8,45,890</p></CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Successful</p><p className="text-2xl font-bold text-emerald-600">1,198</p></CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Refunded</p><p className="text-2xl font-bold text-amber-600">₹12,450</p></CardContent></Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <table className="w-full">
            <thead><tr className="border-b bg-muted/30"><th className="text-left p-4 text-sm">Transaction ID</th><th className="text-left p-4 text-sm">Order</th><th className="text-left p-4 text-sm">Customer</th><th className="text-left p-4 text-sm">Amount</th><th className="text-left p-4 text-sm">Status</th><th className="text-left p-4 text-sm">Date</th></tr></thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="p-4 text-sm font-medium">{p.id}</td>
                  <td className="p-4 text-sm">{p.order}</td>
                  <td className="p-4 text-sm">{p.customer}</td>
                  <td className="p-4 text-sm font-semibold">{p.amount}</td>
                  <td className="p-4"><span className={`px-2 py-1 text-xs rounded-full ${p.status === "Success" ? "bg-emerald-100 text-emerald-700" : p.status === "Failed" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{p.status}</span></td>
                  <td className="p-4 text-sm text-muted-foreground">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;
