import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Shimmer } from "./ui/shimmer";
import { cn } from "@/lib/utils";

interface ProductVariant {
  size: string;
  price: number;
  mrp?: number;
}

interface Product {
  id: number | string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  tag?: string;
  slug?: string;
  category?: string;
  variants?: ProductVariant[];
}

interface ProductCardProps {
  product: Product;
  showSocialProof?: boolean;
}

const ProductCard = ({ product, showSocialProof = true }: ProductCardProps) => {
  const { toggleItem, isInWishlist } = useWishlist();
  const { addItem, setIsCartOpen } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const slug = product.slug || product.name.toLowerCase().replace(/\s+/g, '-');
  const productId = String(product.id);
  const isWishlisted = isInWishlist(productId);

  // Generate random social proof numbers (stable per product)
  const socialProof = useMemo(() => {
    const seed = productId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return {
      boughtLastWeek: 5 + (seed % 11), // 5-15
      viewingNow: 5 + ((seed * 7) % 11), // 5-15
    };
  }, [productId]);

  // Default variants if not provided
  const variants: ProductVariant[] = product.variants || [
    { size: "8ml", price: Math.round(product.price * 0.3), mrp: Math.round((product.originalPrice || product.price) * 0.3) },
    { size: "50ml", price: product.price, mrp: product.originalPrice },
    { size: "100ml", price: Math.round(product.price * 1.8), mrp: Math.round((product.originalPrice || product.price) * 1.8) },
  ];

  const currentVariant = variants[selectedVariant];
  const discountPercent = currentVariant.mrp 
    ? Math.round(((currentVariant.mrp - currentVariant.price) / currentVariant.mrp) * 100)
    : 0;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      id: productId,
      name: product.name,
      price: currentVariant.price,
      originalPrice: currentVariant.mrp,
      image: product.image,
      slug: slug,
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToCart(true);
    
    // Simulate loading for shimmer effect
    setTimeout(() => {
      addItem({
        id: `${productId}-${currentVariant.size}`,
        name: product.name,
        size: currentVariant.size,
        price: currentVariant.price,
        quantity: 1,
        image: product.image,
      });
      setIsAddingToCart(false);
      setIsCartOpen(true);
    }, 300);
  };

  const handleVariantClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedVariant(index);
  };

  return (
    <div className="card-product group cursor-pointer min-w-[280px] md:min-w-[300px] block hover-lift gpu-accelerated bg-card rounded-xl overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
      <Link to={`/products/${slug}`}>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          {!imageLoaded && (
            <Shimmer className="absolute inset-0" />
          )}
          <img
            src={product.image}
            alt={product.name}
            className={cn(
              "w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          
          {/* Tags - Category & Bestseller */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.category && (
              <span className="bg-muted/90 backdrop-blur-sm text-foreground text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm font-medium">
                {product.category}
              </span>
            )}
            {product.tag && (
              <span className="bg-primary text-primary-foreground text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm font-semibold">
                {product.tag}
              </span>
            )}
          </div>

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <span className="absolute top-3 right-14 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-1 rounded-sm">
              -{discountPercent}%
            </span>
          )}
          
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            className={cn(
              "absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ease-out touch-target",
              isWishlisted 
                ? "bg-destructive text-destructive-foreground" 
                : "bg-background/90 text-foreground hover:bg-background hover:text-destructive"
            )}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
          </button>
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-background/0 group-hover:bg-background/10 transition-colors duration-300" />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Social Proof */}
          {showSocialProof && (
            <div className="flex items-center gap-3 mb-2 text-[11px]">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Eye className="w-3 h-3" />
                <span>{socialProof.viewingNow} viewing now</span>
              </div>
            </div>
          )}

          {/* Product Name */}
          <h3 className="font-serif text-base font-medium mb-1.5 group-hover:text-primary transition-colors duration-300 line-clamp-1">
            {product.name}
          </h3>

          {/* Variant Selector */}
          <div className="flex gap-1.5 mb-3" onClick={e => e.preventDefault()}>
            {variants.map((variant, index) => (
              <button
                key={variant.size}
                onClick={(e) => handleVariantClick(e, index)}
                className={cn(
                  "px-2 py-1 text-[10px] font-medium rounded border transition-all duration-200",
                  selectedVariant === index
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground hover:border-primary/50"
                )}
              >
                {variant.size}
              </button>
            ))}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-semibold text-foreground">₹{currentVariant.price}</span>
            {currentVariant.mrp && currentVariant.mrp > currentVariant.price && (
              <span className="text-muted-foreground line-through text-sm">
                ₹{currentVariant.mrp}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-[11px] font-medium text-destructive">
                Save ₹{currentVariant.mrp! - currentVariant.price}
              </span>
            )}
          </div>

          {/* Bought Last Week */}
          {showSocialProof && (
            <p className="text-[11px] text-muted-foreground mb-3">
              🔥 {socialProof.boughtLastWeek} people bought last week
            </p>
          )}

          {/* Add to Cart Button with Shimmer */}
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className={cn(
              "relative w-full py-2.5 rounded-lg font-medium text-sm transition-all duration-300 overflow-hidden",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              "flex items-center justify-center gap-2",
              isAddingToCart && "pointer-events-none"
            )}
          >
            {isAddingToCart ? (
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-foreground/20 to-primary animate-shimmer" 
                   style={{ backgroundSize: '200% 100%' }} />
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;