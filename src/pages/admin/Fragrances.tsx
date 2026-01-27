import { useState, useEffect } from "react";
import {
  Search, Plus, Edit, Trash2, Save, Image as ImageIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { categories, genderOptions } from "@/data/products";
import { useFragrancesViewModel } from "@/viewmodels/fragrancesViewModel";
import { Fragrance, ProductVariant } from "@/models/fragrance";

const ITEMS_PER_PAGE = 8;

const Fragrances = () => {
  const { fragrances, loading, error, saveFragrance, deleteFragrance } = useFragrancesViewModel();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Fragrance | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [additionalImages, setAdditionalImages] = useState<string[]>(["", "", ""]);

  const [formData, setFormData] = useState<Partial<Fragrance>>({
    name: "",
    images: [""],
    tag: undefined,
    gender: "unisex",
    category: "Floral",
    type: "perfume",
    sku: "",
    maxOrderThreshold: 5,
    stockID: 50,
    isActive: true,
    notes: { top: [], heart: [], base: [] },
    description: "",
    occasion: "",
    concentration: { sillage: 50, projection: 50, longevity: 50 },
    variants: [
      { size: "8ml", mrp: 0, discount: 0, price: 0 },
      { size: "50ml", mrp: 0, discount: 0, price: 0 },
      { size: "100ml", mrp: 0, discount: 0, price: 0 },
    ],
  });

  // --- Filtered & Paginated Products ---
  const filteredProducts = fragrances.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesGender = genderFilter === "all" || product.gender === genderFilter;
    const matchesType = typeFilter === "all" || product.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || (statusFilter === "active" ? product.isActive : !product.isActive);
    return matchesSearch && matchesCategory && matchesGender && matchesType && matchesStatus;
  });

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // --- Handlers ---
  const handleVariantChange = (index: number, field: "mrp" | "discount", value: number) => {
    if (!formData.variants) return;
    const newVariants = [...formData.variants];
    const variant = { ...newVariants[index], [field]: value };
    variant.price = Math.round(variant.mrp * (1 - variant.discount / 100));
    newVariants[index] = variant;
    setFormData({ ...formData, variants: newVariants });
  };

