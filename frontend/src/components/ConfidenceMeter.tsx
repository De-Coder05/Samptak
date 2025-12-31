import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ConfidenceMeterProps {
  confidence: number;
  level: string;
  hasCrack: boolean;
}

const ConfidenceMeter = ({ confidence, level, hasCrack }: ConfidenceMeterProps) => {
  const [animatedConfidence, setAnimatedConfidence] = useState(0);

  useEffect(() => {
    // Animate the number counting up
    const duration = 1500;
    const start = Date.now();
    const end = confidence;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - start) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedConfidence(end * easeOut);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [confidence]);

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (animatedConfidence / 100) * circumference;
  const color = hasCrack ? "hsl(var(--danger))" : "hsl(var(--safe))";

  return (
    <div className="flex items-center gap-6">
      {/* Circular Progress */}
      <div className="relative w-28 h-28">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              filter: `drop-shadow(0 0 10px ${color})`,
            }}
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`text-2xl font-bold ${
              hasCrack ? "text-danger" : "text-safe"
            }`}
          >
            {animatedConfidence.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Info */}
      <div>
        <p className="text-sm text-muted-foreground mb-1">Confidence Level</p>
        <p
          className={`text-xl font-semibold ${
            hasCrack ? "text-danger" : "text-safe"
          }`}
        >
          {level}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          AI certainty in the detection result
        </p>
      </div>
    </div>
  );
};

export default ConfidenceMeter;
