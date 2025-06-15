
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-visual rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">OT</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            OpenToolsAI
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/visual" className="text-sm font-medium hover:text-purple-600 transition-colors">
            Création Visuelle
          </Link>
          <Link to="/text" className="text-sm font-medium hover:text-green-600 transition-colors">
            Traitement Texte
          </Link>
          <Link to="/dev" className="text-sm font-medium hover:text-orange-600 transition-colors">
            Développement
          </Link>
          <Link to="/media" className="text-sm font-medium hover:text-pink-600 transition-colors">
            Audio & Image
          </Link>
        </nav>

        <Button variant="outline" size="sm">
          GitHub
        </Button>
      </div>
    </header>
  );
};

export default Header;
