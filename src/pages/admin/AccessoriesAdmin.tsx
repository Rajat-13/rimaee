import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Eye, Save, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAccessoriesViewModel } from "@/viewmodels/accessoriesViewModel";
import { Accessory } from "@/models/accessory";

const categoriesList = ["travel", "gift", "display", "sample", "storage", "refill"];
const ITEMS_PER_PAGE = 8;

const AccessoriesAdmin = () => {
  const { accessories, loading, saveAccessory, deleteAccessory } = useAccessoriesViewModel();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingAccessory, setEditingAccessory] = useState<Accessory | null>(null);
  const [viewingAccessory, setViewingAccessory] = useState<Accessory | null>(null);
  const [activeTab, setActiveTab] = useState("general");

  const [formData, setFormData] = useState<Partial<Accessory>>({
    name: "",
    sku: "",
    price: 0,
    originalPrice: undefined,
    image: "",
    images: [],
    description: "",
    category: "travel",
    stockQuantity: 50,
    minOrderThreshold: 5,
    isActive: true,
    tag: "",
  });

  const [additionalImages, setAdditionalImages] = useState<string[]>(["", "", ""]);

  const filteredAccessories = accessories.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || 
                          (statusFilter === "active" && item.isActive) ||
                          (statusFilter === "inactive" && !item.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredAccessories.length / ITEMS_PER_PAGE);
  const paginatedAccessories = filteredAccessories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCreateNew = () => {
    setEditingAccessory(null);
    setFormData({
      name: "",
      sku: `ACC-NEW-${String(accessories.length + 1).padStart(4, "0")}`,
      price: 0,
      originalPrice: undefined,
      image: "",
      images: [],
      description: "",
      category: "travel",
      stockQuantity: 50,
      minOrderThreshold: 5,
      isActive: true,
      tag: "",
    });
    setAdditionalImages(["", "", ""]);
    setActiveTab("general");
    setIsDialogOpen(true);
  };

  const handleEdit = (accessory: Accessory) => {
    setEditingAccessory(accessory);
    setFormData({ ...accessory });
    setAdditionalImages([
      accessory.images[1] || "",
      accessory.images[2] || "",
      accessory.images[3] || "",
    ]);
    setActiveTab("general");
    setIsDialogOpen(true);
  };

  const handleView = (accessory: Accessory) => {
    setViewingAccessory(accessory);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (accessory: Accessory) => {
    if (confirm("Are you sure you want to delete this accessory?")) {
      deleteAccessory(accessory.slug);
    }
  };

  const handleToggleActive = (accessory: Accessory) => {
    saveAccessory({ ...accessory, isActive: !accessory.isActive }, accessory.slug);
  };

  const handleSave = async () => {
    const allImages = [formData.image, ...additionalImages].filter(Boolean) as string[];
    
    const dataToSave: Partial<Accessory> = {
      ...formData,
      images: allImages,
      image: allImages[0] || "",
    };
    
    await saveAccessory(dataToSave, editingAccessory?.slug);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-charcoal">Accessories</h1>
          <p className="text-muted-foreground">Manage all accessory products</p>
        </div>
        <Button onClick={handleCreateNew} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Accessory
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or SKU..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setCurrentPage(1); }}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categoriesList.map((cat) => (
              <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm">
        <span className="text-muted-foreground">
          Showing {paginatedAccessories.length} of {filteredAccessories.length} accessories
        </span>
        <span className="text-muted-foreground">|</span>
        <span className="text-green-600">{accessories.filter(a => a.isActive).length} Active</span>
        <span className="text-red-500">{accessories.filter(a => !a.isActive).length} Inactive</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">Product</th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">Category</th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">SKU</th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">Price</th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">Stock</th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    Loading accessories...
                  </td>
                </tr>
              ) : paginatedAccessories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No accessories found matching your filters.
                  </td>
                </tr>
              ) : (
                paginatedAccessories.map((item) => (
                  <tr key={item.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-charcoal">{item.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                          {item.tag && <Badge variant="outline" className="text-xs mt-1">{item.tag}</Badge>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="capitalize">{item.category}</Badge>
                    </td>
                    <td className="p-4">
                      <code className="text-xs bg-muted px-2 py-1 rounded">{item.sku}</code>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">₹{item.price}</p>
                        {item.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">₹{item.originalPrice}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`font-medium ${item.stockQuantity < item.minOrderThreshold ? 'text-red-500' : 'text-charcoal'}`}>
                        {item.stockQuantity}
                      </span>
                      {item.stockQuantity < item.minOrderThreshold && (
                        <p className="text-xs text-red-500">Low stock!</p>
                      )}
                    </td>
                    <td className="p-4">
                      <Switch
                        checked={item.isActive}
                        onCheckedChange={() => handleToggleActive(item)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleView(item)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <p className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {editingAccessory ? "Edit Accessory" : "Add New Accessory"}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Perfume Atomizer"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>SKU *</Label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="ACC-ATM-0001"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this accessory..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => setFormData({ ...formData, category: v })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesList.map((cat) => (
                        <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tag (optional)</Label>
                  <Input
                    value={formData.tag || ""}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="Best Seller, New, etc."
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Price (₹) *</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Original Price (₹)</Label>
                  <Input
                    type="number"
                    value={formData.originalPrice || ""}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) || undefined })}
                    placeholder="Leave empty if no discount"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(v) => setFormData({ ...formData, isActive: v })}
                />
                <Label>{formData.isActive ? "Active" : "Inactive"}</Label>
              </div>
            </TabsContent>

            <TabsContent value="images" className="space-y-4 mt-4">
              <div>
                <Label>Main Image URL</Label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1"
                />
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {additionalImages.map((url, idx) => (
                  <div key={idx}>
                    <Label>Additional Image {idx + 1}</Label>
                    <Input
                      value={url}
                      onChange={(e) => {
                        const newImgs = [...additionalImages];
                        newImgs[idx] = e.target.value;
                        setAdditionalImages(newImgs);
                      }}
                      placeholder="URL"
                      className="mt-1"
                    />
                    {url && (
                      <img src={url} alt={`Preview ${idx + 1}`} className="mt-1 w-20 h-20 object-cover rounded" />
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-4 mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Stock Quantity</Label>
                  <Input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Low Stock Threshold</Label>
                  <Input
                    type="number"
                    value={formData.minOrderThreshold}
                    onChange={(e) => setFormData({ ...formData, minOrderThreshold: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {editingAccessory ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {viewingAccessory?.name}
            </DialogTitle>
          </DialogHeader>
          
          {viewingAccessory && (
            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <div>
                <img
                  src={viewingAccessory.image}
                  alt={viewingAccessory.name}
                  className="w-full aspect-square object-cover rounded-lg"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">SKU</Label>
                  <p className="font-mono">{viewingAccessory.sku}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Category</Label>
                  <p className="capitalize">{viewingAccessory.category}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Price</Label>
                  <p className="text-xl font-bold">₹{viewingAccessory.price}</p>
                  {viewingAccessory.originalPrice && (
                    <p className="text-muted-foreground line-through">₹{viewingAccessory.originalPrice}</p>
                  )}
                </div>
                <div>
                  <Label className="text-muted-foreground">Stock</Label>
                  <p>{viewingAccessory.stockQuantity} units</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge variant={viewingAccessory.isActive ? "default" : "secondary"}>
                    {viewingAccessory.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="text-sm">{viewingAccessory.description}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccessoriesAdmin;
