import { Quote } from "lucide-react";
import { motion } from "framer-motion";

const reviews = [
  {
    quote: "Thanks to Happimynd, our organization has made significant strides in destigmatizing mental health in the workplace. The platform's emphasis on self-care and emotional well-being has sparked meaningful conversations around mental health, ultimately fostering a more supportive and compassionate work environment for all.",
    author: "Suresh",
    company: "AnantRaj",
  },
  {
    quote: "With Happimynd, our team has been able to proactively address mental health concerns and provide timely support to employees in need. The platform's confidential counseling services and self-assessment tools have facilitated early intervention, preventing potential burnout and promoting long-term well-being.",
    author: "Anuj Nath",
    company: "Signature Global",
  },
  {
    quote: "Since Oct 2022, we are partnered with HappiMynd and happy to say that we took the benefits of what are there in the tools of happimynd; our employees are well aware now of its features and taking benefits. Mental and physical, both tests are now in need of the hour, management reports help us see where to address employees, while individual reports confidentiality is strictly adhered to.",
    author: "Naresh Gehlot",
    company: "Nuvoco",
  },
  {
    quote: "HappiMynd's results-oriented approach is commendable. Their 30+ successful partnerships with leading Indian corporations speak volumes about their effectiveness. If you are an organization seeking to invest in your employees' mental and emotional well-being, look no further than HappiMynd. Their PHYGITAL platform offers a powerful and unique solution that will yield positive and long-lasting results",
    author: "Rohan Chopra",
    company: "M3M India",
  }
];

const OrgClientReviews = () => {
  return (
    <section className="py-16 px-6 lg:px-16">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            What Our Clients Say
          </h2>
        </div>

        {/* Reviews Carousel */}
        <div className="relative overflow-hidden py-8">
          {/* 
            FIX: `whitespace-nowrap` on the flex container was being inherited
            by the card content, causing text to overflow on a single line.
            Solution: keep `whitespace-nowrap` on the scroll row so cards sit
            side-by-side, but add `whitespace-normal` on each card to reset
            text wrapping inside it.
          */}
          <div className="flex gap-6 whitespace-nowrap animate-scroll">
            {[...reviews, ...reviews].map((review, index) => (
              <motion.div
                key={index}
                className="whitespace-normal bg-white rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-all duration-300 flex-shrink-0 w-80 md:w-[28rem] min-h-80 flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Quote className="w-8 h-8 text-primary/30 mb-4 flex-shrink-0" />
                <blockquote className="font-sans text-muted-foreground leading-relaxed mb-6 italic text-sm flex-grow">
                  <p>"{review.quote}"</p>
                </blockquote>
                <div className="border-t border-border/30 pt-4 flex-shrink-0">
                  <p className="font-semibold text-foreground">{review.author}</p>
                  <p className="text-sm text-muted-foreground">{review.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrgClientReviews;