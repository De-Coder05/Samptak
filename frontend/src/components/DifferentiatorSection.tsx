import { motion } from "framer-motion";
import { Search, Cpu, Zap, Settings, MapPin, Brain } from "lucide-react";

const differentiators = [
  {
    number: "01",
    icon: <Search className="w-6 h-6" />,
    title: "Backed by Research",
    description: "Well-researched using several academic papers on similar computer vision problems.",
    color: "primary"
  },
  {
    number: "02",
    icon: <Cpu className="w-6 h-6" />,
    title: "IoT + ML Integration",
    description: "Arduino integrating cameras with AI for precise geo-mapping of cracks using ArduCam OV9281.",
    color: "primary"
  },
  {
    number: "03",
    icon: <Zap className="w-6 h-6" />,
    title: "Real-Time Response",
    description: "Instantly analyzes data to address critical track health and alert authorities immediately.",
    color: "primary"
  },
  {
    number: "04",
    icon: <Settings className="w-6 h-6" />,
    title: "Adaptable & Reliable",
    description: "Adjusts to various train conditions while maintaining top performance across environments.",
    color: "primary"
  }
];

const DifferentiatorSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background pointer-events-none" />
      
      <div className="container px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-4">
            <span className="text-foreground">What Makes Us </span>
            <span className="text-primary glow-text-primary">Different?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            One of a kind solution combining cutting-edge technology with practical implementation
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {differentiators.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="glass-card-hover p-8 flex gap-6 group"
            >
              <div className="flex-shrink-0">
                <span className="font-display text-6xl font-bold text-primary/20 group-hover:text-primary/40 transition-colors">
                  {item.number}
                </span>
              </div>
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:bg-primary/20 transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* How It Works Mini Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <h3 className="font-display text-2xl font-bold text-center mb-10">
            <span className="text-foreground">How </span>
            <span className="text-primary">Samptak</span>
            <span className="text-foreground"> Works</span>
          </h3>
          
          <div className="grid grid-cols-3 gap-4 relative">
            {/* Connection line */}
            <div className="absolute top-1/2 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent -translate-y-1/2 hidden md:block" />
            
            {[
              { icon: <MapPin className="w-6 h-6" />, label: "Data Collection", sublabel: "ArduCam OV9281" },
              { icon: <Brain className="w-6 h-6" />, label: "AI Analysis", sublabel: "InceptionResNetV2" },
              { icon: <Zap className="w-6 h-6" />, label: "Instant Alert", sublabel: "Real-time Response" }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.15 }}
                viewport={{ once: true }}
                className="text-center relative z-10"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 border-2 border-primary/50 flex items-center justify-center text-primary">
                  {step.icon}
                </div>
                <h4 className="font-semibold text-foreground">{step.label}</h4>
                <p className="text-xs text-muted-foreground">{step.sublabel}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DifferentiatorSection;
