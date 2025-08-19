import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";

const SecurityTools = () => {
  const tools = [
    {
      name: "Password Generator",
      description: "Génération de mots de passe sécurisés avec analyse de force",
      path: "/tools/password-generator",
      status: "available"
    },
    {
      name: "Password Strength Checker",
      description: "Analyseur de force avec recommandations sécurité",
      path: "/tools/password-strength",
      status: "available"
    },
    {
      name: "Hash Generator",
      description: "Génération MD5, SHA1, SHA256 sécurisée",
      path: "/tools/hash-generator",
      status: "available"
    },
    {
      name: "Text Encryption",
      description: "Chiffrement/déchiffrement AES sécurisé",
      path: "/tools/text-encryption",
      status: "coming-soon"
    },
    {
      name: "File Hash Checker",
      description: "Vérification intégrité fichiers",
      path: "/tools/file-hash",
      status: "coming-soon"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Header - Mobile First */}
      <div className="bg-gradient-to-br from-red-500 to-orange-600 text-white py-8 sm:py-12 md:py-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center mb-3 sm:mb-4 text-sm">
            <Link to="/" className="text-white/70 hover:text-white touch-target">Accueil</Link>
            <span className="text-white/50 mx-2">/</span>
            <span className="text-white">Sécurité & Analyse</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">🔒 Sécurité & Analyse</h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-xl md:max-w-2xl">
            Outils de sécurité, génération de mots de passe et analyse cryptographique.
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
                    <Button className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:opacity-90 h-11 touch-target">
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

export default SecurityTools;
