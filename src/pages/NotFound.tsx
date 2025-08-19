import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center max-w-md w-full">
        <h1 className="text-6xl sm:text-8xl font-bold mb-4 text-gray-800">404</h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-6">Oops! Page introuvable</p>
        <a href="/" className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors touch-target">
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
};

export default NotFound;
