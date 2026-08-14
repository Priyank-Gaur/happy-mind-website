import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import introSessionImage from "@/assets/SOLV-What happens in intro session.png";

const explorations = [
  "Where you are in your growth journey",
  "Which area matters most right now",
  "How your personality shapes your choices",
  "What patterns influence your outcomes",
  "What direction can move you forward",
];

const SolvIntroSession = () => {
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
      <div className="container mx-auto max-w-10xl">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Content on the left */}
          <div className="flex-1">
            <div
              className={`bg-background rounded-3xl p-8 md:p-12 transition-all duration-700 delay-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <div className="space-y-6 mb-8">
                <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                  What Happens In Your 20-minute Intro Session
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Your <span className="text-primary">GROWTH EXPERT </span>(Subject Matter Expert) helps you understand where you truly stand
                  and what direction can unlock your next level. <br />No pressure. No commitments.
                </p>
              </div>
              
              <p className="text-foreground font-medium mb-6">You'll explore:</p>
              <div className="grid sm:grid-cols-2 gap-4 mb-10">
                {explorations.map((item, index) => (
                  <div
                    key={item}
                    className={`flex items-start gap-3 transition-all duration-500 ${
                      isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                    }`}
                    style={{ transitionDelay: `${0.3 + index * 0.1}s` }}
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <p className="text-primary font-medium text-lg italic">
                  You're one conversation away to feel sorted!
                </p>
                <Link to="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('open-contact-form')); }}>
                  <Button size="lg" className="rounded-full px-10 mt-4">
                    Book Your Growth Session
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Image on the right - outside the content div */}
          <div className="flex-1 flex justify-center lg:justify-end pt-12">
            <img 
              src={introSessionImage} 
              alt="What happens in intro session" 
              className="max-w-full h-auto rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolvIntroSession;
