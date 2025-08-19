import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";

const VisualTools = () => {
  const tools = [
    {
      name: "AI Avatar Generator",
      description: "Créez des avatars personnalisés avec l'API DiceBear",
      path: "/tools/avatar-generator",
      status: "available"
    },
    {
      name: "QR Code Art Generator",
      description: "Génération de QR codes artistiques et personnalisables",
      path: "/tools/qr-generator",
      status: "available"
    },
    {
      name: "Color Palette Extractor",
      description: "Extraction de palettes depuis vos images",
      path: "/tools/color-palette-extractor",
      status: "available"
    },
    {
      name: "Icon Generator",
      description: "Accès à plus de 1,000 icônes Lucide React",
      path: "/tools/icon-generator",
      status: "available"
    },
    {
      name: "Pattern Generator",
      description: "Création de motifs géométriques algorithmiques",
      path: "/tools/pattern-generator",
      status: "available"
    },
    {
      name: "Gradient Creator",
      description: "Générateur de dégradés CSS avancé",
      path: "/tools/gradient-creator",
      status: "available"
    },
    {
      name: "Favicon Maker",
      description: "Création de favicons multi-formats",
      path: "/tools/favicon-maker",
      status: "available"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Header - Mobile First */}
      <div className="bg-gradient-visual text-white py-8 sm:py-12 md:py-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center mb-3 sm:mb-4 text-sm">
            <Link to="/" className="text-white/70 hover:text-white touch-target">Accueil</Link>
            <span className="text-white/50 mx-2">/</span>
            <span className="text-white">Création Visuelle</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">🎨 Création Visuelle</h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-xl md:max-w-2xl">
            Libérez votre créativité avec nos outils de création visuelle. Avatars, QR codes, palettes de couleurs et bien plus.
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
                    <Button className="w-full bg-gradient-visual hover:opacity-90 h-11 touch-target">
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

export default VisualTools;
