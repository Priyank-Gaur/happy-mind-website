import { Lock, User, Clock, Shield } from "lucide-react";
const principles = [{
  icon: User,
  title: "You own your journey",
  description: "Your path is yours. We're here to support, not direct."
}, {
  icon: Lock,
  title: "You own your data",
  description: "Your information stays private and secure through data privacy laws & policies."
}, {
  icon: Clock,
  title: "We respect your pace",
  description: "Growth takes time. We move at the speed that's right for you."
}, {
  icon: Shield,
  title: "We protect your space",
  description: "A safe environment for honest self-exploration."
}];
const TrustSection = () => {
  return <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-16">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16">
          <p className="text-primary font-semibold tracking-wide uppercase text-xs sm:text-sm md:text-base">Trust, Privacy & Ethics</p>
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-semibold text-foreground">
            Your safety is our foundation.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {principles.map(principle => {
          const Icon = principle.icon;
          return <div key={principle.title} className="bg-white rounded-2xl p-4 sm:p-6 text-center space-y-3 sm:space-y-4 border border-border shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300">
                <div className="w-12 h-12 mx-auto rounded-full bg-accent flex items-center justify-center">
                  <Icon className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-foreground">{principle.title}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{principle.description}</p>
              </div>;
        })}
        </div>
      </div>
    </section>;
};
export default TrustSection;