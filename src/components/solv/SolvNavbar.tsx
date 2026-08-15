import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { BookSessionDialog } from "@/v2/components/book-session-dialog";

const SolvNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto max-w-7xl px-6 lg:px-16">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/solv" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold text-primary">SOLV</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">by HappiMynd</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Home
            </Link>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              How It Works
            </a>
            <a href="#products" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Products
            </a>
            <Link to="/for-organisations" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              For Organisations
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" size="sm" className="rounded-full">
              Take Assessment
            </Button>
            <Button size="sm" className="rounded-full" onClick={() => setBookingOpen(true)}>
              Book Session
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border/50">
            <Link
              to="/"
              className="block text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <a
              href="#how-it-works"
              className="block text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#products"
              className="block text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </a>
            <Link
              to="/for-organisations"
              className="block text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              For Organisations
            </Link>
            <div className="flex gap-4 pt-4">
              <Button variant="outline" size="sm" className="rounded-full flex-1">
                Take Assessment
              </Button>
              <Button
                size="sm"
                className="rounded-full flex-1"
                onClick={() => {
                  setIsMenuOpen(false);
                  setBookingOpen(true);
                }}
              >
                Book Session
              </Button>
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

export default SolvNavbar;
