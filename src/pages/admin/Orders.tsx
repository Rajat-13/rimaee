import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const orders = [
  {
    id: "#ORD-2024001",
    customer: "Rahul Sharma",
    email: "rahul.sharma@email.com",
    date: "2024-01-15",
    status: "Delivered",
    total: "₹2,499",
    items: [
      { name: "Custom Perfume - Sandalwood Musk", size: "50ml", price: "₹2,499", notes: ["Sandalwood", "Musk", "Amber"] },
    ],
  },
  {
    id: "#ORD-2024002",
    customer: "Priya Mehta",
    email: "priya.mehta@email.com",
    date: "2024-01-15",
    status: "Shipped",
    total: "₹899",
    items: [{ name: "Flora Bliss", size: "50ml", price: "₹899" }],
  },
  {
    id: "#ORD-2024003",
    customer: "Amit Kumar",
    email: "amit.kumar@email.com",
    date: "2024-01-14",
    status: "Processing",
    total: "₹3,199",
    items: [
      { name: "Custom Perfume - Oud Royal", size: "100ml", price: "₹3,199", notes: ["Oud", "Rose", "Saffron"] },
    ],
  },
  {
    id: "#ORD-2024004",
    customer: "Neha Reddy",
    email: "neha.reddy@email.com",
    date: "2024-01-14",
    status: "Pending",
    total: "₹1,999",
    items: [{ name: "Sandal Veer", size: "100ml", price: "₹1,999" }],
  },
  {
    id: "#ORD-2024005",
    customer: "Vikram Singh",
    email: "vikram.singh@email.com",
    date: "2024-01-13",
    status: "Cancelled",
    total: "₹599",
    items: [{ name: "Ocean Breeze", size: "8ml", price: "₹599" }],
  },
];

const statusColors: Record<string, string> = {
  Delivered: "bg-emerald-100 text-emerald-700",
  Shipped: "bg-blue-100 text-blue-700",
  Processing: "bg-amber-100 text-amber-700",
  Pending: "bg-gray-100 text-gray-700",
  Cancelled: "bg-red-100 text-red-700",
};

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-charcoal">Orders</h1>
          <p className="text-muted-foreground">Manage and track all customer orders</p>
        </div>
        <Button className="w-fit">
          <Download className="w-4 h-4 mr-2" />
          Export Orders
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Order ID</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Date</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Total</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                    <td className="py-4 px-4 text-sm font-medium">{order.id}</td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm font-medium">{order.customer}</p>
                        <p className="text-xs text-muted-foreground">{order.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground hidden md:table-cell">{order.date}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm font-semibold">{order.total}</td>
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>Update Status</DropdownMenuItem>
                          <DropdownMenuItem>Generate Invoice</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedOrder.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedOrder.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{selectedOrder.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[selectedOrder.status]}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Order Items</p>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                      {item.notes && (
                        <p className="text-sm text-muted-foreground">Notes: {item.notes.join(", ")}</p>
                      )}
                    </div>
                    <p className="font-semibold">{item.price}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 flex justify-between">
                <p className="font-semibold">Total</p>
                <p className="font-bold text-lg">{selectedOrder.total}</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">Generate Invoice</Button>
                <Button className="flex-1">Update Status</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
