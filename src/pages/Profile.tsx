import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Package, 
  Heart, 
  MessageSquare, 
  Eye, 
  Settings, 
  LogOut,
  Camera,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Star,
  Edit
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Mock data
const userProfile = {
  id: "USR001",
  name: "Rahul Sharma",
  email: "rahul.sharma@email.com",
  phone: "+91 98765 43210",
  avatar: "",
  memberSince: "June 2023",
  tier: "Gold",
  totalOrders: 12,
  totalSpent: "₹15,499",
  addresses: [
    {
      id: 1,
      type: "Home",
      address: "123, Green Park, New Delhi - 110016",
      isDefault: true,
    },
    {
      id: 2,
      type: "Office",
      address: "456, Tech Park, Gurgaon - 122001",
      isDefault: false,
    },
  ],
};

const recentlyViewed = [
  { id: 1, name: "Midnight Oud", image: "/placeholder.svg", price: 2499, viewedAt: "2 hours ago" },
  { id: 2, name: "Rose Elixir", image: "/placeholder.svg", price: 1899, viewedAt: "Yesterday" },
  { id: 3, name: "Amber Woods", image: "/placeholder.svg", price: 2199, viewedAt: "2 days ago" },
  { id: 4, name: "Fresh Citrus", image: "/placeholder.svg", price: 1599, viewedAt: "3 days ago" },
];

const myReviews = [
  {
    id: 1,
    productName: "Midnight Oud",
    productImage: "/placeholder.svg",
    rating: 5,
    comment: "Absolutely love this fragrance! The longevity is amazing and I get compliments every time I wear it.",
    date: "Jan 15, 2024",
    status: "approved",
  },
  {
    id: 2,
    productName: "Rose Elixir",
    productImage: "/placeholder.svg",
    rating: 4,
    comment: "Beautiful floral scent, perfect for daytime. Wish it lasted a bit longer though.",
    date: "Jan 10, 2024",
    status: "pending",
  },
];

const orders = [
  {
    id: "ORD-2024-001",
    date: "Jan 15, 2024",
    status: "Delivered",
    total: "₹4,398",
    items: 2,
  },
  {
    id: "ORD-2024-002",
    date: "Jan 8, 2024",
    status: "Processing",
    total: "₹2,499",
    items: 1,
  },
  {
    id: "ORD-2023-045",
    date: "Dec 20, 2023",
    status: "Delivered",
    total: "₹5,697",
    items: 3,
  },
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <PageTransition>
      <Header />
      <main className="min-h-screen bg-cream pt-32 pb-16">
        <div className="container-wide px-4">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal" />
              <CardContent className="relative px-6 pb-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 sm:-mt-12">
                  <div className="relative">
                    <Avatar className="w-28 h-28 border-4 border-white shadow-xl">
                      <AvatarImage src={userProfile.avatar} />
                      <AvatarFallback className="bg-gold text-charcoal text-2xl font-serif">
                        {userProfile.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <button className="absolute bottom-1 right-1 p-2 bg-charcoal text-white rounded-full hover:bg-charcoal/80 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 text-center sm:text-left pt-2 sm:pt-8">
                    <div className="flex items-center justify-center sm:justify-start gap-3">
                      <h1 className="text-2xl font-serif font-semibold">{userProfile.name}</h1>
                      <Badge className="bg-gradient-to-r from-gold to-gold-light text-charcoal">
                        {userProfile.tier} Member
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1">Member since {userProfile.memberSince}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white shadow-sm p-1 h-auto flex-wrap">
              <TabsTrigger value="overview" className="gap-2">
                <User className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2">
                <Package className="w-4 h-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="recently-viewed" className="gap-2">
                <Eye className="w-4 h-4" />
                Recently Viewed
              </TabsTrigger>
              <TabsTrigger value="reviews" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                My Reviews
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="gap-2">
                <Heart className="w-4 h-4" />
                Wishlist
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6 text-center">
                    <Package className="w-10 h-10 mx-auto text-gold mb-3" />
                    <p className="text-3xl font-bold">{userProfile.totalOrders}</p>
                    <p className="text-muted-foreground">Total Orders</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6 text-center">
                    <Heart className="w-10 h-10 mx-auto text-red-500 mb-3" />
                    <p className="text-3xl font-bold">8</p>
                    <p className="text-muted-foreground">Wishlist Items</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6 text-center">
                    <Star className="w-10 h-10 mx-auto text-amber-500 mb-3" />
                    <p className="text-3xl font-bold">{myReviews.length}</p>
                    <p className="text-muted-foreground">Reviews Written</p>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <Card className="border-0 shadow-sm md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <span>{userProfile.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <span>{userProfile.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <span>Member since {userProfile.memberSince}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Saved Addresses */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Saved Addresses</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {userProfile.addresses.map((addr) => (
                      <div key={addr.id} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-4 h-4 text-gold" />
                          <span className="font-medium text-sm">{addr.type}</span>
                          {addr.isDefault && (
                            <Badge variant="outline" className="text-xs">Default</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{addr.address}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.date} • {order.items} items</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{order.total}</p>
                          <Badge variant={order.status === "Delivered" ? "default" : "secondary"}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Recently Viewed Tab */}
            <TabsContent value="recently-viewed">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Recently Viewed Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {recentlyViewed.map((item) => (
                      <motion.div 
                        key={item.id}
                        whileHover={{ y: -5 }}
                        className="bg-muted/30 rounded-lg overflow-hidden cursor-pointer"
                      >
                        <div className="aspect-square bg-gradient-to-br from-cream to-blush">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3">
                          <p className="font-medium text-sm truncate">{item.name}</p>
                          <p className="text-gold font-semibold">₹{item.price}</p>
                          <p className="text-xs text-muted-foreground mt-1">{item.viewedAt}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>My Reviews & Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myReviews.map((review) => (
                      <div key={review.id} className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                        <div className="w-16 h-16 bg-gradient-to-br from-cream to-blush rounded-lg overflow-hidden flex-shrink-0">
                          <img src={review.productImage} alt={review.productName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">{review.productName}</p>
                            <Badge variant={review.status === "approved" ? "default" : "secondary"}>
                              {review.status === "approved" ? "Published" : "Pending Approval"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < review.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}`} 
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                          <p className="text-xs text-muted-foreground mt-2">{review.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>My Wishlist</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    Your wishlist items will appear here. Start exploring our collection!
                  </p>
                  <div className="text-center">
                    <Button>Browse Fragrances</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive order updates and promotions</p>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">Change Password</p>
                      <p className="text-sm text-muted-foreground">Update your account password</p>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">Delete Account</p>
                      <p className="text-sm text-muted-foreground">Permanently delete your account</p>
                    </div>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
};

export default Profile;
