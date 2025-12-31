import { motion } from "framer-motion";
import { Shield, Zap, Eye, AlertTriangle, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import NetworkBackground from "./NetworkBackground";

const HeroSection = () => {
  const scrollToDemo = () => {
    document.getElementById("analysis")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToUrgency = () => {
    document.getElementById("urgency")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden network-bg">
      <NetworkBackground />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background pointer-events-none" />
      
      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Urgency Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-danger/10 border border-danger/30"
          >
            <AlertTriangle className="w-4 h-4 text-danger animate-pulse" />
            <span className="text-sm font-medium text-danger">638 Incidents | 781 Lives Lost (2014-2023)</span>
          </motion.div>

          {/* AI Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full glass-card border-primary/30 ml-2"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-sm font-medium text-primary">AI-Powered Safety System</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="text-foreground">Every Crack Ignored is a </span>
            <br />
            <span className="text-danger glow-text-danger">Life at Risk</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-6 max-w-3xl mx-auto"
          >
            <span className="text-primary font-semibold">Samptak</span> identifies abnormalities in railway tracks using 
            <span className="text-primary"> InceptionResNetV2</span> deep learning—detecting cracks before they become disasters.
          </motion.p>

          {/* Tech Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-wrap gap-3 justify-center mb-10"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/50 border border-border/50 text-xs">
              <Brain className="w-3 h-3 text-primary" />
              <span className="text-muted-foreground">InceptionResNetV2</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/50 border border-border/50 text-xs">
              <Zap className="w-3 h-3 text-safe" />
              <span className="text-muted-foreground">ArduCam OV9281 • 120 FPS</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/50 border border-border/50 text-xs">
              <Shield className="w-3 h-3 text-primary" />
              <span className="text-muted-foreground">Real-time Geo-tagging</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={scrollToDemo}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-primary transition-all duration-300 text-lg px-8 py-6 font-semibold"
            >
              <Eye className="w-5 h-5 mr-2" />
              Analyze Track Now
            </Button>
            <Button
              onClick={scrollToUrgency}
              variant="outline"
              size="lg"
              className="border-danger/50 bg-danger/10 hover:bg-danger/20 hover:border-danger text-danger transition-all duration-300 text-lg px-8 py-6"
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              Why This Matters
            </Button>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-4 justify-center mt-16"
          >
            {[
              { icon: Shield, text: "~75% Model Accuracy", color: "text-safe" },
              { icon: Zap, text: "Real-time Analysis", color: "text-primary" },
              { icon: Eye, text: "Deep Learning CNN", color: "text-primary" },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-full glass-card"
              >
                <feature.icon className={`w-4 h-4 ${feature.color}`} />
                <span className="text-sm text-muted-foreground">{feature.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
