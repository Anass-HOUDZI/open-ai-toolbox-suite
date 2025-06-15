
import Header from "@/components/layout/Header";
import CategoryCard from "@/components/CategoryCard";

const Index = () => {
  const categories = [
    {
      title: "Création Visuelle",
      description: "Avatars, QR codes artistiques, palettes de couleurs, icônes et bien plus pour vos créations visuelles.",
      toolCount: 7,
      icon: "🎨",
      gradient: "bg-gradient-visual",
      path: "/visual"
    },
    {
      title: "Traitement de Texte",
      description: "Analyse, résumé, détection de langue et outils avancés pour optimiser vos contenus textuels.",
      toolCount: 8,
      icon: "📝",
      gradient: "bg-gradient-text",
      path: "/text"
    },
    {
      title: "Outils Développement",
      description: "JSON, Base64, Hash, Regex et tous les utilitaires essentiels pour les développeurs.",
      toolCount: 10,
      icon: "🔧",
      gradient: "bg-gradient-dev",
      path: "/dev"
    },
    {
      title: "Audio & Image",
      description: "Compression, conversion, visualisation audio et manipulation d'images en temps réel.",
      toolCount: 5,
      icon: "🎵",
      gradient: "bg-gradient-media",
      path: "/media"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container text-center animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            OpenToolsAI Suite
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            30 outils d'intelligence artificielle révolutionnaires, 100% gratuits et open source. 
            Aucune authentification, aucune base de données, aucune limite.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-lg">
            <div className="bg-white/20 px-6 py-3 rounded-full">✨ 100% Côté Client</div>
            <div className="bg-white/20 px-6 py-3 rounded-full">🚀 Zero Configuration</div>
            <div className="bg-white/20 px-6 py-3 rounded-full">🔓 Open Source</div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Découvrez nos catégories</h2>
            <p className="text-xl text-muted-foreground">
              Chaque catégorie regroupe des outils spécialisés pour répondre à vos besoins spécifiques
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 animate-scale-in">
            {categories.map((category, index) => (
              <div key={category.title} style={{ animationDelay: `${index * 0.1}s` }}>
                <CategoryCard {...category} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Pourquoi OpenToolsAI ?</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl glass-effect">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Ultra Rapide</h3>
              <p className="text-muted-foreground">Traitement instantané côté client, pas d'attente serveur</p>
            </div>
            
            <div className="text-center p-8 rounded-2xl glass-effect">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">100% Privé</h3>
              <p className="text-muted-foreground">Vos données ne quittent jamais votre navigateur</p>
            </div>
            
            <div className="text-center p-8 rounded-2xl glass-effect">
              <div className="text-4xl mb-4">🆓</div>
              <h3 className="text-xl font-bold mb-2">Totalement Gratuit</h3>
              <p className="text-muted-foreground">Aucun coût caché, aucune limite d'utilisation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container text-center">
          <div className="mb-6">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              OpenToolsAI Suite
            </span>
          </div>
          <p className="text-gray-400 mb-4">
            Démocratiser l'accès aux outils d'intelligence artificielle
          </p>
          <p className="text-sm text-gray-500">
            Made with ❤️ by the OpenToolsAI community
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
