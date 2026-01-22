import {
  DollarSign,
  ShoppingCart,
  Users,
  Beaker,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Package,
  Truck,
  CreditCard,
  Percent,
  RotateCcw,
  Building2,
  Calculator,
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
  PieChart,
  Pie,
  Cell,
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

const orderStatusData = [
  { name: "Delivered", value: 45, color: "#10b981" },
  { name: "Shipped", value: 25, color: "#3b82f6" },
  { name: "Processing", value: 20, color: "#f59e0b" },
  { name: "Pending", value: 10, color: "#6b7280" },
];

const unitEconomics = [
  { component: "Selling Price", amount: 799, explanation: "Price charged to customer (no GST included)", isPositive: true },
  { component: "Net Revenue (Realisation)", amount: 799, explanation: "No GST, so the full amount is revenue", isPositive: true },
  { component: "(-) COGS", amount: 199, explanation: "Manufacturing + packaging", isPositive: false },
  { component: "Gross Margin", amount: 600, explanation: "₹799 - ₹199", isPositive: true, isTotal: true },
  { component: "(-) Marketing Cost (CAC)", amount: 200, explanation: "Cost to acquire a customer", isPositive: false },
  { component: "(-) Logistics/Shipping", amount: 60, explanation: "Courier partner charges", isPositive: false },
  { component: "(-) Platform & Payment Fees", amount: 24, explanation: "~3% of ₹799 (Razorpay)", isPositive: false },
  { component: "(-) Return & Replacements", amount: 20, explanation: "Estimated cost of refunds/replacements (~2.5%)", isPositive: false },
  { component: "Contribution Margin", amount: 296, explanation: "₹600 - (200 + 60 + 24 + 20)", isPositive: true, isTotal: true },
  { component: "(-) Fixed Ops & Team Cost", amount: 50, explanation: "Salaries, rent, CRM tools, etc.", isPositive: false },
  { component: "EBITDA", amount: 246, explanation: "CM - Fixed Ops", isPositive: true, isTotal: true },
  { component: "EBITDA %", amount: "30.79%", explanation: "₹246 ÷ ₹799 × 100", isPositive: true, isPercentage: true },
];

const recentOrders = [
  { id: "#ORD-2024001", customer: "Rahul Sharma", amount: "₹2,499", status: "Delivered", date: "2h ago" },
  { id: "#ORD-2024002", customer: "Priya Mehta", amount: "₹899", status: "Shipped", date: "4h ago" },
  { id: "#ORD-2024003", customer: "Amit Kumar", amount: "₹3,199", status: "Processing", date: "6h ago" },
  { id: "#ORD-2024004", customer: "Neha Reddy", amount: "₹1,999", status: "Pending", date: "8h ago" },
];

const Dashboard = () => {
  const stats = [
    {
      title: "Total Revenue",
      value: "₹8,45,890",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Total Orders",
      value: "1,234",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Active Customers",
      value: "5,678",
      change: "+15.3%",
      trend: "up",
      icon: Users,
      color: "from-violet-500 to-violet-600",
    },
    {
      title: "Avg. Order Value",
      value: "₹685",
      change: "+4.1%",
      trend: "up",
      icon: TrendingUp,
      color: "from-amber-500 to-amber-600",
    },
  ];

  const quickMetrics = [
    { label: "COGS", value: "₹1,99,000", icon: Package, color: "text-blue-600 bg-blue-50" },
    { label: "CAC", value: "₹200", icon: Users, color: "text-violet-600 bg-violet-50" },
    { label: "Shipping Cost", value: "₹74,040", icon: Truck, color: "text-amber-600 bg-amber-50" },
    { label: "Platform Fees", value: "₹25,376", icon: CreditCard, color: "text-pink-600 bg-pink-50" },
    { label: "Return Rate", value: "2.5%", icon: RotateCcw, color: "text-red-600 bg-red-50" },
    { label: "Gross Margin", value: "75.1%", icon: Percent, color: "text-emerald-600 bg-emerald-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-charcoal">Dashboard</h1>
          <p className="text-muted-foreground">Business overview & unit economics</p>
        </div>
        <div className="flex items-center gap-2 text-sm bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full">
          <TrendingUp className="w-4 h-4" />
          <span className="font-medium">Healthy margins</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 lg:p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs lg:text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-xl lg:text-2xl font-bold text-charcoal">{stat.value}</p>
                  <div className={`flex items-center gap-1 text-xs ${stat.trend === "up" ? "text-emerald-600" : "text-red-500"}`}>
                    {stat.trend === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {quickMetrics.map((metric) => (
          <div key={metric.label} className="bg-white rounded-lg p-3 shadow-sm border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-7 h-7 rounded-lg ${metric.color} flex items-center justify-center`}>
                <metric.icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs text-muted-foreground">{metric.label}</span>
            </div>
            <p className="text-sm font-bold text-charcoal">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Unit Economics Table */}
        <Card className="lg:col-span-3 border-0 shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">Unit Economics</CardTitle>
              <p className="text-xs text-muted-foreground">Per order breakdown</p>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-charcoal/10">
                    <th className="text-left py-2 font-semibold text-charcoal">Component</th>
                    <th className="text-right py-2 font-semibold text-charcoal w-24">Amount (₹)</th>
                    <th className="text-left py-2 font-semibold text-charcoal pl-4 hidden md:table-cell">Explanation</th>
                  </tr>
                </thead>
                <tbody>
                  {unitEconomics.map((row, index) => (
                    <tr 
                      key={index} 
                      className={`border-b border-border/50 ${row.isTotal ? 'bg-muted/50 font-semibold' : ''}`}
                    >
                      <td className={`py-2.5 ${row.isTotal ? 'text-charcoal font-medium' : 'text-muted-foreground'}`}>
                        {row.isTotal && <span className="text-emerald-600 mr-1">✓</span>}
                        {row.component}
                      </td>
                      <td className={`py-2.5 text-right font-medium ${
                        row.isTotal 
                          ? 'text-emerald-600' 
                          : row.isPositive 
                            ? 'text-charcoal' 
                            : 'text-red-500'
                      }`}>
                        {row.isPercentage ? row.amount : typeof row.amount === 'number' ? row.amount.toLocaleString() : row.amount}
                      </td>
                      <td className="py-2.5 pl-4 text-xs text-muted-foreground hidden md:table-cell">
                        {row.explanation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Order Status Pie + Recent Orders */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <ResponsiveContainer width={120} height={120}>
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={55}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 pl-4 space-y-2">
                  {orderStatusData.map((status) => (
                    <div key={status.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: status.color }} />
                        <span className="text-muted-foreground">{status.name}</span>
                      </div>
                      <span className="font-medium">{status.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders Mini */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-medium">Recent Orders</CardTitle>
              <a href="/admin/orders" className="text-xs text-primary hover:underline">View all</a>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{order.amount}</p>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
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
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888" fontSize={11} />
                <YAxis stroke="#888" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="hsl(345, 60%, 30%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(345, 60%, 30%)", strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Profit Breakdown */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Profit Breakdown (per ₹799 order)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart 
                data={[
                  { name: "COGS", value: 199, fill: "#ef4444" },
                  { name: "CAC", value: 200, fill: "#f97316" },
                  { name: "Logistics", value: 60, fill: "#eab308" },
                  { name: "Fees", value: 24, fill: "#84cc16" },
                  { name: "Returns", value: 20, fill: "#22c55e" },
                  { name: "Fixed Ops", value: 50, fill: "#14b8a6" },
                  { name: "Profit", value: 246, fill: "#10b981" },
                ]}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#888" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#888" fontSize={10} width={60} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`₹${value}`, '']}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {[
                    { fill: "#ef4444" },
                    { fill: "#f97316" },
                    { fill: "#eab308" },
                    { fill: "#84cc16" },
                    { fill: "#22c55e" },
                    { fill: "#14b8a6" },
                    { fill: "#10b981" },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
