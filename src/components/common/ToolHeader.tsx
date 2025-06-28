
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface ToolHeaderProps {
  title: string;
  description: string;
  icon: ReactNode;
  category: string;
  categoryPath: string;
  gradientClass: string;
}

export const ToolHeader = ({ 
  title, 
  description, 
  icon, 
  category, 
  categoryPath, 
  gradientClass 
}: ToolHeaderProps) => {
  return (
    <div className={`${gradientClass} text-white py-16`}>
      <div className="container">
        <div className="flex items-center mb-4">
          <Link to="/" className="text-white/70 hover:text-white mr-2">Accueil</Link>
          <span className="text-white/50">/</span>
          <Link to={categoryPath} className="text-white/70 hover:text-white mx-2">{category}</Link>
          <span className="text-white/50">/</span>
          <span className="ml-2">{title}</span>
        </div>
        <div className="flex items-center gap-3 mb-4">
          {icon}
          <h1 className="text-4xl font-bold">{title}</h1>
        </div>
        <p className="text-xl text-white/90">
          {description}
        </p>
      </div>
    </div>
  );
};
