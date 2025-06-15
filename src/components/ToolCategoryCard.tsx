
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface ToolCategoryCardProps {
  title: string;
  description: string;
  toolCount: number;
  totalTools: number;
  icon: React.ReactNode;
  gradient: string;
  path: string;
  available: boolean;
}

export default function ToolCategoryCard({
  title,
  description,
  toolCount,
  totalTools,
  icon,
  gradient,
  path,
  available
}: ToolCategoryCardProps) {
  return (
    <Link to={path} className="block">
      <Card className={`tool-card shadow-lg rounded-2xl p-8 text-white ${gradient} relative overflow-hidden group min-h-[220px]`}>
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <div className="text-4xl">{icon}</div>
            <Badge variant={available ? "default" : "destructive"}
              className={available
                ? "bg-green-500/90 text-white shadow"
                : "bg-destructive text-white"}>
              {available ? "Disponible" : "Bientôt"}
            </Badge>
          </div>
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-white/90 mb-4 leading-relaxed flex-1">{description}</p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              {toolCount} / {totalTools} outils
            </span>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              →
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
