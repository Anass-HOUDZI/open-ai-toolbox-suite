
import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

interface StatsCounterProps {
  number: number;
  suffix?: string;
  label: string;
  delay?: number;
  isVisible?: boolean;
}

const StatsCounter = ({ number, suffix = "", label, delay = 0, isVisible = false }: StatsCounterProps) => {
  const [count, setCount] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        // Animate the number counting up
        const duration = 2000; // 2 seconds
        const increment = number / (duration / 16); // 60fps
        let current = 0;
        
        const counter = setInterval(() => {
          current += increment;
          if (current >= number) {
            setCount(number);
            clearInterval(counter);
          } else {
            setCount(Math.floor(current));
          }
        }, 16);

        // Animate the container
        controls.start({
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.6,
            ease: "easeOut"
          }
        });

        return () => clearInterval(counter);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, number, delay, controls]);

  return (
    <motion.div
      className="text-center glass-premium p-4 md:p-6 rounded-2xl hover-3d"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={controls}
      whileHover={{ 
        scale: 1.05,
        transition: { type: "spring", stiffness: 300 }
      }}
    >
      <motion.div 
        className="text-3xl md:text-4xl font-bold mb-2 font-space-grotesk"
        animate={{
          color: ["#ffffff", "#fbbf24", "#ffffff"]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {count}{suffix}
      </motion.div>
      <div className="text-sm text-white/80 font-medium">{label}</div>
    </motion.div>
  );
};

export default StatsCounter;
