import { useState, useEffect, useRef } from "react";
import { Eye, Search, Shield, Compass, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
const journeyCards = [{
  id: "noticing",
  icon: Eye,
  title: "Noticing",
  frontText: "Something feels off",
  backText: "You're becoming aware of patterns or feelings that weren't visible before. This awareness is the first step towards conscious growth.",
  products: "MyPulse · Awareness Tools",
  route: "/awareness"
}, {
  id: "checking",
  icon: Search,
  title: "Checking In",
  frontText: "I want to understand this better",
  backText: "You want to understand what's happening beneath the surface. Clarity begins when you pause and check in with yourself.",
  products: "Assessments · Vibe Checks",
  route: "/assessments"
}, {
  id: "staying",
  icon: Shield,
  title: "Staying Ahead",
  frontText: "I don't want this to pile up",
  backText: "You're choosing to take care of things before they become heavy. Small, consistent actions help you stay balanced and prepared.",
  products: "Daily Tools · Preventive Routines",
  route: "/daily-tools"
}, {
  id: "handling",
  icon: Compass,
  title: "Handling It Myself",
  frontText: "I want tools I can use on my own",
  backText: "You want practical tools you can use independently. Growth feels powerful when you know how to support yourself.",
  products: "Self-help Tools · CBT Resources",
  route: "/self-help"
}, {
  id: "talking",
  icon: MessageCircle,
  title: "Talking It Through",
  frontText: "I need to speak to someone",
  backText: "Sometimes clarity comes from conversation. Speaking with someone helps you see things from a new perspective.",
  products: "Buddy · SOLV · Experts",
  route: "/experts"
}];
const JourneySection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // Re-trigger animation every time section enters viewport
      if (entry.isIntersecting) {
        setIsVisible(false);
        // Small delay to reset animation state
        setTimeout(() => setIsVisible(true), 50);
      } else {
        setIsVisible(false);
      }
    }, {
      threshold: 0.15
    });
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);
  const handleFlip = (cardId: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };
  const handleCardClick = (route: string) => {
    navigate(route);
  };
  return <section ref={sectionRef} className="relative py-12 px-6 lg:px-16 overflow-hidden">
      {/* Background Journey Footprints */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" style={{
        filter: "blur(1px)"
      }}>
          {/* Walking footprints - alternating left/right feet in natural walking pattern */}
          
          {/* Step 1 - Left foot */}
          <g transform="translate(30, 750) rotate(-25)" opacity="0.07" className={`transition-opacity duration-500 ${isVisible ? 'opacity-[0.07]' : 'opacity-0'}`} style={{
          transitionDelay: '0ms'
        }}>
            <ellipse cx="0" cy="0" rx="7" ry="12" fill="hsl(var(--primary))" />
            <ellipse cx="0" cy="-16" rx="4" ry="5" fill="hsl(var(--primary))" />
          </g>
          
          {/* Step 2 - Right foot */}
          <g transform="translate(90, 690) rotate(-30) scale(-1, 1)" className={`transition-opacity duration-500 ${isVisible ? 'opacity-[0.06]' : 'opacity-0'}`} style={{
          transitionDelay: '150ms'
        }}>
            <ellipse cx="0" cy="0" rx="7" ry="12" fill="hsl(var(--primary))" />
            <ellipse cx="0" cy="-16" rx="4" ry="5" fill="hsl(var(--primary))" />
          </g>
          
          {/* Step 3 - Left foot */}
          <g transform="translate(160, 620) rotate(-28)" className={`transition-opacity duration-500 ${isVisible ? 'opacity-[0.07]' : 'opacity-0'}`} style={{
          transitionDelay: '300ms'
        }}>
            <ellipse cx="0" cy="0" rx="7" ry="12" fill="hsl(var(--primary))" />
            <ellipse cx="0" cy="-16" rx="4" ry="5" fill="hsl(var(--primary))" />
          </g>
          
          {/* Step 4 - Right foot */}
          <g transform="translate(235, 555) rotate(-32) scale(-1, 1)" className={`transition-opacity duration-500 ${isVisible ? 'opacity-[0.06]' : 'opacity-0'}`} style={{
          transitionDelay: '450ms'
        }}>
            <ellipse cx="0" cy="0" rx="7" ry="12" fill="hsl(var(--primary))" />
            <ellipse cx="0" cy="-16" rx="4" ry="5" fill="hsl(var(--primary))" />
          </g>
          
          {/* Step 5 - Left foot */}
          <g transform="translate(320, 490) rotate(-26)" className={`transition-opacity duration-500 ${isVisible ? 'opacity-[0.07]' : 'opacity-0'}`} style={{
          transitionDelay: '600ms'
        }}>
            <ellipse cx="0" cy="0" rx="7" ry="12" fill="hsl(var(--primary))" />
            <ellipse cx="0" cy="-16" rx="4" ry="5" fill="hsl(var(--primary))" />
          </g>
          
          {/* Step 6 - Right foot */}
          <g transform="translate(405, 430) rotate(-30) scale(-1, 1)" className={`transition-opacity duration-500 ${isVisible ? 'opacity-[0.06]' : 'opacity-0'}`} style={{
          transitionDelay: '750ms'
        }}>
            <ellipse cx="0" cy="0" rx="7" ry="12" fill="hsl(var(--primary))" />
            <ellipse cx="0" cy="-16" rx="4" ry="5" fill="hsl(var(--primary))" />
          </g>
          
          {/* Step 7 - Left foot */}
          <g transform="translate(495, 365) rotate(-28)" className={`transition-opacity duration-500 ${isVisible ? 'opacity-[0.07]' : 'opacity-0'}`} style={{
          transitionDelay: '900ms'
        }}>
            <ellipse cx="0" cy="0" rx="7" ry="12" fill="hsl(var(--primary))" />
            <ellipse cx="0" cy="-16" rx="4" ry="5" fill="hsl(var(--primary))" />
          </g>
          
          {/* Step 8 - Right foot */}
          <g transform="translate(585, 300) rotate(-32) scale(-1, 1)" className={`transition-opacity duration-500 ${isVisible ? 'opacity-[0.06]' : 'opacity-0'}`} style={{
          transitionDelay: '1050ms'
        }}>
            <ellipse cx="0" cy="0" rx="7" ry="12" fill="hsl(var(--primary))" />
            <ellipse cx="0" cy="-16" rx="4" ry="5" fill="hsl(var(--primary))" />
          </g>
          
          {/* Step 9 - Left foot */}
          <g transform="translate(680, 240) rotate(-26)" className={`transition-opacity duration-500 ${isVisible ? 'opacity-[0.07]' : 'opacity-0'}`} style={{
          transitionDelay: '1200ms'
        }}>
            <ellipse cx="0" cy="0" rx="7" ry="12" fill="hsl(var(--primary))" />
            <ellipse cx="0" cy="-16" rx="4" ry="5" fill="hsl(var(--primary))" />
          </g>
          
          {/* Step 10 - Right foot */}
          <g transform="translate(775, 180) rotate(-30) scale(-1, 1)" className={`transition-opacity duration-500 ${isVisible ? 'opacity-[0.06]' : 'opacity-0'}`} style={{
          transitionDelay: '1350ms'
        }}>
            <ellipse cx="0" cy="0" rx="7" ry="12" fill="hsl(var(--primary))" />
            <ellipse cx="0" cy="-16" rx="4" ry="5" fill="hsl(var(--primary))" />
          </g>
          
          {/* Step 11 - Left foot */}
          <g transform="translate(870, 120) rotate(-28)" className={`transition-opacity duration-500 ${isVisible ? 'opacity-[0.07]' : 'opacity-0'}`} style={{
          transitionDelay: '1500ms'
        }}>
            <ellipse cx="0" cy="0" rx="7" ry="12" fill="hsl(var(--primary))" />
            <ellipse cx="0" cy="-16" rx="4" ry="5" fill="hsl(var(--primary))" />
          </g>
          
          {/* Step 12 - Right foot */}
          <g transform="translate(965, 60) rotate(-32) scale(-1, 1)" className={`transition-opacity duration-500 ${isVisible ? 'opacity-[0.06]' : 'opacity-0'}`} style={{
          transitionDelay: '1650ms'
        }}>
            <ellipse cx="0" cy="0" rx="7" ry="12" fill="hsl(var(--primary))" />
            <ellipse cx="0" cy="-16" rx="4" ry="5" fill="hsl(var(--primary))" />
          </g>
          
          {/* Step 13 - Left foot */}
          <g transform="translate(1060, 10) rotate(-26)" className={`transition-opacity duration-500 ${isVisible ? 'opacity-[0.07]' : 'opacity-0'}`} style={{
          transitionDelay: '1800ms'
        }}>
            <ellipse cx="0" cy="0" rx="7" ry="12" fill="hsl(var(--primary))" />
            <ellipse cx="0" cy="-16" rx="4" ry="5" fill="hsl(var(--primary))" />
          </g>
        </svg>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Headings */}
        <div className="text-center space-y-4 mb-16">
          <h1 className="font-sans text-3xl md:text-4xl lg:text-5xl text-primary font-semibold">
            Your Journey is Our Journey
          </h1>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
            Start Where You Are
          </h2>
          <p className="font-sans text-lg text-foreground/80 max-w-xl mx-auto">
            There's no right or wrong place to begin.{" "}
            <span className="text-primary font-medium">Choose to begin.</span>
          </p>
        </div>

        {/* Journey Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {journeyCards.map((card, index) => {
          const Icon = card.icon;
          const isFlipped = flippedCards[card.id] || false;
          return <div key={card.id} className="perspective-1000 h-[340px] cursor-pointer group" style={{
            transitionDelay: `${index * 100}ms`
          }} onMouseEnter={() => handleFlip(card.id)} onMouseLeave={() => handleFlip(card.id)} onClick={() => handleCardClick(card.route)}>
                <div className={`relative w-full h-full transition-all duration-700 ease-out preserve-3d ${isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"} ${isFlipped ? "rotate-y-180" : ""}`} style={{
              transitionProperty: "transform, opacity, box-shadow",
              transitionDuration: isVisible ? "800ms, 800ms, 600ms" : "0ms",
              transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
              transformStyle: "preserve-3d"
            }}>
                  {/* Card Front */}
                  <div className={`absolute inset-0 bg-white rounded-2xl p-2 flex flex-col items-center justify-center text-center backface-hidden transition-shadow duration-600 ${isVisible ? "shadow-[0_15px_40px_-10px_hsl(var(--primary)/0.15)]" : "shadow-none"}`} style={{
                backfaceVisibility: "hidden"
              }}>
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-sans text-lg font-bold text-foreground mb-3">
                      {card.title}
                    </h3>
                    <p className="font-sans text-xs text-foreground leading-relaxed">
                      "{card.frontText}"
                    </p>
                  </div>

                  {/* Card Back */}
                  <div className={`absolute inset-0 bg-white rounded-2xl p-5 flex flex-col items-center justify-center text-center rotate-y-180 backface-hidden transition-shadow duration-600 ${isVisible ? "shadow-[0_15px_40px_-10px_hsl(var(--primary)/0.15)]" : "shadow-none"}`} style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)"
              }}>
                    <h3 className="font-sans text-base font-bold text-foreground mb-3">
                      {card.title}
                    </h3>
                    <p className="font-sans text-xs text-foreground/80 leading-relaxed mb-4">
                      {card.backText}
                    </p>
                    {/*<p className="font-sans text-xs text-primary font-medium">
                      {card.products}
                    </p>*/}
                  </div>
                </div>
              </div>;
        })}
        </div>
      </div>
    </section>;
};
export default JourneySection;