const milestones = [
  { year: "2019", title: "Founded", description: "HappiMynd was born from a simple belief: mental well-being should be accessible to everyone." },
  { year: "2020", title: "First 1,000 Users", description: "Launched our core platform and helped our first thousand individuals find clarity." },
  { year: "2021", title: "Corporate Launch", description: "Expanded to serve organizations, bringing emotional well-being to workplaces across India." },
  { year: "2022", title: "25K+ Assessments", description: "Crossed 25,000 psychological assessments, building India's largest emotional intelligence dataset." },
  { year: "2023", title: "App Launched", description: "Released the HappiMynd mobile app, making conscious growth accessible on-the-go." },
  { year: "2024", title: "2L+ Lives Touched", description: "Reached over 200,000 individuals and partnered with 40+ corporate clients." },
  { year: "2025", title: "HappiMynd 2.0 & SOLV", description: "Launched HappiMynd 2.0 platform and introduced SOLV for youth conscious growth." },
];

const MilestoneCard = ({ milestone, position }: { milestone: typeof milestones[0]; position: "top" | "bottom" }) => (
  <div className={`text-center px-1 ${position === "top" ? "mb-3" : "mt-3"}`}>
    <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary font-mono text-xs font-semibold rounded-full mb-1">
      {milestone.year}
    </span>
    <h3 className="font-serif text-sm font-semibold text-foreground leading-tight mb-0.5">
      {milestone.title}
    </h3>
    <p className="text-muted-foreground text-[11px] leading-relaxed">
      {milestone.description}
    </p>
  </div>
);

const AboutMilestonesSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-6 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-10 sm:mb-16">
          Our Milestones
        </h2>

        {/* Mobile / tablet: simple vertical timeline, one milestone per row */}
        <div className="md:hidden space-y-6">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3.5 h-3.5 rounded-full bg-primary border-[3px] border-background shadow-[0_0_0_1px_hsl(var(--primary)/0.2)] shrink-0" />
                {index < milestones.length - 1 && (
                  <div className="w-0.5 flex-1 bg-primary/20 mt-1" />
                )}
              </div>
              <div className="pb-2">
                <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary font-mono text-xs font-semibold rounded-full mb-1">
                  {milestone.year}
                </span>
                <h3 className="font-serif text-base font-semibold text-foreground leading-tight mb-1">
                  {milestone.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: alternating top/bottom horizontal timeline */}
        <div className="hidden md:grid md:grid-cols-7 gap-0">
          {/* Top row - odd milestones (0,2,4,6) show content, even slots empty */}
          {milestones.map((milestone, index) => (
            <div key={`top-${index}`} className="flex flex-col justify-end min-h-[120px]">
              {index % 2 === 0 && <MilestoneCard milestone={milestone} position="top" />}
            </div>
          ))}

          {/* Timeline row with dots */}
          <div className="col-span-7 relative flex items-center">
            <div className="absolute left-0 right-0 h-0.5 bg-primary/20" />
            {milestones.map((_, index) => (
              <div key={`dot-${index}`} className="flex-1 flex justify-center">
                <div className="w-3.5 h-3.5 rounded-full bg-primary border-[3px] border-background z-10" />
              </div>
            ))}
          </div>

          {/* Bottom row - even milestones (1,3,5) show content, odd slots empty */}
          {milestones.map((milestone, index) => (
            <div key={`bottom-${index}`} className="flex flex-col justify-start min-h-[120px]">
              {index % 2 !== 0 && <MilestoneCard milestone={milestone} position="bottom" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutMilestonesSection;
