import { Layers } from "lucide-react";

const OrgPlatformPhilosophy = () => {
  return (
    <section className="py-20 px-6 lg:px-16">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-12 md:p-16 border border-primary/20">
          <Layers className="w-12 h-12 text-primary mx-auto mb-8" />

          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8">
            Systems-led, not session-based
          </h2>

          <p className="font-sans text-lg md:text-xl text-muted-foreground leading-relaxed">
            HappiMynd is designed as an ongoing emotional support system — not a
            limited counselling model. It integrates into daily work life,
            enabling continuous awareness, early intervention, and sustained
            behavioural change across the organisation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default OrgPlatformPhilosophy;
