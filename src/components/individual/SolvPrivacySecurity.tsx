import { useEffect, useRef, useState } from "react";
import { Shield } from "lucide-react";

const SolvPrivacySecurity = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 px-6 lg:px-16">
      <div className="container mx-auto max-w-3xl text-center">
        <div
          className={`space-y-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
            Your space. Your data. Your control.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto">
            Your journey is personal. Your data stays private. We protect your space with respect, responsibility, and trust.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SolvPrivacySecurity;
