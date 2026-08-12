import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const SolvCommunity = () => {
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
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
            Join Our Growing Community of HappiVIBES
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            You don't grow alone. Be part of conversations, learning, and shared journeys that make conscious growth easier and more human.
          </p>
          <Button 
            size="lg" 
            variant="outline" 
            className="rounded-full px-10 mt-4"
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent('open-contact-form'));
            }}
          >
            Explore the community
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SolvCommunity;
