import { Users, Building, Award, TrendingUp } from "lucide-react";

const proofStats = [
  {
    icon: Users,
    value: "2L+",
    label: "Individuals engaged across environments",
  },
  {
    icon: Building,
    value: "40+",
    label: "Institutional Clients Across BFSI, IT, Media, Real Estate, Energy",
  },
  {
    icon: Award,
    value: "Industry First",
    label: "Programs for PWD Employees & D.E.I. Interventions",
  },
  {
    icon: TrendingUp,
    value: "35%+",
    label: "Engagement in Corporate Emotional Support Programmes",
  },
];

const OrgProofSection = () => {
  return (
    <section className="py-20 px-6 lg:px-16 bg-muted/30">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            Built On Real-World Experience, Not Theory
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {proofStats.map((stat, index) => (
            <div
              key={index}
              className="bg-background rounded-2xl p-6 border border-border/30 shadow-sm text-center"
            >
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-4" />
              <div className="font-serif text-2xl md:text-3xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrgProofSection;
