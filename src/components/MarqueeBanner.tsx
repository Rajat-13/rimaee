const MarqueeBanner = () => {
  const text = "The Scent Loot Box is Now Live — Choose Your 4 Scents at ₹1599";
  
  return (
    <div className="bg-charcoal text-white py-2.5 overflow-hidden">
      <div className="marquee-track flex whitespace-nowrap">
        {[...Array(10)].map((_, i) => (
          <span key={i} className="marquee-text mx-8 text-xs uppercase tracking-[0.2em] font-light">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeBanner;
