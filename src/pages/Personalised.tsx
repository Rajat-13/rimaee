import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronLeft, ChevronRight, ShoppingCart, CreditCard } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustBadges from "@/components/TrustBadges";
import { useCart } from "@/context/CartContext";

// Note options with prices
const noteOptions = {
  top: [
    { name: "Bergamot", price: 50 },
    { name: "Lemon", price: 40 },
    { name: "Grapefruit", price: 45 },
    { name: "Pink Pepper", price: 60 },
    { name: "Cardamom", price: 55 },
    { name: "Lavender", price: 50 },
    { name: "Orange", price: 35 },
    { name: "Rose", price: 70 },
  ],
  middle: [
    { name: "Jasmine", price: 80 },
    { name: "Rose", price: 85 },
    { name: "Sandalwood", price: 100 },
    { name: "Oud", price: 150 },
    { name: "Iris", price: 90 },
    { name: "Violet", price: 75 },
    { name: "Peony", price: 70 },
    { name: "Cinnamon", price: 55 },
  ],
  base: [
    { name: "Vanilla", price: 60 },
    { name: "Musk", price: 70 },
    { name: "Amber", price: 80 },
    { name: "Cedar", price: 65 },
    { name: "Vetiver", price: 75 },
    { name: "Leather", price: 90 },
    { name: "Benzoin", price: 85 },
    { name: "Patchouli", price: 70 },
  ],
};

// Bottle options
const bottleOptions = [
  {
    id: "classic",
    name: "Classic Elegance",
    price: 200,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&auto=format&fit=crop&q=80",
    description: "Timeless rectangular design",
  },
  {
    id: "modern",
    name: "Modern Luxe",
    price: 350,
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&auto=format&fit=crop&q=80",
    description: "Sleek contemporary style",
  },
  {
    id: "vintage",
    name: "Vintage Charm",
    price: 450,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&auto=format&fit=crop&q=80",
    description: "Art deco inspired elegance",
  },
  {
    id: "premium",
    name: "Premium Crystal",
    price: 600,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&auto=format&fit=crop&q=80",
    description: "Handcrafted crystal masterpiece",
  },
];

