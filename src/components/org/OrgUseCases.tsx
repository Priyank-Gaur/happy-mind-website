import { Flame, TrendingUp, Award, UserCheck } from "lucide-react";

const outcomes = [
  { icon: Flame, label: "Reduce burnout" },
  { icon: TrendingUp, label: "Improve engagement" },
  { icon: Award, label: "Develop leadership" },
  { icon: UserCheck, label: "Retain talent" },
];

const OrgUseCases = () => {
  return (
    <section className="py-20 px-6 lg:px-16">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
            How organisations use HappiMynd
          </h2>
          <p className="font-sans text-lg text-muted-foreground max-w-3xl mx-auto">
            HappiMynd integrates into existing people systems and workflows.
            Programmes are customised based on workforce size, industry, and
            organisational risk profile.
          </p>
        </div>

        {/* Key Outcomes */}
        <div className="mb-12">
          <h3 className="font-serif text-xl font-semibold text-foreground text-center mb-10">
            Key outcomes
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {outcomes.map((outcome, index) => (
              <div
                key={index}
                className="bg-background rounded-2xl p-6 border border-border/30 shadow-sm text-center hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <outcome.icon className="w-7 h-7 text-primary" />
                </div>
                <span className="font-medium text-foreground">
                  {outcome.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrgUseCases;
