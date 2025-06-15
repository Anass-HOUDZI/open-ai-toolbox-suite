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
      
      <div className="bg-gradient-to-br from-red-500 to-orange-600 text-white py-16">
        <div className="container">
          <div className="flex items-center mb-4">
            <Link to="/" className="text-white/70 hover:text-white mr-2">Accueil</Link>
            <span className="text-white/50">/</span>
            <span className="ml-2">Sécurité & Analyse</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">🔒 Sécurité & Analyse</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Outils de sécurité, génération de mots de passe et analyse cryptographique.
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
                    <Button className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:opacity-90">
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
      <Footer />
    </div>
  );
};

export default SecurityTools;