const Personalised = () => {
  const navigate = useNavigate();
  const { addItem, setIsCartOpen, setIsCheckoutOpen } = useCart();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedNotes, setSelectedNotes] = useState<{
    top: string[];
    middle: string[];
    base: string[];
  }>({ top: [], middle: [], base: [] });
  const [selectedBottle, setSelectedBottle] = useState<string | null>(null);
  const [personalMessage, setPersonalMessage] = useState("");
  const [perfumeName, setPerfumeName] = useState("");

  const toggleNote = (category: "top" | "middle" | "base", noteName: string) => {
    setSelectedNotes((prev) => {
      const current = prev[category];
      if (current.includes(noteName)) {
        return { ...prev, [category]: current.filter((n) => n !== noteName) };
      }
      if (current.length < 3) {
        return { ...prev, [category]: [...current, noteName] };
      }
      return prev;
    });
  };

  const calculateNotesPrice = () => {
    let total = 0;
    (["top", "middle", "base"] as const).forEach((category) => {
      selectedNotes[category].forEach((noteName) => {
        const note = noteOptions[category].find((n) => n.name === noteName);
        if (note) total += note.price;
      });
    });
    return total;
  };

  const calculateTotalPrice = () => {
    const notesPrice = calculateNotesPrice();
    const bottle = bottleOptions.find((b) => b.id === selectedBottle);
    const bottlePrice = bottle?.price || 0;
    const basePrice = 500; // Base formulation price
    return basePrice + notesPrice + bottlePrice;
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return (
        selectedNotes.top.length > 0 &&
        selectedNotes.middle.length > 0 &&
        selectedNotes.base.length > 0
      );
    }
    if (currentStep === 2) {
      return selectedBottle !== null;
    }
    return true;
  };

  const handleAddToCart = () => {
    const bottle = bottleOptions.find((b) => b.id === selectedBottle);
    addItem({
      id: `custom-${Date.now()}`,
      name: perfumeName || "Custom Perfume",
      size: "50ml",
      price: calculateTotalPrice(),
      quantity: 1,
      image: bottle?.image || bottleOptions[0].image,
    });
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    const bottle = bottleOptions.find((b) => b.id === selectedBottle);
    addItem({
      id: `custom-${Date.now()}`,
      name: perfumeName || "Custom Perfume",
      size: "50ml",
      price: calculateTotalPrice(),
      quantity: 1,
      image: bottle?.image || bottleOptions[0].image,
    });
    setIsCheckoutOpen(true);
  };

  const steps = [
    { number: 1, title: "Choose Notes" },
    { number: 2, title: "Select Bottle" },
    { number: 3, title: "Your Message" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 md:pt-24 pb-16">
        <div className="container-wide px-4">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-charcoal mb-4">
              Create Your Signature Scent
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              Design a fragrance that's uniquely yours in 3 simple steps
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8 md:mb-12">
            <div className="flex items-center gap-2 md:gap-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`flex items-center gap-2 ${
                      currentStep >= step.number ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-medium ${
                        currentStep > step.number
                          ? "bg-primary text-white"
                          : currentStep === step.number
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {currentStep > step.number ? (
                        <Check className="w-4 h-4 md:w-5 md:h-5" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <span className="hidden md:block text-sm font-medium">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 md:w-16 h-0.5 mx-2 md:mx-4 ${
                        currentStep > step.number ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="max-w-4xl mx-auto">
            {/* Step 1: Choose Notes */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="text-center mb-6">
                  <h2 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal mb-2">
                    Choose Your Fragrance Notes
                  </h2>
                  <p className="text-muted-foreground text-sm md:text-base">
                    Select up to 3 notes from each category
                  </p>
                </div>

                {(["top", "middle", "base"] as const).map((category) => (
                  <div key={category} className="bg-white rounded-xl p-4 md:p-6 border border-border">
                    <h3 className="font-serif text-lg md:text-xl font-medium text-charcoal mb-4 capitalize">
                      {category} Notes
                      <span className="text-sm text-muted-foreground font-sans ml-2">
                        ({selectedNotes[category].length}/3 selected)
                      </span>
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                      {noteOptions[category].map((note) => (
                        <button
                          key={note.name}
                          onClick={() => toggleNote(category, note.name)}
                          className={`p-3 md:p-4 rounded-lg border-2 transition-all text-left ${
                            selectedNotes[category].includes(note.name)
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <span className="block text-sm md:text-base font-medium text-charcoal">
                            {note.name}
                          </span>
                          <span className="block text-xs md:text-sm text-primary font-semibold mt-1">
                            +₹{note.price}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Notes Price Summary */}
                <div className="bg-muted/50 rounded-xl p-4 md:p-6">
                  <div className="flex justify-between items-center">
                    <span className="text-charcoal font-medium">Notes Total:</span>
                    <span className="text-xl md:text-2xl font-semibold text-primary">
                      ₹{calculateNotesPrice()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Select Bottle */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="text-center mb-6">
                  <h2 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal mb-2">
                    Select Your Bottle Design
                  </h2>
                  <p className="text-muted-foreground text-sm md:text-base">
                    Choose a bottle that matches your style
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {bottleOptions.map((bottle) => (
                    <button
                      key={bottle.id}
                      onClick={() => setSelectedBottle(bottle.id)}
                      className={`rounded-xl border-2 overflow-hidden transition-all ${
                        selectedBottle === bottle.id
                          ? "border-primary shadow-lg"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="aspect-square bg-muted/30">
                        <img
                          src={bottle.image}
                          alt={bottle.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3 md:p-4 text-left">
                        <h4 className="font-medium text-charcoal text-sm md:text-base">
                          {bottle.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1 hidden md:block">
                          {bottle.description}
                        </p>
                        <span className="block text-primary font-semibold mt-2 text-sm md:text-base">
                          ₹{bottle.price}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Bottle Price Summary */}
                {selectedBottle && (
                  <div className="bg-muted/50 rounded-xl p-4 md:p-6">
                    <div className="flex justify-between items-center">
                      <span className="text-charcoal font-medium">Selected Bottle:</span>
                      <span className="text-xl md:text-2xl font-semibold text-primary">
                        ₹{bottleOptions.find((b) => b.id === selectedBottle)?.price}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Personal Message */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="text-center mb-6">
                  <h2 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal mb-2">
                    Add Your Personal Touch
                  </h2>
                  <p className="text-muted-foreground text-sm md:text-base">
                    Name your creation and add a special message
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 md:p-6 border border-border space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Name Your Perfume
                    </label>
                    <input
                      type="text"
                      value={perfumeName}
                      onChange={(e) => setPerfumeName(e.target.value)}
                      placeholder="e.g., Midnight Dreams"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Personal Message (Optional)
                    </label>
                    <textarea
                      value={personalMessage}
                      onChange={(e) => setPersonalMessage(e.target.value)}
                      placeholder="Add a message for the bottle label or gift card..."
                      rows={4}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                  </div>
                </div>

                {/* Final Summary */}
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-4 md:p-6 border border-primary/20">
                  <h3 className="font-serif text-xl md:text-2xl font-semibold text-charcoal mb-4">
                    Your Custom Perfume
                  </h3>
                  
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Bottle Preview */}
                    <div className="flex-shrink-0">
                      <img
                        src={bottleOptions.find((b) => b.id === selectedBottle)?.image}
                        alt="Your bottle"
                        className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-lg mx-auto md:mx-0"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Base Price:</span>
                        <span className="text-charcoal">₹500</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Selected Notes:</span>
                        <span className="text-charcoal">₹{calculateNotesPrice()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Bottle Design:</span>
                        <span className="text-charcoal">
                          ₹{bottleOptions.find((b) => b.id === selectedBottle)?.price}
                        </span>
                      </div>
                      <div className="border-t border-border pt-3 mt-3">
                        <div className="flex justify-between">
                          <span className="text-lg font-medium text-charcoal">Total Price:</span>
                          <span className="text-2xl md:text-3xl font-bold text-primary">
                            ₹{calculateTotalPrice()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex items-center justify-center gap-2 bg-charcoal text-white py-4 text-sm font-medium uppercase tracking-wider hover:bg-charcoal/90 transition-colors rounded-md"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="flex items-center justify-center gap-2 bg-primary text-white py-4 text-sm font-medium uppercase tracking-wider hover:bg-primary/90 transition-colors rounded-md"
                    >
                      <CreditCard className="w-4 h-4" />
                      Buy it Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
              <button
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-md transition-colors ${
                  currentStep === 1
                    ? "text-muted-foreground cursor-not-allowed"
                    : "text-charcoal hover:bg-muted"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden md:inline">Previous</span>
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={() => setCurrentStep((prev) => Math.min(3, prev + 1))}
                  disabled={!canProceed()}
                  className={`flex items-center gap-2 px-6 md:px-8 py-3 rounded-md transition-colors ${
                    canProceed()
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </main>
      <TrustBadges />
      <Footer />
    </div>
  );
};

export default Personalised;