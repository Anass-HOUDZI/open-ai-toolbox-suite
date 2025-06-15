
import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
      status: "coming-soon"
    },
    {
      name: "Favicon Maker",
      description: "Création de favicons multi-formats",
      path: "/tools/favicon-maker",
      status: "coming-soon"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gradient-visual text-white py-16">
        <div className="container">
          <div className="flex items-center mb-4">
            <Link to="/" className="text-white/70 hover:text-white mr-2">Accueil</Link>
            <span className="text-white/50">/</span>
            <span className="ml-2">Création Visuelle</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">🎨 Création Visuelle</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Libérez votre créativité avec nos outils de création visuelle. Avatars, QR codes, palettes de couleurs et bien plus.
          </p>
        </div>
      </div>

      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <div key={tool.name} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border">
                <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
                <p className="text-muted-foreground mb-4">{tool.description}</p>
                
                {tool.status === "available" ? (
                  <Link to={tool.path}>
                    <Button className="w-full bg-gradient-visual hover:opacity-90">
                      Utiliser l'outil
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    Bientôt disponible
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisualTools;
