import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import UrgencySection from "@/components/UrgencySection";
import DifferentiatorSection from "@/components/DifferentiatorSection";
import AnalysisSection from "@/components/AnalysisSection";
import StatsSection from "@/components/StatsSection";
import MarketImpactSection from "@/components/MarketImpactSection";
import TechStackSection from "@/components/TechStackSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <div id="urgency">
          <UrgencySection />
        </div>
        <DifferentiatorSection />
        <AnalysisSection />
        <div id="stats">
          <StatsSection />
        </div>
        <MarketImpactSection />
        <div id="tech">
          <TechStackSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
