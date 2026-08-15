import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Lock, Check, FlaskConical, Heart } from "lucide-react";

const trustMarkers = [
  { icon: Lock, label: "100% Confidential" },
  { icon: Check, label: "No commitments" },
  { icon: FlaskConical, label: "Science-backed" },
  { icon: Heart, label: "People-first" },
];

const SolvConversionOffer = () => {
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
      <div className="container mx-auto max-w-4xl">
        <div
          className={`bg-gradient-to-br from-primary/5 to-accent/50 rounded-3xl p-4 md:p-8 text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="space-y-6 mb-10">
            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              Limited Time Offer
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
              COMPLIMENTARY SOLV Session!
            </h2>
            <p className="text-primary font-medium text-lg">
              Two minutes. One form. Your conscious growth begins.
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We're offering early users a complimentary intro session — powered by conscious science,
              people-first guidance to help you become more aware, capable, and connected.
            </p>
          </div>

          <div className="space-y-4 mb-10">
            <Link to="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('open-contact-form')); }}>
            <Button size="lg" className="rounded-full px-5 text-md h-14">
              Begin Your Conscious Growth
            </Button>
            </Link>
            <p className="text-muted-foreground text-sm">Just 2 minutes to start.</p>
          </div>

          <div
            className={`flex flex-wrap justify-center gap-6 transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {trustMarkers.map((marker) => (
              <div key={marker.label} className="flex items-center gap-2 text-muted-foreground">
                <marker.icon className="w-4 h-4 text-primary" />
                <span className="text-sm">{marker.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolvConversionOffer;
