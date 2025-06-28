
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
  description?: string;
}

export const StatsCard = ({ title, value, icon, color = "blue", description }: StatsCardProps) => {
  return (
    <div className={`text-center p-4 bg-${color}-50 rounded-lg`}>
      {icon && <div className="mb-2">{icon}</div>}
      <div className={`text-2xl font-bold text-${color}-600`}>
        {value}
      </div>
      <div className="text-sm text-gray-600">{title}</div>
      {description && <div className="text-xs text-gray-500 mt-1">{description}</div>}
    </div>
  );
};
