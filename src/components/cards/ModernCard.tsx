
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface ModernCardProps {
  title: string;
  description: string;
  toolCount: number;
  icon: string;
  gradient: string;
  path: string;
  imageUrl?: string;
  status?: "active" | "beta" | "coming-soon";
  delay?: number;
}

const ModernCard = ({ 
  title, 
  description, 
  toolCount, 
  icon, 
  gradient, 
  path, 
  imageUrl,
  status = "active",
  delay = 0
}: ModernCardProps) => {
  const statusConfig = {
    active: { label: "Disponible", color: "bg-green-500" },
    beta: { label: "Beta", color: "bg-yellow-500" },
    "coming-soon": { label: "Bientôt", color: "bg-blue-500" }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -12,
        transition: { type: "spring", stiffness: 300 }
      }}
    >
      <Link to={path} className="block h-full">
        <motion.div 
          className={`glass-premium rounded-3xl p-8 h-full relative overflow-hidden group ${gradient} shine-effect`}
          whileHover={{
            scale: 1.02,
            rotateY: 5,
            transition: { type: "spring", stiffness: 300 }
          }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Background Image */}
          {imageUrl && (
            <div 
              className="absolute inset-0 opacity-20 bg-cover bg-center"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
          )}
          
          {/* Status Badge */}
          <div className="absolute top-4 right-4 z-10">
            <Badge className={`${statusConfig[status].color} text-white border-none`}>
              {statusConfig[status].label}
            </Badge>
          </div>
          
          {/* Shine Effect Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          
          <div className="relative z-10 text-white h-full flex flex-col">
            {/* Icon */}
            <motion.div 
              className="text-5xl mb-6"
              whileHover={{ 
                scale: 1.2, 
                rotate: 10,
                transition: { type: "spring", stiffness: 300 }
              }}
            >
              {icon}
            </motion.div>
            
            {/* Content */}
            <div className="flex-1">
              <motion.h3 
                className="text-2xl font-bold mb-4 font-space-grotesk"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {title}
              </motion.h3>
              <p className="text-white/90 mb-6 leading-relaxed line-clamp-3">
                {description}
              </p>
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-between">
              <motion.span 
                className="text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-medium"
                whileHover={{ scale: 1.05 }}
              >
                {toolCount} outils
              </motion.span>
              <motion.div 
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors"
                whileHover={{ 
                  scale: 1.1, 
                  rotate: 45,
                  transition: { type: "spring", stiffness: 300 }
                }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default ModernCard;
