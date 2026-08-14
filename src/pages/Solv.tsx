import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SolvHeroSection from "@/components/solv/SolvHeroSection";
import SolvImpactStats from "@/components/solv/SolvImpactStats";
import SolvRealityCheck from "@/components/solv/SolvRealityCheck";
import SolvBridgeStatement from "@/components/solv/SolvBridgeStatement";
import SolvHowItWorks from "@/components/solv/SolvHowItWorks";
import SolvIntroSession from "@/components/solv/SolvIntroSession";
import SolvConversionOffer from "@/components/solv/SolvConversionOffer";
import SolvPrivacySecurity from "@/components/solv/SolvPrivacySecurity";

const Solv = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {/* 1. Hero */}
        <div className="surface-hero">
          <SolvHeroSection />
        </div>

        {/* 2. Impact Stats */}
        <div className="bg-card">
          <SolvImpactStats />
        </div>

        {/* 3. Reality Check */}
        <div className="surface-soft">
          <SolvRealityCheck />
        </div>

        {/* 4. Bridge Statement */}
        <div className="surface-canvas">
          <SolvBridgeStatement />
        </div>

        {/* 5. How It Works */}
        <div className="bg-card">
          <SolvHowItWorks />
        </div>

        {/* 6. Intro Session Experience */}
        <div className="surface-canvas">
          <SolvIntroSession />
        </div>

        {/* 7. Conversion Offer */}
        <div className="surface-tint">
          <SolvConversionOffer />
        </div>

        {/* 8. Trust, Privacy & Security */}
        <div className="surface-canvas">
          <SolvPrivacySecurity />
        </div>
      </main>

      {/* 9. Footer */}
      <Footer />
    </div>
  );
};

export default Solv;
