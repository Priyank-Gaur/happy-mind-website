import { Button } from "@/components/ui/button";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const OrgStrategicClosing = () => {
  return (
    <section className="py-24 px-6 lg:px-16 bg-background">
      <div className="container mx-auto max-w-4xl text-center">
        {/* H1 */}
        <h2 className="font-serif text-primary text-2xl md:text-3xl font-bold text-foreground mb-8">
          Ready to Build Conscious & High-Performing Teams?
        </h2>

        {/* Closing Paragraph */}
        <p className="font-sans text-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          You cannot separate performance from people. HappiMynd helps
          organisations unlock potential through psychology-powered, data-backed
          solutions that strengthen awareness, leadership, and culture — at
          scale.
        </p>

        {/* CTA Strip */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-10 md:p-16 border border-primary/20">
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            {/* Primary CTA */}
            <div className="text-center">
              <Link to="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('open-contact-form')); }}>
              <Button
                variant="default"
                size="lg"
                className="rounded-full px-10 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 mb-3"
              >
                Talk to Our Team
              </Button>
              </Link>
              <p className="text-md text-muted-foreground mb-4">
                Explore how people intelligence strengthens performance.
              </p>
            </div>
            

           
          </div>
          {/* Divider */}
        <div className="w-full max-w-md mx-auto">
          <div className="h-px bg-border" />
        </div>

        {/* Support line */}
        <p className="text-muted-foreground text-sm sm:text-base font-mono mt-2">
          Have questions? Reach out to us.
        </p>

        {/* Contact row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm mt-4">
          <a href="mailto:info@happimynd.com" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <Mail className="w-4 h-4" />
            <span>info@happimynd.com</span>
          </a>
          <a href="tel:+918860393400" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <Phone className="w-4 h-4" />
            <span>+91 9136899581</span>
          </a>
          {/*<Link to="/live-chat" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span>Live Chat</span>
          </Link>*/}
        </div>
        </div>
      </div>
    </section>
  );
};

export default OrgStrategicClosing;
