import { useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Tag,
  Calendar,
  Percent,
  Users,
  X,
  Copy,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Coupon {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_amount: number;
  max_discount: number | null;
  usage_limit: number | null;
  used_count: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  created_at: string;
}

interface CouponUsage {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  order_id: string;
  discount_amount: number;
  used_at: string;
}

// Mock data
const mockCoupons: Coupon[] = [
  {
    id: "1",
    code: "RIMAENEW",
    discount_type: "percentage",
    discount_value: 20,
    min_order_amount: 500,
    max_discount: 500,
    usage_limit: 100,
    used_count: 45,
    valid_from: "2024-01-01",
    valid_until: "2024-12-31",
    is_active: true,
    created_at: "2024-01-01",
  },
  {
    id: "2",
    code: "WINTER50",
    discount_type: "fixed",
    discount_value: 50,
    min_order_amount: 300,
    max_discount: null,
    usage_limit: null,
    used_count: 120,
    valid_from: "2024-11-01",
    valid_until: "2025-02-28",
    is_active: true,
    created_at: "2024-11-01",
  },
  {
    id: "3",
    code: "FIRST10",
    discount_type: "percentage",
    discount_value: 10,
    min_order_amount: 0,
    max_discount: 200,
    usage_limit: 1000,
    used_count: 856,
    valid_from: "2024-01-01",
    valid_until: "2024-06-30",
    is_active: false,
    created_at: "2024-01-01",
  },
];

const mockUsage: CouponUsage[] = [
  {
    id: "1",
    user_id: "u1",
    user_name: "John Doe",
    user_email: "john@example.com",
    order_id: "ORD-001",
    discount_amount: 100,
    used_at: "2024-01-15",
  },
  {
    id: "2",
    user_id: "u2",
    user_name: "Jane Smith",
    user_email: "jane@example.com",
    order_id: "ORD-002",
    discount_amount: 150,
    used_at: "2024-01-16",
  },
  {
    id: "3",
    user_id: "u3",
    user_name: "Mike Johnson",
    user_email: "mike@example.com",
    order_id: "ORD-003",
    discount_amount: 200,
    used_at: "2024-01-17",
  },
];

const Coupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage" as "percentage" | "fixed",
    discount_value: 0,
    min_order_amount: 0,
    max_discount: 0,
    usage_limit: 0,
    valid_from: "",
    valid_until: "",
    is_active: true,
  });

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setFormData({
      code: "",
      discount_type: "percentage",
      discount_value: 0,
      min_order_amount: 0,
      max_discount: 0,
      usage_limit: 0,
      valid_from: "",
      valid_until: "",
      is_active: true,
    });
    setIsEditing(false);
    setIsCreateOpen(true);
  };

  const handleEdit = (coupon: Coupon) => {
    setFormData({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_order_amount: coupon.min_order_amount,
      max_discount: coupon.max_discount || 0,
      usage_limit: coupon.usage_limit || 0,
      valid_from: coupon.valid_from,
      valid_until: coupon.valid_until,
      is_active: coupon.is_active,
    });
    setSelectedCoupon(coupon);
    setIsEditing(true);
    setIsCreateOpen(true);
  };

  const handleView = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsViewOpen(true);
  };

  const handleDelete = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCoupon) {
      setCoupons(coupons.filter((c) => c.id !== selectedCoupon.id));
      toast.success("Coupon deleted successfully");
      setIsDeleteOpen(false);
      setSelectedCoupon(null);
    }
  };

  const handleSubmit = () => {
    if (!formData.code || !formData.valid_from || !formData.valid_until) {
      toast.error("Please fill all required fields");
      return;
    }

    if (isEditing && selectedCoupon) {
      setCoupons(
        coupons.map((c) =>
          c.id === selectedCoupon.id
            ? {
                ...c,
                ...formData,
                max_discount: formData.max_discount || null,
                usage_limit: formData.usage_limit || null,
              }
            : c
        )
      );
      toast.success("Coupon updated successfully");
    } else {
      const newCoupon: Coupon = {
        id: Date.now().toString(),
        ...formData,
        max_discount: formData.max_discount || null,
        usage_limit: formData.usage_limit || null,
        used_count: 0,
        created_at: new Date().toISOString().split("T")[0],
      };
      setCoupons([...coupons, newCoupon]);
      toast.success("Coupon created successfully");
    }

    setIsCreateOpen(false);
    setSelectedCoupon(null);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Coupon code copied!");
  };

  const toggleStatus = (couponId: string) => {
    setCoupons(
      coupons.map((c) =>
        c.id === couponId ? { ...c, is_active: !c.is_active } : c
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-charcoal">Coupons</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage discount coupons and promotions
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-charcoal hover:bg-charcoal/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Coupon
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{coupons.length}</p>
              <p className="text-xs text-muted-foreground">Total Coupons</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold">
                {coupons.filter((c) => c.is_active).length}
              </p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold">
                {coupons.reduce((acc, c) => acc + c.used_count, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Total Uses</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
              <Percent className="w-5 h-5 text-gold" />
            </div>
            <div>
              <p className="text-2xl font-semibold">₹12,450</p>
              <p className="text-xs text-muted-foreground">Total Savings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search coupons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Min Order</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Valid Until</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCoupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                      {coupon.code}
                    </code>
                    <button
                      onClick={() => copyCode(coupon.code)}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <Copy className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                </TableCell>
                <TableCell>
                  {coupon.discount_type === "percentage" ? (
                    <span>{coupon.discount_value}%</span>
                  ) : (
                    <span>₹{coupon.discount_value}</span>
                  )}
                </TableCell>
                <TableCell>₹{coupon.min_order_amount}</TableCell>
                <TableCell>
                  <span className="text-sm">
                    {coupon.used_count}
                    {coupon.usage_limit ? ` / ${coupon.usage_limit}` : ""}
                  </span>
                </TableCell>
                <TableCell>{coupon.valid_until}</TableCell>
                <TableCell>
                  <Switch
                    checked={coupon.is_active}
                    onCheckedChange={() => toggleStatus(coupon.id)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleView(coupon)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Coupon" : "Create New Coupon"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Coupon Code *</Label>
                <Input
                  placeholder="e.g., SUMMER20"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  className="mt-1 font-mono"
                />
              </div>
              <div>
                <Label>Discount Type</Label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(value: "percentage" | "fixed") =>
                    setFormData({ ...formData, discount_type: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Discount Value *</Label>
                <Input
                  type="number"
                  placeholder="10"
                  value={formData.discount_value || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discount_value: Number(e.target.value),
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Min Order Amount</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.min_order_amount || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      min_order_amount: Number(e.target.value),
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Max Discount (for %)</Label>
                <Input
                  type="number"
                  placeholder="500"
                  value={formData.max_discount || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_discount: Number(e.target.value),
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Usage Limit</Label>
                <Input
                  type="number"
                  placeholder="Unlimited"
                  value={formData.usage_limit || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usage_limit: Number(e.target.value),
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Valid From *</Label>
                <Input
                  type="date"
                  value={formData.valid_from}
                  onChange={(e) =>
                    setFormData({ ...formData, valid_from: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Valid Until *</Label>
                <Input
                  type="date"
                  value={formData.valid_until}
                  onChange={(e) =>
                    setFormData({ ...formData, valid_until: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
                <Label>Active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-charcoal hover:bg-charcoal/90">
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Coupon Details: {selectedCoupon?.code}
            </DialogTitle>
          </DialogHeader>
          {selectedCoupon && (
            <Tabs defaultValue="details" className="mt-4">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="usage">Usage History</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Discount</p>
                    <p className="font-semibold">
                      {selectedCoupon.discount_type === "percentage"
                        ? `${selectedCoupon.discount_value}%`
                        : `₹${selectedCoupon.discount_value}`}
                    </p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Min Order</p>
                    <p className="font-semibold">₹{selectedCoupon.min_order_amount}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Max Discount</p>
                    <p className="font-semibold">
                      {selectedCoupon.max_discount
                        ? `₹${selectedCoupon.max_discount}`
                        : "No limit"}
                    </p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Usage</p>
                    <p className="font-semibold">
                      {selectedCoupon.used_count}
                      {selectedCoupon.usage_limit
                        ? ` / ${selectedCoupon.usage_limit}`
                        : " (Unlimited)"}
                    </p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Valid From</p>
                    <p className="font-semibold">{selectedCoupon.valid_from}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Valid Until</p>
                    <p className="font-semibold">{selectedCoupon.valid_until}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg col-span-2">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge variant={selectedCoupon.is_active ? "default" : "secondary"}>
                      {selectedCoupon.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="usage" className="pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsage.map((usage) => (
                      <TableRow key={usage.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{usage.user_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {usage.user_email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm">{usage.order_id}</code>
                        </TableCell>
                        <TableCell>₹{usage.discount_amount}</TableCell>
                        <TableCell>{usage.used_at}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Coupon</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete coupon{" "}
            <strong>{selectedCoupon?.code}</strong>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Coupons;
