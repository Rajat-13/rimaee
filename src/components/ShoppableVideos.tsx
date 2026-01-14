import { useRef } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";

import { useCart } from "@/context/CartContext";
import { allProducts } from "@/data/products";

@@ -18,14 +19,6 @@ const shoppableVideos = [
    videoUrl: PERFUME_VIDEO_URL,
    product: allProducts[2],
  },
  {
    videoUrl: PERFUME_VIDEO_URL,
    product: allProducts[3],
  },
  {
    videoUrl: PERFUME_VIDEO_URL,
    product: allProducts[4],
  },
];

const ShoppableVideos = () => {
@@ -55,76 +48,53 @@ const ShoppableVideos = () => {
  };

  return (
    <section className="section-padding bg-background">
      <div className="container-wide">
            {/* Header - Same style as Shop by Gender */}
            <div className="text-center mb-12">
              <h2 className="heading-section font-bold">
                Shoppable <em className="highlighted-text not-italic">Videos</em>
              </h2>

            </div>
        {/* Videos Carousel */}
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-muted transition-colors -translate-x-4"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {shoppableVideos.map((item, index) => (
              <div key={index} className="flex-shrink-0 w-[220px] md:w-[240px]">
                {/* Video Container */}
                <div className="aspect-[9/16] rounded-2xl overflow-hidden mb-3 relative bg-charcoal">
                  <video
                    src={item.videoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info Card */}
                <div className="bg-white border border-border rounded-lg p-3 flex items-center gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-charcoal truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-sm font-bold text-charcoal">
                      ₹{item.product.price.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAddToCart(item.product)}
                    className="w-9 h-9 flex items-center justify-center border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-muted transition-colors translate-x-4"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
      );
    };

    export default ShoppableVideos;