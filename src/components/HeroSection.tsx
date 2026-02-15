import { Button } from "@/components/ui/button";
import { Shield, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";
import whatSpaceHero from "@/assets/home-page-hero-section.png";

const trustPills = [{
  icon: Shield,
  text: "100% Confidential & Secure"
}, {
  icon: Users,
  text: "200K+ Users Trust Us"
}, {
  icon: Star,
  text: "5000+ counselling hours"
}];

const HeroSection = () => {
  return (
    <section className="min-h-[110vh] relative overflow-hidden">
      
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={whatSpaceHero} 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{
        background: "linear-gradient(to right, hsl(var(--background)) 0%, hsl(var(--background) / 0.95) 35%, hsl(var(--background) / 0.7) 55%, transparent 75%)"
      }} />
      {/* Top/bottom fade */}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{
        background: "linear-gradient(to bottom, hsl(var(--background)) 0%, transparent 15%, transparent 85%, hsl(var(--background)) 100%)"
      }} />

      {/* Content */}
      <div className="relative z-20 min-h-[110vh] flex items-center py-8 px-6 lg:px-16">
        <div className="container mx-auto max-w-3xl lg:mr-auto lg:ml-16">
          <div className="space-y-8 text-center lg:text-left">
            {/* Trust Pills - Full width above content */}
        <div className="flex flex-wrap gap-2 sm:gap-4 justify-center mb-8 sm:mb-12">
          {trustPills.map((pill, index) => (
            <div key={index} className="flex items-center gap-2 bg-white border border-border/30 rounded-md px-3 py-2 sm:px-5 sm:py-2.5 shadow-md flex-shrink-0">
              <pill.icon className="w-4 h-4 text-primary" />
              <span className="text-[10px] sm:text-xs font-medium text-foreground whitespace-normal text-center" style={{
                fontFamily: "'IBM Plex Sans', sans-serif"
              }}>
                {pill.text}
              </span>
            </div>
          ))}
        </div>

            {/* Micro-intro */}
            <p className="font-sans text-base text-muted-foreground tracking-wide">
              Welcome to
            </p>
            
            {/* H1 */}
            <h1 className="font-sans text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-muted-foreground">
              A <span className="text-primary">Conscious Growth Ecosystem</span> Where
            </h1>
            
            {/* H2 - Hero Statement */}
            <h2 className="font-serif text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed text-foreground">
              <span className="text-primary">Human Science & Psychology powered</span> technology engages individuals & organisations to become more {" "}
              <span className="text-primary">aware, capable, and connected.</span>
            </h2>
            
            {/* H3 - Support Line */}
            <p style={{
            fontFamily: "'IBM Plex Sans', sans-serif"
          }} className="text-sm md:text-base font-medium tracking-wide font-mono text-muted-foreground">
              Psychology-powered. Human-led.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link to="/for-individuals">
              <Button variant="default" size="lg" className="rounded-full px-8 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                Start for Myself
              </Button></Link>
              <Link to="/for-organisations">
              <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-base font-medium border-2 border-primary text-primary bg-background/80 backdrop-blur-sm hover:bg-primary/5 transition-all duration-300">
                Explore for My Team
              </Button></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
