import { Monitor, Brain, FlaskConical, BookOpen } from "lucide-react";

const approaches = [
  { icon: Monitor, label: "Technology-Backed" },
  { icon: FlaskConical, label: "Evidence-Based Tools" },
  { icon: Brain, label: "Positive Psychology" },
  { icon: BookOpen, label: "Research-Driven" },
];

const AboutApproachSection = () => {
  return (
    <section className="py-20 px-6 lg:px-16">
      <div className="container mx-auto max-w-5xl text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
          Our Approach
        </h2>
        
        <p className="font-sans text-lg md:text-xl text-muted-foreground leading-relaxed mb-12 max-w-4xl mx-auto">
          We are a phygital platform delivering a structured <span className="text-primary">Conscious Growth Ecosystem</span> for individuals and a <span className="text-primary">People Intelligence System</span> for organisations. Our approach integrates technology, evidence-based tools, positive psychology, and behavioural research to turn human insight into measurable growth.
        </p>

        {/* Approach Pills */}
        <div className="flex flex-wrap justify-center gap-4">
          {approaches.map((approach, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-background px-6 py-3 rounded-md border border-border/50 shadow-sm"
            >
              <approach.icon className="w-5 h-5 text-primary" />
              <span className="font-sans text-foreground font-medium">
                {approach.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutApproachSection;
