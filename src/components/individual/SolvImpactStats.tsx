import { useEffect, useRef, useState } from "react";
const stats = [{
  value: "200,000+",
  label: "Assessments completed"
}, {
  value: "1,500+",
  label: "User Reviews"
}, {
  value: "10,000+",
  label: "Journeys Started"
}, {
  value: "5000+",
  label: "Counseling Hours"
}];
const SolvImpactStats = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0.2
    });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);
  return <section ref={sectionRef} className="py-12 px-6 lg:px-16">
      <div className="container mx-auto max-w-5xl">
        <div className={`text-center space-y-4 mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-3xl md:text-4xl font-semibold text-primary font-sans">
            Real People. Real Clarity. Real Impact.
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => <div key={stat.label} className={`bg-white rounded-2xl p-6 text-center space-y-2 shadow-lg hover:shadow-xl border border-border hover:border-primary/30 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{
          transitionDelay: `${0.1 + index * 0.1}s`
        }}>
              <div className="font-serif text-3xl md:text-4xl font-semibold text-muted-foreground">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>)}
        </div>

        <p className={`text-center text-muted-foreground mt-12 transition-all duration-700 delay-500 italic text-2xl ${isVisible ? "opacity-100" : "opacity-0"}`}>
          Built on real journeys, not assumptions.
        </p>
      </div>
    </section>;
};
export default SolvImpactStats;