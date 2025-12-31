import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Train, AlertCircle, Shield, Clock, Activity } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  delay: number;
}

const StatCard = ({ icon, value, suffix, label, delay }: StatCardProps) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const start = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - start) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(value * easeOut));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    const timeout = setTimeout(animate, delay);
    return () => clearTimeout(timeout);
  }, [isVisible, value, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay / 1000 }}
      viewport={{ once: true }}
      className="glass-card-hover p-6 text-center"
    >
      <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
        {icon}
      </div>
      <div className="text-4xl font-display font-bold text-foreground mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <p className="text-muted-foreground">{label}</p>
    </motion.div>
  );
};

const StatsSection = () => {
  const stats = [
    {
      icon: <Train className="w-7 h-7 text-primary" />,
      value: 10000,
      suffix: "+",
      label: "Tracks Analyzed",
      delay: 0,
    },
    {
      icon: <Activity className="w-7 h-7 text-primary" />,
      value: 98,
      suffix: ".8%",
      label: "Training Accuracy",
      delay: 200,
    },
    {
      icon: <Shield className="w-7 h-7 text-safe" />,
      value: 94,
      suffix: ".4%",
      label: "Test Accuracy",
      delay: 400,
    },
    {
      icon: <AlertCircle className="w-7 h-7 text-danger" />,
      value: 847,
      suffix: "",
      label: "Faults Detected",
      delay: 600,
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background pointer-events-none" />

      <div className="container px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Real </span>
            <span className="text-primary">Impact</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our AI-powered system is making railways safer every day
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
