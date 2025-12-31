import { motion } from "framer-motion";
import { AlertTriangle, Users, Clock, Skull } from "lucide-react";

const UrgencySection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Danger gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-danger/5 to-background pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-danger/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-danger/10 border border-danger/30">
            <AlertTriangle className="w-4 h-4 text-danger animate-pulse" />
            <span className="text-sm font-medium text-danger">Critical Safety Issue</span>
          </div>
          
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-4">
            <span className="text-foreground">The </span>
            <span className="text-danger glow-text-danger">Tragedy</span>
            <span className="text-foreground"> on Tracks</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Train accidents in India remain a serious threat. Minor defects leading to major disasters—
            <span className="text-danger font-semibold"> no amount of payout can bring back lives.</span>
          </p>
        </motion.div>

        {/* Critical Statistics */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="glass-card p-8 text-center border-danger/30 hover:border-danger/50 transition-all"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-danger/20 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-danger" />
            </div>
            <div className="text-5xl font-display font-bold text-danger mb-2">638</div>
            <p className="text-muted-foreground">Train Incidents</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Between 2014-2023</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="glass-card p-8 text-center border-danger/30 hover:border-danger/50 transition-all"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-danger/20 flex items-center justify-center">
              <Skull className="w-8 h-8 text-danger" />
            </div>
            <div className="text-5xl font-display font-bold text-danger mb-2">781</div>
            <p className="text-muted-foreground">Lives Lost</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Preventable Deaths</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="glass-card p-8 text-center border-danger/30 hover:border-danger/50 transition-all"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-danger/20 flex items-center justify-center">
              <Users className="w-8 h-8 text-danger" />
            </div>
            <div className="text-5xl font-display font-bold text-danger mb-2">1,543</div>
            <p className="text-muted-foreground">People Injured</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Families Affected</p>
          </motion.div>
        </div>

        {/* Problem Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: <Clock className="w-6 h-6 text-warning" />,
              title: "Need for Early Detection",
              description: "Minor defects lead to major disasters. Timely reporting can prevent accidents."
            },
            {
              icon: <Users className="w-6 h-6 text-warning" />,
              title: "Inspection Challenges",
              description: "Infrequent checks, human error, and delayed detection compromise safety."
            },
            {
              icon: <AlertTriangle className="w-6 h-6 text-warning" />,
              title: "Undetected Defects",
              description: "Cracks, fissures, and fractures—all posing grave danger to trains and passengers."
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 border-warning/20"
            >
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UrgencySection;
