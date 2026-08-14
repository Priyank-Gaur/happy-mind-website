import { useState, useEffect } from "react";
import { Sparkles, Heart, Compass } from "lucide-react";
import carousel1 from "@/assets/home-page-section-2-image1.png";
import carousel2 from "@/assets/home-page-section-2-image2.png";
import carousel3 from "@/assets/home-page-section-2-image3.png";

const carouselImages = [carousel1, carousel2, carousel3];

const WhatSpaceSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const normalizedDiff = (diff % carouselImages.length + carouselImages.length) % carouselImages.length;
    if (normalizedDiff === 0) {
      return {
        transform: "translateZ(0px) scale(1)",
        opacity: 1,
        zIndex: 30,
        filter: "blur(0px)"
      };
    } else if (normalizedDiff === 1) {
      return {
        transform: "translateX(60%) translateZ(-100px) scale(0.85)",
        opacity: 0.7,
        zIndex: 20,
        filter: "blur(2px)"
      };
    } else {
      return {
        transform: "translateX(-60%) translateZ(-100px) scale(0.85)",
        opacity: 0.7,
        zIndex: 20,
        filter: "blur(2px)"
      };
    }
  };

  return (
    <section className="pt-16 sm:pt-24 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-[1100px]">
        {/* Headline Block */}
        <div className="text-center">
          {/* H1 */}
          <h1 className="font-sans text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[0.04em] uppercase text-primary mb-4 sm:mb-6">
            What Space This Is?
          </h1>

          {/* H2 - Above carousel */}
          <h2 className="font-sans text-base sm:text-lg md:text-xl lg:text-2xl leading-[1.4] text-foreground max-w-[900px] mx-auto font-medium mb-6 sm:mb-8 md:mb-10">
            When life feels overwhelming, growth shouldn't wait for a breaking point.
          
            This is a space designed to help people pause, reflect, and grow consciously
            
            <span className="text-primary">&nbsp;before stress turns into struggle.</span>
          </h2>

          {/* 3D Carousel */}
          <div className="mb-8 sm:mb-12 w-full max-w-[900px] mx-auto relative h-[300px] sm:h-[400px] md:h-[500px]">
            <div className="relative w-full h-full flex items-center justify-center" style={{
              perspective: "1000px"
            }}>
              {carouselImages.map((img, index) => (
                <div
                  key={index}
                  className="absolute w-48 sm:w-64 md:w-72 lg:w-80 aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-700 ease-out cursor-pointer"
                  style={{
                    ...getCardStyle(index),
                    boxShadow: index === activeIndex 
                      ? "0 25px 50px -12px hsl(var(--primary) / 0.25)" 
                      : "0 10px 25px -5px hsl(var(--foreground) / 0.1)"
                  }}
                  onClick={() => setActiveIndex(index)}
                >
                  <img src={img} alt={`Conscious growth visual ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            
            {/* Carousel Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex ? "w-8 bg-primary" : "bg-muted hover:bg-primary/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Three Columns - Right after carousel */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Column 1 */}
          <div className="text-center space-y-3 flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-primary/30">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-sans text-sm sm:text-base md:text-lg font-semibold text-foreground">
              What Conscious Growth Means
            </h3>
            <p className="font-sans text-xs sm:text-sm md:text-[15px] text-muted-foreground leading-[1.6]">
              Conscious growth is about becoming more aware of your patterns, responding to life with greater clarity, and making better decisions—both personally and professionally—so growth becomes intentional, not accidental.
            </p>
          </div>

          {/* Column 2 */}
          <div className="text-center space-y-3 flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-primary/30">
              <Heart className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-sans text-sm sm:text-base md:text-lg font-semibold text-foreground">
              Why You Need This Today
            </h3>
            <p className="font-sans text-xs sm:text-sm md:text-[15px] text-muted-foreground leading-[1.6]">
              Life today moves fast, brings emotional overload, and constantly pushes us to perform, leaving very little space to pause, reflect, and truly understand what we need before stress quietly builds up.
            </p>
          </div>

          {/* Column 3 */}
          <div className="text-center space-y-3 flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-primary/30">
              <Compass className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-sans text-sm sm:text-base md:text-lg font-semibold text-foreground">
              Why HappiMynd Feels Different
            </h3>
            <p className="font-sans text-xs sm:text-sm md:text-[15px] text-muted-foreground leading-[1.6]">
              At HappiMynd, there are no heavy labels, no complicated systems, and no intimidating processes just simple, guided clarity that helps you move forward in a way that feels human and manageable.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatSpaceSection;
