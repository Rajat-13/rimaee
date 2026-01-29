import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnimatedHeader from "./AnimatedHeader";
import ScrollReveal from "./ScrollReveal";
import { productRepository, FrontendProduct } from "@/repositories/productRepository";
import { allProducts as fallbackProducts } from "@/data/products";

const BestsellersSection = () => {
  const [activeTab, setActiveTab] = useState<"perfume" | "attar">("perfume");
  const [activeIndex, setActiveIndex] = useState(2);
  const [apiProducts, setApiProducts] = useState<FrontendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productRepository.list();
        if (data.length > 0) {
          setApiProducts(data);
        }
      } catch (err) {
        console.error("Failed to fetch products for bestsellers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products by type
  const perfumeProducts = apiProducts.length > 0 
    ? apiProducts.filter(p => p.type === "perfume" || !p.type).slice(0, 6)
    : fallbackProducts.filter(p => p.category !== "attar").slice(0, 6).map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        originalPrice: p.originalPrice,
        image: p.image,
        images: p.images,
        tag: p.tag,
        gender: p.gender,
        category: p.category,
        notes: p.notes,
        description: p.description,
        occasion: p.occasion,
        concentration: p.concentration,
      }));

  const attarProducts = apiProducts.length > 0
    ? apiProducts.filter(p => p.type === "attar").slice(0, 6)
    : fallbackProducts.slice(0, 6).map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        originalPrice: p.originalPrice,
        image: p.image,
        images: p.images,
        tag: p.tag,
        gender: p.gender,
        category: p.category,
        notes: p.notes,
        description: p.description,
        occasion: p.occasion,
        concentration: p.concentration,
      }));

  const products = activeTab === "perfume" ? perfumeProducts : attarProducts;

  // Reset to center card when tab changes
  useEffect(() => {
    setActiveIndex(Math.min(2, products.length - 1));
  }, [activeTab, products.length]);

  const scroll = (direction: "left" | "right") => {
    const newIndex = direction === "left"
      ? Math.max(0, activeIndex - 1)
      : Math.min(products.length - 1, activeIndex + 1);
    setActiveIndex(newIndex);
  };

 const getCardStyle = (index: number) => {
   const diff = index - activeIndex;
   const absD = Math.abs(diff);

   const translateX = diff * 220;
   const translateZ = -absD * 140;
   const rotateY = diff * -10;
   const scale = 1 - absD * 0.08;
   const opacity = absD <= 3 ? 1 - absD * 0.15 : 0;
   const zIndex = 20 - absD;

   return {
     transform: `
       translateX(${translateX}px)
       translateZ(${translateZ}px)
       rotateY(${rotateY}deg)
       scale(${scale})
     `,
     opacity,
     zIndex,
   };
 };

  if (products.length === 0 && !loading) {
    return null;
  }

  return (
    <section id="bestsellers" className="section-padding bg-background overflow-hidden">
      <div className="container-wide">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 lg:gap-8 mb-8">
          <AnimatedHeader>
            <h2 className="heading-section font-bold">
              Discover <em className="highlighted-text not-italic">Our Bestsellers</em>
            </h2>
          </AnimatedHeader>
          <ScrollReveal direction="right" delay={0.2}>
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
          </ScrollReveal>
        </div>

        {/* Animated Circular Tabs */}
        <ScrollReveal delay={0.1}>
          <div className="flex justify-center mb-8">
            <div className="relative inline-flex bg-muted/50 rounded-full p-1.5 backdrop-blur-sm">
              {/* Animated background pill */}
              <div
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-primary rounded-full shadow-lg transition-all duration-500 ease-out ${
                  activeTab === "perfume" ? "left-1.5" : "left-[calc(50%+3px)]"
                }`}
                style={{
                  boxShadow: "0 4px 20px -4px hsl(var(--primary) / 0.5)",
                }}
              />

              <button
                onClick={() => setActiveTab("perfume")}
                className={`relative z-10 px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === "perfume"
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeTab === "perfume" ? "bg-primary-foreground scale-100" : "bg-muted-foreground/50 scale-75"
                  }`} />
                  Perfume
                </span>
              </button>
              <button
                onClick={() => setActiveTab("attar")}
                className={`relative z-10 px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === "attar"
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeTab === "attar" ? "bg-primary-foreground scale-100" : "bg-muted-foreground/50 scale-75"
                  }`} />
                  Attar
                </span>
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Attar Description */}
        {activeTab === "attar" && (
          <div className="text-center mb-6 animate-fade-in">
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              <span className="text-primary font-medium">Alcohol-free oil-based fragrances</span> — Perfect for those who prefer natural, long-lasting scents without alcohol
            </p>
          </div>
        )}

        {/* 3D Stacked Carousel */}
        <ScrollReveal delay={0.2}>
          <div className="relative py-8">
            <div
              className="flex items-center justify-center min-h-[450px]"
              style={{ perspective: "1200px" }}
            >
              <div className="relative flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
                {products.map((product, index) => {
                  const slug = product.slug || product.name.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <div
                      key={product.id}
                      onClick={() => {
                        if (index === activeIndex) {
                          navigate(`/products/${slug}`);
                        } else {
                          setActiveIndex(index);
                        }
                      }}
                      className={`absolute transition-all duration-500 ease-out cursor-pointer ${
                        index === activeIndex ? "z-20" : ""
                      }`}
                      style={getCardStyle(index)}
                    >
                      <div className={`w-64 md:w-72 bg-card rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
                        index === activeIndex ? "ring-2 ring-primary/30 shadow-2xl" : "hover:shadow-lg"
                      }`}>
                        <div className="aspect-[3/4] overflow-hidden relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500"
                          />
                          {product.tag && (
                            <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-medium rounded-full ${
                              product.tag === "Bestseller" ? "bg-primary text-primary-foreground" :
                              product.tag === "Sale" ? "bg-destructive text-destructive-foreground" :
                              "bg-secondary text-secondary-foreground"
                            }`}>
                              {product.tag}
                            </span>
                          )}
                        </div>
                        <div className="p-4 bg-gradient-to-t from-background to-card">
                          <h3 className="font-semibold text-foreground text-center">{product.name}</h3>
                          <div className="flex items-center justify-center gap-2 mt-2">
                            <span className="text-lg font-bold text-primary">₹{product.price}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Navigation Arrows */}
            <div className="flex lg:hidden justify-center gap-4 mt-4">
              <button
                onClick={() => scroll("left")}
                disabled={activeIndex === 0}
                className="w-10 h-10 flex items-center justify-center border border-foreground/30 rounded-full hover:bg-foreground hover:text-background transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Previous"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={activeIndex === products.length - 1}
                className="w-10 h-10 flex items-center justify-center border border-foreground/30 rounded-full hover:bg-foreground hover:text-background transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Carousel Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "w-8 h-2 bg-primary"
                      : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default BestsellersSection;
