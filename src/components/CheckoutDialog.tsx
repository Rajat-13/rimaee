import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, User, ChevronRight, X, MapPin, Plus, Check, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Step = "phone" | "otp" | "address" | "payment";

interface SavedAddress {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const defaultAddresses: SavedAddress[] = [
  {
    id: "1",
    name: "John Doe",
    phone: "9876543210",
    address: "123, MG Road, Koramangala",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560034",
    isDefault: true,
  },
  {
    id: "2",
    name: "John Doe",
    phone: "9876543210",
    address: "456, Brigade Road, Indiranagar",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560038",
    isDefault: false,
  },
];

const CheckoutDialog = () => {
  const { items, total, isCheckoutOpen, setIsCheckoutOpen } = useCart();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(defaultAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(defaultAddresses[0]?.id || null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    country: "India",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSendOtp = () => {
    if (phone.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }
    setIsVerifying(true);
    // Simulate OTP sending
    setTimeout(() => {
      setIsVerifying(false);
      setStep("otp");
      toast({
        title: "OTP Sent",
        description: `OTP sent to +91 ${phone}`,
      });
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit OTP",
        variant: "destructive",
      });
      return;
    }
    setIsVerifying(true);
    // Simulate OTP verification
    setTimeout(() => {
      setIsVerifying(false);
      setStep("address");
      toast({
        title: "Phone Verified",
        description: "Your phone number has been verified successfully",
      });
    }, 1000);
  };

  const handleAddNewAddress = () => {
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const newAddress: SavedAddress = {
      id: Date.now().toString(),
      name: formData.fullName,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      isDefault: savedAddresses.length === 0,
    };

    setSavedAddresses([...savedAddresses, newAddress]);
    setSelectedAddressId(newAddress.id);
    setShowAddressForm(false);
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      country: "India",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });
    toast({
      title: "Address Added",
      description: "New address has been saved successfully",
    });
  };

  const handleContinue = () => {
    if (step === "address") {
      if (!selectedAddressId && !showAddressForm) {
        toast({
          title: "Select Address",
          description: "Please select a delivery address",
          variant: "destructive",
        });
        return;
      }
      setStep("payment");
    } else if (step === "payment") {
      // Handle payment submission
      console.log("Order placed:", { items, formData, selectedAddressId });
      toast({
        title: "Order Placed!",
        description: "Your order has been placed successfully",
      });
      setIsCheckoutOpen(false);
    }
  };

