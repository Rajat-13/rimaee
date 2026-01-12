import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, Package, Users, ShoppingCart, TrendingUp, 
  Settings, LogOut, Menu, X, DollarSign, Eye, ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logoImg from "@/assets/logo.png";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    { title: "Total Revenue", value: "₹2,45,890", change: "+12.5%", icon: DollarSign },
    { title: "Total Orders", value: "1,234", change: "+8.2%", icon: ShoppingCart },
    { title: "Total Customers", value: "5,678", change: "+15.3%", icon: Users },
    { title: "Page Views", value: "45,678", change: "+22.1%", icon: Eye },
  ];

  const recentOrders = [
    { id: "#ORD001", customer: "Rahul S.", product: "Sandal Veer 100ml", amount: "₹1,999", status: "Delivered" },
    { id: "#ORD002", customer: "Priya M.", product: "Flora Bliss 50ml", amount: "₹899", status: "Shipped" },
    { id: "#ORD003", customer: "Amit K.", product: "Ocean Breeze 8ml", amount: "₹599", status: "Processing" },
    { id: "#ORD004", customer: "Neha R.", product: "Purple Mystique 100ml", amount: "₹1,499", status: "Delivered" },
  ];

  const topProducts = [
    { name: "Sandal Veer", sales: 234, revenue: "₹4,67,766" },
    { name: "Flora Bliss", sales: 189, revenue: "₹1,69,911" },
    { name: "Ocean Breeze", sales: 156, revenue: "₹93,444" },
    { name: "Purple Mystique", sales: 143, revenue: "₹71,357" },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
        <img src={logoImg} alt="RIMAE" className="h-8" />
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-charcoal text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300`}>
          <div className="p-6 border-b border-white/10">
            <img src={logoImg} alt="RIMAE" className="h-10 invert" />
            <p className="text-xs text-white/60 mt-1">Admin Dashboard</p>
          </div>
          
          <nav className="p-4 space-y-2">
            {[
              { icon: LayoutDashboard, label: "Dashboard", active: true },
              { icon: Package, label: "Products" },
              { icon: ShoppingCart, label: "Orders" },
              { icon: Users, label: "Customers" },
              { icon: TrendingUp, label: "Analytics" },
              { icon: Settings, label: "Settings" },
            ].map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white transition-colors"
            >
              <LogOut size={20} />
              Back to Store
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-charcoal">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your store overview.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                      <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                        <ArrowUpRight size={14} />
                        {stat.change}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.customer} • {order.product}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{order.amount}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <p className="font-medium">{product.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{product.revenue}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
