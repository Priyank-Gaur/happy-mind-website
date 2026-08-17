import { useEffect, useRef, useState } from "react";
import personalHabitsImg from "@/assets/solv-personal-habits.png";
import emotionalPatternsImg from "@/assets/solv-emotional-patterns.png";
import lifeDirectionImg from "@/assets/solv-life-direction.png";
import relationshipImg from "@/assets/solv-relationship.png";
import selfUnderstandingImg from "@/assets/solv-self-understanding.png";
import careerChoicesImg from "@/assets/solv-career-choices.png";
import moneyIndependenceImg from "@/assets/solv-money-independence.png";

const categories = [
  { title: "PERSONAL HABITS", image: personalHabitsImg },
  { title: "EMOTIONAL PATTERNS", image: emotionalPatternsImg },
  { title: "LIFE DIRECTION", image: lifeDirectionImg },
  { title: "MONEY & INDEPENDENCE", image: moneyIndependenceImg },
  { title: "RELATIONSHIP", image: relationshipImg },
  { title: "SELF UNDERSTANDING", image: selfUnderstandingImg },
  { title: "CAREER CHOICES", image: careerChoicesImg }
];

const SolvWhoThisIsFor = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<number>(0);
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
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Card + arc geometry scales down on narrow viewports so cards stay on screen
  const cardWidth = viewportWidth < 480 ? 160 : viewportWidth < 640 ? 190 : viewportWidth < 1024 ? 224 : 256;
  const cardHeight = viewportWidth < 480 ? 200 : viewportWidth < 640 ? 240 : viewportWidth < 1024 ? 280 : 320;
  const radiusX = viewportWidth < 480 ? 90 : viewportWidth < 640 ? 130 : viewportWidth < 1024 ? 260 : 420;
  const radiusY = viewportWidth < 640 ? 36 : 60;

  // Continuous rotation animation
  useEffect(() => {
    if (!isVisible) return;

    const speed = 0.10; // Slow, premium speed
    const animate = () => {
      if (!isPaused) {
        setRotation(prev => (prev + speed) % 360);
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isVisible, isPaused]);

  // Calculate card position on the curved arc
  const getCardStyle = (index: number) => {
    const totalCards = categories.length;
    const anglePerCard = 360 / totalCards;
    const cardAngle = (index * anglePerCard + rotation) % 360;

    // Convert to radians for calculations
    const radians = (cardAngle * Math.PI) / 180;

    // Calculate position on elliptical arc
    const x = Math.sin(radians) * radiusX;
    const z = Math.cos(radians) * radiusY;

    // Scale based on z-position (front = larger, back = smaller)
    const normalizedZ = (z + radiusY) / (radiusY * 2); // 0 to 1
    const scale = 0.65 + normalizedZ * 0.45; // 0.65 to 1.1

    // Opacity based on position (front = visible, back = faded)
    const opacity = 0.4 + normalizedZ * 0.6; // 0.4 to 1

    // Z-index based on depth
    const zIndex = Math.round(normalizedZ * 10);

    // Vertical offset to create arc effect
    const y = -Math.abs(Math.cos(radians)) * 25;

    return {
      transform: `translateX(${x}px) translateY(${y}px) scale(${scale})`,
      opacity,
      zIndex,
      transition: isPaused ? 'all 0.3s ease-out' : 'none'
    };
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-12 sm:py-16 md:py-20 overflow-hidden"
    >
      {/* Header */}
      <div className="text-center mb-10 sm:mb-16 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-primary">
          If You're Figuring Life Out, This Is For You.
        </h2>
        <p className="text-base sm:text-lg max-w-3xl mx-auto">
          We support the moments that shape your direction, not just the ones that feel difficult.
        </p>
      </div>

      {/* Curved Carousel */}
      <div className="relative w-full h-[260px] sm:h-[320px] md:h-[400px] flex items-center justify-center">
        {/* Center point for the carousel */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {categories.map((category, index) => {
            const style = getCardStyle(index);
            return (
              <div
                key={index}
                className="absolute rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
                style={{
                  ...style,
                  left: '50%',
                  top: '50%',
                  width: cardWidth,
                  height: cardHeight,
                  marginLeft: -cardWidth / 2,
                  marginTop: -cardHeight / 2,
                }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {/* Image */}
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover"
                />

                {/* Dark gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6">
                  <h3 className="text-white font-bold text-[10px] sm:text-xs text-center leading-tight uppercase tracking-wide">
                    {category.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SolvWhoThisIsFor;