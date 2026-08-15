import { useEffect, useRef, useState } from "react";
const stats = [{
  value: "2,00,000+",
  label: "Platform Users"
}, {
  value: "40+",
  label: "Corporate Clients"
}, {
  value: "91%",
  label: "Tool Adoption Rate"
}, {
  value: "4.7/5",
  label: "Ratings"
}];
const ImpactStatsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, {
      threshold: 0.2
    });
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);
  return <section ref={sectionRef} className="py-4 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <div className={`text-center transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => <div key={stat.label} className={`space-y-3 transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{
            transitionDelay: `${0.2 + index * 0.15}s`
          }}>
                <div className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-[10px] sm:text-xs md:text-sm">
                  {stat.label}
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </section>;
};
export default ImpactStatsSection;