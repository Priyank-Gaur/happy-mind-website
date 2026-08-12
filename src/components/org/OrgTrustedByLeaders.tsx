import { TrendingUp, BarChart3, Flame, Heart } from "lucide-react";

const stats = [
  { icon: TrendingUp, value: "89%", label: "employee adoption" },
  { icon: BarChart3, value: "3.2X", label: "ROI on wellness investment" },
  { icon: Flame, value: "34%", label: "reduction in burnout indicators" },
  { icon: Heart, value: "28%", label: "improvement in engagement scores" },
];

const testimonials = [
  {
    quote:
      "HappiMynd gave us visibility into team well-being without compromising individual privacy. It's exactly what modern organisations need.",
    author: "Chief Human Resources Officer",
    company: "Technology Company",
  },
  {
    quote:
      "We've seen measurable improvements in engagement and a significant reduction in stress-related absenteeism since implementing HappiMynd.",
    author: "Head of People",
    company: "Financial Services",
  },
  {
    quote:
      "What sets HappiMynd apart is the balance between organisational insight and employee trust. Our teams actually use it.",
    author: "Chief Executive Officer",
    company: "Healthcare Organisation",
  },
];

const OrgTrustedByLeaders = () => {
  return (
    <section className="py-20 px-6 lg:px-16 bg-primary/5">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            What organisations are seeing
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-background rounded-2xl p-6 border border-border/30 shadow-sm text-center"
            >
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="font-serif text-3xl font-bold text-primary mb-1">
                {stat.value}
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-background rounded-2xl p-8 border border-border/30 shadow-sm"
            >
              <blockquote className="font-sans text-muted-foreground mb-6 leading-relaxed italic">
                "{testimonial.quote}"
              </blockquote>
              <div>
                <div className="font-semibold text-foreground text-sm">
                  {testimonial.author}
                </div>
                <div className="text-xs text-muted-foreground">
                  {testimonial.company}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrgTrustedByLeaders;
