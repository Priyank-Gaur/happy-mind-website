import { V2Link } from "@/v2/lib/router";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import logoImg from "@/v2/assets/happimynd-logo.png";

const PinterestIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.317-.088-.791-.167-2.005.035-2.868.182-.78 1.172-4.97 1.172-4.97s-.299-.6-.299-1.486c0-1.39.806-2.428 1.81-2.428.852 0 1.264.64 1.264 1.408 0 .858-.546 2.14-.828 3.33-.236.995.497 1.807 1.478 1.807 1.775 0 3.139-1.87 3.139-4.57 0-2.39-1.72-4.06-4.17-4.06-2.84 0-4.508 2.13-4.508 4.33 0 .858.33 1.78.742 2.28a.3.3 0 0 1 .069.286c-.076.315-.245.994-.278 1.133-.044.183-.145.222-.335.134-1.247-.58-2.027-2.4-2.027-3.86 0-3.14 2.284-6.02 6.577-6.02 3.453 0 6.136 2.46 6.136 5.75 0 3.43-2.162 6.19-5.163 6.19-1.01 0-1.958-.52-2.282-1.14l-.62 2.36c-.224.86-.83 1.94-1.235 2.597C9.704 21.84 10.82 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
  </svg>
);

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-4 sm:mt-8 w-full rounded-2xl sm:rounded-[2rem] border border-border/50 bg-white/95 p-4 sm:p-6 md:p-8 shadow-soft">
      <div className="grid gap-5 sm:gap-8 grid-cols-3 md:grid-cols-3 lg:grid-cols-5">
        {/* Brand Header on Mobile */}
        <div className="col-span-3 md:col-span-1 flex flex-col sm:flex-col justify-between sm:justify-start gap-2 sm:gap-3 border-b sm:border-0 border-border/30 pb-3 sm:pb-0">
          <V2Link to="/" className="flex items-center gap-2.5 focus:outline-none">
            <img
              src={logoImg}
              alt="HappiMynd Logo"
              className="h-9 sm:h-16 md:h-20 w-auto max-w-[150px] sm:max-w-[220px] object-contain"
            />
          </V2Link>
          <p className="hidden sm:block text-xs sm:text-sm leading-relaxed text-muted-foreground">
            A conscious growth ecosystem empowering people to become more aware, capable, and
            connected.
          </p>
          <a
            href="mailto:info@happimynd.com"
            className="text-[11px] sm:text-sm font-semibold text-primary hover:underline transition-colors w-fit"
          >
            info@happimynd.com
          </a>
        </div>

        {/* Services Column */}
        <div className="col-span-1 flex flex-col gap-2 sm:gap-3">
          <h4 className="text-xs sm:text-base font-bold tracking-tight text-foreground">
            Services
          </h4>
          <ul className="flex flex-col gap-1.5 sm:gap-2.5 text-[11px] sm:text-sm font-medium">
            <li>
              <V2Link
                to="/assessment"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                HappiLIFE
              </V2Link>
            </li>
            <li>
              <V2Link
                to="/services/happibuddy"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                HappiBUDDY
              </V2Link>
            </li>
            <li>
              <V2Link
                to="/services/happiself"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                HappiSELF
              </V2Link>
            </li>
            <li>
              <V2Link
                to="/services/happitalk"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                HappiTALK
              </V2Link>
            </li>
            <li>
              <V2Link
                to="/games"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Games
              </V2Link>
            </li>
            <li>
              <a
                href="https://quizzard.happimynd.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Quizzard
              </a>
            </li>
          </ul>
        </div>

        {/* Solutions Column */}
        <div className="col-span-1 flex flex-col gap-2 sm:gap-3">
          <h4 className="text-xs sm:text-base font-bold tracking-tight text-foreground">
            Solutions
          </h4>
          <ul className="flex flex-col gap-1.5 sm:gap-2.5 text-[11px] sm:text-sm font-medium">
            <li>
              <V2Link
                to="/services"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                For Individuals
              </V2Link>
            </li>
            <li>
              <a
                href="https://happimynd.com/for-organisations"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                For Organisations
              </a>
            </li>
            <li>
              <V2Link
                to="/services/solv"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                SOLV
              </V2Link>
            </li>
          </ul>
        </div>

        {/* Company Column */}
        <div className="col-span-1 flex flex-col gap-2 sm:gap-3">
          <h4 className="text-xs sm:text-base font-bold tracking-tight text-foreground">Company</h4>
          <ul className="flex flex-col gap-1.5 sm:gap-2.5 text-[11px] sm:text-sm font-medium">
            <li>
              <a
                href="https://happimynd.com/about"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                About
              </a>
            </li>
            <li>
              <V2Link
                to="/support"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Contact
              </V2Link>
            </li>
            <li>
              <a
                href="https://happimynd.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy
              </a>
            </li>
            <li>
              <a
                href="https://happimynd.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Terms
              </a>
            </li>
          </ul>
        </div>

        {/* App Download Column */}
        <div className="col-span-3 sm:col-span-1 flex flex-col gap-2 sm:gap-3 border-t sm:border-0 border-border/30 pt-3 sm:pt-0">
          <h4 className="text-xs sm:text-base font-bold tracking-tight text-foreground">
            Get the App
          </h4>
          <p className="hidden sm:block text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Experience HappiMynd on mobile devices.
          </p>
          <div className="flex flex-wrap gap-2 pt-0.5">
            <a
              href="https://play.google.com/store/apps/details?id=com.happimynd"
              target="_blank"
              rel="noopener noreferrer"
              className="transition duration-200 hover:scale-105 active:scale-95"
            >
              <img
                src="https://www.happimynd.com/assets/Frontend/images/play_store.png"
                alt="Get it on Google Play"
                className="h-7 sm:h-10 w-auto rounded-lg border border-border bg-black object-contain"
              />
            </a>
            <a
              href="https://apps.apple.com/in/app/happimynd-emotional-self-help/id1634742782"
              target="_blank"
              rel="noopener noreferrer"
              className="transition duration-200 hover:scale-105 active:scale-95"
            >
              <img
                src="https://www.happimynd.com/assets/Frontend/images/app_store.png"
                alt="Download on the App Store"
                className="h-7 sm:h-10 w-auto rounded-lg border border-border bg-black object-contain"
              />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 border-t border-border/40 pt-4 flex flex-col items-center justify-center gap-3 text-[11px] sm:text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-3">
          {[
            {
              icon: Linkedin,
              href: "https://www.linkedin.com/company/happimynd",
              label: "LinkedIn",
            },
            { icon: Facebook, href: "https://www.facebook.com/HappiMynd/", label: "Facebook" },
            { icon: Instagram, href: "https://www.instagram.com/happimynd/", label: "Instagram" },
            { icon: Twitter, href: "https://twitter.com/happi_mynd", label: "Twitter" },
            {
              icon: PinterestIcon,
              href: "https://in.pinterest.com/happi_mynd/_created/",
              label: "Pinterest",
            },
          ].map((social, i) => {
            const Icon = social.icon;
            return (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-lavender/30 text-muted-foreground transition-all duration-200 hover:bg-gradient-brand hover:text-white hover:scale-110 hover:shadow-soft active:scale-95"
              >
                <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              </a>
            );
          })}
        </div>
        <p className="text-center text-xs text-muted-foreground/80">
          &copy; {currentYear} HappiMynd. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
