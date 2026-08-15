import Navbar from "@/components/Navbar";
import SolvHeroSection from "@/components/individual/SolvHeroSection";
import SolvImpactStats from "@/components/individual/SolvImpactStats";
import SolvWhoThisIsFor from "@/components/individual/SolvWhoThisIsFor";
import SolvRealityCheck from "@/components/individual/SolvRealityCheck";
import JourneySection from "@/components/individual/JourneySection";
import SolvBackedByPsychology from "@/components/individual/SolvBackedByPsychology";
import SolvCommunity from "@/components/individual/SolvCommunity";
import SolvPrivacySecurity from "@/components/individual/SolvPrivacySecurity";
import Footer from "@/components/Footer";

const ForIndividuals = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <div className="surface-hero">
          <SolvHeroSection />
        </div>
        <div className="bg-card">
          <SolvImpactStats />
        </div>
        <div className="surface-soft">
          <SolvWhoThisIsFor />
        </div>
        <div className="bg-card">
          <SolvRealityCheck />
        </div>
        <div className="surface-soft">
          <JourneySection />
        </div>
        <div className="bg-card">
          <SolvBackedByPsychology />
        </div>
        <div className="surface-tint">
          <SolvCommunity />
        </div>
        <div className="surface-canvas">
          <SolvPrivacySecurity />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForIndividuals;
