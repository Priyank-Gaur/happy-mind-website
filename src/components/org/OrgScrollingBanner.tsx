import { Button } from "@/components/ui/button";

const bannerStats = [
  "67% of employees experience unmanaged stress affecting focus and decision-making",
  "23% higher absenteeism is linked to burnout and emotional fatigue",
  "41% of voluntary attrition connects to unresolved emotional well-being challenges",
  "76% of employees report burnout symptoms at work",
];

const OrgScrollingBanner = () => {
  return (
    <section className="py-12 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Scrolling Stats */}
        <div className="relative mb-10 overflow-hidden">
          <div className="flex animate-scroll-left gap-12 whitespace-nowrap py-4">
            {[...bannerStats, ...bannerStats].map((stat, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-3 text-foreground/80 min-w-max"
              >
                <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                <span className="font-sans text-base md:text-lg font-medium">
                  {stat}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Pills */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            variant="default"
            size="lg"
            className="rounded-full px-8 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent('open-contact-form'));
            }}
          >
            Talk To HappiMynd
          </Button>
          <a href="https://drive.google.com/file/d/1AmW0MIjUj7U3UUbkAJiXznMPkJ8wezgA/view?usp=sharing">
          
          <Button
            variant="default"
            size="lg"
            className="rounded-full px-8 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Download Brochure
          </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default OrgScrollingBanner;
