import { BarChart3, HeartHandshake, Brain, Users, Target } from "lucide-react";

const modules = [
  {
    icon: BarChart3,
    title: "Organisation-level emotional insight",
    description:
      "Our psychodiagnostic framework captures anonymised emotional health trends across teams and functions. Leaders gain visibility into stress patterns, engagement signals, and resilience indicators — without accessing individual employee data.",
    highlight: "This enables proactive intervention while preserving trust.",
  },
  {
    icon: HeartHandshake,
    title: "Always-available emotional support",
    description:
      "Employees access emotional check-ins, self-management tools, safe expression spaces, learning resources, and confidential professional conversations.",
    highlight: "Support is continuous — not limited to crisis moments.",
  },
  {
    icon: Brain,
    title: "Stronger leadership through emotional intelligence",
    description:
      "Programmes build self-awareness, stress management, communication skills, conflict handling, and psychologically safe leadership.",
    highlight: "Emotionally aware leaders create stable, high-performing teams.",
  },
  {
    icon: Users,
    title: "Emotional safety for diverse workforces",
    description:
      "Support frameworks for employees with disabilities, LGBTQ+ teams, returning parents, caregivers, and underrepresented groups — focused on dignity, safety, and sustained inclusion.",
    highlight: null,
  },
  {
    icon: Target,
    title: "Strengthening alignment and engagement",
    description:
      "We help organisations strengthen purpose alignment, morale, emotional resilience, and long-term engagement — because supported people perform better.",
    highlight: null,
  },
];

const OrgCorporatePlatform = () => {
  return (
    <section className="py-20 px-6 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            A scalable emotional well-being infrastructure
          </h2>
          <p className="font-sans text-lg text-muted-foreground">
            Built for modern organisations that understand performance is driven
            by people.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module, index) => (
            <div
              key={index}
              className="bg-background rounded-2xl p-8 border border-border/30 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <module.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                {module.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {module.description}
              </p>
              {module.highlight && (
                <p className="text-primary text-sm font-medium">
                  {module.highlight}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrgCorporatePlatform;
