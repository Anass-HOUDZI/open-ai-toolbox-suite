
import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MediaTools = () => {
  const tools = [
    {
      name: "Image Compressor",
      description: "Compression intelligente d'images avec préservation qualité",
      path: "/tools/image-compressor",
      status: "available"
    },
    {
      name: "Image Format Converter",
      description: "Conversion entre formats JPEG, PNG, WebP, AVIF",
      path: "/tools/image-converter",
      status: "coming-soon"
    },
    {
      name: "Audio Visualizer",
      description: "Visualisation spectrale audio temps réel",
      path: "/tools/audio-visualizer",
      status: "coming-soon"
    },
    {
      name: "Background Remover",
      description: "Suppression arrière-plan IA avec Remove.bg",
      path: "/tools/background-remover",
      status: "coming-soon"
    },
    {
      name: "Barcode Generator",
      description: "Génération codes-barres multiples formats",
      path: "/tools/barcode-generator",
      status: "coming-soon"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white py-16">
        <div className="container">
          <div className="flex items-center mb-4">
            <Link to="/" className="text-white/70 hover:text-white mr-2">Accueil</Link>
            <span className="text-white/50">/</span>
            <span className="ml-2">Audio & Image</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">🎵 Audio & Image</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Traitement et optimisation de médias : compression, conversion et analyse.
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
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90">
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

export default MediaTools;
