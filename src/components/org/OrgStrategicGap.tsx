import { XCircle, CheckCircle } from "lucide-react";

const commonGaps = [
  { label: "Reactive", desc: "Support begins only after crisis" },
  { label: "Generic", desc: "One-size-fits-all programmes" },
  { label: "Underutilised", desc: "Low employee adoption" },
];

const howDifferent = [
  "Early emotional insight before issues escalate",
  "Daily self-management tools employees actually use",
  "Confidential professional support when required",
  "Anonymised intelligence for informed leadership decisions",
];

const OrgStrategicGap = () => {
  return (
    <section className="py-20 px-6 lg:px-16">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
            Why most corporate wellness initiatives fail
          </h2>
          <p className="font-sans text-lg text-muted-foreground max-w-3xl mx-auto">
            Most programmes fail not because organisations do not care — but
            because the systems are flawed.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Common Gaps */}
          <div className="bg-background rounded-2xl p-8 border border-border/30 shadow-sm">
            <h3 className="font-serif text-xl font-semibold text-foreground mb-8">
              Common gaps
            </h3>
            <div className="space-y-6">
              {commonGaps.map((gap, index) => (
                <div key={index} className="flex items-start gap-4">
                  <XCircle className="w-6 h-6 text-destructive/70 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">
                      {gap.label}:
                    </span>{" "}
                    <span className="text-muted-foreground">{gap.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How HappiMynd is Different */}
          <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20 shadow-sm">
            <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
              How HappiMynd is different
            </h3>
            <p className="text-muted-foreground mb-8">
              HappiMynd replaces reactive wellness with a systems-led emotional
              infrastructure.
            </p>
            <div className="space-y-4">
              {howDifferent.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Positioning Line */}
        <div className="mt-16 text-center">
          <p className="font-serif text-xl md:text-2xl text-primary font-medium">
            This is not a wellness add-on. It is an organisational capability.
          </p>
        </div>
      </div>
    </section>
  );
};

export default OrgStrategicGap;
