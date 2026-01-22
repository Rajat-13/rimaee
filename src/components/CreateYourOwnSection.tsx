import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";

const CreateYourOwnSection = () => {
  return (
    <section id="create" className="section-padding bg-background">
      <div className="container-wide">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Image */}
          <ScrollReveal direction="left" className="order-2 md:order-1">
            <div className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-sm">
              <img
                src="https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&auto=format&fit=crop&q=80"
                alt="Create your own perfume"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-transparent" />
            </div>
          </ScrollReveal>

          {/* Content */}
          <div className="text-center md:text-left order-1 md:order-2">
            <ScrollReveal delay={0.1}>
              <span className="text-sm uppercase tracking-[0.2em] text-gold font-medium">
                Personalization
              </span>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <h2 className="heading-section font-bold mt-4 mb-6">
                Create <em className="highlighted-text not-italic">Your Own</em> Bottle
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <p className="text-body text-muted-foreground mb-8 max-w-lg mx-auto md:mx-0">
                Design a fragrance as unique as you are. Choose your notes, customize 
                your bottle, and create a signature scent that tells your story. 
                From top notes to base, every detail is in your hands.
              </p>
            </ScrollReveal>
            
            <div className="space-y-4 mb-8">
              <ScrollReveal delay={0.4}>
                <div className="flex items-center gap-4 justify-center md:justify-start">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-gold font-serif text-lg">1</span>
                  </div>
                  <p className="text-body text-left">Choose your fragrance notes</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.5}>
                <div className="flex items-center gap-4 justify-center md:justify-start">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-gold font-serif text-lg">2</span>
                  </div>
                  <p className="text-body text-left">Customize your bottle design</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.6}>
                <div className="flex items-center gap-4 justify-center md:justify-start">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-gold font-serif text-lg">3</span>
                  </div>
                  <p className="text-body text-left">Add a personal message</p>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.7}>
              <Link to="/personalised" className="btn-gold inline-block">
                Start Creating
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateYourOwnSection;
