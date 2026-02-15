import { Separator } from "@/components/ui/separator";
import { Linkedin, Instagram, Facebook, Youtube } from "lucide-react";
import logo from "@/assets/happimynd-logo.png";
const Footer = () => {
  return <footer className="bg-card py-12 sm:py-16 px-4 sm:px-6 lg:px-16">
      <div className="container mx-auto max-w-6xl px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12">
          {/* Brand Block */}
          <div className="col-span-1 space-y-4">
            <img src={logo} alt="HappiMynd" className="h-8 sm:h-10 w-auto" />
            <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
              A conscious growth ecosystem empowering people to become more aware, capable, and connected.
            </p>
            <a href="mailto:info@happimynd.com" className="text-primary text-xs sm:text-sm hover:underline transition-colors">
              info@happimynd.com
            </a>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-sm">Services</h4>
            <ul className="space-y-2 text-muted-foreground text-xs sm:text-sm">
              <li><a href="https://happimynd.com/signup" className="hover:text-primary transition-colors">HappiLIFE</a></li>
              <li><a href="" className="hover:text-primary transition-colors">HappiGUIDE</a></li>
              <li><a href="" className="hover:text-primary transition-colors">HappiBUDDY</a></li>
              <li><a href="" className="hover:text-primary transition-colors">HappiSELF</a></li>
              <li><a href="" className="hover:text-primary transition-colors">HappiTALK</a></li>
            </ul>
          </div>

          {/* Solutions */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-sm">Solutions</h4>
            <ul className="space-y-2 text-muted-foreground text-xs sm:text-sm">
              <li><a href="/for-individuals" className="hover:text-primary transition-colors">For Individuals</a></li>
              <li><a href="/for-organisations" className="hover:text-primary transition-colors">For Organisations</a></li>
              <li><a href="/solv" className="hover:text-primary transition-colors">SOLV</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-sm">Company</h4>
            <ul className="space-y-2 text-muted-foreground text-xs sm:text-sm">
              <li><a href="" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="" className="hover:text-primary transition-colors">Team</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('open-contact-form')); }} className="hover:text-primary transition-colors cursor-pointer">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-sm">Policy</h4>
            <ul className="space-y-2 text-muted-foreground text-xs sm:text-sm">
              <li><a href="" className="hover:text-primary transition-colors">Privacy</a></li>
              <li><a href="" className="hover:text-primary transition-colors">Terms</a></li>

            </ul>
          </div>
        </div>

        <Separator className="mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground text-xs sm:text-sm">
          <p className="text-center md:text-left">© 2026 HappiMynd. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300" aria-label="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300" aria-label="YouTube">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;