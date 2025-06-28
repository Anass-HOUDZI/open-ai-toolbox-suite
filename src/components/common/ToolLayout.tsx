
import { ReactNode } from "react";
import Header from "@/components/layout/Header";
import { ToolHeader } from "./ToolHeader";

interface ToolLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  icon: ReactNode;
  category: string;
  categoryPath: string;
  gradientClass: string;
}

export const ToolLayout = ({ 
  children, 
  title, 
  description, 
  icon, 
  category, 
  categoryPath, 
  gradientClass 
}: ToolLayoutProps) => {
  return (
    <div className="min-h-screen">
      <Header />
      <ToolHeader
        title={title}
        description={description}
        icon={icon}
        category={category}
        categoryPath={categoryPath}
        gradientClass={gradientClass}
      />
      <section className="py-12">
        <div className="container">
          {children}
        </div>
      </section>
    </div>
  );
};
