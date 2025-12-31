import { motion } from "framer-motion";
import { TrendingUp, IndianRupee, Target, Users, Building2, GraduationCap, Cpu } from "lucide-react";

const MarketImpactSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-safe/5 to-background pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-safe/10 rounded-full blur-3xl pointer-events-none translate-x-1/2" />
      
      <div className="container px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Left Column - Room for Change */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-8">
              <span className="text-foreground">The Room for </span>
              <span className="text-safe glow-text-safe">Change</span>
            </h2>
            
            {/* 27% Stat */}
            <div className="glass-card p-8 mb-8 border-safe/30">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-4 bg-card rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "27%" }}
                    transition={{ duration: 1, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="h-full bg-gradient-to-r from-safe to-warning rounded-full"
                  />
                </div>
                <span className="font-display text-3xl font-bold text-safe">27%</span>
              </div>
              <p className="text-muted-foreground">
                Approx <span className="text-foreground font-semibold">27% of Indian Railways Expenditure</span> is on 
                <span className="text-warning"> Repairs and Maintenance</span> which can be significantly reduced using our solution
              </p>
            </div>

            {/* Key Partners */}
            <h3 className="font-display text-xl font-semibold mb-4 text-foreground">Key Partners</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { icon: <Building2 className="w-4 h-4" />, label: "Railway Operators" },
                { icon: <GraduationCap className="w-4 h-4" />, label: "Research Institutes" },
                { icon: <Cpu className="w-4 h-4" />, label: "AI Companies" }
              ].map((partner, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-primary"
                >
                  {partner.icon}
                  <span className="text-sm font-medium">{partner.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Market Analysis */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-8">
              <span className="text-foreground">Analysing </span>
              <span className="text-primary glow-text-primary">Market</span>
            </h2>

            {/* TAM Card */}
            <div className="glass-card p-8 mb-8 border-primary/30 text-center">
              <p className="text-muted-foreground text-sm mb-2">Total Addressable Market (TAM)</p>
              <div className="flex items-center justify-center gap-2">
                <IndianRupee className="w-8 h-8 text-primary" />
                <span className="font-display text-5xl font-bold text-primary">3,400</span>
                <span className="text-lg text-muted-foreground">crore</span>
              </div>
              <p className="text-muted-foreground text-sm mt-2">INR/year</p>
            </div>

            {/* Target Market */}
            <div className="glass-card p-6 mb-4 border-border/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground">Target Market</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 ml-13">
                <li>• National and regional railway operators</li>
                <li>• Governments and regulatory bodies focused on transportation safety</li>
              </ul>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                "Cost Reduction",
                "Minimized Downtime", 
                "Sustainable Maintenance",
                "Reduced Emissions"
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="px-3 py-2 rounded-lg bg-safe/10 border border-safe/30 text-center"
                >
                  <span className="text-sm text-safe font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MarketImpactSection;
