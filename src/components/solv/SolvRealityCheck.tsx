import { useEffect, useRef, useState } from "react";

const stats = [
  {
    value: "80%",
    label: "feel unsure about their career direction",
  },
  {
    value: "70%+",
    label: "fear making the wrong decisions in life and relationships",
  },
  {
    value: "200+",
    label: "pieces of advice consumed daily, yet feeling more confused",
  },
  {
    value: "90%",
    label: "have never received guidance tailored to their psychology",
  },
];

const SolvRealityCheck = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 px-6 lg:px-16">
      <div className="container mx-auto max-w-4xl">
        <div
          className={`text-center space-y-6 mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
            The Truth About Young Adults Today
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            Comparison pressure, emotional confusion, and decision fatigue define modern life.
            Most people are capable, ambitious, and self-driven — yet struggle with clarity and direction.
          </p>
        </div>

        <div
          className={`grid grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-6 text-center space-y-3 shadow-lg border border-border hover:shadow-xl hover:border-primary/30 transition-all duration-300"
              style={{ transitionDelay: `${0.3 + index * 0.1}s` }}
            >
              <div className="font-serif text-3xl md:text-4xl font-semibold text-primary">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm leading-relaxed">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolvRealityCheck;
