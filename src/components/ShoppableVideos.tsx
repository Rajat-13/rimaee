import { useRef } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { allProducts } from "@/data/products";

const PERFUME_VIDEO_URL = "/videos/perfume-video.mp4";

const shoppableVideos = [
  {
    videoUrl: PERFUME_VIDEO_URL,
    product: allProducts[0],
  },
  {
    videoUrl: PERFUME_VIDEO_URL,
    product: allProducts[1],
  },
  {
    videoUrl: PERFUME_VIDEO_URL,
    product: allProducts[2],
  },
];

const ShoppableVideos = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addItem, setIsCartOpen } = useCart();

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleAddToCart = (product: typeof allProducts[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      size: "50ml",
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    setIsCartOpen(true);
  };

  return (
    <section className="section-padding bg-muted">
      <div className="container-wide">
        {/* Header - Same style as Shop by Gender */}
        <div className="text-center mb-12">
          <h2 className="heading-section font-bold">
            Shoppable <em className="highlighted-text not-italic">Videos</em>
          </h2>
        </div>

        {/* Gender-style Grid for Videos */}
        <div className="grid md:grid-cols-3 gap-6">
          {shoppableVideos.map((item, index) => (
            <div key={index} className="group relative">
              {/* Video Container - Gender style aspect ratio */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
                <video
                  src={item.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/10 transition-colors duration-300" />
                
                {/* Product Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-charcoal/80 to-transparent">
                  <div className="flex items-end justify-between">
                    <Link to={`/products/${item.product.slug}`} className="flex-1">
                      <h3 className="font-serif text-lg font-medium text-primary-foreground">
                        {item.product.name}
                      </h3>
                      <p className="text-primary-foreground/80 text-sm">
                        ₹{item.product.price.toLocaleString()}
                      </p>
                    </Link>
                    <button
                      onClick={() => handleAddToCart(item.product)}
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-full hover:bg-primary hover:text-white transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShoppableVideos;
