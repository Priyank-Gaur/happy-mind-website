import { useEffect, useRef, useState } from "react";

const stats = [
  {
    value: "73%",
    label: "experience constant stress & emotional fatigue"
  },
  {
    value: "68%",
    label: "delay seeking support until it affects daily life"
  },
  {
    value: "4 in 5",
    label: "individuals struggle with mental overload regularly"
  },
  {
    value: "89%",
    label: "wish they understood their emotions better"
  }
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
          <h2 className="text-3xl md:text-4xl font-semibold text-primary font-sans">
            Why Conscious Growth Matters?
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
            Mental and emotional strain acts as the biggest stumbling blocks in the path of growth.
          </p>
        </div>

        <div
          className={`text-center space-y-6 mb-12 transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-foreground text-2xl leading-relaxed max-w-4xl mx-auto">
            <span className="text-primary">Early awareness makes a real difference.</span> More than 95% of people never reach their life growth goals. When you understand your emotional state, you can respond before things run out of control.
          </p>
        </div>

        <div
          className={`text-center mb-8 transition-all duration-700 delay-150 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h3 className="text-xl md:text-2xl font-semibold text-foreground font-sans">
            Fact Check About Growth Blockers
          </h3>
        </div>

        <div
          className={`grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center space-y-2"
              style={{ transitionDelay: `${0.3 + index * 0.1}s` }}
            >
              <div className="font-serif text-3xl md:text-4xl font-semibold text-primary">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolvRealityCheck;