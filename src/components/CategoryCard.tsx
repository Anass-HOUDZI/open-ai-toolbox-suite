
import { Link } from "react-router-dom";

interface CategoryCardProps {
  title: string;
  description: string;
  toolCount: number;
  icon: string;
  gradient: string;
  path: string;
}

const CategoryCard = ({ title, description, toolCount, icon, gradient, path }: CategoryCardProps) => {
  return (
    <Link to={path} className="block">
      <div className={`tool-card rounded-2xl p-8 text-white ${gradient} relative overflow-hidden group`}>
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10">
          <div className="text-4xl mb-4">{icon}</div>
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-white/90 mb-4 leading-relaxed">{description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              {toolCount} outils
            </span>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
