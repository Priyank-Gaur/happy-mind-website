import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye } from "lucide-react";
import organizationHero from "@/assets/org-page-hero.png";

const microTablets = [
  { icon: Shield, text: "Enterprise-Grade Security" },
  { icon: Lock, text: "GDPR Compliant" },
  { icon: Eye, text: "Anonymised Insights" },
];

const peopleIntelligenceStats = [
  {
    value: "$438 Bn.",
    label: "disengaged employees cost to company affecting culture and collaboration",
  },
  {
    value: "$8.8 Tn.",
    label: "cost of lost productivity annually impacting performance and outcome",
  },
  {
    value: "$4 Tn.",
    label: "cost due to employee leaving before their concerns are visible",
  },
  {
    value: "$550 Bn.",
    label: "costs due to lack of effective leadership",
  },
];

const heroPills = [
  "Psycho-Diagnostics & Analytics",
  "Emotionally Resilient Workforce",
  "People Intelligence For Leadership",
];

const OrgHeroSection = () => {
  return (
    <section className="py-16 px-6 lg:px-16">
      <div className="container mx-auto">
        {/* Micro Tablets */}
        <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
          {microTablets.map((tablet, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-md px-4 py-2"
            >
              <tablet.icon className="w-4 h-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">{tablet.text}</span>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* H1 */}
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
              Where People Intelligence Drives{" "}
              <span className="text-primary">Business Performance</span>
            </h1>

            {/* H2 */}
            <h2 className="font-sans text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
              Built on psychodiagnostics and people intelligence, HappiMynd enables 
              organisations to move beyond surface-level metrics and address the real 
              drivers of performance - behaviour, emotional regulation and personality dynamics.
            </h2>

            {/* People Intelligence Stats */}
            <div className="space-y-4">
              <h3 className="font-serif text-base sm:text-lg md:text-xl font-semibold text-foreground">
                People Intelligence - A Global Need
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {peopleIntelligenceStats.map((stat, index) => (
                  <div
                  
                    key={index}
                    className="bg-white border border-border rounded-xl p-5 text-left shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300"
                  >
                    <span className="font-serif text-xl sm:text-2xl font-bold text-primary">
                      {stat.value}
                    </span>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-snug">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Image with Pills */}
          <div className="flex flex-col items-center gap-6">
            <img
              src={organizationHero}
              alt="People-centric organizational growth"
              className="w-full max-w-lg lg:max-w-xl h-auto object-contain rounded-2xl shadow-lg"
            />
            
            {/* Pills Below Image */}
            <div className="flex flex-wrap justify-center gap-3">
              {heroPills.slice(0, 2).map((pill, index) => (
                <div
                  key={index}
                  className="bg-primary/10 border border-primary/30 rounded-md px-5 py-2.5"
                >
                  <span className="text-sm font-medium text-primary">{pill}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <div className="bg-primary/10 border border-primary/30 rounded-md px-5 py-2.5">
                <span className="text-sm font-medium text-primary">{heroPills[2]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrgHeroSection;
