import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/happimynd-logo.png";
import solvLogo from "@/assets/solv-final-logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="HappiMynd" className="h-8 sm:h-10 lg:h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
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
          <div className="hidden md:flex items-center gap-4">
            <a href="https://happimynd.com/login" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Log In
            </a>
            <Button asChild variant="default" size="sm" className="rounded-full px-6">
              <a href="https://happimynd.com/signup">Get Started</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border/30">
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
            <div className="flex gap-4 pt-4">
              <a href="https://happimynd.com/login" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Log In
              </a>
              <Button asChild variant="default" size="sm" className="rounded-full px-6">
                <a href="https://happimynd.com/signup">Get Started</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
