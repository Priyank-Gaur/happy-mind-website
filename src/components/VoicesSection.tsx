import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
const reviews = [{
  name: "Priya S.",
  testimonial: "HappiMynd helped me understand myself better without feeling judged. It's like having a gentle guide.",
  rating: 5
}, {
  name: "Rahul M.",
  testimonial: "Our team's conscious awareness has transformed how we work together. The change is remarkable.",
  rating: 5
}, {
  name: "Ananya K.",
  testimonial: "Finally, a space that feels safe and welcoming. I've grown so much in just a few months.",
  rating: 5
}, {
  name: "Vikram P.",
  testimonial: "The journey approach made all the difference. No pressure, just progress at my own pace.",
  rating: 5
}, {
  name: "Meera J.",
  testimonial: "Simple yet profound. HappiMynd gave me tools I use every single day.",
  rating: 5
}, {
  name: "Arjun T.",
  testimonial: "Our organisation saw real change. Employees are more engaged and connected.",
  rating: 5
}, {
  name: "Sneha R.",
  testimonial: "I was skeptical at first, but the calm approach won me over completely.",
  rating: 5
}, {
  name: "Karthik N.",
  testimonial: "The experts are compassionate and truly listen. A rare find in today's world.",
  rating: 5
},{
  name: "Pooja N.",
  testimonial: "Clarity came slowly, but it stayed. That’s what made the difference for me.",
  rating: 5
}, {
  name: "Siddharth A.",
  testimonial: "I’ve tried many approaches before, but this one finally stuck. The changes felt real, not forced.",
  rating: 5
}, {
  name: "Neha L.",
  testimonial: "We noticed a shift within weeks. Better conversations, healthier mindsets, and stronger collaboration.",
  rating: 5
},{
  name: "Kapil R.",
  testimonial: "It didn’t feel like a program—it felt like a journey built around me.",
  rating: 5
}, {
  name: "Alaya M.",
  testimonial: "What stood out was how practical everything was. I could actually apply the insights to my daily life.",
  rating: 5
}, {
  name: "Ananya Raj S.",
  testimonial: "The experience felt thoughtful and human. I wasn’t rushed or judged—just steadily guided forward.",
  rating: 5
},];

// Duplicate reviews for seamless infinite scroll
const duplicatedReviews = [...reviews, ...reviews];
const VoicesSection = () => {
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
  return <section ref={sectionRef} className="py-4 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-16 bg-background">
      <div className="container mx-auto max-w-6xl mb-12">
        <div className={`text-center transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-primary tracking-widest uppercase mb-4 text-2xl sm:text-3xl md:text-4xl font-semibold">
            Voices
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
            What People Say
          </h2>
        </div>
      </div>

      {/* Carousel Container */}
      <div className={`relative transition-all duration-1000 ease-out ${isVisible ? "opacity-100" : "opacity-0"}`} style={{
      transitionDelay: "0.3s"
    }}>
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Sliding Track with proper container */}
        <div className="overflow-hidden">
          <div className={`flex gap-6 ${isVisible ? "animate-slide" : ""}`}>
            {duplicatedReviews.map((review, index) => <div key={index} className="w-64 sm:w-72 h-64 sm:h-72 flex-shrink-0 bg-card rounded-2xl p-4 sm:p-6 shadow-sm border border-border/20 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Star Rating */}
                  <div className="flex gap-1">
                    {Array.from({
                  length: review.rating
                }).map((_, i) => <Star key={i} className="w-4 h-4 fill-primary/60 text-primary/60" />)}
                  </div>
                  
                  {/* Testimonial */}
                  <p className="text-foreground text-xl leading-relaxed">
                    "{review.testimonial}"
                  </p>
                </div>

                {/* Reviewer Name */}
                <div className="pt-1 border-t border-border/20">
                  <p className="font-semibold text-foreground text-sm">
                    {review.name}
                  </p>
                </div>
              </div>)}
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes slideLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .animate-slide {
          animation: slideLeft 120s linear infinite;
          width: max-content;
        }
        
        .animate-slide:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>;
};
export default VoicesSection;