import {
  DollarSign,
  ShoppingCart,
  Users,
  Beaker,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4500 },
  { name: "May", sales: 6000 },
  { name: "Jun", sales: 5500 },
  { name: "Jul", sales: 7000 },
];

const fragranceData = [
  { name: "Sandalwood + Musk", count: 245 },
  { name: "Rose + Vanilla", count: 198 },
  { name: "Oud + Amber", count: 167 },
  { name: "Lavender + Cedar", count: 134 },
  { name: "Jasmine + Bergamot", count: 112 },
];

const recentOrders = [
  { id: "#ORD-2024001", customer: "Rahul Sharma", product: "Custom Perfume - Sandalwood Musk", amount: "₹2,499", status: "Delivered", date: "2 hours ago" },
  { id: "#ORD-2024002", customer: "Priya Mehta", product: "Flora Bliss 50ml", amount: "₹899", status: "Shipped", date: "4 hours ago" },
  { id: "#ORD-2024003", customer: "Amit Kumar", product: "Custom Perfume - Oud Royal", amount: "₹3,199", status: "Processing", date: "6 hours ago" },
  { id: "#ORD-2024004", customer: "Neha Reddy", product: "Sandal Veer 100ml", amount: "₹1,999", status: "Pending", date: "8 hours ago" },
  { id: "#ORD-2024005", customer: "Vikram Singh", product: "Ocean Breeze 8ml", amount: "₹599", status: "Delivered", date: "1 day ago" },
];

const alerts = [
  { type: "warning", message: "Low stock alert: Sandalwood base note (12 units left)", icon: AlertTriangle },
  { type: "info", message: "5 pending orders require attention", icon: Clock },
  { type: "success", message: "Revenue up 15% compared to last week", icon: TrendingUp },
];

const Dashboard = () => {
  const stats = [
    {
      title: "Total Orders",
      value: "1,234",
      change: "+12.5%",
      trend: "up",
      icon: ShoppingCart,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Total Revenue",
      value: "₹8,45,890",
      change: "+8.2%",
      trend: "up",
      icon: DollarSign,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Total Users",
      value: "5,678",
      change: "+15.3%",
      trend: "up",
      icon: Users,
      color: "from-violet-500 to-violet-600",
    },
    {
      title: "Custom Perfumes",
      value: "892",
      change: "-2.1%",
      trend: "down",
      icon: Beaker,
      color: "from-amber-500 to-amber-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-charcoal">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your store overview.</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Last updated:</span>
          <span className="font-medium">Just now</span>
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-2">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg ${
              alert.type === "warning"
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : alert.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}
          >
            <alert.icon className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{alert.message}</span>
          </div>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-charcoal">{stat.value}</p>
                  <div className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-emerald-600" : "text-red-500"}`}>
                    {stat.trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span>{stat.change}</span>
                    <span className="text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="hsl(345, 60%, 30%)"
                  strokeWidth={3}
                  dot={{ fill: "hsl(345, 60%, 30%)", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Fragrance Combinations */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Top Fragrance Combinations</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={fragranceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#888" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#888" fontSize={11} width={120} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="hsl(43, 60%, 50%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Recent Orders</CardTitle>
          <a href="/admin/orders" className="text-sm text-primary hover:underline">
            View all
          </a>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Order ID</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden md:table-cell">Product</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="py-3 px-2 text-sm font-medium">{order.id}</td>
                    <td className="py-3 px-2 text-sm">{order.customer}</td>
                    <td className="py-3 px-2 text-sm text-muted-foreground hidden md:table-cell">{order.product}</td>
                    <td className="py-3 px-2 text-sm font-medium">{order.amount}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === "Delivered"
                            ? "bg-emerald-100 text-emerald-700"
                            : order.status === "Shipped"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "Processing"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm text-muted-foreground text-right hidden sm:table-cell">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
