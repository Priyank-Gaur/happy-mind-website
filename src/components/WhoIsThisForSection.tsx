import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import individualHero from "@/assets/home-page-section-3-for-individual.png";
import organizationHero from "@/assets/home-page-section-3-for-org.png";
const WhoIsThisForSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
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
      threshold: 0.2
    });
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);
  return <section className="pb-16 sm:py-12 px-4 sm:px-6 lg:px-16" ref={sectionRef}>
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl text-primary text-center font-sans font-semibold">
            WHO IS THIS FOR?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Individuals Card */}
          <Link to="/for-individuals" className={`group relative bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 lg:p-10 border border-border overflow-hidden block transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0 shadow-[0_8px_30px_-12px_hsl(var(--primary)/0.25)]' : 'opacity-0 translate-y-8 shadow-none'} hover:shadow-[0_20px_50px_-12px_hsl(var(--primary)/0.35)] hover:border-primary/30`} style={{
          transitionDelay: '0ms'
        }}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col h-full">
              {/* Polaroid-style image */}
              <div className="mx-4">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                  <img src={individualHero} alt="Individual growth" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="mt-5">
                <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-semibold text-foreground">For Individuals</h3>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-5 flex-grow">
                Anyone who wishes to groom into 2.0 version of self but if you are struggling with career pressures, relationship issues, workplace fatigue, parenting challenges or loneliness in spite of people around, then proceed here.
              </p>
              <button className="mt-4 px-4 py-2 text-sm font-medium border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full transition-colors self-start">
                Explore
              </button>
            </div>
          </Link>

          {/* Organisations Card */}
          <Link to="/for-organisations" className={`group relative bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 lg:p-10 border border-border overflow-hidden block transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0 shadow-[0_8px_30px_-12px_hsl(var(--primary)/0.25)]' : 'opacity-0 translate-y-8 shadow-none'} hover:shadow-[0_20px_50px_-12px_hsl(var(--primary)/0.35)] hover:border-primary/30`} style={{
          transitionDelay: '150ms'
        }}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col h-full">
              {/* Polaroid-style image */}
              <div className="mx-4">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                  <img src={organizationHero} alt="Organisation teams" className="w-full h-full border-0 shadow-md object-cover" />
                </div>
              </div>
              <div className="mt-5">
                <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-semibold text-foreground">For Organisations</h3>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-5 flex-grow">
                The next evolution in workforce intelligence is here. It's not about collecting more employee data, but understanding the underlying behavioural and psychological drivers that shape business outcomes. To move from people analytics to people intelligence proceed here.
              </p>
              <button className="mt-4 px-4 py-2 text-sm font-medium border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full transition-colors self-start">
                Explore
              </button>
            </div>
          </Link>
        </div>
      </div>
    </section>;
};
export default WhoIsThisForSection;