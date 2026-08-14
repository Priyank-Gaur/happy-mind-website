import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrgHeroSection from "@/components/org/OrgHeroSection";
import OrgScrollingBanner from "@/components/org/OrgScrollingBanner";
import OrgBusinessRealityStrip from "@/components/org/OrgBusinessRealityStrip";
import OrgStrategicGapWithHappiMynd from "@/components/org/OrgStrategicGapWithHappiMynd";
import OrgImpactSection from "@/components/org/OrgImpactSection";
import OrgHowWeWork from "@/components/org/OrgHowWeWork";
import OrgProofSection from "@/components/org/OrgProofSection";
import OrgClientReviews from "@/components/org/OrgClientReviews";
import OrgTrustConfidentiality from "@/components/org/OrgTrustConfidentiality";
import OrgScalability from "@/components/org/OrgScalability";
import OrgStrategicClosing from "@/components/org/OrgStrategicClosing";

const ForOrganisations = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <div className="surface-hero">
          <OrgHeroSection />
        </div>
        <div className="bg-card">
          <OrgScrollingBanner />
        </div>
        <div className="surface-soft">
          <OrgBusinessRealityStrip />
        </div>
        <div className="surface-canvas">
          <OrgStrategicGapWithHappiMynd />
        </div>
        <div className="surface-band">
          <OrgImpactSection />
        </div>
        <div className="bg-card">
          <OrgHowWeWork />
        </div>
        <div className="surface-soft">
          <OrgProofSection />
        </div>
        <div className="surface-canvas">
          <OrgClientReviews />
        </div>
        <div className="bg-card">
          <OrgTrustConfidentiality />
        </div>
        <div className="surface-canvas">
          <OrgScalability />
        </div>
        <div className="surface-tint">
          <OrgStrategicClosing />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForOrganisations;
