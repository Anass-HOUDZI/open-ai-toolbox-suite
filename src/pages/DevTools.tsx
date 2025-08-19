import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";

const DevTools = () => {
  const tools = [
    {
      name: "JSON Formatter/Validator",
      description: "Formatage, validation et minification JSON",
      path: "/tools/json-formatter",
      status: "available"
    },
    {
      name: "Base64 Encoder/Decoder",
      description: "Encodage/décodage Base64 texte et fichiers",
      path: "/tools/base64-tool",
      status: "available"
    },
    {
      name: "Regex Tester",
      description: "Test et debug d'expressions régulières",
      path: "/tools/regex-tester",
      status: "available"
    },
    {
      name: "Hash Generator",
      description: "Génération MD5, SHA1, SHA256 sécurisée",
      path: "/tools/hash-generator",
      status: "available"
    },
    {
      name: "URL Shortener",
      description: "Raccourcissement d'URLs avec analytics",
      path: "/tools/url-shortener",
      status: "available"
    },
    {
      name: "API Tester",
      description: "Test d'APIs REST avec gestion headers",
      path: "/tools/api-tester",
      status: "available"
    },
    {
      name: "Code Formatter",
      description: "Formatage code multi-langages avec Prettier",
      path: "/tools/code-formatter",
      status: "available"
    },
    {
      name: "SQL Formatter",
      description: "Formatage et optimisation requêtes SQL",
      path: "/tools/sql-formatter",
      status: "available"
    },
    {
      name: "CSS Minifier",
      description: "Minification et optimisation CSS avancée",
      path: "/tools/css-minifier",
      status: "available"
    },
    {
      name: "HTML Validator",
      description: "Validation HTML et détection d'erreurs",
      path: "/tools/html-validator",
      status: "available"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Header - Mobile First */}
      <div className="bg-gradient-dev text-white py-8 sm:py-12 md:py-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center mb-3 sm:mb-4 text-sm">
            <Link to="/" className="text-white/70 hover:text-white touch-target">Accueil</Link>
            <span className="text-white/50 mx-2">/</span>
            <span className="text-white">Développement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">🔧 Outils de Développement</h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-xl md:max-w-2xl">
            Outils essentiels pour développeurs : formatage, validation, testing et debugging.
          </p>
        </div>
      </div>

      {/* Tools Grid - Mobile First */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {tools.map((tool) => (
              <div key={tool.name} className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border touch-target">
                <h3 className="text-lg sm:text-xl font-bold mb-2">{tool.name}</h3>
                <p className="text-muted-foreground mb-4 text-sm sm:text-base">{tool.description}</p>
                
                {tool.status === "available" ? (
                  <Link to={tool.path}>
                    <Button className="w-full bg-gradient-dev hover:opacity-90 h-11 touch-target">
                      Utiliser l'outil
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" className="w-full h-11 touch-target" disabled>
                    Bientôt disponible
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default DevTools;
