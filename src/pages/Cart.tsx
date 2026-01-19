import { Link } from "react-router-dom";
import { ChevronUp, ChevronDown, CornerDownLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarqueeBanner from "@/components/MarqueeBanner";
import CouponInput from "@/components/CouponInput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";

const Cart = () => {
  const { items, removeItem, updateQuantity, total, setIsCheckoutOpen } = useCart();

  const freeShippingThreshold = 1500;
  const progress = Math.min((total / freeShippingThreshold) * 100, 100);
  const isFreeShipping = total >= freeShippingThreshold;

  return (
    <div className="min-h-screen bg-background">
      <MarqueeBanner />
      <Header />

      <main className="pt-8 pb-16">
        <div className="container-wide px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-serif text-4xl md:text-5xl font-light italic text-charcoal">
              YOUR CART
            </h1>
            <Link
              to="/"
              className="flex items-center gap-2 px-6 py-3 border border-charcoal rounded-full text-sm font-medium hover:bg-charcoal hover:text-white transition-colors"
            >
              <CornerDownLeft className="w-4 h-4" />
              Continue shopping
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-6">Your cart is empty</p>
              <Link to="/">
                <Button className="bg-charcoal text-white hover:bg-charcoal/90">
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="divide-y divide-border">
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.size}`}
                      className="py-6 flex gap-6"
                    >
                      {/* Product Image */}
                      <div className="w-28 h-28 bg-cream flex-shrink-0 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-medium text-charcoal text-lg">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.size}</p>
                        <p className="text-sm font-medium text-charcoal mt-1">
                          Rs. {item.price.toLocaleString()}.00
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-border">
                          <span className="px-4 py-2 text-sm min-w-[50px] text-center">
                            {item.quantity}
                          </span>
                          <div className="flex flex-col border-l border-border">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.size, item.quantity + 1)
                              }
                              className="p-1.5 hover:bg-muted transition-colors"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.size, item.quantity - 1)
                              }
                              className="p-1.5 hover:bg-muted transition-colors border-t border-border"
                            >
                              <ChevronDown className="w-4 h-4" />
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

                      {/* Line Total */}
                      <div className="text-right min-w-[120px]">
                        <p className="font-medium text-charcoal">
                          Rs. {(item.price * item.quantity).toLocaleString()}.00
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-muted/30 p-6 sticky top-24">
                  {/* Free Shipping Progress */}
                  <div className="mb-6">
                    <p className="text-sm text-charcoal mb-2">
                      {isFreeShipping
                        ? "You are eligible for free shipping."
                        : `Add ₹${(freeShippingThreshold - total).toLocaleString()} more for free shipping.`}
                    </p>
                    <div className="w-full bg-gray-300 h-1 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-charcoal transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="text-lg text-muted-foreground">SUBTOTAL</span>
                    <span className="text-2xl font-semibold text-charcoal">
                      Rs. {total.toLocaleString()}.00
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-6">
                    Tax included.{" "}
                    <a href="#" className="underline">
                      Shipping
                    </a>{" "}
                    calculated at checkout.
                  </p>

                  {/* Coupon Code */}
                  <div className="mb-6">
                    <label className="text-sm text-charcoal font-medium block mb-2">
                      Have a coupon?
                    </label>
                    <CouponInput total={total} />
                  </div>

                  {/* Order Note */}
                  <div className="mb-6">
                    <label className="text-sm text-charcoal font-medium block mb-2">
                      Add a note to your order
                    </label>
                    <Textarea
                      placeholder="Order note"
                      className="resize-none bg-white"
                      rows={3}
                    />
                  </div>

                  {/* Checkout Button */}
                  <Button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full bg-charcoal text-white hover:bg-charcoal/90 py-6 text-sm font-medium uppercase tracking-wider"
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
