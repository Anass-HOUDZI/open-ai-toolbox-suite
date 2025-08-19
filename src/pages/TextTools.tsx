import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";

const TextTools = () => {
  const tools = [
    {
      name: "Text Summarizer",
      description: "Résumé automatique de texte avec contrôle de longueur",
      path: "/tools/text-summarizer",
      status: "available"
    },
    {
      name: "Language Detector",
      description: "Détection automatique de langue avec probabilités",
      path: "/tools/language-detector",
      status: "available"
    },
    {
      name: "Grammar Checker",
      description: "Correction grammaire et orthographe temps réel",
      path: "/tools/grammar-checker",
      status: "available"
    },
    {
      name: "Text to Speech",
      description: "Synthèse vocale multilingue avec contrôles",
      path: "/tools/text-to-speech",
      status: "available"
    },
    {
      name: "Word Frequency Analyzer",
      description: "Analyse fréquence mots avec visualisations",
      path: "/tools/word-frequency",
      status: "available"
    },
    {
      name: "Text Encryption",
      description: "Chiffrement/déchiffrement de texte sécurisé",
      path: "/tools/text-encryption",
      status: "available"
    },
    {
      name: "Markdown Editor",
      description: "Éditeur Markdown avec preview temps réel",
      path: "/tools/markdown-editor",
      status: "available"
    },
    {
      name: "Text Comparison",
      description: "Comparaison avancée de textes avec diff",
      path: "/tools/text-comparison",
      status: "available"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Header - Mobile First */}
      <div className="bg-gradient-text text-white py-8 sm:py-12 md:py-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center mb-3 sm:mb-4 text-sm">
            <Link to="/" className="text-white/70 hover:text-white touch-target">Accueil</Link>
            <span className="text-white/50 mx-2">/</span>
            <span className="text-white">Traitement Texte</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">📝 Traitement de Texte</h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-xl md:max-w-2xl">
            Analysez, transformez et optimisez vos contenus textuels avec nos outils d'intelligence artificielle.
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
                    <Button className="w-full bg-gradient-text hover:opacity-90 h-11 touch-target">
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

export default TextTools;
