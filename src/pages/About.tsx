import Navbar from "@/components/Navbar";
import AboutHeroSection from "@/components/about/AboutHeroSection";
import AboutGapSection from "@/components/about/AboutGapSection";
import AboutMissionVisionSection from "@/components/about/AboutMissionVisionSection";
import AboutApproachSection from "@/components/about/AboutApproachSection";
import AboutMilestonesSection from "@/components/about/AboutMilestonesSection";
import AboutTeamSection from "@/components/about/AboutTeamSection";
import FinalInvitationSection from "@/components/FinalInvitationSection";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 lg:pt-20">
        <div className="surface-hero">
          <AboutHeroSection />
        </div>
        <div className="surface-soft">
          <AboutGapSection />
        </div>
        <div className="surface-tint">
          <AboutMissionVisionSection />
        </div>
        <div className="bg-card">
          <AboutApproachSection />
        </div>
        <div className="bg-card">
          <AboutTeamSection />
        </div>
        <div className="bg-card">
          <AboutMilestonesSection />
        </div>
        <div className="surface-tint">
          <FinalInvitationSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
