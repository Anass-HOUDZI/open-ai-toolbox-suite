
import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Scissors, Download, Copy, FileText, Zap } from "lucide-react";
import { toast } from "sonner";

const CSSMinifier = () => {
  const [cssInput, setCssInput] = useState("");
  const [minifiedCSS, setMinifiedCSS] = useState("");
  const [stats, setStats] = useState({ original: 0, minified: 0, savings: 0 });

  const minifyCSS = () => {
    if (!cssInput.trim()) {
      toast.error("Veuillez entrer du code CSS");
      return;
    }

    try {
      // Simple CSS minification
      let minified = cssInput
        // Remove comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove extra whitespace
        .replace(/\s+/g, ' ')
        // Remove whitespace around specific characters
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*,\s*/g, ',')
        // Remove trailing semicolon before }
        .replace(/;}/g, '}')
        // Remove leading/trailing whitespace
        .trim();

      setMinifiedCSS(minified);
      
      const originalSize = cssInput.length;
      const minifiedSize = minified.length;
      const savings = Math.round(((originalSize - minifiedSize) / originalSize) * 100);
      
      setStats({
        original: originalSize,
        minified: minifiedSize,
        savings: savings
      });
      
      toast.success(`CSS minifié avec succès ! Réduction de ${savings}%`);
    } catch (error) {
      toast.error("Erreur lors de la minification CSS");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(minifiedCSS);
    toast.success("CSS minifié copié !");
  };

  const downloadCSS = () => {
    const blob = new Blob([minifiedCSS], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'minified.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("CSS téléchargé !");
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gradient-dev text-white py-16">
        <div className="container">
          <div className="flex items-center mb-4">
            <Link to="/" className="text-white/70 hover:text-white mr-2">Accueil</Link>
            <span className="text-white/50">/</span>
            <Link to="/dev" className="text-white/70 hover:text-white mx-2">Développement</Link>
            <span className="text-white/50">/</span>
            <span className="ml-2">CSS Minifier</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Scissors className="w-8 h-8" />
            <h1 className="text-4xl font-bold">CSS Minifier</h1>
          </div>
          <p className="text-xl text-white/90">
            Minifiez et optimisez votre code CSS pour améliorer les performances
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  CSS Original
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={cssInput}
                  onChange={(e) => setCssInput(e.target.value)}
                  placeholder="Collez votre code CSS ici..."
                  className="w-full h-80 p-4 border rounded-lg font-mono text-sm resize-none"
                />
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">
                    {formatBytes(cssInput.length)}
                  </span>
                  <Button 
                    onClick={minifyCSS} 
                    disabled={!cssInput.trim()}
                    className="bg-gradient-dev hover:opacity-90"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Minifier CSS
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Output */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scissors className="w-5 h-5" />
                  CSS Minifié
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={minifiedCSS}
                  readOnly
                  placeholder="Le CSS minifié apparaîtra ici..."
                  className="w-full h-80 p-4 border rounded-lg font-mono text-sm resize-none bg-gray-50"
                />
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">
                    {formatBytes(minifiedCSS.length)}
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      onClick={copyToClipboard} 
                      disabled={!minifiedCSS}
                      variant="outline"
                      size="sm"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copier
                    </Button>
                    <Button 
                      onClick={downloadCSS} 
                      disabled={!minifiedCSS}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics */}
          {minifiedCSS && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Statistiques d'optimisation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatBytes(stats.original)}
                    </div>
                    <div className="text-sm text-gray-600">Taille originale</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatBytes(stats.minified)}
                    </div>
                    <div className="text-sm text-gray-600">Taille minifiée</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatBytes(stats.original - stats.minified)}
                    </div>
                    <div className="text-sm text-gray-600">Octets économisés</div>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {stats.savings}%
                    </div>
                    <div className="text-sm text-gray-600">Réduction</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};

export default CSSMinifier;
