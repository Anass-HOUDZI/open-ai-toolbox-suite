
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/d8d14116-0a84-4210-bf1f-29986e228162.png" 
            alt="Toolbox Logo"
            className="h-8 object-contain"
          />
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/visual" className="text-sm font-medium hover:text-purple-600 transition-colors flex items-center space-x-1">
            <span>🎨</span>
            <span>Création Visuelle</span>
          </Link>
          <Link to="/text" className="text-sm font-medium hover:text-green-600 transition-colors flex items-center space-x-1">
            <span>📝</span>
            <span>Traitement Texte</span>
          </Link>
          <Link to="/dev" className="text-sm font-medium hover:text-orange-600 transition-colors flex items-center space-x-1">
            <span>🔧</span>
            <span>Développement</span>
          </Link>
          <Link to="/security" className="text-sm font-medium hover:text-red-600 transition-colors flex items-center space-x-1">
            <span>🔒</span>
            <span>Sécurité</span>
          </Link>
        </nav>

        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-lg md:hidden">
            <nav className="flex flex-col p-4 space-y-4">
              <Link to="/visual" className="text-sm font-medium hover:text-purple-600 transition-colors flex items-center space-x-2">
                <span>🎨</span>
                <span>Création Visuelle</span>
              </Link>
              <Link to="/text" className="text-sm font-medium hover:text-green-600 transition-colors flex items-center space-x-2">
                <span>📝</span>
                <span>Traitement Texte</span>
              </Link>
              <Link to="/dev" className="text-sm font-medium hover:text-orange-600 transition-colors flex items-center space-x-2">
                <span>🔧</span>
                <span>Développement</span>
              </Link>
              <Link to="/security" className="text-sm font-medium hover:text-red-600 transition-colors flex items-center space-x-2">
                <span>🔒</span>
                <span>Sécurité</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
