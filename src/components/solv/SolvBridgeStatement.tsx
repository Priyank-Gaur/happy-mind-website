import { useEffect, useRef, useState } from "react";

const SolvBridgeStatement = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 px-6 lg:px-16">
      <div className="container mx-auto max-w-4xl text-center">
        <div
          className={`space-y-8 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight">
            The Problem Isn't You.{" "}<br />
            <span className="text-primary">The Problem Is Lack Of Awareness.</span>
          </h2>

          <p className="text-muted-foreground text-lg leading-relaxed">
            Today's generation has unlimited information, but very little personalised guidance.
            The pressure to "figure everything out" creates confusion about identity, direction, and decision-making.
          </p>

          <p className="text-foreground font-medium text-lg leading-relaxed">
            SOLV gives you a way to pause, understand yourself deeply, and grow with structure instead of noise.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SolvBridgeStatement;
