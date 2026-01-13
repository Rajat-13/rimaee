import { useState } from "react";
import { Search, Plus, Edit, Trash2, ToggleLeft, ToggleRight, Upload } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ingredients = {
  top: [
    { id: 1, name: "Bergamot", category: "Citrus", strength: "Light", longevity: "1-2 hrs", inventory: 150, enabled: true, price: 50 },
    { id: 2, name: "Grapefruit", category: "Citrus", strength: "Light", longevity: "1-2 hrs", inventory: 200, enabled: true, price: 45 },
    { id: 3, name: "Cardamom", category: "Spice", strength: "Medium", longevity: "2-3 hrs", inventory: 80, enabled: true, price: 75 },
    { id: 4, name: "Pink Pepper", category: "Spice", strength: "Light", longevity: "1-2 hrs", inventory: 120, enabled: true, price: 60 },
  ],
  middle: [
    { id: 5, name: "Rose", category: "Floral", strength: "Medium", longevity: "4-6 hrs", inventory: 100, enabled: true, price: 120 },
    { id: 6, name: "Jasmine", category: "Floral", strength: "Strong", longevity: "5-7 hrs", inventory: 90, enabled: true, price: 150 },
    { id: 7, name: "Lavender", category: "Floral", strength: "Medium", longevity: "3-5 hrs", inventory: 180, enabled: true, price: 80 },
    { id: 8, name: "Iris", category: "Floral", strength: "Light", longevity: "4-6 hrs", inventory: 60, enabled: false, price: 200 },
  ],
  base: [
    { id: 9, name: "Sandalwood", category: "Woody", strength: "Strong", longevity: "8-12 hrs", inventory: 12, enabled: true, price: 180 },
    { id: 10, name: "Oud", category: "Woody", strength: "Strong", longevity: "10-24 hrs", inventory: 45, enabled: true, price: 350 },
    { id: 11, name: "Vanilla", category: "Sweet", strength: "Medium", longevity: "6-8 hrs", inventory: 200, enabled: true, price: 90 },
    { id: 12, name: "Musk", category: "Animal", strength: "Strong", longevity: "8-12 hrs", inventory: 150, enabled: true, price: 100 },
  ],
};

const Ingredients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("top");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const currentIngredients = ingredients[activeTab as keyof typeof ingredients].filter((ing) =>
    ing.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-charcoal">
            Perfume Ingredients
          </h1>
          <p className="text-muted-foreground">Manage fragrance notes and inventory</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Ingredient
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Ingredient</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input placeholder="Ingredient name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="citrus">Citrus</SelectItem>
                      <SelectItem value="floral">Floral</SelectItem>
                      <SelectItem value="woody">Woody</SelectItem>
                      <SelectItem value="spice">Spice</SelectItem>
                      <SelectItem value="sweet">Sweet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Note Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Top Note</SelectItem>
                      <SelectItem value="middle">Middle Note</SelectItem>
                      <SelectItem value="base">Base Note</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Strength</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select strength" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="strong">Strong</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Price (₹)</Label>
                  <Input type="number" placeholder="Price per unit" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Inventory Quantity</Label>
                <Input type="number" placeholder="Quantity in stock" />
              </div>
              <div className="space-y-2">
                <Label>Image</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button className="flex-1">Add Ingredient</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Top Notes</p>
            <p className="text-2xl font-bold">{ingredients.top.length}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Middle Notes</p>
            <p className="text-2xl font-bold">{ingredients.middle.length}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Base Notes</p>
            <p className="text-2xl font-bold">{ingredients.base.length}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-amber-50">
          <CardContent className="p-4">
            <p className="text-sm text-amber-700">Low Stock Items</p>
            <p className="text-2xl font-bold text-amber-700">3</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="top">Top Notes</TabsTrigger>
                <TabsTrigger value="middle">Middle Notes</TabsTrigger>
                <TabsTrigger value="base">Base Notes</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search ingredients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Strength</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Longevity</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Inventory</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentIngredients.map((ingredient) => (
                  <tr key={ingredient.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                    <td className="py-3 px-4 font-medium">{ingredient.name}</td>
                    <td className="py-3 px-4 text-sm">{ingredient.category}</td>
                    <td className="py-3 px-4 text-sm hidden md:table-cell">{ingredient.strength}</td>
                    <td className="py-3 px-4 text-sm hidden md:table-cell">{ingredient.longevity}</td>
                    <td className="py-3 px-4 text-sm font-medium">₹{ingredient.price}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                        ingredient.inventory < 50 ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {ingredient.inventory} units
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-muted-foreground hover:text-foreground">
                        {ingredient.enabled ? (
                          <ToggleRight className="w-6 h-6 text-emerald-500" />
                        ) : (
                          <ToggleLeft className="w-6 h-6" />
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Ingredients;
