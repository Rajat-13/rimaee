import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { allProducts } from "@/data/products";

interface Slide {
  id: number;
  product: typeof allProducts[0];
  subtitle: string;
  bgColor: string;
}

const slides: Slide[] = [
  {
    id: 1,
    product: allProducts[0], // Sandal Veer
    subtitle: "Introducing",
    bgColor: "bg-gradient-to-br from-amber-100 via-orange-50 to-amber-200",
  },
  {
    id: 2,
    product: allProducts[1], // Flora Bliss
    subtitle: "Discover",
    bgColor: "bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200",
  },
  {
    id: 3,
    product: allProducts[2], // Purple Mystique
    subtitle: "Experience",
    bgColor: "bg-gradient-to-br from-purple-100 via-violet-50 to-purple-200",
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <section className="relative mt-16 md:mt-20 overflow-hidden">
      <div className="relative">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100 relative" : "opacity-0 absolute inset-0"
            }`}
          >
            <Link 
              to={`/products/${slide.product.slug}`}
              className={`block ${slide.bgColor} min-h-[400px] md:min-h-[500px] lg:min-h-[600px]`}
            >
              <div className="container-wide h-full">
                <div className="grid md:grid-cols-2 items-center h-full py-8 md:py-12 px-4 md:px-8">
                  {/* Product Image - Left */}
                  <div className="relative flex items-center justify-center order-1 md:order-1">
                    {/* Decorative elements */}
                    <div className="absolute -top-10 -left-10 w-20 h-20 md:w-32 md:h-32 bg-gradient-to-br from-amber-300/30 to-orange-200/20 rounded-full blur-2xl" />
                    <div className="absolute -bottom-10 -right-10 w-24 h-24 md:w-40 md:h-40 bg-gradient-to-br from-pink-300/30 to-rose-200/20 rounded-full blur-2xl" />
                    
                    {/* Main product image */}
                    <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
                      <img
                        src={slide.product.image}
                        alt={slide.product.name}
                        className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 object-cover rounded-lg shadow-2xl"
                      />
                      
                      {/* Floating decorative icons */}
                      <div className="absolute -top-4 -right-4 w-8 h-8 md:w-12 md:h-12 bg-white/80 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-lg md:text-xl">✨</span>
                      </div>
                      <div className="absolute -bottom-4 -left-4 w-8 h-8 md:w-12 md:h-12 bg-white/80 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-lg md:text-xl">🌸</span>
                      </div>
                    </div>
                  </div>

                  {/* Content - Right */}
                  <div className="text-center md:text-left order-2 md:order-2 mt-6 md:mt-0 md:pl-8 lg:pl-16">
                    <span className="font-serif italic text-2xl md:text-3xl lg:text-4xl text-primary/80 block mb-2">
                      {slide.subtitle}
                    </span>
                    <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold text-charcoal leading-tight">
                      {slide.product.name}
                    </h1>
                    <p className="mt-4 text-muted-foreground text-sm md:text-base max-w-md mx-auto md:mx-0">
                      {slide.product.description}
                    </p>
                    <div className="mt-6 flex items-center gap-4 justify-center md:justify-start">
                      <span className="text-2xl md:text-3xl font-semibold text-charcoal">
                        ₹{slide.product.price.toLocaleString()}
                      </span>
                      {slide.product.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          ₹{slide.product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <button className="mt-6 btn-primary rounded-md">
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={(e) => { e.preventDefault(); prevSlide(); }}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full transition-all duration-300 shadow-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} className="text-charcoal md:w-6 md:h-6" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); nextSlide(); }}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full transition-all duration-300 shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight size={20} className="text-charcoal md:w-6 md:h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 md:h-2.5 rounded-full transition-all duration-500 ${
              index === currentSlide
                ? "bg-charcoal w-8 md:w-10"
                : "bg-charcoal/30 w-4 md:w-6 hover:bg-charcoal/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;