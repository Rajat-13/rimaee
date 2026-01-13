import { useRef } from "react";
import { Link } from "react-router-dom";
import { allProducts } from "@/data/products";

const winterPicks = [
  {
    name: "BLUE",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80",
    slug: "sandal-veer",
  },
  {
    name: "CRYSTAL",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80",
    slug: "flora-bliss",
  },
  {
    name: "BOMB",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
    slug: "midnight-rose",
  },
];

const WinterPicksSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const featuredProducts = allProducts.slice(0, 4);

  return (
    <section className="section-padding bg-muted">
      <div className="container-wide">
        {/* Header - Same style as Shop by Gender */}
        <div className="text-center mb-12">
          <h2 className="heading-section font-bold">
            Explore Our <em className="highlighted-text not-italic">Winter Picks</em>
          </h2>
        </div>

        {/* Gender-style Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {winterPicks.map((pick) => (
            <Link
              key={pick.name}
              to={`/products/${pick.slug}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-sm"
            >
              <img
                src={pick.image}
                alt={pick.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-charcoal/30 group-hover:bg-charcoal/20 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="font-serif text-2xl md:text-3xl font-medium text-primary-foreground uppercase tracking-wider">
                    {pick.name}
                  </h3>
                  <span className="inline-block mt-4 text-primary-foreground/80 text-sm uppercase tracking-wider border-b border-primary-foreground/50 pb-1 group-hover:border-primary-foreground transition-colors">
                    Shop Now
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WinterPicksSection;
