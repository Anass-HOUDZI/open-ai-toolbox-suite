import Header from "@/components/layout/Header";
import CategoryCard from "@/components/CategoryCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Heart, Star, Users, Sparkles } from "lucide-react";
import Footer from "@/components/layout/Footer";
import SidebarNavigation from "@/components/SidebarNavigation";
import ToolCategoryCard from "@/components/ToolCategoryCard";
import CategoryProgressBar from "@/components/CategoryProgressBar";
import UserMenuDropdown from "@/components/UserMenuDropdown";

const availableByCategory = {
  Création: 5,
  Texte: 6,
  Dev: 8,
  Media: 4,
  Securite: 3,
}
const totalByCategory = {
  Création: 7,
  Texte: 8,
  Dev: 10,
  Media: 5,
  Securite: 5,
}

const Index = () => {
  const categories = [{
    title: "Création Visuelle",
    description: "Avatars, QR codes artistiques, palettes de couleurs, icônes et bien plus pour vos créations visuelles.",
    toolCount: 7,
    icon: "🎨",
    gradient: "bg-gradient-visual",
    path: "/visual"
  }, {
    title: "Traitement de Texte",
    description: "Analyse, résumé, détection de langue et outils avancés pour optimiser vos contenus textuels.",
    toolCount: 8,
    icon: "📝",
    gradient: "bg-gradient-text",
    path: "/text"
  }, {
    title: "Outils Développement",
    description: "JSON, Base64, Hash, Regex et tous les utilitaires essentiels pour les développeurs.",
    toolCount: 10,
    icon: "🔧",
    gradient: "bg-gradient-dev",
    path: "/dev"
  }, {
    title: "Audio & Image",
    description: "Compression, conversion, visualisation audio et manipulation d'images en temps réel.",
    toolCount: 5,
    icon: "🎵",
    gradient: "bg-gradient-media",
    path: "/media"
  }];
  const features = [{
    icon: <Zap className="w-8 h-8" />,
    title: "Ultra Rapide",
    description: "Traitement instantané côté client, pas d'attente serveur",
    gradient: "from-yellow-400 to-orange-500"
  }, {
    icon: <Shield className="w-8 h-8" />,
    title: "100% Privé",
    description: "Vos données ne quittent jamais votre navigateur",
    gradient: "from-blue-400 to-purple-500"
  }, {
    icon: <Heart className="w-8 h-8" />,
    title: "Totalement Gratuit",
    description: "Aucun coût caché, aucune limite d'utilisation",
    gradient: "from-pink-400 to-red-500"
  }];
  const stats = [{
    number: "30+",
    label: "Outils Disponibles"
  }, {
    number: "100%",
    label: "Côté Client"
  }, {
    number: "0€",
    label: "Coût Total"
  }, {
    number: "∞",
    label: "Utilisation Illimitée"
  }];
  const scrollToTools = () => {
    const toolsSection = document.getElementById('tools-section');
    if (toolsSection) {
      toolsSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  // Nouvelle icônographie plus colorée pour chaque catégorie
  const catIcons = [
    <span className="inline-block"><svg width="40" height="40" viewBox="0 0 40 40"><ellipse cx="20" cy="20" rx="17" ry="17" fill="#F093FB"/><ellipse cx="13" cy="24" rx="7" ry="7" fill="#71E1F8"/><ellipse cx="28" cy="14" rx="5" ry="5" fill="#5EE39B"/></svg></span>, // Création Visuelle
    <span className="inline-block"><svg width="40" height="40" viewBox="0 0 40 40"><rect x="6" y="10" width="28" height="20" rx="6" fill="#4FACFE"/><rect x="10" y="14" width="20" height="12" rx="3" fill="#00F2FE" fillOpacity=".6"/></svg></span>, // Texte
    <span className="inline-block"><svg width="40" height="40" viewBox="0 0 40 40"><rect x="6" y="6" width="28" height="28" rx="8" fill="#43E97B"/><circle cx="20" cy="20" r="10" fill="#38F9D7"/></svg></span>, // Dev
    <span className="inline-block"><svg width="40" height="40" viewBox="0 0 40 40"><ellipse cx="20" cy="20" rx="17" ry="15" fill="#FA709A"/><ellipse cx="20" cy="20" rx="14" ry="11" fill="#FEE140" fillOpacity=".7"/></svg></span>, // Media
  ];

  const mappedCategories = categories.map((cat, idx) => ({
    ...cat,
    icon: catIcons[idx],
    toolCount: 
      idx === 0 ? availableByCategory.Création 
      : idx === 1 ? availableByCategory.Texte 
      : idx === 2 ? availableByCategory.Dev
      : availableByCategory.Media,
    totalTools: 
      idx === 0 ? totalByCategory.Création 
      : idx === 1 ? totalByCategory.Texte 
      : idx === 2 ? totalByCategory.Dev
      : totalByCategory.Media,
    available: true
  }));

  // Responsive sidebar + barre du menu utilisateur en haut
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col md:flex-row">
      {/* Sidebar latérale */}
      <div className="hidden md:block w-60 bg-white shadow-lg z-30">
        <SidebarNavigation />
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Menu utilisateur (en haut à droite) */}
        <div className="flex justify-end px-4 py-4">
          <UserMenuDropdown />
        </div>
        {/* Hero Section Enhanced */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500" />
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{
            animationDelay: '1s'
          }} />
          </div>
          
          <div className="container relative z-10 text-center text-white">
            <div className="animate-fade-in">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-medium">Suite d'outils IA révolutionnaire</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="block">OpenToolsAI</span>
                <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                  Suite
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
                30 outils d'intelligence artificielle révolutionnaires, 100% gratuits et open source. 
                Aucune authentification, aucune base de données, aucune limite.
              </p>
              
              <div className="flex justify-center mb-12">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90 font-semibold px-8 py-4 rounded-full" onClick={scrollToTools}>
                  Découvrir les outils
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                {stats.map((stat, index) => <div key={index} className="text-center animate-scale-in" style={{
                animationDelay: `${index * 0.2}s`
              }}>
                    <div className="text-3xl font-bold mb-1">{stat.number}</div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                  </div>)}
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section with progress bar */}
        <section id="tools-section" className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container">
            <CategoryProgressBar 
              available={availableByCategory.Création + availableByCategory.Texte + availableByCategory.Dev + availableByCategory.Media}
              total={totalByCategory.Création + totalByCategory.Texte + totalByCategory.Dev + totalByCategory.Media}
            />
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-600 rounded-full px-6 py-2 mb-4">
                <Star className="w-4 h-4" />
                <span className="text-sm font-medium">Nos Catégories</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Découvrez nos outils
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Chaque catégorie regroupe des outils spécialisés pour répondre à vos besoins spécifiques
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {mappedCategories.map((category, index) => (
                <ToolCategoryCard key={category.title} {...category} />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section Enhanced */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Pourquoi nous choisir ?</h2>
              <p className="text-xl text-gray-600">Une expérience utilisateur sans compromis</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  <div className="relative text-center p-8 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-xl">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} text-white mb-6`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>)}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        

        {/* Footer Enhanced */}
        <Footer />
      </div>
    </div>
  );
};

export default Index;
