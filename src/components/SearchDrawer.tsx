import { useState, useEffect } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { productRepository, FrontendProduct } from "@/repositories/productRepository";

interface SearchDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const popularSearches = [
  "Vanilla perfume",
  "Oud collection",
  "Floral fragrances",
  "Gift sets",
  "Men's cologne",
  "Summer scents",
];

const SearchDrawer = ({ open, onOpenChange }: SearchDrawerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FrontendProduct[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<FrontendProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch trending products on mount
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const products = await productRepository.list();
        // Get first 3 products as trending
        setTrendingProducts(products.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch trending products:", err);
      }
    };
    if (open) {
      fetchTrending();
    }
  }, [open]);

  // Search products when query changes
  useEffect(() => {
    const searchProducts = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      
      setLoading(true);
      try {
        const results = await productRepository.search(searchQuery);
        setSearchResults(results.slice(0, 5));
      } catch (err) {
        console.error("Failed to search products:", err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleProductClick = (slug: string) => {
    onOpenChange(false);
    navigate(`/products/${slug}`);
  };

  const displayProducts = searchQuery.trim() ? searchResults : trendingProducts;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[85vh]">
        <div className="mx-auto w-full max-w-3xl">
          <DrawerHeader className="border-b">
            <div className="flex items-center justify-between">
              <DrawerTitle className="font-serif text-xl">Search</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-5 w-5" />
                </Button>
              </DrawerClose>
            </div>
            
            {/* Search Input */}
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for perfumes, collections, ingredients..."
                className="pl-10 pr-4 py-6 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          </DrawerHeader>
          
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {/* Popular Searches */}
            {!searchQuery.trim() && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                  Popular Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSearch(term)}
                      className="px-4 py-2 bg-muted rounded-full text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Products */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                {searchQuery.trim() ? `Results for "${searchQuery}"` : "Trending Now"}
              </h3>
              
              {loading && (
                <div className="text-center py-4 text-muted-foreground">
                  Searching...
                </div>
              )}
              
              {!loading && displayProducts.length === 0 && searchQuery.trim() && (
                <div className="text-center py-4 text-muted-foreground">
                  No products found
                </div>
              )}
              
              <div className="space-y-4">
                {displayProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product.slug)}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors group w-full text-left"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">₹{product.price}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SearchDrawer;
