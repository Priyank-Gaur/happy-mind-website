import { Target, Lightbulb, TrendingUp } from "lucide-react";
import organizationHero from "@/assets/organization-page-section-3.png";

const gaps = [
  { label: "Reactive", desc: "Support begins only after crisis" },
  { label: "Generic", desc: "One-size-fits-all programmes" },
  { label: "Underutilised", desc: "Low employee adoption reduces impact" },
];

const valuePillars = [
  {
    icon: Target,
    title: "Precision Over Generic Programmes",
    description: "No one-size-fits-all initiatives. Every solution is shaped around your organisation's real dynamics.",
  },
  {
    icon: Lightbulb,
    title: "Insight Before Action",
    description: "We diagnose first, intervene second — ensuring effort goes where impact is highest.",
  },
  {
    icon: TrendingUp,
    title: "Business + People Outcomes",
    description: "Performance and well-being improve together, not at each other's cost.",
  },
];

const OrgStrategicGapWithHappiMynd = () => {
  return (
    <section className="py-20 px-6 lg:px-16 bg-background">
      <div className="container mx-auto max-w-7xl">
        {/* Main Content - Image and first paragraph together */}
        <div className="flex flex-col lg:flex-row gap-12 items-start mb-12">
          {/* Left Content - Image */}
          <div className="lg:w-1/2 flex justify-center lg:justify-start">
            <img 
              src={organizationHero} 
              alt="Corporate people intelligence" 
              className="w-full max-w-md rounded-2xl shadow-lg"
            />
          </div>
          
          {/* Right Content - Strategic Gap Section */}
          <div className="lg:w-1/2 space-y-4">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
              Why Do Most Corporate Growth Initiatives Fail?
            </h2>

            <p className="font-sans text-xl text-muted-foreground leading-relaxed">
              Most programmes fail not because organisations do not care — but because 
              the fundamentals are misplaced.
            </p>

            {/* Gaps with red dots */}
            <div className="space-y-2">
              {gaps.map((gap, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-destructive rounded-full flex-shrink-0 mt-2" />
                  <div>
                    <span className="font-semibold text-foreground">{gap.label}:</span>{" "}
                    <span className="text-muted-foreground">{gap.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* With HappiMynd Section - Below the image and first paragraph */}
        <div className="space-y-8">
          <div className="space-y-6">
            <p className="text-lg font-semibold text-primary uppercase tracking-wider">
              With HappiMynd
            </p>

            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              From People Problems to <span className="text-primary">People Intelligence</span>
            </h2>

            <h3 className="font-sans text-xl text-muted-foreground">
              HappiMynd turns emotional intelligence and personality insight into an organisational advantage.
            </h3>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="text-xl">
                Most organisations respond to people's challenges with generic programmes; 
                training modules, EAPs, wellness weeks, surveys and engagement drives.
              </p>
              <p className="text-primary font-bold text-foreground text-2xl">
                HappiMynd Works Differently.
              </p>
              <p className="text-xl">
                We use psychodiagnostic intelligence to identify the real drivers behind 
                performance gaps and build targeted interventions that strengthen leadership, 
                teams and culture at the root.
              </p>
              <p className="font-serif text-lg text-primary italic">
                This is not about fixing symptoms. It is about strengthening the system.
              </p>
            </div>
          </div>

          {/* Value Pillars */}
          <div className="grid md:grid-cols-3 gap-4">
            {valuePillars.map((pillar, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-5 border border-border/30 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex flex-col gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex-shrink-0 flex items-center justify-center">
                    <pillar.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-semibold text-foreground mb-1">
                      {pillar.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrgStrategicGapWithHappiMynd;
