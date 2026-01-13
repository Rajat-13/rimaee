import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";

const bottles = [
  { id: 1, size: "8ml", design: "Classic", price: 0, inventory: 500 },
  { id: 2, size: "50ml", design: "Modern", price: 200, inventory: 300 },
  { id: 3, size: "100ml", design: "Premium", price: 500, inventory: 150 },
];

const Products = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-charcoal">Products & Bottles</h1>
          <p className="text-muted-foreground">Manage bottle sizes, designs, and pricing</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" />Add Bottle</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {bottles.map((bottle) => (
          <Card key={bottle.id} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">🧴</span>
              </div>
              <h3 className="font-semibold text-lg">{bottle.size} - {bottle.design}</h3>
              <p className="text-primary font-bold">+₹{bottle.price}</p>
              <p className="text-sm text-muted-foreground">{bottle.inventory} in stock</p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1"><Edit className="w-4 h-4" /></Button>
                <Button variant="outline" size="sm" className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Products;
