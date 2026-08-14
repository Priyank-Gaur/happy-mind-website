import { AlertTriangle, Clock, TrendingDown } from "lucide-react";

const challenges = [
  {
    icon: AlertTriangle,
    value: "67%",
    label: "experience unmanaged stress affecting focus and decision-making",
  },
  {
    icon: Clock,
    value: "23%",
    label: "higher absenteeism linked to burnout",
  },
  {
    icon: TrendingDown,
    value: "41%",
    label: "of voluntary attrition connects to emotional well-being challenges",
  },
];

const OrgBusinessCase = () => {
  return (
    <section className="py-20 px-6 lg:px-16">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
            The measurable impact of emotional well-being at work
          </h2>
          <p className="font-sans text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Emotional well-being is not a soft metric. Across industries,
            research confirms it is a direct performance driver that shapes
            focus, judgment quality, retention, leadership effectiveness, and
            team stability.
          </p>
        </div>

        {/* What organisations face today */}
        <div className="mb-16">
          <h3 className="font-serif text-2xl font-semibold text-foreground text-center mb-10">
            What organisations face today
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {challenges.map((challenge, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 border border-border shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300"
              >
                <challenge.icon className="w-8 h-8 text-primary/70 mb-4" />
                <div className="font-serif text-3xl font-bold text-foreground mb-2">
                  {challenge.value}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {challenge.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership Insight */}
        <div className="bg-primary/5 rounded-2xl p-8 md:p-12 mb-12">
          <p className="font-serif text-xl md:text-2xl text-foreground text-center italic leading-relaxed">
            "Teams with emotionally aware leaders demonstrate stronger
            engagement and more effective collaboration."
          </p>
        </div>

        {/* Closing Line */}
        <p className="font-sans text-lg text-muted-foreground text-center max-w-3xl mx-auto">
          HappiMynd supports organisations with data, structure, and dignity —
          not surface-level wellness initiatives.
        </p>
      </div>
    </section>
  );
};

export default OrgBusinessCase;
