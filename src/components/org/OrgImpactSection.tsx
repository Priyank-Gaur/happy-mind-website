import { Users, Scale, Lightbulb, Heart } from "lucide-react";

const impactStats = [
  {
    icon: Users,
    value: "70%",
    label: "Long-term employee retention with EI driven leaders",
  },
  {
    icon: Scale,
    value: "5X",
    label: "Conflict Resolution effective with high EQ leaders",
  },
  {
    icon: Lightbulb,
    value: "3X",
    label: "Higher innovation inspiration with Emotionally Intelligent leaders",
  },
  {
    icon: Heart,
    value: "25%",
    label: "Higher customer satisfaction by prioritizing EI",
  },
];

const OrgImpactSection = () => {
  return (
    <section className="py-20 px-6 lg:px-16">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-wider mb-2 sm:mb-3">
            Impact — A Systematic Change
          </p>
          <h2 className="font-serif text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-foreground">
            What organisations see when people intelligence system is embedded
          </h2>
        </div>

        {/* Impact Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {impactStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-primary/20 shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
            >
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-4" />
              <div className="font-serif text-3xl sm:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrgImpactSection;
