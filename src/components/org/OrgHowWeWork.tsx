import { Users, Target, Heart, UserCheck, Brain, Shield, Zap } from "lucide-react";

const coreFramework = [
  {
    icon: Users,
    letter: "C",
    title: "Culture & Collaboration",
    description: "Building synergy across diverse personalities through awareness and EQ.",
  },
  {
    icon: Target,
    letter: "O",
    title: "Outcomes & Performance",
    description: "Aligning roles, strengths and adaptability for consistent execution.",
  },
  {
    icon: Heart,
    letter: "R",
    title: "Relationships & Retention",
    description: "Creating belonging, trust and sustainable engagement.",
  },
  {
    icon: UserCheck,
    letter: "E",
    title: "Empathetic Leadership",
    description: "Developing leaders who inspire discretionary effort.",
  },
];

const eipaModel = [
  {
    icon: Brain,
    title: "Self-Awareness",
    description: "Moving people from comfort zones to optimal performance zones.",
  },
  {
    icon: Shield,
    title: "Emotional Resilience",
    description: "Strengthening capacity to lead and perform under pressure.",
  },
  {
    icon: Zap,
    title: "Mental Vibrancy",
    description: "Enhancing focus, synergy and discretionary effort across teams.",
  },
];

const OrgHowWeWork = () => {
  return (
    <section className="py-20 px-6 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            A Framework That Translates Psychology Into Performance
          </h2>
        </div>

        {/* C.O.R.E. Framework */}
        <div className="mb-16">
          <h3 className="font-serif text-4xl font-bold text-foreground text-center mb-10">
            <span className="text-primary">The C.O.R.E.</span>
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreFramework.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-serif text-xl font-bold text-primary">
                      {item.letter}
                    </span>
                  </div>
                  <item.icon className="w-6 h-6 text-primary/70" />
                </div>
                <h4 className="font-serif text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* EIPA Model */}
        <div>
          <h3 className="font-serif text-2xl font-semibold text-foreground text-center mb-4">
            The Emotional Intelligence & Personality Analytics (EIPA) Model
          </h3>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {eipaModel.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <item.icon className="w-10 h-10 text-primary mb-4" />
                <h4 className="font-serif text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrgHowWeWork;
