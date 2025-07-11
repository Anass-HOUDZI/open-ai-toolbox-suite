
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/hero/HeroSection";
import ModernCard from "@/components/cards/ModernCard";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const Index = () => {
  const categories = [
    {
      title: "Création Visuelle",
      description: "Avatars, QR codes artistiques, palettes de couleurs, icônes et bien plus pour vos créations visuelles.",
      toolCount: 7,
      icon: "🎨",
      gradient: "bg-gradient-visual",
      path: "/visual",
      imageUrl: "https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=400&h=300&fit=crop",
      status: "active" as const
    },
    {
      title: "Traitement de Texte",
      description: "Analyse, résumé, détection de langue et outils avancés pour optimiser vos contenus textuels.",
      toolCount: 8,
      icon: "📝",
      gradient: "bg-gradient-text",
      path: "/text",
      imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68e2c6b1eb?w=400&h=300&fit=crop",
      status: "active" as const
    },
    {
      title: "Outils Développement",
      description: "JSON, Base64, Hash, Regex et tous les utilitaires essentiels pour les développeurs et les no codeurs également.",
      toolCount: 10,
      icon: "🔧",
      gradient: "bg-gradient-dev",
      path: "/dev",
      imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
      status: "active" as const
    },
    {
      title: "Audio & Image",
      description: "Compression, conversion, visualisation audio et manipulation d'images en temps réel.",
      toolCount: 5,
      icon: "🎵",
      gradient: "bg-gradient-media",
      path: "/media",
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      status: "beta" as const
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section Révolutionnaire */}
      <HeroSection />

      {/* Categories Grid Premium */}
      <section id="tools-section" className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-pattern-grid opacity-5" />
        
        <div className="container relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="inline-flex items-center space-x-2 bg-premium-100 text-premium-600 rounded-full px-6 py-2 mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">Nos Catégories</span>
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent font-space-grotesk"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Découvrez nos outils
            </motion.h2>
            
            <motion.p 
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Chaque catégorie regroupe des outils spécialisés pour répondre à vos besoins spécifiques
            </motion.p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {categories.map((category, index) => (
              <ModernCard
                key={category.title}
                {...category}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