  const handleBack = () => {
    if (step === "otp") {
      setStep("phone");
    } else if (step === "address") {
      setStep("otp");
    } else if (step === "payment") {
      setStep("address");
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep("phone");
    setPhone("");
    setOtp(["", "", "", "", "", ""]);
  };

  const getStepLabel = () => {
    switch (step) {
      case "phone": return "Phone";
      case "otp": return "Verify";
      case "address": return "Address";
      case "payment": return "Payment";
    }
  };

  return (
    <Dialog open={isCheckoutOpen} onOpenChange={handleClose}>
      <DialogContent className="p-0 gap-0 max-w-lg max-h-[90vh] overflow-hidden border-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {step !== "phone" && (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            {/* Logo */}
            <div className="bg-charcoal text-white font-bold text-xs px-2 py-1">
              <span className="block leading-tight">RI</span>
              <span className="block leading-tight">MÉ</span>
            </div>
          </div>

          {/* Steps Indicator */}
          <div className="flex items-center gap-2 text-sm">
            <span className={`${step === "phone" || step === "otp" ? "text-charcoal font-medium" : "text-muted-foreground"}`}>
              Verify
            </span>
            <span className="text-muted-foreground">»</span>
            <span className={`${step === "address" ? "text-charcoal font-medium" : "text-muted-foreground"}`}>
              Address
            </span>
            <span className="text-muted-foreground">»</span>
            <span className={`${step === "payment" ? "text-charcoal font-medium" : "text-muted-foreground"}`}>
              Payment
            </span>
          </div>

          <button
            onClick={handleClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Phone Step */}
            {step === "phone" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="font-semibold text-charcoal text-xl mb-2">Enter Your Phone Number</h3>
                  <p className="text-muted-foreground text-sm">We'll send you an OTP to verify</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex mt-1">
                    <div className="flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">
                      <span className="text-sm">🇮🇳 +91</span>
                    </div>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="Enter 10-digit phone number"
                      className="rounded-l-none text-lg"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSendOtp}
                  disabled={phone.length !== 10 || isVerifying}
                  className="w-full bg-charcoal text-white hover:bg-charcoal/90 py-6"
                >
                  {isVerifying ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Get OTP"
                  )}
                </Button>
              </div>
            )}

            {/* OTP Step */}
            {step === "otp" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="font-semibold text-charcoal text-xl mb-2">Verify OTP</h3>
                  <p className="text-muted-foreground text-sm">
                    Enter the 6-digit code sent to +91 {phone}
                  </p>
                </div>

                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-12 h-12 text-center text-xl font-semibold"
                      maxLength={1}
                      inputMode="numeric"
                    />
                  ))}
                </div>

                <div className="text-center">
                  <button
                    onClick={handleSendOtp}
                    className="text-primary text-sm hover:underline"
                  >
                    Resend OTP
                  </button>
                </div>

                <Button
                  onClick={handleVerifyOtp}
                  disabled={otp.join("").length !== 6 || isVerifying}
                  className="w-full bg-charcoal text-white hover:bg-charcoal/90 py-6"
                >
                  {isVerifying ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Verify & Continue"
                  )}
                </Button>
              </div>
            )}

            {/* Address Step */}
            {step === "address" && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-charcoal">Delivery Address</h3>
                </div>

                {/* Saved Addresses */}
                {!showAddressForm && (
                  <div className="space-y-3">
                    {savedAddresses.map((addr) => (
                      <button
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`w-full p-4 border rounded-lg text-left transition-all ${
                          selectedAddressId === addr.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-charcoal">{addr.name}</span>
                              {addr.isDefault && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                            <p className="text-sm text-muted-foreground">+91 {addr.phone}</p>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedAddressId === addr.id
                                ? "border-primary bg-primary"
                                : "border-muted-foreground"
                            }`}
                          >
                            {selectedAddressId === addr.id && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </div>
                      </button>
                    ))}

                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="w-full p-4 border border-dashed border-border rounded-lg flex items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add New Address
                    </button>
                  </div>
                )}

                {/* New Address Form */}
                {showAddressForm && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Add New Address</h4>
                      <button
                        onClick={() => setShowAddressForm(false)}
                        className="text-sm text-primary hover:underline"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          placeholder="Full name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                          placeholder="Phone"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="House no., building, street"
                        className="mt-1 resize-none"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase">
                          City <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          placeholder="City"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase">
                          State <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={formData.state}
                          onChange={(e) => handleInputChange("state", e.target.value)}
                          placeholder="State"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase">
                          Pincode <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={formData.pincode}
                          onChange={(e) => handleInputChange("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                          placeholder="Pincode"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleAddNewAddress}
                      className="w-full"
                    >
                      Save Address
                    </Button>
                  </div>
                )}
              </div>
            )}

            {step === "payment" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-charcoal text-lg">Payment Method</h3>
                </div>

                <div className="space-y-3">
                  <button className="w-full p-4 border border-border rounded-lg flex items-center justify-between hover:border-charcoal transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold text-xs">COD</span>
                      </div>
                      <span className="font-medium">Cash on Delivery</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>

                  <button className="w-full p-4 border border-border rounded-lg flex items-center justify-between hover:border-charcoal transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-xs">UPI</span>
                      </div>
                      <span className="font-medium">UPI Payment</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>

                  <button className="w-full p-4 border border-border rounded-lg flex items-center justify-between hover:border-charcoal transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-bold text-xs">💳</span>
                      </div>
                      <span className="font-medium">Credit / Debit Card</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-64 bg-muted/30 p-4 border-t lg:border-t-0 lg:border-l border-border">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-charcoal">Order Summary</h4>
              <span className="text-sm text-muted-foreground">• {items.length} item(s)</span>
            </div>

            <div className="space-y-2 mb-4">
              {items.slice(0, 2).map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-2">
                  <div className="w-10 h-10 bg-cream flex-shrink-0 overflow-hidden rounded">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-charcoal truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ₹{item.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {items.length > 2 && (
                <p className="text-xs text-muted-foreground">
                  +{items.length - 2} more item(s)
                </p>
              )}
            </div>

            <div className="border-t border-border pt-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">₹{total.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600 text-xs">FREE</span>
              </div>
              <div className="flex justify-between font-semibold text-charcoal">
                <span>Total</span>
                <span>₹{total.toLocaleString()}.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {(step === "address" || step === "payment") && (
          <div className="p-4 border-t border-border bg-white sticky bottom-0">
            <Button
              onClick={handleContinue}
              className="w-full bg-charcoal text-white hover:bg-charcoal/90 py-6 text-sm font-medium"
            >
              {step === "payment" ? "Place Order" : "Continue"}
            </Button>
            <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
              <span>T&C</span>
              <span>|</span>
              <span>Privacy</span>
              <span className="ml-4">🔒 Secured by <strong className="text-charcoal">RIMAÉ</strong></span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
