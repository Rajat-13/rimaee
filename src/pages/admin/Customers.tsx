import { useState } from "react";
import { 
  Search, 
  Eye, 
  Ban, 
  ShieldCheck, 
  MoreVertical, 
  Mail, 
  Phone,
  Package,
  Heart,
  MessageSquare,
  Star,
  Calendar,
  MapPin,
  Camera
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  status: string;
  orders: number;
  totalSpent: string;
  customPerfumes: number;
  joinedDate: string;
  lastOrder: string;
  addresses: { type: string; address: string }[];
  recentlyViewed: { name: string; image: string; viewedAt: string }[];
  reviews: { product: string; rating: number; status: string; date: string }[];
}

const customers: Customer[] = [
  {
    id: "USR001",
    name: "Rahul Sharma",
    email: "rahul.sharma@email.com",
    phone: "+91 98765 43210",
    avatar: "",
    role: "Customer",
    status: "Active",
    orders: 12,
    totalSpent: "₹15,499",
    customPerfumes: 3,
    joinedDate: "2023-06-15",
    lastOrder: "2024-01-15",
    addresses: [
      { type: "Home", address: "123, Green Park, New Delhi - 110016" },
      { type: "Office", address: "456, Tech Park, Gurgaon - 122001" },
    ],
    recentlyViewed: [
      { name: "Midnight Oud", image: "/placeholder.svg", viewedAt: "2 hours ago" },
      { name: "Rose Elixir", image: "/placeholder.svg", viewedAt: "Yesterday" },
      { name: "Amber Woods", image: "/placeholder.svg", viewedAt: "2 days ago" },
    ],
    reviews: [
      { product: "Midnight Oud", rating: 5, status: "approved", date: "Jan 15, 2024" },
      { product: "Rose Elixir", rating: 4, status: "pending", date: "Jan 10, 2024" },
    ],
  },
  {
    id: "USR002",
    name: "Priya Mehta",
    email: "priya.mehta@email.com",
    phone: "+91 87654 32109",
    avatar: "",
    role: "VIP",
    status: "Active",
    orders: 28,
    totalSpent: "₹45,890",
    customPerfumes: 8,
    joinedDate: "2023-03-20",
    lastOrder: "2024-01-14",
    addresses: [
      { type: "Home", address: "789, Marine Drive, Mumbai - 400020" },
    ],
    recentlyViewed: [
      { name: "Fresh Citrus", image: "/placeholder.svg", viewedAt: "3 hours ago" },
      { name: "Amber Woods", image: "/placeholder.svg", viewedAt: "1 day ago" },
    ],
    reviews: [
      { product: "Fresh Citrus", rating: 5, status: "approved", date: "Jan 12, 2024" },
    ],
  },
  {
    id: "USR003",
    name: "Amit Kumar",
    email: "amit.kumar@email.com",
    phone: "+91 76543 21098",
    avatar: "",
    role: "Customer",
    status: "Blocked",
    orders: 5,
    totalSpent: "₹8,499",
    customPerfumes: 1,
    joinedDate: "2023-09-10",
    lastOrder: "2024-01-10",
    addresses: [],
    recentlyViewed: [],
    reviews: [],
  },
  {
    id: "USR004",
    name: "Neha Reddy",
    email: "neha.reddy@email.com",
    phone: "+91 65432 10987",
    avatar: "",
    role: "Customer",
    status: "Active",
    orders: 7,
    totalSpent: "₹12,350",
    customPerfumes: 2,
    joinedDate: "2023-08-05",
    lastOrder: "2024-01-12",
    addresses: [
      { type: "Home", address: "321, Jubilee Hills, Hyderabad - 500033" },
    ],
    recentlyViewed: [
      { name: "Midnight Oud", image: "/placeholder.svg", viewedAt: "5 hours ago" },
    ],
    reviews: [
      { product: "Amber Woods", rating: 3, status: "rejected", date: "Jan 8, 2024" },
    ],
  },
];

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [profileTab, setProfileTab] = useState("overview");

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || customer.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-charcoal">Customers</h1>
        <p className="text-muted-foreground">Manage your customer base and view their activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Customers</p>
            <p className="text-2xl font-bold">5,678</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">VIP Members</p>
            <p className="text-2xl font-bold">234</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">New This Month</p>
            <p className="text-2xl font-bold">156</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Blocked</p>
            <p className="text-2xl font-bold">12</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Contact</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Orders</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Total Spent</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden xl:table-cell">Activity</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={customer.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-gold to-gold-light text-charcoal">
                            {customer.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                              customer.role === "VIP" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"
                            }`}>
                              {customer.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell">
                      <div className="space-y-1">
                        <p className="text-sm flex items-center gap-1">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          {customer.email}
                        </p>
                        <p className="text-sm flex items-center gap-1 text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {customer.phone}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                        customer.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm hidden lg:table-cell">{customer.orders}</td>
                    <td className="py-4 px-4 text-sm font-semibold hidden lg:table-cell">{customer.totalSpent}</td>
                    <td className="py-4 px-4 hidden xl:table-cell">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {customer.recentlyViewed.length}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {customer.reviews.length}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedCustomer(customer);
                            setProfileTab("overview");
                          }}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Full Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ShieldCheck className="w-4 h-4 mr-2" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Ban className="w-4 h-4 mr-2" />
                            {customer.status === "Active" ? "Block User" : "Unblock User"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Customer Profile Modal - Full Detail View */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Profile</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start gap-4 pb-4 border-b">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={selectedCustomer.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-gold to-gold-light text-charcoal text-xl">
                      {selectedCustomer.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 p-1.5 bg-charcoal text-white rounded-full">
                    <Camera className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold">{selectedCustomer.name}</h3>
                    <Badge variant={selectedCustomer.role === "VIP" ? "default" : "secondary"}>
                      {selectedCustomer.role}
                    </Badge>
                    <Badge variant={selectedCustomer.status === "Active" ? "default" : "destructive"}>
                      {selectedCustomer.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" /> {selectedCustomer.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" /> {selectedCustomer.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Joined {selectedCustomer.joinedDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabs for detailed info */}
              <Tabs value={profileTab} onValueChange={setProfileTab}>
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews ({selectedCustomer.reviews.length})</TabsTrigger>
                  <TabsTrigger value="addresses">Addresses</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="border-0 bg-muted/30">
                      <CardContent className="p-4 text-center">
                        <Package className="w-8 h-8 mx-auto text-gold mb-2" />
                        <p className="text-2xl font-bold">{selectedCustomer.orders}</p>
                        <p className="text-sm text-muted-foreground">Orders</p>
                      </CardContent>
                    </Card>
                    <Card className="border-0 bg-muted/30">
                      <CardContent className="p-4 text-center">
                        <span className="text-2xl mb-2 block">💰</span>
                        <p className="text-2xl font-bold">{selectedCustomer.totalSpent}</p>
                        <p className="text-sm text-muted-foreground">Total Spent</p>
                      </CardContent>
                    </Card>
                    <Card className="border-0 bg-muted/30">
                      <CardContent className="p-4 text-center">
                        <Heart className="w-8 h-8 mx-auto text-red-500 mb-2" />
                        <p className="text-2xl font-bold">{selectedCustomer.customPerfumes}</p>
                        <p className="text-sm text-muted-foreground">Custom Perfumes</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                  <h4 className="font-medium">Recently Viewed Products</h4>
                  {selectedCustomer.recentlyViewed.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4">
                      {selectedCustomer.recentlyViewed.map((item, i) => (
                        <div key={i} className="bg-muted/30 rounded-lg overflow-hidden">
                          <div className="aspect-square bg-gradient-to-br from-cream to-blush">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-3">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.viewedAt}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No recent activity</p>
                  )}
                </TabsContent>

                <TabsContent value="reviews" className="space-y-4">
                  <h4 className="font-medium">Customer Reviews & Feedback</h4>
                  {selectedCustomer.reviews.length > 0 ? (
                    <div className="space-y-3">
                      {selectedCustomer.reviews.map((review, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div>
                            <p className="font-medium">{review.product}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, j) => (
                                  <Star 
                                    key={j} 
                                    className={`w-4 h-4 ${j < review.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">{review.date}</span>
                            </div>
                          </div>
                          <Badge variant={
                            review.status === "approved" ? "default" : 
                            review.status === "pending" ? "secondary" : "destructive"
                          }>
                            {review.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No reviews yet</p>
                  )}
                </TabsContent>

                <TabsContent value="addresses" className="space-y-4">
                  <h4 className="font-medium">Saved Addresses</h4>
                  {selectedCustomer.addresses.length > 0 ? (
                    <div className="space-y-3">
                      {selectedCustomer.addresses.map((addr, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                          <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">{addr.type}</p>
                            <p className="text-sm text-muted-foreground">{addr.address}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No addresses saved</p>
                  )}
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" className="flex-1">View Orders</Button>
                <Button className="flex-1">Send Message</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
