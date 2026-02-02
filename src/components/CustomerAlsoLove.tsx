import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { allProducts } from "@/data/products";
import { productRepository, FrontendProduct } from "@/repositories/productRepository";

interface CustomerAlsoLoveProps {
  currentProductSlug?: string;
  currentProductCategory?: string;
}

const CustomerAlsoLove = ({ currentProductSlug, currentProductCategory }: CustomerAlsoLoveProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [apiProducts, setApiProducts] = useState<FrontendProduct[]>([]);
  
  // Fetch products from API filtered by category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productRepository.list();
        if (data.length > 0) {
          // Filter by category if available
          let filtered = data.filter(p => p.slug !== currentProductSlug);
          
          if (currentProductCategory) {
            const sameCategory = filtered.filter(
              p => p.category?.toLowerCase() === currentProductCategory.toLowerCase()
            );
            // If we have products in the same category, use those, otherwise use all
            if (sameCategory.length >= 4) {
              filtered = sameCategory;
            }
          }
          
          setApiProducts(filtered.slice(0, 8));
        }
      } catch (err) {
        console.error("Failed to fetch related products:", err);
      }
    };
    fetchProducts();
  }, [currentProductSlug, currentProductCategory]);

  // Convert to common product format
  const toProductFormat = (p: FrontendProduct) => ({
    id: String(p.id),
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice,
    image: p.image,
    tag: p.tag,
    slug: p.slug,
    category: p.category,
  });

  // Use API products or fallback to static data
  const relatedProducts = apiProducts.length > 0
    ? apiProducts.map(toProductFormat)
    : allProducts
        .filter(p => p.slug !== currentProductSlug)
        .slice(0, 8)
        .map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          originalPrice: p.originalPrice,
          image: p.image,
          tag: p.tag,
          slug: p.slug,
          category: p.category,
        }));

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal">
          Customers Also Love
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 -mx-4 px-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {relatedProducts.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-[260px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CustomerAlsoLove;