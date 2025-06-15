
import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
      
      <div className="bg-gradient-text text-white py-16">
        <div className="container">
          <div className="flex items-center mb-4">
            <Link to="/" className="text-white/70 hover:text-white mr-2">Accueil</Link>
            <span className="text-white/50">/</span>
            <span className="ml-2">Traitement Texte</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">📝 Traitement de Texte</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Analysez, transformez et optimisez vos contenus textuels avec nos outils d'intelligence artificielle.
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
                    <Button className="w-full bg-gradient-text hover:opacity-90">
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

export default TextTools;
