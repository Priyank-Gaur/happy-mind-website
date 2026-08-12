import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Linkedin, Instagram, Facebook, Youtube } from "lucide-react";
import logo from "@/assets/happimynd-logo.png";
import playStoreImg from "@/assets/play_store.png";
import appStoreImg from "@/assets/app_store.png";
const Footer = () => {
  return (
    <footer className="bg-card py-12 sm:py-16 px-4 sm:px-6 lg:px-16">
      <div className="container mx-auto max-w-6xl px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12">
          {/* Brand Block */}
          <div className="col-span-1 space-y-4">
            <img src={logo} alt="HappiMynd" className="h-20 sm:h-14 w-auto" />
            <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
              A conscious growth ecosystem empowering people to become more
              aware, capable, and connected.
            </p>
            <a
              href="mailto:info@happimynd.com"
              className="text-primary text-xs sm:text-sm hover:underline transition-colors"
            >
              info@happimynd.com
            </a>
            <div className="flex gap-4 mt-4">
              <a
                href="https://play.google.com/store/apps/details?id=com.happimynd"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={playStoreImg}
                  alt="Get it on Google Play"
                  className="h-12 sm:h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                />
              </a>
              <a
                href="https://apps.apple.com/in/app/happimynd-emotional-self-help/id1634742782"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={appStoreImg}
                  alt="Download on the App Store"
                  className="h-12 sm:h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-sm">Services</h4>
            <ul className="space-y-2 text-muted-foreground text-xs sm:text-sm">
              <li>
                <a
                  href="https://happimynd.com/signup"
                  className="hover:text-primary transition-colors"
                >
                  HappiLIFE
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    window.dispatchEvent(new CustomEvent("open-contact-form"));
                  }}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  HappiGUIDE
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    window.dispatchEvent(new CustomEvent("open-contact-form"));
                  }}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  HappiBUDDY
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    window.dispatchEvent(new CustomEvent("open-contact-form"));
                  }}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  HappiSELF
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    window.dispatchEvent(new CustomEvent("open-contact-form"));
                  }}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  HappiTALK
                </a>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-sm">Solutions</h4>
            <ul className="space-y-2 text-muted-foreground text-xs sm:text-sm">
              <li>
                <Link
                  to="/for-individuals"
                  className="hover:text-primary transition-colors"
                >
                  For Individuals
                </Link>
              </li>
              <li>
                <Link
                  to="/for-organisations"
                  className="hover:text-primary transition-colors"
                >
                  For Organisations
                </Link>
              </li>
              <li>
                <Link
                  to="/solv"
                  className="hover:text-primary transition-colors"
                >
                  SOLV
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-sm">Company</h4>
            <ul className="space-y-2 text-muted-foreground text-xs sm:text-sm">
              <li>
                <a
                  href="https://happimynd.com/about"
                  className="hover:text-primary transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <Link
                  to="/about#our-team"
                  className="hover:text-primary transition-colors"
                >
                  Team
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    window.dispatchEvent(new CustomEvent("open-contact-form"));
                  }}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-sm">Policy</h4>
            <ul className="space-y-2 text-muted-foreground text-xs sm:text-sm">
              <li>
                <a
                  href="https://happimynd.com/privacy"
                  className="hover:text-primary transition-colors"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="https://happimynd.com/terms"
                  className="hover:text-primary transition-colors"
                >
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground text-xs sm:text-sm">
          <p className="text-center md:text-left">
            © 2026 HappiMynd. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="https://www.linkedin.com/company/happimynd"
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://www.instagram.com/happimynd"
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://www.facebook.com/HappiMynd/"
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://www.youtube.com/@happimynd"
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
