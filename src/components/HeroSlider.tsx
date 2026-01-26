import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Shimmer } from "./ui/shimmer";
import heroSlide1 from "@/assets/hero-slide-1.png";
import heroSlide2 from "@/assets/hero-slide-2.png";
import heroSlide3 from "@/assets/hero-slide-3.png";

interface Slide {
  id: number;
  image: string;
  link: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: heroSlide1,
    link: "/all-products",
  },
  {
    id: 2,
    image: heroSlide2,
    link: "/products/sandal-veer",
  },
  {
    id: 3,
    image: heroSlide3,
    link: "/all-products?promo=RIMAENEW",
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(new Array(slides.length).fill(false));
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (imagesLoaded.some(Boolean)) {
      setIsInitialLoad(false);
    }
  }, [imagesLoaded]);

  const handleImageLoad = (index: number) => {
    setImagesLoaded(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  const goToSlide = (index: number) => setCurrentSlide(index);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <section className="relative overflow-hidden gpu-accelerated">
      <div className="relative h-[500px] md:h-[650px]">
        {/* Initial shimmer loader */}
        {isInitialLoad && (
          <Shimmer className="absolute inset-0 z-0" />
        )}
        
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-out gpu-accelerated ${
              index === currentSlide 
                ? "opacity-100 scale-100 z-10" 
                : "opacity-0 scale-105 z-0"
            }`}
          >
            <Link 
              to={slide.link}
              className="block w-full h-full"
            >
              <img
                src={slide.image}
                alt={`Slide ${slide.id}`}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  imagesLoaded[index] ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => handleImageLoad(index)}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={(e) => { e.preventDefault(); prevSlide(); }}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-background/80 backdrop-blur-sm hover:bg-background rounded-full transition-all duration-300 shadow-lg touch-target"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} className="text-foreground md:w-6 md:h-6" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); nextSlide(); }}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-background/80 backdrop-blur-sm hover:bg-background rounded-full transition-all duration-300 shadow-lg touch-target"
        aria-label="Next slide"
      >
        <ChevronRight size={20} className="text-foreground md:w-6 md:h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 md:h-2.5 rounded-full transition-all duration-500 touch-target ${
              index === currentSlide
                ? "bg-background w-8 md:w-10"
                : "bg-background/50 w-4 md:w-6 hover:bg-background/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
