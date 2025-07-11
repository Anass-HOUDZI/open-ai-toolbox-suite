
import { motion } from "framer-motion";

interface BackgroundPatternProps {
  variant?: "dots" | "grid" | "waves";
  className?: string;
}

const BackgroundPattern = ({ variant = "dots", className = "" }: BackgroundPatternProps) => {
  const patterns = {
    dots: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
    grid: `
      linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
    `,
    waves: "repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 20px)"
  };

  const sizes = {
    dots: "20px 20px",
    grid: "30px 30px",
    waves: "40px 40px"
  };

  return (
    <motion.div
      className={`absolute inset-0 ${className}`}
      style={{
        backgroundImage: patterns[variant],
        backgroundSize: sizes[variant],
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  );
};

export default BackgroundPattern;
