import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Download, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { BookSessionDialog } from "@/v2/components/book-session-dialog";
import logo from "@/assets/happimynd-logo.png";
import solvLogo from "@/assets/solv-final-logo.png";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.happimynd";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

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
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {/* Account buttons with borders */}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full px-4 border border-border text-foreground hover:bg-accent hover:border-primary/50 transition-all font-medium text-xs sm:text-sm"
            >
                  <Link to="/v2/login" onClick={() => setIsOpen(false)}>Log In</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full px-4 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all font-medium text-xs sm:text-sm"
            >
                  <Link to="/v2/signup" onClick={() => setIsOpen(false)}>Get Started</Link>
            </Button>

            <span className="h-5 w-px bg-border" aria-hidden="true" />

            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="px-3 border border-border text-foreground hover:bg-accent rounded-full"
              >
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden xl:inline">Download App</span>
                  <span className="xl:hidden">App</span>
                </a>
              </Button>

              <Button
                variant="default"
                size="sm"
                className="px-4 rounded-full"
                onClick={() => setBookingOpen(true)}
              >
                <CalendarDays className="w-4 h-4" />
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
            <div className="pt-4 space-y-3 border-t border-border/30">
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
                className="w-full border border-border text-foreground hover:bg-accent rounded-full"
              >
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                >
                  <Download className="w-4 h-4 mr-1.5" />
                  Download App
                </a>
              </Button>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full rounded-full border border-border text-foreground hover:bg-accent"
                >
              <Link to="/v2/login">Log In</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full rounded-full border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
              <Link to="/v2/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <BookSessionDialog
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        service={{ key: "solv", name: "SOLV" }}
      />
    </nav>
  );
};

export default Navbar;
