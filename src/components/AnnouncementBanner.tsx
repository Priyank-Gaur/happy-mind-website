import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import solvLogo from "@/assets/solv-final-logo.png";
import viewPlansMascot from "@/assets/view-plans-mascot.png";

const useTypewriter = (texts: string[], speed: number = 100, backspaceSpeed: number = 50) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const handleTyping = () => {
      const current = texts[textIndex];
      
      if (isDeleting) {
        // Backspace effect
        setCurrentText(current.substring(0, currentIndex - 1));
        setCurrentIndex(prev => prev - 1);
        
        if (currentIndex === 0) {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      } else {
        // Typing effect
        setCurrentText(current.substring(0, currentIndex + 1));
        setCurrentIndex(prev => prev + 1);
        
        if (currentIndex === current.length) {
          // Wait before backspacing
          setTimeout(() => setIsDeleting(true), 2000);
        }
      }
    };

    const timer = setTimeout(handleTyping, isDeleting ? backspaceSpeed : speed);
    return () => clearTimeout(timer);
  }, [currentIndex, isDeleting, textIndex, texts, speed, backspaceSpeed]);

  return currentText;
};

const AnnouncementBanner = () => {
  const texts = [
    "Get the tools, guidance and expert support you need - with plans starting at just ₹199.",
    "Choose your level of support and grow at your own pace."
  ];
  
  const animatedText = useTypewriter(texts, 50, 25);

  return (
    <div className="relative w-full overflow-hidden group cursor-pointer">
      {/* Animated lavender gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-lavender via-lavender-medium to-lavender animate-gradient-flow" />

      {/* Secondary flowing gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-lavender-light/50 via-transparent to-lavender/50 animate-gradient-slow" />

      {/* Left smoky mist effect */}
      <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 lg:w-64">
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent animate-mist-left" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/20 to-transparent animate-mist-left-slow" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent animate-mist-pulse" />
      </div>

      {/* Right smoky mist effect */}
      <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 lg:w-64">
        <div className="absolute inset-0 bg-gradient-to-l from-white/80 via-white/40 to-transparent animate-mist-right" />
        <div className="absolute inset-0 bg-gradient-to-l from-white/60 via-white/20 to-transparent animate-mist-right-slow" />
        <div className="absolute inset-0 bg-gradient-to-bl from-white/50 via-transparent to-transparent animate-mist-pulse" />
      </div>

      {/* View Plans Mascot peeking from the left (upper part only) */}
      <img
        src={viewPlansMascot}
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute -bottom-16 left-6 z-10 hidden h-48 w-auto object-cover object-top animate-float drop-shadow-xl md:block md:-bottom-20 md:h-60 md:left-10 lg:left-14 lg:-bottom-28 lg:h-72 xl:left-20 xl:-bottom-32 xl:h-80"
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-16 py-4 md:py-6 lg:py-8 flex flex-col items-center justify-center text-center">
        {/* Main line */}
        <h1 className="font-serif text-xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-2 md:mb-3">
          Start Your Growth Journey Today.

        </h1>
        
        {/* Animated Supporting Text */}
        <div className="space-y-3">
          <p className="font-sans text-sm md:text-base lg:text-lg text-foreground/80 text-center min-h-[30px] flex items-center justify-center">
            {animatedText}
            <span className="inline-block w-2 h-5 bg-foreground/80 ml-1 animate-pulse"></span>
          </p>
          <p className="font-sans text-xs md:text-xs lg:text-sm text-foreground/80 text-center">
            Plans starting at just ₹ 199
          </p>
        </div>
        
        {/* CTA Button */}
        <Button
          variant="outline"
          className="mt-6 bg-card text-foreground rounded-full px-8 py-2.5 font-medium shadow-sm hover:bg-card hover:text-foreground hover:shadow-sm flex items-center gap-2"
        >
          Explore Now
        </Button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
