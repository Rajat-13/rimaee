import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
    <section className="relative overflow-hidden">
      <div className="relative h-[500px] md:h-[650px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
              index === currentSlide 
                ? "opacity-100 translate-x-0 z-10" 
                : "opacity-0 -translate-x-full z-0"
            }`}
          >
            <Link 
              to={slide.link}
              className="block w-full h-full"
            >
              <img
                src={slide.image}
                alt={`Slide ${slide.id}`}
                className="w-full h-full object-cover"
              />
            </Link>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 md:h-2.5 rounded-full transition-all duration-500 ${
              index === currentSlide
                ? "bg-white w-8 md:w-10"
                : "bg-white/50 w-4 md:w-6 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
