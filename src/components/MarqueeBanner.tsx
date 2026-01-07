const MarqueeBanner = () => {
  const text = "The Scent Loot Box is Now Live — Choose Your 4 Scents at ₹1599";
  
  return (
    <a 
      href="#loot-box" 
      className="block bg-gold text-charcoal py-3 overflow-hidden hover:bg-gold/90 transition-colors cursor-pointer"
    >
      <div className="marquee-track flex whitespace-nowrap">
        {[...Array(10)].map((_, i) => (
          <span key={i} className="marquee-text mx-8 text-sm uppercase tracking-[0.15em] font-semibold">
            {text} ✦
          </span>
        ))}
      </div>
    </a>
  );
};

export default MarqueeBanner;
