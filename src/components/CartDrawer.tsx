import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X, ChevronUp, ChevronDown, Lock, CornerDownLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";

const CartDrawer = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    total,
    itemCount,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
  } = useCart();
  const navigate = useNavigate();

  const freeShippingThreshold = 1500;
  const progress = Math.min((total / freeShippingThreshold) * 100, 100);
  const isFreeShipping = total >= freeShippingThreshold;

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleViewCart = () => {
    setIsCartOpen(false);
    navigate("/cart");
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="p-6 pt-8 border-b border-border">
          <SheetTitle className="font-serif text-2xl tracking-tight">
            CART<sup className="text-sm ml-1">{itemCount}</sup>
          </SheetTitle>
        </SheetHeader>

        {/* Free Shipping Progress */}
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm text-charcoal mb-2">
            {isFreeShipping
              ? "You are eligible for free shipping."
              : `Add ₹${(freeShippingThreshold - total).toLocaleString()} more for free shipping.`}
          </p>
          <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
            <div
              className="h-full bg-charcoal transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <p className="text-muted-foreground mb-4">Your cart is empty</p>
              <Button
                onClick={() => setIsCartOpen(false)}
                className="bg-charcoal text-white hover:bg-charcoal/90"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="p-4 flex gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-cream flex-shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-charcoal truncate">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.size}</p>
                    <p className="text-sm font-medium text-charcoal mt-1">
                      Rs. {item.price.toLocaleString()}.00
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center border border-border">
                      <span className="px-3 py-1.5 text-sm min-w-[40px] text-center">
                        {item.quantity}
                      </span>
                      <div className="flex flex-col border-l border-border">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.size, item.quantity + 1)
                          }
                          className="p-1 hover:bg-muted transition-colors"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.size, item.quantity - 1)
                          }
                          className="p-1 hover:bg-muted transition-colors border-t border-border"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id, item.size)}
                      className="text-sm text-muted-foreground hover:text-charcoal underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-4 space-y-4 bg-white">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Tax included.{" "}
                  <a href="#" className="underline">
                    Shipping
                  </a>{" "}
                  calculated at checkout.
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Subtotal</p>
                <p className="text-xl font-semibold text-charcoal">
                  Rs. {total.toLocaleString()}.00
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleCheckout}
                className="flex-1 bg-charcoal text-white hover:bg-charcoal/90 py-6 text-sm font-medium"
              >
                <Lock className="w-4 h-4 mr-2" />
                Check out
              </Button>
              <Button
                onClick={handleViewCart}
                variant="outline"
                className="flex-1 border-charcoal text-charcoal hover:bg-charcoal hover:text-white py-6 text-sm font-medium"
              >
                View cart
              </Button>
            </div>

            {/* Continue Shopping */}
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-charcoal transition-colors"
            >
              <CornerDownLeft className="w-4 h-4" />
              Continue shopping
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
