import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnimatedHeader from "./AnimatedHeader";
import ScrollReveal from "./ScrollReveal";

import { fragranceRepository } from "@/repositories/fragranceRepository";
import { Fragrance } from "@/models/fragrance";

const BestsellersSection = () => {
  const [activeTab, setActiveTab] = useState<"perfume" | "attar">("perfume");
  const [activeIndex, setActiveIndex] = useState(2);
  const [apiProducts, setApiProducts] = useState<Fragrance[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // =============================
  // FETCH BESTSELLERS
  // =============================
  useEffect(() => {
    const fetchProducts = async () => {
      const data = await fragranceRepository.listBestsellers();
      setApiProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // =============================
  // FILTER BY TYPE
  // =============================
  const perfumeProducts = apiProducts.filter(p => p.type === "perfume");
  const attarProducts = apiProducts.filter(p => p.type === "attar");

  const products =
    activeTab === "perfume" ? perfumeProducts : attarProducts;

  const noDataForTab = !loading && products.length === 0;

  // Reset index on tab switch
  useEffect(() => {
    setActiveIndex(Math.min(2, products.length - 1));
  }, [activeTab, products.length]);

  const scroll = (direction: "left" | "right") => {
    setActiveIndex(prev =>
      direction === "left"
        ? Math.max(0, prev - 1)
        : Math.min(products.length - 1, prev + 1)
    );
  };

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const abs = Math.abs(diff);

    return {
      transform: `
        translateX(${diff * 220}px)
        translateZ(${-abs * 140}px)
        rotateY(${diff * -10}deg)
        scale(${1 - abs * 0.08})
      `,
      opacity: abs <= 3 ? 1 - abs * 0.15 : 0,
      zIndex: 20 - abs,
    };
  };

  // =============================
  // RENDER
  // =============================
  return (
    <section
      id="bestsellers"
      className="section-padding bg-background overflow-hidden"
    >
      <div className="container-wide">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <AnimatedHeader>
            <h2 className="heading-section font-bold">
              Discover{" "}
              <em className="highlighted-text not-italic">
                Our Bestsellers
              </em>
            </h2>
          </AnimatedHeader>

          {/* DESKTOP ARROWS */}
          <div className="hidden lg:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 flex items-center justify-center border border-foreground rounded-full"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 flex items-center justify-center border border-foreground rounded-full"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex justify-center mb-8">
          <div className="bg-muted/50 rounded-full p-1.5 flex gap-2">
            {["perfume", "attar"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-8 py-3 rounded-full text-sm font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "perfume" ? "Perfume" : "Attar"}
              </button>
            ))}
          </div>
        </div>

        {/* EMPTY STATE OR CAROUSEL */}
        <ScrollReveal>
          <div className="relative py-8">
            {noDataForTab ? (
              <div className="flex justify-center items-center min-h-[300px]">
                <p className="text-muted-foreground text-sm">
                  No data found
                </p>
              </div>
            ) : (
              <div
                className="flex items-center justify-center min-h-[450px]"
                style={{ perspective: "1200px" }}
              >
                <div className="relative" style={{ transformStyle: "preserve-3d" }}>
                  {products.map((product, index) => {
                    const slug =
                      product.slug ||
                      product.name.toLowerCase().replace(/\s+/g, "-");

                    return (
                      <div
                        key={product.id}
                        onClick={() =>
                          index === activeIndex
                            ? navigate(`/products/${slug}`)
                            : setActiveIndex(index)
                        }
                        className="absolute cursor-pointer transition-all duration-500"
                        style={getCardStyle(index)}
                      >
                        <div className="w-64 bg-card rounded-2xl overflow-hidden shadow-xl">
                          <div className="aspect-[3/4] relative">
                            <img
                              src={product.product_images?.[0]?.image }
                              className="w-full h-full object-cover"
                            />
                            {product.tag && (
                              <span className="absolute top-3 left-3 px-3 py-1 text-xs rounded-full bg-primary text-primary-foreground">
                                {product.tag}
                              </span>
                            )}
                          </div>

                          <div className="p-4 text-center">
                            <h3 className="font-semibold">
                              {product.name}
                            </h3>
                            <div className="mt-2 flex justify-center gap-2">
                              <span className="font-bold text-primary">
                                ₹{product.variants?.[0]?.price}
                              </span>
                              {product.variants?.[0]?.mrp && (
                                <span className="line-through text-muted-foreground">
                                  ₹{product.variants?.[0]?.mrp}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default BestsellersSection;
