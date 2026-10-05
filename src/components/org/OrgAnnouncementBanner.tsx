import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import viewPlansMascot from "@/assets/view-plans-mascot.png";

const OrgAnnouncementBanner = () => {
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
          MIND MATTERS - An Awareness Initiative.
        </h1>

        {/* Supporting Text */}
        <div className="space-y-3 max-w-3xl">
          <h2 className="font-serif text-base md:text-lg lg:text-xl font-medium text-foreground text-center">
            This World Mental Health Day is a reminder to orient towards holistic well being.
          </h2>
          <p className="font-sans text-base md:text-lg lg:text-xl font-semibold text-foreground text-center">
            Let us drive awareness &amp; acceptance!!
          </p>
          <p className="font-sans text-sm md:text-base lg:text-lg text-foreground/80 text-center">
            Go beyond a one-day message with fun, learn and self reflect experience organized to help your people gain clarity and take something valuable away.
          </p>
        </div>

        {/* CTA Button */}
        <Button
          asChild
          variant="outline"
          className="mt-6 bg-card text-foreground rounded-full px-8 py-2.5 font-medium shadow-sm hover:bg-card hover:text-foreground hover:shadow-sm flex items-center gap-2"
        >
          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent('open-contact-form'));
            }}
          >
            Connect With Us
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default OrgAnnouncementBanner;
