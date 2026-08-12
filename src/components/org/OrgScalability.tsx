import { Building, Building2, Landmark, Globe } from "lucide-react";

const environments = [
  { icon: Building, label: "Startups", range: "10 to 100 employees" },
  { icon: Building2, label: "Mid-sized", range: "100 to 2500 employees" },
  { icon: Landmark, label: "Enterprise", range: "2500+ employees" },
  { icon: Globe, label: "Global", range: "Multi-geography teams" },
];

const OrgScalability = () => {
  return (
    <section className="py-20 px-6 lg:px-16 bg-background">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-4xl font-bold text-primary uppercase tracking-wider mb-3">
            Let's Grow Together
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
            Designed For Scale — Without Losing Trust
          </h2>
          <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
            From fast-growing startups to large enterprises, HappiMynd adapts without 
            compromising privacy or impact.
          </p>
        </div>

        {/* Supported Environments */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {environments.map((env, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 border border-border/30 shadow-sm text-center hover:shadow-md transition-shadow duration-300"
            >
              <env.icon className="w-12 h-12 text-primary mx-auto mb-4" />
              <div className="font-serif text-lg font-semibold text-foreground mb-2">
                {env.label}
              </div>
              <span className="text-sm text-muted-foreground">
                {env.range}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrgScalability;
