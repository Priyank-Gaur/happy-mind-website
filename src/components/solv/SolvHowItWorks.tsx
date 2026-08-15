import { useEffect, useRef, useState } from "react";
import { ClipboardCheck, Calendar, Compass } from "lucide-react";

const steps = [
  {
    icon: ClipboardCheck,
    number: "1",
    title: "Do a Super Short Check-In",
    description: "A quick rewind to understand your current state and growth areas.",
    time: "60 Seconds",
  },
  {
    icon: Calendar,
    number: "2",
    title: "Schedule your intro call",
    description: "Book your complimentary 20-minute session with a growth coach.",
    time: "20 minutes",
  },
  {
    icon: Compass,
    number: "3",
    title: "Get personalised direction",
    description: "Receive clarity on your growth path and actionable next steps.",
    time: "At your pace",
  },
];

const SolvHowItWorks = () => {
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
    <section ref={sectionRef} className="py-12 px-6 lg:px-16 overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div
          className={`text-center space-y-4 mb-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h1 className="text-primary font-medium text-3xl md:text-5xl tracking-wider">HOW IT WORKS</h1>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
            A Simple Three-Step Process
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            No complex onboarding. No long forms. Just clarity in three simple steps.
          </p>
        </div>

        {/* Visual Process Flow */}
        <div className="relative">
          {/* Large Background Numbers */}
          <div className="absolute inset-0 flex justify-between items-center pointer-events-none select-none z-0">
            <span className="text-[180px] md:text-[220px] font-serif font-bold text-primary/5 leading-none -ml-4">1</span>
            <span className="text-[180px] md:text-[220px] font-serif font-bold text-primary/5 leading-none">2</span>
            <span className="text-[180px] md:text-[220px] font-serif font-bold text-primary/5 leading-none -mr-4">3</span>
          </div>

          {/* Curved Path SVG - positioned behind content */}
          <svg
            className="absolute top-[calc(20%-20px)] left-0 w-full h-40 pointer-events-none z-0 hidden md:block"
            viewBox="0 0 1200 160"
            preserveAspectRatio="none"
            fill="none"
          >
            {/* Wave path connecting the three dots */}
            <path
              d="M100 10 C250 10, 350 90, 600 90 S950 10, 1100 10"
              stroke="url(#gradient)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              className={`transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              style={{
                strokeDasharray: 2000,
                strokeDashoffset: isVisible ? 0 : 2000,
                transition: 'stroke-dashoffset 1.5s ease-out, opacity 0.5s ease-out'
              }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.7" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Steps */}
          <div className="relative z-10 grid md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => {
              // Position steps at different heights to follow the curve
              const verticalOffset = index === 1 ? 'md:mt-16' : 'md:mt-0';
              
              return (
                <div
                  key={step.number}
                  className={`relative flex flex-col items-center text-center space-y-4 ${verticalOffset} transition-all duration-700 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${0.2 + index * 0.2}s` }}
                >
                  {/* Icon Circle with connector dot */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-background border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/10">
                      <step.icon className="w-7 h-7 text-primary" />
                    </div>
                    {/* Connector dot on the wave line */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-md hidden md:block" />
                  </div>

                  {/* Content */}
                  <div className="space-y-2 max-w-xs pt-2">
                    <h3 className="font-semibold text-foreground text-lg">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                    {step.time && (
                      <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-medium mt-2">
                        {step.time}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolvHowItWorks;