const handleSave = () => {
  // Ensure images
  const allImages = [formData.images?.[0] || "", ...additionalImages].filter(Boolean);

  // Ensure concentration and notes exist
  const safeFormData: Fragrance = {
    ...formData,
    images: allImages,
    notes: {
      top: formData.notes?.top || [],
      heart: formData.notes?.heart || [],
      base: formData.notes?.base || [],
    },
    concentration: {
      sillage: formData.concentration?.sillage ?? 50,
      projection: formData.concentration?.projection ?? 50,
      longevity: formData.concentration?.longevity ?? 50,
    },
    variants: formData.variants?.map(v => ({
      size: v.size,
      mrp: v.mrp || 0,
      discount: v.discount || 0,
      price: v.price || Math.round((v.mrp || 0) * (1 - (v.discount || 0) / 100)),
    })) || [],
    isActive: formData.isActive ?? true,
    category: formData.category || "Floral",
    gender: formData.gender || "unisex",
    type: formData.type || "perfume",
    sku: formData.sku || "",
    maxOrderThreshold: formData.maxOrderThreshold || 5,
    stockID: formData.stockID || 0,
    tag: formData.tag,
    description: formData.description || "",
    occasion: formData.occasion || "",
  };

  // Save using ViewModel
  saveFragrance(safeFormData, editingProduct?.id);

  // Close dialog
  setIsDialogOpen(false);

  // Reset editing
  setEditingProduct(null);
};


  const handleEdit = (product: Fragrance) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setAdditionalImages([
      product.images?.[1] || "",
      product.images?.[2] || "",
      product.images?.[3] || "",
    ]);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif font-semibold">Fragrances</h1>
        <Button
          onClick={() => { setEditingProduct(null); setIsDialogOpen(true); }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="perfume">Perfume</SelectItem>
            <SelectItem value="attar">Attar</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Floral">Floral</SelectItem>
            <SelectItem value="Woody">Woody</SelectItem>
            <SelectItem value="Fresh">Fresh</SelectItem>
            <SelectItem value="Oriental">Oriental</SelectItem>
            <SelectItem value="Citrus">Citrus</SelectItem>
            <SelectItem value="Gourmand">Gourmand</SelectItem>
            <SelectItem value="Leather">Leather</SelectItem>
          </SelectContent>
        </Select>
        <Select value={genderFilter} onValueChange={setGenderFilter}>
          <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            {genderOptions.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="p-4 text-left font-medium uppercase text-[10px]">Image</th>
                <th className="p-4 text-left font-medium uppercase text-[10px]">Product Name</th>
                <th className="p-4 text-left font-medium uppercase text-[10px]">SKU ID</th>
                <th className="p-4 text-left font-medium uppercase text-[10px]">Tags</th>
                <th className="p-4 text-left font-medium uppercase text-[10px]">Gender</th>
                <th className="p-4 text-left font-medium uppercase text-[10px]">Type</th>
                <th className="p-4 text-left font-medium uppercase text-[10px]">Category</th>
                <th className="p-4 text-left font-medium uppercase text-[10px]">Status</th>
                <th className="p-4 text-right font-medium uppercase text-[10px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-4"><img src={product.images?.[0]} className="w-10 h-10 rounded object-cover" /></td>
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4 font-mono text-xs">{product.sku}</td>
                  <td className="p-4">{product.tag && <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{product.tag}</Badge>}</td>
                  <td className="p-4 capitalize">{product.gender}</td>
                  <td className="p-4 capitalize">{product.type}</td>
                  <td className="p-4 capitalize">{product.category}</td>
                  <td className="p-4">
                    <Switch
                      checked={product.isActive}
                      onCheckedChange={(checked) =>
                        saveFragrance({ ...product, isActive: checked }, product.id)
                      }
                    />
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteFragrance(product.id)}><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-0 flex flex-row justify-between items-center">
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" /> Save</Button>
            </div>
          </DialogHeader>

          <div className="p-6 grid lg:grid-cols-2 gap-8">
            {/* Media */}
            <div className="space-y-6">
              <label className="text-sm font-medium mb-2 block">Cover Image</label>
              <div className="border-2 border-dashed rounded-xl p-4 bg-muted/30 aspect-square flex items-center justify-center overflow-hidden">
                {formData.images?.[0] ? <img src={formData.images[0]} className="w-full h-full object-cover" /> : <ImageIcon className="w-10 h-10 text-muted-foreground" />}
              </div>
              <Input
                value={formData.images?.[0] || ""}
                onChange={(e) => setFormData({ ...formData, images: [e.target.value, ...additionalImages] })}
                placeholder="Paste main image URL"
                className="mt-2"
              />
              <div className="grid grid-cols-3 gap-2 mt-4">
                {additionalImages.map((url, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="h-20 bg-muted/50 rounded flex items-center justify-center border overflow-hidden">
                      {url ? <img src={url} className="h-full w-full object-cover" /> : <ImageIcon className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    <Input value={url} onChange={(e) => {
                      const newImgs = [...additionalImages];
                      newImgs[idx] = e.target.value;
                      setAdditionalImages(newImgs);
                    }} placeholder="URL" className="text-[10px] h-7" />
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>

                {/* General */}
                <TabsContent value="general" className="space-y-4 pt-4">
                  <Input placeholder="Product Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  <div className="grid grid-cols-2 gap-4">
                    <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as any })}>
                      <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="perfume">Perfume</SelectItem>
                        <SelectItem value="attar">Attar</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="SKU" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                      <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Floral">Floral</SelectItem>
                        <SelectItem value="Woody">Woody</SelectItem>
                        <SelectItem value="Fresh">Fresh</SelectItem>
                        <SelectItem value="Oriental">Oriental</SelectItem>
                        <SelectItem value="Citrus">Citrus</SelectItem>
                        <SelectItem value="Gourmand">Gourmand</SelectItem>
                        <SelectItem value="Leather">Leather</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={formData.gender} onValueChange={(v) => setFormData({ ...formData, gender: v as any })}>
                      <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
                      <SelectContent>{genderOptions.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>

                  {/* Variants */}
                  <div className="space-y-2 border-t pt-4">
                    <h4 className="text-[10px] font-bold uppercase text-muted-foreground">Pricing (8ml, 50ml, 100ml)</h4>
                    {formData.variants?.map((v, idx) => (
                      <div key={v.size} className="grid grid-cols-4 gap-2 items-center">
                        <Badge variant="outline" className="h-8 justify-center text-[10px]">{v.size}</Badge>
                        <Input type="number" placeholder="MRP" value={v.mrp || ""} onChange={(e) => handleVariantChange(idx, "mrp", Number(e.target.value))} className="h-8 text-xs" />
                        <Input type="number" placeholder="%" value={v.discount || ""} onChange={(e) => handleVariantChange(idx, "discount", Number(e.target.value))} className="h-8 text-xs" />
                        <div className="h-8 flex items-center justify-center font-bold text-green-700 bg-green-50 rounded border text-[10px]">₹{v.price}</div>
                      </div>
                    ))}
                  </div>

                  <Textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />

                 {/* Notes */}
                 <div className="space-y-2 border-t pt-4">
                   <h4 className="text-[10px] font-bold uppercase text-muted-foreground">Notes</h4>

                   {/* Top Notes */}
                   <Input
                     placeholder="Top Notes"
                     value={formData.notes?.top?.join(", ") || ""}
                     onChange={(e) => {
                       setFormData({
                         ...formData,
                         notes: {
                           top: e.target.value.split(",").map(n => n.trim()), // split and trim
                           heart: formData.notes?.heart || [],
                           base: formData.notes?.base || [],
                         },
                       });
                     }}
                   />

                   {/* Heart Notes */}
                   <Input
                     placeholder="Heart Notes"
                     value={formData.notes?.heart?.join(", ") || ""}
                     onChange={(e) => {
                       setFormData({
                         ...formData,
                         notes: {
                           top: formData.notes?.top || [],
                           heart: e.target.value.split(",").map(n => n.trim()),
                           base: formData.notes?.base || [],
                         },
                       });
                     }}
                   />

                   {/* Base Notes */}
                   <Input
                     placeholder="Base Notes"
                     value={formData.notes?.base?.join(", ") || ""}
                     onChange={(e) => {
                       setFormData({
                         ...formData,
                         notes: {
                           top: formData.notes?.top || [],
                           heart: formData.notes?.heart || [],
                           base: e.target.value.split(",").map(n => n.trim()),
                         },
                       });
                     }}
                   />
                 </div>


                  {/* Active toggle */}
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-[10px] font-medium">Active</span>
                    <Switch checked={formData.isActive} onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })} />
                  </div>
                </TabsContent>

              {/* Advanced */}
              <TabsContent value="advanced" className="space-y-5 pt-4">
                {/* Stock / Max Order */}
                <label className="text-sm font-small mb-2">please add Stock ID and Max order quantity</label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Stock ID"
                    value={formData.stockID || 0}
                    onChange={(e) => setFormData({ ...formData, stockID: Number(e.target.value) })}
                  />
                  <Input
                    type="number"
                    placeholder="Max Order"
                    value={formData.maxOrderThreshold || 0}
                    onChange={(e) => setFormData({ ...formData, maxOrderThreshold: Number(e.target.value) })}
                  />
                </div>

                {/* Tag / Occasion */}
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    value={formData.tag || "none"}
                    onValueChange={(v) => setFormData({ ...formData, tag: v === "none" ? undefined : v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Tag</SelectItem>
                      <SelectItem value="Bestseller">Bestseller</SelectItem>
                      <SelectItem value="Sale">Sale</SelectItem>
                      <SelectItem value="New">New</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Occasion"
                    value={formData.occasion || ""}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                  />
                </div>

                {/* Concentration sliders */}
                <div className="space-y-4 bg-muted/20 p-4 rounded-xl border">
                  <h4 className="text-[10px] font-bold uppercase text-muted-foreground">Concentration Levels (%)</h4>
                  {["sillage", "projection", "longevity"].map((level) => (
                    <div key={level} className="space-y-1">
                      <p className="text-[10px] capitalize">{level}</p>
                      <Slider
                        value={[formData.concentration?.[level as keyof typeof formData.concentration] ?? 50]}
                        max={100}
                        step={1}
                        onValueChange={(val) =>
                          setFormData({
                            ...formData,
                            concentration: {
                              sillage: formData.concentration?.sillage ?? 50,
                              projection: formData.concentration?.projection ?? 50,
                              longevity: formData.concentration?.longevity ?? 50,
                              [level]: val[0],
                            },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>

                {/* Notes */}
                <div className="space-y-2 border-t pt-4">
                  <h4 className="text-[10px] font-bold uppercase text-muted-foreground">Notes</h4>
                  {["top", "heart", "base"].map((noteType) => (
                    <Input
                      key={noteType}
                      placeholder={noteType === "heart" ? "Heart Notes" : `${noteType.charAt(0).toUpperCase() + noteType.slice(1)} Notes`}
                      value={formData.notes?.[noteType as keyof typeof formData.notes]?.join(", ") || ""}
                      onChange={(e) => {
                        const newNotes = { ...formData.notes } || { top: [], heart: [], base: [] };
                        newNotes[noteType as keyof typeof newNotes] = e.target.value.split(",").map((n) => n.trim());
                        setFormData({ ...formData, notes: newNotes });
                      }}
                    />
                  ))}
                </div>

                {/* Active / Inactive Switch */}
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.isActive ?? true}
                    onCheckedChange={(v) => setFormData({ ...formData, isActive: v })}
                  />
                  <span className="text-xs">{formData.isActive ? "Active" : "Inactive"}</span>
                </div>
              </TabsContent>


              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Fragrances;
