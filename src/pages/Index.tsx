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
        <div className="bg-background">
          <AnnouncementBanner />
        </div>
        <div className="bg-muted/30">
          <HeroSection />
        </div>
        <div className="bg-background">
          <FactStats />
        </div>
        <div className="bg-background">
          <WhatSpaceSection />
        </div>
        <div className="bg-muted/30">
          <WhoIsThisForSection />
        </div>
        <div className="bg-gradient-to-r from-purple-50 via-white to-purple-50">
          <ImpactStatsSection />
        </div>
        <div className="bg-background">
          <TrustedBySection />
        </div>
        <div className="bg-muted/30">
          <VoicesSection />
        </div>
        <div className="bg-gradient-to-r from-purple-50 via-white to-purple-50">
          <SocialsSection />
        </div>
        <div className="bg-background">
          <TrustSection />
        </div>
        <div className="bg-muted/30">
          <FinalInvitationSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
