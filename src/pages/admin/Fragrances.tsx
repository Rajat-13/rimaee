import { useState } from "react";
import { Search, Plus, Edit, Trash2, Eye, X, Upload, Save, ChevronLeft, ChevronRight, Image as ImageIcon, Users } from "lucide-react";
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
import { allProducts, categories, genderOptions, Product } from "@/data/products";

interface ExtendedProduct extends Product {
  type: "perfume" | "attar";
  sku: string;
  minOrderThreshold: number;
  stockQuantity: number;
  watchingCount: number;
  isActive: boolean;
  discount?: number;
}

// Extend existing products with new fields
const extendProducts = (products: Product[]): ExtendedProduct[] => {
  return products.map((p, i) => ({
    ...p,
    type: i % 3 === 0 ? "attar" : "perfume",
    sku: `RIM-${p.category.slice(0, 3).toUpperCase()}-${String(i + 1).padStart(4, "0")}`,
    minOrderThreshold: Math.floor(Math.random() * 10) + 5,
    stockQuantity: Math.floor(Math.random() * 100) + 10,
    watchingCount: Math.floor(Math.random() * 50),
    isActive: Math.random() > 0.2,
    discount: p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : undefined,
  }));
};

const ITEMS_PER_PAGE = 8;

const Fragrances = () => {
  const [products, setProducts] = useState<ExtendedProduct[]>(extendProducts(allProducts));
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ExtendedProduct | null>(null);
  const [viewingProduct, setViewingProduct] = useState<ExtendedProduct | null>(null);
  const [activeTab, setActiveTab] = useState("general");

  // Form state
  const [formData, setFormData] = useState<Partial<ExtendedProduct>>({
    name: "",
    slug: "",
    price: 0,
    originalPrice: undefined,
    discount: undefined,
    image: "",
    images: [],
    tag: "",
    gender: "unisex",
    category: "floral",
    type: "perfume",
    sku: "",
    minOrderThreshold: 5,
    stockQuantity: 50,
    watchingCount: 0,
    isActive: true,
    notes: { top: [], middle: [], base: [] },
    description: "",
    occasion: "",
    concentration: { sillage: 50, projection: 50, longevity: 50 },
  });

  const [additionalImages, setAdditionalImages] = useState<string[]>(["", "", ""]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesGender = genderFilter === "all" || product.gender === genderFilter;
    const matchesType = typeFilter === "all" || product.type === typeFilter;
    const matchesStatus = statusFilter === "all" || 
                          (statusFilter === "active" && product.isActive) ||
                          (statusFilter === "inactive" && !product.isActive);
    return matchesSearch && matchesCategory && matchesGender && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCreateNew = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      price: 0,
      originalPrice: undefined,
      discount: undefined,
      image: "",
      images: [],
      tag: "",
      gender: "unisex",
      category: "floral",
      type: "perfume",
      sku: `RIM-NEW-${String(products.length + 1).padStart(4, "0")}`,
      minOrderThreshold: 5,
      stockQuantity: 50,
      watchingCount: 0,
      isActive: true,
      notes: { top: [], middle: [], base: [] },
      description: "",
      occasion: "",
      concentration: { sillage: 50, projection: 50, longevity: 50 },
    });
    setAdditionalImages(["", "", ""]);
    setActiveTab("general");
    setIsDialogOpen(true);
  };

  const handleEdit = (product: ExtendedProduct) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setAdditionalImages([
      product.images[1] || "",
      product.images[2] || "",
      product.images[3] || "",
    ]);
    setActiveTab("general");
    setIsDialogOpen(true);
  };

  const handleView = (product: ExtendedProduct) => {
    setViewingProduct(product);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (productId: string) => {
    if (confirm("Are you sure you want to delete this fragrance?")) {
      setProducts(products.filter((p) => p.id !== productId));
    }
  };

  const handleToggleActive = (productId: string) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const handleSave = () => {
    const allImages = [formData.image, ...additionalImages].filter(Boolean) as string[];
    
    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id ? { ...p, ...formData, images: allImages } as ExtendedProduct : p
        )
      );
    } else {
      const newProduct: ExtendedProduct = {
        ...formData,
        id: Date.now().toString(),
        slug: formData.name?.toLowerCase().replace(/\s+/g, "-") || "",
        images: allImages,
      } as ExtendedProduct;
      setProducts([...products, newProduct]);
    }
    setIsDialogOpen(false);
  };

  const handleNotesChange = (type: "top" | "middle" | "base", value: string) => {
    setFormData({
      ...formData,
      notes: {
        ...formData.notes!,
        [type]: value.split(",").map((s) => s.trim()).filter(Boolean),
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-charcoal">Fragrances</h1>
          <p className="text-muted-foreground">Manage all your perfume and attar products</p>
        </div>
        <Button onClick={handleCreateNew} className="gap-2">
          <Plus className="w-4 h-4" />
          Add New Product
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or SKU..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setCurrentPage(1); }}>
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="perfume">Perfume</SelectItem>
            <SelectItem value="attar">Attar</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setCurrentPage(1); }}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={genderFilter} onValueChange={(v) => { setGenderFilter(v); setCurrentPage(1); }}>
          <SelectTrigger>
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            {genderOptions.map((g) => (
              <SelectItem key={g.id} value={g.id}>
                {g.name}
              </SelectItem>
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
          Showing {paginatedProducts.length} of {filteredProducts.length} products
        </span>
        <span className="text-muted-foreground">|</span>
        <span className="text-green-600">{products.filter(p => p.isActive).length} Active</span>
        <span className="text-red-500">{products.filter(p => !p.isActive).length} Inactive</span>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">Product</th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">Type</th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">SKU</th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">Price</th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">Stock</th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">Min Order</th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">Watching</th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                        {product.images.length > 1 && (
                          <span className="absolute -bottom-1 -right-1 bg-charcoal text-white text-xs px-1.5 py-0.5 rounded">
                            +{product.images.length - 1}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-charcoal">{product.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{product.category} • {product.gender.replace("-", " ")}</p>
                        {product.tag && (
                          <Badge variant="outline" className="text-xs mt-1">{product.tag}</Badge>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge 
                      variant="outline" 
                      className={`capitalize ${product.type === 'attar' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}
                    >
                      {product.type}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <code className="text-xs bg-muted px-2 py-1 rounded">{product.sku}</code>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium">₹{product.price}</p>
                      {product.originalPrice && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice}</span>
                          <span className="text-xs text-green-600">-{product.discount}%</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`font-medium ${product.stockQuantity < product.minOrderThreshold ? 'text-red-500' : 'text-charcoal'}`}>
                      {product.stockQuantity}
                    </span>
                    {product.stockQuantity < product.minOrderThreshold && (
                      <p className="text-xs text-red-500">Low stock!</p>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="text-sm">{product.minOrderThreshold}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{product.watchingCount}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Switch
                      checked={product.isActive}
                      onCheckedChange={() => handleToggleActive(product.id)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleView(product)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No fragrances found matching your filters.
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
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
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded text-sm transition-colors ${
                      currentPage === page
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
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

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {editingProduct ? `Last updated: ${new Date().toLocaleDateString()}` : "Fill in the product details"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingProduct ? "Update" : "Publish"}
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Images */}
              <div className="space-y-6">
                {/* Cover Image */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Cover Image</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-4 bg-muted/30">
                    {formData.image ? (
                      <div className="relative">
                        <img
                          src={formData.image}
                          alt="Cover"
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <button
                          onClick={() => setFormData({ ...formData, image: "" })}
                          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="aspect-square flex flex-col items-center justify-center text-muted-foreground">
                        <ImageIcon className="w-12 h-12 mb-2" />
                        <p className="text-sm">Add cover image</p>
                      </div>
                    )}
                  </div>
                  <Input
                    value={formData.image || ""}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Enter image URL"
                    className="mt-2"
                  />
                </div>

                {/* Additional Images */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Additional Images (up to 3)</label>
                  <div className="grid grid-cols-3 gap-3">
                    {additionalImages.map((img, index) => (
                      <div key={index} className="border-2 border-dashed border-border rounded-lg p-2 bg-muted/30">
                        {img ? (
                          <div className="relative">
                            <img
                              src={img}
                              alt={`Image ${index + 2}`}
                              className="w-full aspect-square object-cover rounded"
                            />
                            <button
                              onClick={() => {
                                const newImages = [...additionalImages];
                                newImages[index] = "";
                                setAdditionalImages(newImages);
                              }}
                              className="absolute top-1 right-1 p-0.5 bg-white rounded-full shadow"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="aspect-square flex flex-col items-center justify-center text-muted-foreground">
                            <Plus className="w-6 h-6" />
                          </div>
                        )}
                        <Input
                          value={img}
                          onChange={(e) => {
                            const newImages = [...additionalImages];
                            newImages[index] = e.target.value;
                            setAdditionalImages(newImages);
                          }}
                          placeholder="URL"
                          className="mt-1 text-xs h-8"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visibility */}
                <div className="bg-muted/30 rounded-xl p-4">
                  <h4 className="font-medium mb-2">Visibility</h4>
                  <p className="text-sm text-muted-foreground mb-3">Control product visibility for customers</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active</span>
                    <Switch
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="space-y-6">
                <div className="bg-white border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Product Details</h4>
                    <Badge variant="outline">
                      Status: {formData.isActive ? "Active" : "Draft"}
                    </Badge>
                  </div>

                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-2 mb-4">
                      <TabsTrigger value="general">General</TabsTrigger>
                      <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Product Name *</label>
                        <Input
                          value={formData.name || ""}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Royal Oudh Perfume"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Type *</label>
                          <Select
                            value={formData.type || "perfume"}
                            onValueChange={(v) => setFormData({ ...formData, type: v as "perfume" | "attar" })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="perfume">Perfume</SelectItem>
                              <SelectItem value="attar">Attar (Alcohol-free)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">SKU *</label>
                          <Input
                            value={formData.sku || ""}
                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            placeholder="RIM-XXX-0001"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Category *</label>
                          <Select
                            value={formData.category || "floral"}
                            onValueChange={(v) => setFormData({ ...formData, category: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Gender *</label>
                          <Select
                            value={formData.gender || "unisex"}
                            onValueChange={(v) => setFormData({ ...formData, gender: v as any })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {genderOptions.map((g) => (
                                <SelectItem key={g.id} value={g.id}>
                                  {g.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Price (₹) *</label>
                          <Input
                            type="number"
                            value={formData.price || 0}
                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Discount (%)</label>
                          <Input
                            type="number"
                            value={formData.discount || ""}
                            onChange={(e) => {
                              const discount = e.target.value ? Number(e.target.value) : undefined;
                              const originalPrice = discount && formData.price 
                                ? Math.round(formData.price / (1 - discount / 100)) 
                                : undefined;
                              setFormData({ ...formData, discount, originalPrice });
                            }}
                            placeholder="e.g. 15"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          value={formData.description || ""}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Write a short description highlighting key benefits and features"
                          rows={3}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="advanced" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Stock Quantity</label>
                          <Input
                            type="number"
                            value={formData.stockQuantity || 0}
                            onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Min Order Threshold</label>
                          <Input
                            type="number"
                            value={formData.minOrderThreshold || 5}
                            onChange={(e) => setFormData({ ...formData, minOrderThreshold: Number(e.target.value) })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Tag</label>
                          <Select
                            value={formData.tag || "none"}
                            onValueChange={(v) => setFormData({ ...formData, tag: v === "none" ? undefined : v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No Tag</SelectItem>
                              <SelectItem value="Bestseller">Bestseller</SelectItem>
                              <SelectItem value="Sale">Sale</SelectItem>
                              <SelectItem value="Premium">Premium</SelectItem>
                              <SelectItem value="New">New</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Occasion</label>
                          <Input
                            value={formData.occasion || ""}
                            onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                            placeholder="e.g., Evening, Daily Wear"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium">Fragrance Notes</h4>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Top Notes</label>
                            <Input
                              value={formData.notes?.top?.join(", ") || ""}
                              onChange={(e) => handleNotesChange("top", e.target.value)}
                              placeholder="Rose, Jasmine, Bergamot"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Middle Notes</label>
                            <Input
                              value={formData.notes?.middle?.join(", ") || ""}
                              onChange={(e) => handleNotesChange("middle", e.target.value)}
                              placeholder="Peony, Lily, Violet"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Base Notes</label>
                            <Input
                              value={formData.notes?.base?.join(", ") || ""}
                              onChange={(e) => handleNotesChange("base", e.target.value)}
                              placeholder="Musk, Cedar, Vanilla"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium">Concentration Levels</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Sillage (%)</label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={formData.concentration?.sillage || 50}
                              onChange={(e) => setFormData({
                                ...formData,
                                concentration: { ...formData.concentration!, sillage: Number(e.target.value) }
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Projection (%)</label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={formData.concentration?.projection || 50}
                              onChange={(e) => setFormData({
                                ...formData,
                                concentration: { ...formData.concentration!, projection: Number(e.target.value) }
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Longevity (%)</label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={formData.concentration?.longevity || 50}
                              onChange={(e) => setFormData({
                                ...formData,
                                concentration: { ...formData.concentration!, longevity: Number(e.target.value) }
                              })}
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>

          {viewingProduct && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img
                  src={viewingProduct.image}
                  alt={viewingProduct.name}
                  className="w-full aspect-square object-cover rounded-xl"
                />
                {viewingProduct.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {viewingProduct.images.slice(1).map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`${viewingProduct.name} ${i + 2}`}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{viewingProduct.name}</h3>
                    <p className="text-muted-foreground">{viewingProduct.sku}</p>
                  </div>
                  <Badge variant={viewingProduct.isActive ? "default" : "secondary"}>
                    {viewingProduct.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={viewingProduct.type === 'attar' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}>
                    {viewingProduct.type}
                  </Badge>
                  <Badge variant="outline">{viewingProduct.category}</Badge>
                  <Badge variant="outline">{viewingProduct.gender.replace("-", " ")}</Badge>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">₹{viewingProduct.price}</span>
                  {viewingProduct.originalPrice && (
                    <>
                      <span className="text-muted-foreground line-through">₹{viewingProduct.originalPrice}</span>
                      <span className="text-green-600 text-sm">-{viewingProduct.discount}%</span>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="bg-muted/50 p-3 rounded-lg text-center">
                    <p className="text-muted-foreground">Stock</p>
                    <p className="font-semibold">{viewingProduct.stockQuantity}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg text-center">
                    <p className="text-muted-foreground">Min Order</p>
                    <p className="font-semibold">{viewingProduct.minOrderThreshold}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg text-center">
                    <p className="text-muted-foreground">Watching</p>
                    <p className="font-semibold">{viewingProduct.watchingCount}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{viewingProduct.description}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Fragrance Notes</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Top:</span> {viewingProduct.notes.top.join(", ")}</p>
                    <p><span className="text-muted-foreground">Middle:</span> {viewingProduct.notes.middle.join(", ")}</p>
                    <p><span className="text-muted-foreground">Base:</span> {viewingProduct.notes.base.join(", ")}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      handleEdit(viewingProduct);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleDelete(viewingProduct.id);
                      setIsViewDialogOpen(false);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Fragrances;
