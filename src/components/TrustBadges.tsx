import { Truck, RotateCcw, Shield } from "lucide-react";

const TrustBadges = () => {
  const badges = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "Free shipping on orders above ₹399 across India",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "Simple return process with the perfumes",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "Your payment information is processed through secure payment gateway",
    },
  ];

  return (
    <section className="py-12 bg-muted/30 border-t border-border">
      <div className="container-wide px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center gap-3"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <badge.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-lg font-semibold">{badge.title}</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
