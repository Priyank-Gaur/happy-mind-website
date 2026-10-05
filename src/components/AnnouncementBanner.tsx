import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import solvLogo from "@/assets/solv-final-logo.png";
import viewPlansMascot from "@/assets/view-plans-mascot.png";

interface AnnouncementBannerProps {
  title?: string;
  description?: string;
  priceNote?: string | null;
  ctaLabel?: string;
  ctaHref?: string;
}

const AnnouncementBanner = ({
  title = "Find clarity. Build awareness. Grow consciously.",
  description = "Whether you're navigating career pressure, relationships, overthinking or simply trying to understand yourself better, HappiMynd gives you the tools, guidance and expert support to move forward.",
  priceNote = "Plans starting at ₹199",
  ctaLabel = "Explore Plans",
  ctaHref = "/v2/services/happiself",
}: AnnouncementBannerProps) => {
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
          {title}
        </h1>

        {/* Supporting Text */}
        <div className="space-y-3 max-w-3xl">
          <p className="font-sans text-sm md:text-base lg:text-lg text-foreground/80 text-center">
            {description}
          </p>
          {priceNote && (
            <p className="font-sans text-xs md:text-sm lg:text-base font-semibold text-foreground text-center">
              {priceNote}
            </p>
          )}
        </div>

        {/* CTA Button */}
        <Button
          asChild
          variant="outline"
          className="mt-6 bg-card text-foreground rounded-full px-8 py-2.5 font-medium shadow-sm hover:bg-card hover:text-foreground hover:shadow-sm flex items-center gap-2"
        >
          <Link to={ctaHref}>
            {ctaLabel}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
