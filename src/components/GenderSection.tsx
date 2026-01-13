import { Link } from "react-router-dom";
import forHimImg from "@/assets/for-him.png";
import forHerImg from "@/assets/for-her.png";
import unisexImg from "@/assets/unisex.png";

const genders = [
  {
    id: 1,
    name: "For Him",
    image: forHimImg,
    slug: "for-him",
  },
  {
    id: 2,
    name: "For Her",
    image: forHerImg,
    slug: "for-her",
  },
  {
    id: 3,
    name: "Unisex",
    image: unisexImg,
    slug: "unisex",
  },
];

const GenderSection = () => {
  return (
    <section className="section-padding bg-muted">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="heading-section font-bold">
            Shop by <em className="highlighted-text not-italic">Gender</em>
          </h2>
        </div>

        {/* Gender Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {genders.map((gender) => (
            <Link
              key={gender.id}
              to={`/all-products?gender=${gender.slug}`}
              state={{ selectedGender: gender.slug }}
              className="group relative aspect-[3/4] overflow-hidden rounded-sm"
            >
              <img
                src={gender.image}
                alt={gender.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-charcoal/30 group-hover:bg-charcoal/20 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="font-serif text-2xl md:text-3xl font-medium text-primary-foreground uppercase tracking-wider">
                    {gender.name}
                  </h3>
                  <span className="inline-block mt-4 text-primary-foreground/80 text-sm uppercase tracking-wider border-b border-primary-foreground/50 pb-1 group-hover:border-primary-foreground transition-colors">
                    Explore Collection
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

export default GenderSection;
