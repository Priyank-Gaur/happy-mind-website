import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Download, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import BookSessionModal from "./BookSessionModal";
import { consumeBookingResume } from "@/lib/happimyndAuth";
import logo from "@/assets/happimynd-logo.png";
import solvLogo from "@/assets/solv-final-logo.png";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.happimynd";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  // Reopen the booking form when the visitor lands back here after logging in
  useEffect(() => {
    if (consumeBookingResume()) setBookingOpen(true);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img src={logo} alt="HappiMynd" className="h-14 sm:h-16 lg:h-20 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Home
            </Link>
            <Link to="/solv" className="text-primary hover:text-primary/80 transition-colors text-sm font-medium flex items-center">
              <img src={solvLogo} alt="SOLV" className="h-5 w-auto" />
            </Link>
            <Link to="/for-individuals" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              For Individuals
            </Link>
            <Link to="/for-organisations" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              For Organisations
            </Link>
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              About
            </Link>
            {/*<a href="#blog" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Vibe with Us
            </a>*/}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            {/* Account links, kept quiet so the buttons lead */}
            <a href="https://happimynd.com/login" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Log In
            </a>
            <a href="https://happimynd.com/signup" className="hidden xl:inline text-muted-foreground hover:text-foreground transition-colors text-sm">
              Get Started
            </a>

            <span className="h-5 w-px bg-border" aria-hidden="true" />

            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="px-3 border border-border text-foreground hover:bg-accent"
              >
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download />
                  <span className="hidden xl:inline">Download App</span>
                  <span className="xl:hidden">App</span>
                </a>
              </Button>

              <Button
                variant="default"
                size="sm"
                className="px-4"
                onClick={() => setBookingOpen(true)}
              >
                <CalendarDays />
                Book a Session
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 space-y-4 border-t border-border/30">
            <Link to="/" className="block text-muted-foreground hover:text-foreground transition-colors py-2">
              Home
            </Link>
            <Link to="/solv" className="block text-primary hover:text-primary/80 transition-colors py-2 font-medium flex items-center">
              <img src={solvLogo} alt="SOLV" className="h-5 w-auto" />
            </Link>
            <Link to="/for-individuals" className="block text-muted-foreground hover:text-foreground transition-colors py-2">
              For Individuals
            </Link>
            <Link to="/for-organisations" className="block text-muted-foreground hover:text-foreground transition-colors py-2">
              For Organisations
            </Link>
            <Link to="/about" className="block text-muted-foreground hover:text-foreground transition-colors py-2">
              About
            </Link>
            <a href="#blog" className="block text-muted-foreground hover:text-foreground transition-colors py-2">
              Vibe with Us
            </a>
            <div className="pt-4 space-y-4 border-t border-border/30">
              <Button
                variant="default"
                size="sm"
                className="w-full rounded-full"
                onClick={() => {
                  setIsOpen(false);
                  setBookingOpen(true);
                }}
              >
                <CalendarDays className="w-4 h-4 mr-1.5" />
                Book a Session
              </Button>

              <Button
                asChild
                variant="ghost"
                size="sm"
                className="w-full border border-border text-foreground hover:bg-accent"
              >
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                >
                  <Download />
                  Download App
                </a>
              </Button>

              <div className="flex gap-4">
                <a href="https://happimynd.com/login" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Log In
                </a>
                <a href="https://happimynd.com/signup" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Get Started
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <BookSessionModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
