import { Quote } from "lucide-react";
const stats = [{
  value: "50,000+",
  label: "Individuals Supported"
}, {
  value: "200+",
  label: "Organisations Partnered"
}, {
  value: "92%",
  label: "Adoption Rate"
}, {
  value: "4.8/5",
  label: "Satisfaction Score"
}];
const testimonials = [{
  quote: "HappiMynd helped me understand myself better without feeling judged. It's like having a gentle guide.",
  author: "Priya S.",
  role: "Individual User"
}, {
  quote: "Our team's conscious awareness has transformed how we work together. The change is remarkable.",
  author: "Rahul M.",
  role: "HR Director"
}];
const clientLogos = ["Partner 1", "Partner 2", "Partner 3", "Partner 4", "Partner 5", "Partner 6"];
const ProofSection = () => {
  return <section className="py-24 px-6 lg:px-16">
      <div className="container mx-auto max-w-6xl space-y-20">
        {/* Stats */}
        <div className="text-center">
          <p className="text-primary tracking-wide uppercase mb-12 text-2xl font-semibold">Impact</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(stat => <div key={stat.label} className="space-y-2">
                <div className="font-serif text-4xl md:text-5xl font-semibold text-foreground">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>)}
          </div>
        </div>

        {/* Client Logos */}
        <div className="text-center">
          <p className="text-primary font-medium tracking-wide uppercase text-sm mb-8">Trusted By</p>
          <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
            {clientLogos.map((logo, index) => <div key={index} className="w-24 h-12 rounded-lg bg-background flex items-center justify-center text-muted-foreground text-sm font-medium">
                {logo}
              </div>)}
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center">
          <p className="text-primary font-medium tracking-wide uppercase text-sm mb-12">Voices</p>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => <div key={index} className="bg-background rounded-3xl p-8 text-left relative border border-border/30">
                <Quote className="w-8 h-8 text-primary/20 absolute top-6 right-6" />
                <blockquote className="text-foreground text-lg leading-relaxed mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.author}</div>
                  <div className="text-muted-foreground text-sm">{testimonial.role}</div>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </section>;
};
export default ProofSection;