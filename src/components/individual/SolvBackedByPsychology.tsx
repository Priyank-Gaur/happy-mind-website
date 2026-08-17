import { useEffect, useRef, useState } from "react";

const frameworks = [
  { name: "Personality Science", orbitRadius: 140, speed: 50, startAngle: 0, color: "primary" },
  { name: "Emotional Intelligence Mapping", orbitRadius: 190, speed: 65, startAngle: 36, color: "muted" },
  { name: "Cognitive Behaviour Therapy", orbitRadius: 150, speed: 55, startAngle: 72, color: "accent" },
  { name: "Cognitive Pattern Analysis", orbitRadius: 180, speed: 70, startAngle: 108, color: "primary" },
  { name: "Behaviour Therapy", orbitRadius: 145, speed: 52, startAngle: 144, color: "muted" },
  { name: "Solution-Focused Brief Therapy", orbitRadius: 195, speed: 68, startAngle: 180, color: "accent" },
  { name: "Single Session Therapy", orbitRadius: 155, speed: 58, startAngle: 216, color: "primary" },
  { name: "Cognitive Overload Reduction", orbitRadius: 185, speed: 72, startAngle: 252, color: "muted" },
  { name: "Motivational Interviewing", orbitRadius: 160, speed: 60, startAngle: 288, color: "accent" },
  { name: "Evidence-Based Coaching", orbitRadius: 175, speed: 66, startAngle: 324, color: "primary" },
];

const SolvBackedByPsychology = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Orbit radii + planet size are tuned for desktop; scale them down so
  // orbits stay inside the section's overflow-hidden bounds on narrow screens
  const orbitScale = viewportWidth < 400 ? 0.42 : viewportWidth < 640 ? 0.52 : viewportWidth < 1024 ? 0.75 : 1;
  const planetSize = viewportWidth < 640 ? 56 : viewportWidth < 1024 ? 72 : 96;
  const planetFontSize = viewportWidth < 640 ? 6 : viewportWidth < 1024 ? 7 : 9;

  return (
    <section ref={sectionRef} className="py-12 px-6 lg:px-16 overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div
          className={`text-center space-y-4 mb-8 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
            Built On Psychological Science
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            5+ years of behavioural and emotional intelligence research. 
            Our framework is grounded in <span className="text-primary font-bold">proven methodologies</span>, validated through lakhs of real users assessments on HappiMynd platform.
          </p>
        </div>

        {/* Solar System Container */}
        <div
          className={`relative w-full h-[260px] sm:h-[320px] md:h-[500px] flex items-center justify-center transition-all duration-1000 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          {/* Orbital Rings - Perfect circles matching planet paths */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {Array.from(new Set(frameworks.map(f => f.orbitRadius)))
              .sort((a, b) => a - b)
              .map((radius) => (
                <div
                  key={radius}
                  className="absolute rounded-full border border-foreground/10"
                  style={{
                    width: `${radius * 2 * orbitScale}px`,
                    height: `${radius * 2 * orbitScale}px`,
                  }}
                />
              ))
            }
          </div>

          {/* Central Globe */}
          <div 
            className="absolute z-20 w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary/40 via-primary/60 to-primary/30 flex items-center justify-center shadow-lg"
            style={{ 
              boxShadow: "0 0 60px hsl(var(--primary) / 0.3), inset 0 0 30px hsl(var(--primary) / 0.2)"
            }}
          >
            <div className="text-center px-3">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-primary-foreground leading-tight block">
                Psychological
              </span>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-primary-foreground leading-tight block">
                Science
              </span>
            </div>
          </div>

          {/* Individual Orbiting Planets */}
          {frameworks.map((framework, index) => {
            const animationDelay = `-${(framework.startAngle / 360) * framework.speed}s`;
            
            return (
              <div
                key={framework.name}
                className="absolute left-1/2 top-1/2"
                style={{
                  animation: `planet-orbit-${index} ${framework.speed}s linear infinite`,
                  animationDelay,
                }}
              >
                <div
                  className="rounded-full flex items-center justify-center p-1.5 sm:p-2 text-center"
                  style={{
                    width: `${planetSize}px`,
                    height: `${planetSize}px`,
                    animation: `planet-counter-${index} ${framework.speed}s linear infinite`,
                    animationDelay,
                    background: framework.color === "primary"
                      ? "linear-gradient(to bottom right, hsl(var(--primary) / 0.2), hsl(var(--primary) / 0.3))"
                      : framework.color === "muted"
                      ? "linear-gradient(to bottom right, hsl(var(--muted) / 0.6), hsl(var(--muted) / 0.8))"
                      : "linear-gradient(to bottom right, hsl(var(--primary) / 0.15), hsl(var(--muted) / 0.5))",
                    boxShadow: "0 8px 25px hsl(var(--primary) / 0.15)",
                  }}
                >
                  <span
                    className="font-bold uppercase tracking-wide text-foreground/80 leading-tight"
                    style={{ fontSize: `${planetFontSize}px` }}
                  >
                    {framework.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Keyframes */}
      <style>{`
        ${frameworks.map((framework, index) => {
          const radius = framework.orbitRadius * orbitScale;

          return `
            @keyframes planet-orbit-${index} {
              0% {
                transform: translate(-50%, -50%) 
                          rotate(0deg) 
                          translateX(${radius}px);
              }
              100% {
                transform: translate(-50%, -50%) 
                          rotate(360deg) 
                          translateX(${radius}px);
              }
            }
            
            @keyframes planet-counter-${index} {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(-360deg); }
            }
          `;
        }).join('\n')}
      `}</style>
    </section>
  );
};

export default SolvBackedByPsychology;