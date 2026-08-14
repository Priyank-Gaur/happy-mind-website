import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import careerDirectionImg from "@/assets/Individual/career-direction.png";
import personalHabitsImg from "@/assets/Individual/personal-habits.png";
import relationshipImg from "@/assets/Individual/RELATIONSHIP.png";
import moneyIndependenceImg from "@/assets/Individual/money-independence.png";

const SolvHeroSection = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true
  });

  // 4 slides with actual images
  const slides = [{
    id: 1,
    image: careerDirectionImg,
    title: "Career Direction"
  }, {
    id: 2,
    image: moneyIndependenceImg,
    title: "Money & Independence"
  },, {
    id: 3,
    image: personalHabitsImg,
    title: "Personal Habits"
  }, {
    id: 4,
    image: relationshipImg,
    title: "Relationship"
  }];
  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Auto-slide every 2 seconds
  useEffect(() => {
    if (!emblaApi) return;
    const autoSlide = setInterval(() => {
      emblaApi.scrollNext();
    }, 2000);
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      clearInterval(autoSlide);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);
  return <section className="h-[calc(90vh-80px)] w-full overflow-hidden">
      <div className="h-full w-full grid lg:grid-cols-2 relative">
        {/* Left Content */}
        <div className="relative z-20 flex items-center px-6 lg:px-16 py-12 lg:py-0">
          <div className="space-y-8 max-w-xl">
            <div className="space-y-6">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-foreground leading-tight font-sans">
                A <span className="text-primary text-2xl sm:text-3xl md:text-4xl lg:text-5xl">Conscious Growth Space</span> For Life's Real progress.
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed font-serif font-semibold text-left">
                The journey to be your better version that leads you to make clearer and confident choices. Happiness is derived after knowing yourself through a <span className="text-primary">validated journey</span>. 
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
           
              <a href="https://happimynd.com/signup">
              <Button size="lg" variant="outline" className="rounded-full px-8">
                My Emo Snapshot
              </Button>
              </a>
              <Link to="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('open-contact-form')); }}>
              <Button size="lg" className="rounded-full px-8">
                Book My SOLV Session
              </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Carousel - Full Height */}
        <div className="absolute inset-0 lg:relative lg:inset-auto h-full">
          {/* Gradient overlay for text readability - only on left portion */}
          <div className="absolute inset-0 z-10 pointer-events-none lg:hidden" style={{
          background: "linear-gradient(to right, hsl(var(--background)) 0%, hsl(var(--background) / 0.95) 30%, hsl(var(--background) / 0.7) 50%, transparent 70%)"
        }} />
          <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none" style={{
          background: "linear-gradient(to right, hsl(var(--background)) 0%, hsl(var(--background) / 0.8) 40%, transparent 100%)"
        }} />

          {/* Embla Carousel */}
          <div className="h-full w-full overflow-hidden" ref={emblaRef}>
            <div className="flex h-full">
              {slides.map(slide => <div key={slide.id} className="flex-[0_0_100%] min-w-0 h-full relative">
                  <div className="w-full h-full relative">
                    <img 
                      src={slide.image} 
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-background/20 to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8">
                      
                    </div>
                  </div>
                </div>)}
            </div>
          </div>


          {/* Dot Navigation */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {slides.map((_, index) => <button key={index} onClick={() => scrollTo(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ease-in-out ${index === selectedIndex ? "bg-primary scale-110" : "border-2 border-foreground/50 bg-transparent hover:border-foreground"}`} />)}
          </div>
        </div>
      </div>
    </section>;
};
export default SolvHeroSection;