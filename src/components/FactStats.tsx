import { useEffect, useRef, useState } from "react";
const stats = [{
  value: "78%",
  label: "of Indian employees reported moderate-to-high levels of stress"
}, {
  value: "51%",
  label: "of Gen Z workforce felt burnt out "
}, {
  value: "30%",
  label: "of adults reporting moderate-to-severe anxiety symptoms in 2025"
}, {
  value: "47%",
  label: "of GenZ and Millennials are in a “constant” state of worry"
}, {
  value: "20%",
  label: "of Indian workforce are considering quitting their jobs due to burnout"
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
      <div className="container mx-auto max-w-8xl">

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {stats.map((stat, index) => <div key={stat.label} className={`bg-white rounded-2xl p-6 text-center space-y-2 shadow-lg hover:shadow-xl border border-border hover:border-primary/30 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{
          transitionDelay: `${0.1 + index * 0.1}s`
        }}>
              <div className="font-serif text-3xl md:text-4xl font-semibold text-muted-foreground">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>)}
        </div>
      </div>
    </section>;
};
export default SolvImpactStats;