import Navbar from "@/components/Navbar";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import HeroSection from "@/components/HeroSection";
import WhatSpaceSection from "@/components/WhatSpaceSection";
import WhoIsThisForSection from "@/components/WhoIsThisForSection";
import ImpactStatsSection from "@/components/ImpactStatsSection";
import TrustedBySection from "@/components/TrustedBySection";
import VoicesSection from "@/components/VoicesSection";
import SocialsSection from "@/components/SocialsSection";
import TrustSection from "@/components/TrustSection";
import FinalInvitationSection from "@/components/FinalInvitationSection";
import Footer from "@/components/Footer";
import FactStats from "@/components/FactStats";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 lg:pt-20">
        <div>
          <AnnouncementBanner />
        </div>
        <div className="surface-hero">
          <HeroSection />
        </div>
        <div className="surface-canvas">
          <FactStats />
        </div>
        <div className="surface-soft">
          <WhatSpaceSection />
        </div>
        <div className="surface-canvas">
          <WhoIsThisForSection />
        </div>
        <div className="surface-band">
          <ImpactStatsSection />
        </div>
        <div className="bg-card">
          <TrustedBySection />
        </div>
        <div className="surface-soft">
          <VoicesSection />
        </div>
        <div className="surface-tint">
          <SocialsSection />
        </div>
        <div className="bg-card">
          <TrustSection />
        </div>
        <div className="surface-tint">
          <FinalInvitationSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
