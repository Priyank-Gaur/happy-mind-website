import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Activity, ClipboardCheck, Wrench, BookOpen, MessageSquare, Compass, Users } from "lucide-react";

const products = [
  {
    icon: Activity,
    name: "MyPulse",
    description: "Understand where you are",
  },
  {
    icon: ClipboardCheck,
    name: "MyCheck-In",
    description: "Track how you feel",
  },
  {
    icon: Wrench,
    name: "Tools",
    description: "Manage emotions daily",
  },
  {
    icon: BookOpen,
    name: "Learn",
    description: "Understand yourself better",
  },
  {
    icon: MessageSquare,
    name: "MySpace",
    description: "Express without judgement",
  },
  {
    icon: Compass,
    name: "MyGuide",
    description: "Get clarity and direction",
  },
  {
    icon: Users,
    name: "SOLV",
    description: "Speak to a professional",
  },
];

const SolvProductsEcosystem = () => {
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
    <section ref={sectionRef} className="py-24 px-6 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <div
          className={`text-center space-y-4 mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
            A simple, private ecosystem for your emotional well-being
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {products.map((product, index) => (
            <div
              key={product.name}
              className={`group bg-white rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-xl shadow-lg transition-all duration-500 cursor-pointer ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${0.05 * index}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <product.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{product.name}</h3>
              <p className="text-muted-foreground text-sm">{product.description}</p>
            </div>
          ))}
        </div>

        <div
          className={`text-center transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button size="lg" className="rounded-full px-10">
            Explore SOLV
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SolvProductsEcosystem;
