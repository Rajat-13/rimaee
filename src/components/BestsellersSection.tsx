import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

const perfumeProducts = [
  {
    id: 1,
    name: "Purple Mystique",
    price: 499,
    originalPrice: 799,
    image: "https://images.unsplash.com/photo-1594035900144-17fc72a68908?w=600&auto=format&fit=crop&q=80",
    tag: "Bestseller",
  },
  {
    id: 2,
    name: "Ocean Breeze",
    price: 599,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Midnight Rose",
    price: 549,
    originalPrice: 899,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80",
    tag: "Sale",
  },
  {
    id: 4,
    name: "Fresh Citrus",
    price: 449,
    image: "https://images.unsplash.com/photo-1595535873420-a599195b3f4a?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    name: "Woody Essence",
    price: 699,
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 6,
    name: "Floral Dreams",
    price: 549,
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&auto=format&fit=crop&q=80",
  },
];

const attarProducts = [
  {
    id: 101,
    name: "Royal Oudh Attar",
    price: 799,
    originalPrice: 999,
    image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&auto=format&fit=crop&q=80",
    tag: "Premium",
  },
  {
    id: 102,
    name: "Sandal Pure",
    price: 649,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 103,
    name: "Rose Absolute",
    price: 549,
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&auto=format&fit=crop&q=80",
    tag: "Bestseller",
  },
  {
    id: 104,
    name: "Musk White",
    price: 499,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 105,
    name: "Amber Gold",
    price: 699,
    originalPrice: 899,
    image: "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=600&auto=format&fit=crop&q=80",
    tag: "Sale",
  },
  {
    id: 106,
    name: "Jasmine Night",
    price: 599,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80",
  },
];

const BestsellersSection = () => {
  const [activeTab, setActiveTab] = useState<"perfume" | "attar">("perfume");
  const scrollRef = useRef<HTMLDivElement>(null);

  const products = activeTab === "perfume" ? perfumeProducts : attarProducts;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="bestsellers" className="section-padding bg-background">
      <div className="container-wide">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 lg:gap-8 mb-8">
          <div>
            <h2 className="heading-section font-bold">
              Discover <em className="highlighted-text not-italic">Our Bestsellers</em>
            </h2>
          </div>
          <div className="hidden lg:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 flex items-center justify-center border border-foreground rounded-full hover:bg-foreground hover:text-background transition-all duration-300"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 flex items-center justify-center border border-foreground rounded-full hover:bg-foreground hover:text-background transition-all duration-300"
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-muted rounded-full p-1">
            <button
              onClick={() => setActiveTab("perfume")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === "perfume"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Perfume
            </button>
            <button
              onClick={() => setActiveTab("attar")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === "attar"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Attar
            </button>
          </div>
        </div>

        {/* Attar Description */}
        {activeTab === "attar" && (
          <div className="text-center mb-6">
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              <span className="text-primary font-medium">Alcohol-free oil-based fragrances</span> — Perfect for those who prefer natural, long-lasting scents without alcohol
            </p>
          </div>
        )}

        {/* Carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 md:mx-0 md:px-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestsellersSection;
