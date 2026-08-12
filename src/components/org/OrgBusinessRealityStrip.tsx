import { AlertTriangle, TrendingDown, Users, Target } from "lucide-react";

const realityTiles = [
  {
    icon: AlertTriangle,
    title: "Talent Continuity Risk",
    description: "Quiet disengagement is draining leadership pipelines and institutional memory.",
  },
  {
    icon: TrendingDown,
    title: "Execution Pressure",
    description: "Stressed leaders manage output — not people. Performance becomes fragile.",
  },
  {
    icon: Users,
    title: "Multigenerational Challenges",
    description: "Emotional overload in the system slows judgment, raises escalations and depletes accountability.",
  },
  {
    icon: Target,
    title: "Misplaced Interventions",
    description: "Most fixes target processes & products. The real friction sits in people dynamics.",
  },
];

const OrgBusinessRealityStrip = () => {
  return (
    <section className="py-20 px-6 lg:px-16 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight">
              The Performance Risks Leaders Are Managing — Often Without the Right Lens
            </h2>

            <h3 className="text-primary font-serif text-xl md:text-2xl font-semibold text-foreground">
              Great Strategy. Great Technology. Great Team.
            </h3>

            <p className="font-sans text-xl text-muted-foreground">
              So what's holding performance back?
            </p>

            <p className="font-sans text-xl text-muted-foreground leading-relaxed">
              Those unexpected delivery gaps, leadership strain and talent erosion along the execution journey.
            </p>

            {/* Quote with left border */}
            <div className="border-l-4 border-primary pl-6 py-2">
              <blockquote className="font-serif text-lg text-muted-foreground italic leading-relaxed">
                "Until organisations assimilate the human drivers of performance, every solution remains incomplete."
              </blockquote>
            </div>
          </div>

          {/* Right Side - 2x2 Tiles Grid */}
          <div className="grid grid-cols-2 gap-4">
            {realityTiles.map((tile, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 border border-border/30 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <tile.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-serif text-lg font-semibold text-foreground mb-2">
                  {tile.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tile.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrgBusinessRealityStrip;
