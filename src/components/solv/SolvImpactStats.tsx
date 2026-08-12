import { useEffect, useRef, useState } from "react";
import { Users, Clock, Target, Star } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "200,000+",
    label: "Individuals Supported",
  },
  {
    icon: Clock,
    value: "5,000+",
    label: "Counseling Hours",
  },
  {
    icon: Target,
    value: "91%",
    label: "Tool Adoption Rate",
  },
  {
    icon: Star,
    value: "4.7/5",
    label: "Ratings",
  },
];

const SolvImpactStats = () => {
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
    <section ref={sectionRef} className="py-6 px-6 lg:px-16 bg-gradient-to-r from-purple-200 via-purple-100 to-purple-200">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center space-y-3 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${0.1 + index * 0.1}s` }}
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-7 h-7 text-primary" />
              </div>
              <div className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
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

export default SolvImpactStats;
