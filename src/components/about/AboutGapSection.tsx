import { Lightbulb, Heart, Target, Cpu } from "lucide-react";

const gaps = [
  {
    icon: Lightbulb,
    title: "Growth desire without awareness",
    description:
      "People want to grow. Organisations invest in growth. But without understanding how we think, react, and decide, growth aspirations become a directionless journey - for individuals and for teams both.",
  },
  {
    icon: Heart,
    title: "Performance without emotional intelligence",
    description:
      "We expect better outcomes - in careers, in leadership, in life. Yet emotional capability is rarely built with the same intent as technical skills, leading to strained life. The result is progress without resilience, and ambition without clarity.",
  },
  {
    icon: Target,
    title: "Support without strategy",
    description:
      "Whether it's personal well-being or workplace initiatives, support often exists in fragments- not as a system. Without structure & conscious awareness, insights fade and change rarely lasts.",
  },
  {
    icon: Cpu,
    title: "Technology without humanity",
    description:
      "Tools can scale efficiency, but growth is still deeply human. Motivation, behaviour patterns, emotional responses - with awareness and direction shape results far more than processes alone.",
  },
];

const AboutGapSection = () => {
  return (
    <section className="py-24 px-6 lg:px-16">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            What The World Was Missing
          </h2>
        </div>

        {/* Gap Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {gaps.map((gap, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <gap.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                    {gap.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {gap.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Closing Statement */}
        <div className="text-center max-w-4xl mx-auto">
          <p className="font-sans text-lg md:text-xl text-foreground leading-relaxed">
            HappiMynd exists to bridge this gap by bringing psychological insight, emotional intelligence, and human awareness to help individuals and organisations grow consciously.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutGapSection;
