import { useState } from "react";
import { 
  Search, 
  Check, 
  X, 
  Star, 
  Eye, 
  Trash2, 
  Filter,
  Image as ImageIcon,
  MessageSquare
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Review {
  id: string;
  customerName: string;
  customerEmail: string;
  customerAvatar: string;
  productName: string;
  productImage: string;
  productType: "fragrance" | "accessory";
  rating: number;
  title: string;
  comment: string;
  images: string[];
  date: string;
  status: "pending" | "approved" | "rejected";
  replyText?: string;
}

const mockReviews: Review[] = [
  {
    id: "REV001",
    customerName: "Rahul Sharma",
    customerEmail: "rahul@email.com",
    customerAvatar: "",
    productName: "Midnight Oud",
    productImage: "/placeholder.svg",
    productType: "fragrance",
    rating: 5,
    title: "Absolutely Amazing!",
    comment: "This is hands down the best oud fragrance I've ever tried. The longevity is incredible - easily lasts 10+ hours. The scent profile evolves beautifully throughout the day. Worth every penny!",
    images: ["/placeholder.svg", "/placeholder.svg"],
    date: "2024-01-15",
    status: "pending",
  },
  {
    id: "REV002",
    customerName: "Priya Mehta",
    customerEmail: "priya@email.com",
    customerAvatar: "",
    productName: "Rose Elixir",
    productImage: "/placeholder.svg",
    productType: "fragrance",
    rating: 4,
    title: "Beautiful but short-lasting",
    comment: "The scent is gorgeous, very romantic and elegant. However, I wish it lasted a bit longer on my skin. Still a great purchase overall.",
    images: [],
    date: "2024-01-14",
    status: "approved",
  },
  {
    id: "REV003",
    customerName: "Amit Kumar",
    customerEmail: "amit@email.com",
    customerAvatar: "",
    productName: "Leather Perfume Case",
    productImage: "/placeholder.svg",
    productType: "accessory",
    rating: 5,
    title: "Premium Quality",
    comment: "The leather quality is excellent. Fits my 50ml bottles perfectly. The stitching is impeccable and it looks very luxurious.",
    images: ["/placeholder.svg"],
    date: "2024-01-13",
    status: "pending",
  },
  {
    id: "REV004",
    customerName: "Neha Reddy",
    customerEmail: "neha@email.com",
    customerAvatar: "",
    productName: "Amber Woods",
    productImage: "/placeholder.svg",
    productType: "fragrance",
    rating: 3,
    title: "Not for me",
    comment: "The fragrance is nice but it's too strong for my taste. The amber note is quite overpowering. Would recommend for those who like intense perfumes.",
    images: [],
    date: "2024-01-12",
    status: "rejected",
  },
];

const ReviewsAdmin = () => {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = 
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || review.status === statusFilter;
    const matchesType = typeFilter === "all" || review.productType === typeFilter;
    const matchesTab = activeTab === "all" || review.status === activeTab;
    return matchesSearch && matchesStatus && matchesType && matchesTab;
  });

  const pendingCount = reviews.filter(r => r.status === "pending").length;
  const approvedCount = reviews.filter(r => r.status === "approved").length;
  const rejectedCount = reviews.filter(r => r.status === "rejected").length;

  const handleApprove = (reviewId: string) => {
    setReviews(reviews.map(r => 
      r.id === reviewId ? { ...r, status: "approved" as const } : r
    ));
    toast.success("Review approved and published");
  };

  const handleReject = (reviewId: string) => {
    setReviews(reviews.map(r => 
      r.id === reviewId ? { ...r, status: "rejected" as const } : r
    ));
    toast.success("Review rejected");
  };

  const handleDelete = (reviewId: string) => {
    setReviews(reviews.filter(r => r.id !== reviewId));
    toast.success("Review deleted");
  };

  const handleReply = () => {
    if (selectedReview && replyText.trim()) {
      setReviews(reviews.map(r =>
        r.id === selectedReview.id ? { ...r, replyText } : r
      ));
      toast.success("Reply added to review");
      setReplyText("");
      setSelectedReview(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-charcoal">
          Reviews & Feedback
        </h1>
        <p className="text-muted-foreground">
          Moderate customer reviews for products and accessories
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <MessageSquare className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{reviews.length}</p>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Filter className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Check className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{approvedCount}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <X className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rejectedCount}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs & Filters */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="all">All ({reviews.length})</TabsTrigger>
            <TabsTrigger value="pending" className="text-yellow-600">
              Pending ({pendingCount})
            </TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedCount})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedCount})</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Product type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="fragrance">Fragrances</SelectItem>
                <SelectItem value="accessory">Accessories</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              {filteredReviews.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No reviews found matching your criteria
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredReviews.map((review) => (
                    <div key={review.id} className="p-4 hover:bg-muted/20 transition-colors">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-16 h-16 bg-gradient-to-br from-cream to-blush rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={review.productImage} 
                            alt={review.productName} 
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Review Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium">{review.title}</p>
                                <Badge variant={
                                  review.status === "approved" ? "default" : 
                                  review.status === "pending" ? "secondary" : "destructive"
                                }>
                                  {review.status}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {review.productType}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                <Avatar className="w-5 h-5">
                                  <AvatarFallback className="text-[10px]">
                                    {review.customerName.split(" ").map(n => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{review.customerName}</span>
                                <span>•</span>
                                <span>{review.productName}</span>
                                <span>•</span>
                                <span>{review.date}</span>
                              </div>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating 
                                      ? "text-amber-500 fill-amber-500" 
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {review.comment}
                          </p>

                          {/* Images if any */}
                          {review.images.length > 0 && (
                            <div className="flex gap-2 mb-3">
                              {review.images.map((img, i) => (
                                <div key={i} className="w-12 h-12 bg-muted rounded-lg overflow-hidden">
                                  <img src={img} alt="" className="w-full h-full object-cover" />
                                </div>
                              ))}
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <ImageIcon className="w-3 h-3" />
                                {review.images.length} image(s)
                              </span>
                            </div>
                          )}

                          {/* Reply if exists */}
                          {review.replyText && (
                            <div className="bg-muted/50 p-3 rounded-lg text-sm mb-3">
                              <p className="text-xs font-medium text-muted-foreground mb-1">Your Reply:</p>
                              <p>{review.replyText}</p>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            {review.status === "pending" && (
                              <>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleApprove(review.id)}
                                  className="bg-emerald-600 hover:bg-emerald-700"
                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleReject(review.id)}
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedReview(review)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View & Reply
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(review.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Detail Dialog */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          
          {selectedReview && (
            <div className="space-y-4">
              {/* Customer & Product Info */}
              <div className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="w-20 h-20 bg-gradient-to-br from-cream to-blush rounded-lg overflow-hidden">
                  <img 
                    src={selectedReview.productImage} 
                    alt={selectedReview.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{selectedReview.productName}</p>
                  <Badge variant="outline" className="mt-1">{selectedReview.productType}</Badge>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Avatar className="w-5 h-5">
                      <AvatarFallback className="text-[10px]">
                        {selectedReview.customerName.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{selectedReview.customerName}</span>
                    <span>({selectedReview.customerEmail})</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < selectedReview.rating 
                            ? "text-amber-500 fill-amber-500" 
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{selectedReview.date}</p>
                </div>
              </div>

              {/* Review Content */}
              <div>
                <h4 className="font-medium mb-2">{selectedReview.title}</h4>
                <p className="text-muted-foreground">{selectedReview.comment}</p>
              </div>

              {/* Review Images */}
              {selectedReview.images.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Attached Images</p>
                  <div className="flex gap-2">
                    {selectedReview.images.map((img, i) => (
                      <div key={i} className="w-24 h-24 bg-muted rounded-lg overflow-hidden">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing Reply */}
              {selectedReview.replyText && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">Your Reply</p>
                  <p className="text-muted-foreground">{selectedReview.replyText}</p>
                </div>
              )}

              {/* Reply Form */}
              <div>
                <p className="text-sm font-medium mb-2">
                  {selectedReview.replyText ? "Update Reply" : "Add Reply"}
                </p>
                <Textarea
                  placeholder="Write a response to this review..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            {selectedReview?.status === "pending" && (
              <>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    handleReject(selectedReview.id);
                    setSelectedReview(null);
                  }}
                >
                  Reject Review
                </Button>
                <Button 
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => {
                    handleApprove(selectedReview.id);
                    setSelectedReview(null);
                  }}
                >
                  Approve Review
                </Button>
              </>
            )}
            <Button onClick={handleReply} disabled={!replyText.trim()}>
              {selectedReview?.replyText ? "Update Reply" : "Submit Reply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewsAdmin;
