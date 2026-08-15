import { Button } from "@/components/ui/button";
import organizationHero from "@/assets/AboutpageHERO.png";

const AboutHeroSection = () => {
  return (
    <section className="py-20 px-6 lg:px-16">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              We're a <span className="text-primary">People First Company</span> in a Tech First World
            </h1>
            
            <h2 className="font-sans text-2xl md:text-3xl text-muted-foreground leading-relaxed">
              HappiMynd brings human science of psychology and technology together to build clarity, capability, and connection at scale.
            </h2>
            
            <h3 className="font-serif text-2xl text-primary italic">
              Growth that feels natural. Impact that lasts.
            </h3>
            
            
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={organizationHero}
                alt="People-first company"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHeroSection;
