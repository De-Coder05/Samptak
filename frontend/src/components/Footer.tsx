import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border/30">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <img src="/icon.png" alt="Samptak Logo" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <span className="font-display font-bold text-xl text-foreground">Samptak</span>
              <p className="text-xs text-muted-foreground">AI Railway Safety</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">About</a>
            <a href="#" className="hover:text-primary transition-colors">Documentation</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-lg bg-card/50 border border-border/30 flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all">
              <Github className="w-5 h-5 text-muted-foreground" />
            </a>
            <a href="#" className="w-10 h-10 rounded-lg bg-card/50 border border-border/30 flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all">
              <Linkedin className="w-5 h-5 text-muted-foreground" />
            </a>
            <a href="#" className="w-10 h-10 rounded-lg bg-card/50 border border-border/30 flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all">
              <Twitter className="w-5 h-5 text-muted-foreground" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/20 text-center text-sm text-muted-foreground">
          <p>© 2024 Samptak. Protecting railways with artificial intelligence.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
