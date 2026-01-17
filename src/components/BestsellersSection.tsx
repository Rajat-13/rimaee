import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const perfumeProducts = [
  {
    id: 1,
    name: "Purple Mystique",
    price: 499,
    originalPrice: 799,
    image:
      "https://images.unsplash.com/photo-1594035900144-17fc72a68908?w=600&auto=format&fit=crop&q=80",
    tag: "Bestseller",
  },
  {
    id: 2,
    name: "Ocean Breeze",
    price: 599,
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Midnight Rose",
    price: 549,
    originalPrice: 899,
    image:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80",
    tag: "Sale",
  },
  {
    id: 4,
    name: "Fresh Citrus",
    price: 449,
    image:
      "https://images.unsplash.com/photo-1595535873420-a599195b3f4a?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    name: "Woody Essence",
    price: 699,
    image:
      "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 6,
    name: "Floral Dreams",
    price: 549,
    image:
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&auto=format&fit=crop&q=80",
  },
];

const attarProducts = [
  {
    id: 101,
    name: "Royal Oudh Attar",
    price: 799,
    originalPrice: 999,
    image:
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&auto=format&fit=crop&q=80",
    tag: "Premium",
  },
  {
    id: 102,
    name: "Sandal Pure",
    price: 649,
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 103,
    name: "Rose Absolute",
    price: 549,
    image:
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&auto=format&fit=crop&q=80",
    tag: "Bestseller",
  },
  {
    id: 104,
    name: "Musk White",
    price: 499,
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 105,
    name: "Amber Gold",
    price: 699,
    originalPrice: 899,
    image:
      "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=600&auto=format&fit=crop&q=80",
    tag: "Sale",
  },
  {
    id: 106,
    name: "Jasmine Night",
    price: 599,
    image:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80",
  },
];

const AUTO_SCROLL_DELAY = 3000;

const BestsellersSection = () => {
  const [activeTab, setActiveTab] = useState<"perfume" | "attar">("perfume");
  const [activeIndex, setActiveIndex] = useState(2);

  const isHovered = useRef(false);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  const products = activeTab === "perfume" ? perfumeProducts : attarProducts;

  // Reset index on tab change
  useEffect(() => {
    setActiveIndex(2);
  }, [activeTab]);

  // Auto-scroll
  useEffect(() => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);

    autoScrollRef.current = setInterval(() => {
      if (!isHovered.current) {
        setActiveIndex((prev) =>
          prev === products.length - 1 ? 0 : prev + 1
        );
      }
    }, AUTO_SCROLL_DELAY);

    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [products.length]);

  const scroll = (dir: "left" | "right") => {
    isHovered.current = true;
    setActiveIndex((prev) =>
      dir === "left"
        ? prev === 0
          ? products.length - 1
          : prev - 1
        : prev === products.length - 1
        ? 0
        : prev + 1
    );
  };

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const absD = Math.abs(diff);

    return {
      transform: `
        translateX(${diff * 240}px)
        translateZ(${-absD * 160}px)
        rotateY(${diff * -12}deg)
        scale(${1 - absD * 0.08})
      `,
      opacity: absD > 3 ? 0 : 1 - absD * 0.15,
      zIndex: 30 - absD,
    };
  };

  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="container-wide">
        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="relative inline-flex bg-muted/50 rounded-full p-1.5">
            <div
              className={`absolute top-1.5 bottom-1.5 w-1/2 bg-primary rounded-full transition-all duration-500 ${
                activeTab === "perfume" ? "left-1.5" : "left-1/2"
              }`}
            />
            <button
              className={`relative px-8 py-3 font-semibold ${
                activeTab === "perfume"
                  ? "text-primary-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("perfume")}
            >
              Perfume
            </button>
            <button
              className={`relative px-8 py-3 font-semibold ${
                activeTab === "attar"
                  ? "text-primary-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("attar")}
            >
              Attar
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          className="relative py-10"
          onMouseEnter={() => (isHovered.current = true)}
          onMouseLeave={() => (isHovered.current = false)}
        >
          <div
            className="flex justify-center items-center min-h-[480px]"
            style={{ perspective: "1400px" }}
          >
            <div
              className="relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              {products.map((p, i) => (
                <div
                  key={p.id}
                  onClick={() => {
                    isHovered.current = true;
                    setActiveIndex(i);
                  }}
                  className="absolute transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer"
                  style={getCardStyle(i)}
                >
                  <div className="w-64 md:w-72 bg-card rounded-2xl overflow-hidden shadow-2xl">
                    <div className="aspect-[3/4] relative">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                      {p.tag && (
                        <span className="absolute top-3 left-3 px-3 py-1 text-xs rounded-full bg-primary text-primary-foreground">
                          {p.tag}
                        </span>
                      )}
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-semibold">{p.name}</h3>
                      <div className="mt-2 flex justify-center gap-2">
                        <span className="text-primary font-bold">
                          ₹{p.price}
                        </span>
                        {p.originalPrice && (
                          <span className="line-through text-muted-foreground">
                            ₹{p.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arrows */}
          <div className="flex justify-center gap-6 mt-6">
            <button onClick={() => scroll("left")}>
              <ChevronLeft />
            </button>
            <button onClick={() => scroll("right")}>
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestsellersSection;
