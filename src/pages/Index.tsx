import Header from "@/components/Header";
import MarqueeBanner from "@/components/MarqueeBanner";
import HeroSlider from "@/components/HeroSlider";
import BestsellersSection from "@/components/BestsellersSection";
import CategorySection from "@/components/CategorySection";
import CreateYourOwnSection from "@/components/CreateYourOwnSection";
import GenderSection from "@/components/GenderSection";
import NewsletterSection from "@/components/NewsletterSection";
import TrustBadges from "@/components/TrustBadges";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <MarqueeBanner />
      <Header />
      <main>
        <HeroSlider />
        <BestsellersSection />
        <CategorySection />
        <CreateYourOwnSection />
        <GenderSection />
        <NewsletterSection />
        <TrustBadges />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
