import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="glass-card mx-4 mt-4 rounded-2xl border-border/30">
        <div className="container px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <img src="/icon.png" alt="Samptak Logo" className="w-6 h-6 object-contain" />
              </div>
              <span className="font-display font-bold text-xl text-foreground">Samptak</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("analysis")}
                className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                Analysis
              </button>
              <button
                onClick={() => scrollToSection("stats")}
                className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                Impact
              </button>
              <button
                onClick={() => scrollToSection("tech")}
                className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                Technology
              </button>
              <Button
                size="sm"
                onClick={() => scrollToSection("analysis")}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Try Demo
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-card/50 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-border/30"
            >
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => scrollToSection("analysis")}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium text-left py-2"
                >
                  Analysis
                </button>
                <button
                  onClick={() => scrollToSection("stats")}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium text-left py-2"
                >
                  Impact
                </button>
                <button
                  onClick={() => scrollToSection("tech")}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium text-left py-2"
                >
                  Technology
                </button>
                <Button
                  size="sm"
                  onClick={() => scrollToSection("analysis")}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
                >
                  Try Demo
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
