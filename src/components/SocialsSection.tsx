import { useEffect, useRef, useState } from "react";
import socialsCardImg from "@/assets/community/HomePage-sec8-SocialsCard.jpeg";
import youtubeCardImg from "@/assets/community/HomePage-sec8-YoutubeCard.png";
import communityCardImg from "@/assets/community/HomePage-sec8-CommunityCard.png";

const socialCards = [
  {
    id: 1,
    label: "#socials",
    type: "image",
    link: "https://www.instagram.com/happimynd/reels/",
    imageSrc: socialsCardImg,
    tilt: "-rotate-2",
  },
  {
    id: 2,
    label: "#youtube",
    type: "image",
    link: "https://www.youtube.com/@happimynd",
    imageSrc: youtubeCardImg,
    tilt: "rotate-1",
  },
  {
    id: 3,
    label: "#community",
    type: "image",
    link: "#contact", // Placeholder to trigger contact form
    imageSrc: communityCardImg,
    tilt: "-rotate-1",
  },
];

const SocialsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        
        // Control video playback based on visibility
        videoRefs.current.forEach((video) => {
          if (video) {
            if (entry.isIntersecting) {
              video.play().catch(() => {});
            } else {
              video.pause();
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-4 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-16"
    >
      <div className="container mx-auto max-w-6xl">
        {/* Headings */}
        <div className="text-center space-y-3 mb-16">
          <p 
            className={`font-sans text-primary tracking-widest uppercase text-xs sm:text-sm font-medium transition-all duration-700 ease-out ${
              isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-4"
            }`}
          >
            CHECK OUR
          </p>
          <h2 
            className={`font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground transition-all duration-700 ease-out ${
              isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "0.15s" }}
          >
            Our Socials and Community
          </h2>
          <p 
            className={`font-mono text-muted-foreground text-xs sm:text-sm md:text-base transition-all duration-700 ease-out ${
              isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "0.3s" }}
          >
            Click and explore
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {socialCards.map((card, index) => {
            // Special handling for the community card to open contact form
            const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
              if (card.id === 3 && card.link === "#contact") { // Community card
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('open-contact-form'));
              }
            };

            return (
              <a
                key={card.id}
                href={card.link}
                target={card.id === 3 ? undefined : "_blank"} // Don't open in new tab for community card
                rel={card.id === 3 ? undefined : "noopener noreferrer"} // Same for rel attribute
                onClick={handleClick}
                className={`group block transition-all duration-700 ease-out ${
                  isVisible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${0.4 + index * 0.15}s` }}
              >
                {/* Polaroid Frame */}
                <div 
                  className={`bg-white rounded-xl p-2 sm:p-3 pb-4 border border-border ${card.tilt} hover:rotate-0 transition-transform duration-500 ease-out ${
                    isVisible ? "shadow-xl" : "shadow-none"
                  }`}
                  style={{
                    boxShadow: isVisible 
                      ? "0 10px 40px -10px rgba(0, 0, 0, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.02)" 
                      : "none",
                    transition: "box-shadow 0.7s ease-out, transform 0.5s ease-out",
                    transitionDelay: `${0.4 + index * 0.15}s`,
                  }}
                >
                  {/* Media Container */}
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted/50 mb-4">
                    <img
                      src={card.imageSrc}
                      alt={card.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  {/* Label */}
                  <p className="text-center text-primary text-base sm:text-lg font-medium">
                    {card.label}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SocialsSection;
