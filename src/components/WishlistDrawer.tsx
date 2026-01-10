import { X, Heart, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

const WishlistDrawer = () => {
  const { items, removeItem, isWishlistOpen, setIsWishlistOpen } = useWishlist();
  const { addItem: addToCart, setIsCartOpen } = useCart();

  const handleMoveToCart = (item: typeof items[0]) => {
    addToCart({
      id: item.slug,
      name: item.name,
      size: "50ml",
      price: item.price,
      quantity: 1,
      image: item.image,
    });
    removeItem(item.id);
    setIsWishlistOpen(false);
    setIsCartOpen(true);
  };

  return (
    <Sheet open={isWishlistOpen} onOpenChange={setIsWishlistOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 font-serif text-xl">
              <Heart className="w-5 h-5 fill-red-500 text-red-500" />
              My Wishlist ({items.length})
            </SheetTitle>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Heart className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="font-serif text-lg font-medium mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Save your favorite fragrances to your wishlist
              </p>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="btn-primary"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {items.map((item) => (
                <div key={item.id} className="p-4 flex gap-4">
                  <Link
                    to={`/products/${item.slug}`}
                    onClick={() => setIsWishlistOpen(false)}
                    className="flex-shrink-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.slug}`}
                      onClick={() => setIsWishlistOpen(false)}
                    >
                      <h4 className="font-medium text-sm truncate hover:text-primary transition-colors">
                        {item.name}
                      </h4>
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium">₹{item.price}</span>
                      {item.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          ₹{item.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default WishlistDrawer;
