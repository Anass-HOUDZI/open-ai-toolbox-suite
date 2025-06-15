
import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Copy, RefreshCw, Palette, Download } from "lucide-react";
import { toast } from "sonner";

const GradientCreator = () => {
  const [gradient, setGradient] = useState({
    type: "linear",
    direction: "to right",
    colors: ["#667eea", "#764ba2"]
  });
  const [angle, setAngle] = useState(90);

  const presetGradients = [
    { name: "Sunset", colors: ["#ff6b6b", "#ffa726"] },
    { name: "Ocean", colors: ["#667eea", "#764ba2"] },
    { name: "Purple", colors: ["#f093fb", "#f5576c"] },
    { name: "Nature", colors: ["#43e97b", "#38f9d7"] },
    { name: "Fire", colors: ["#fa709a", "#fee140"] },
    { name: "Ice", colors: ["#4facfe", "#00f2fe"] }
  ];

  const directions = [
    { name: "To Right", value: "to right" },
    { name: "To Left", value: "to left" },
    { name: "To Bottom", value: "to bottom" },
    { name: "To Top", value: "to top" },
    { name: "Custom Angle", value: "custom" }
  ];

  const generateGradientCSS = () => {
    const direction = gradient.type === "radial" ? "circle" : 
                     gradient.direction === "custom" ? `${angle}deg` : gradient.direction;
    
    if (gradient.type === "radial") {
      return `radial-gradient(${direction}, ${gradient.colors.join(", ")})`;
    }
    return `linear-gradient(${direction}, ${gradient.colors.join(", ")})`;
  };

  const copyCSS = () => {
    const css = `background: ${generateGradientCSS()};`;
    navigator.clipboard.writeText(css);
    toast.success("CSS copié dans le presse-papiers !");
  };

  const randomGradient = () => {
    const colors = [
      "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57",
      "#ff9ff3", "#54a0ff", "#5f27cd", "#00d2d3", "#ff9f43",
      "#6c5ce7", "#a29bfe", "#fd79a8", "#fdcb6e", "#e17055"
    ];
    
    const randomColors = [
      colors[Math.floor(Math.random() * colors.length)],
      colors[Math.floor(Math.random() * colors.length)]
    ];
    
    setGradient(prev => ({ ...prev, colors: randomColors }));
    toast.success("Nouveau dégradé généré !");
  };

  const updateColor = (index: number, color: string) => {
    const newColors = [...gradient.colors];
    newColors[index] = color;
    setGradient(prev => ({ ...prev, colors: newColors }));
  };

  const addColor = () => {
    if (gradient.colors.length < 5) {
      setGradient(prev => ({ 
        ...prev, 
        colors: [...prev.colors, "#ffffff"] 
      }));
    }
  };

  const removeColor = (index: number) => {
    if (gradient.colors.length > 2) {
      const newColors = gradient.colors.filter((_, i) => i !== index);
      setGradient(prev => ({ ...prev, colors: newColors }));
    }
  };

  const downloadGradient = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      const gradient_canvas = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.colors.forEach((color, index) => {
        gradient_canvas.addColorStop(index / (gradient.colors.length - 1), color);
      });
      
      ctx.fillStyle = gradient_canvas;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'gradient.png';
          link.click();
          URL.revokeObjectURL(url);
          toast.success("Image téléchargée !");
        }
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gradient-visual text-white py-16">
        <div className="container">
          <div className="flex items-center mb-4">
            <Link to="/" className="text-white/70 hover:text-white mr-2">Accueil</Link>
            <span className="text-white/50">/</span>
            <Link to="/visual" className="text-white/70 hover:text-white mx-2">Création Visuelle</Link>
            <span className="text-white/50">/</span>
            <span className="ml-2">Gradient Creator</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Gradient Creator</h1>
          </div>
          <p className="text-xl text-white/90">
            Créez des dégradés CSS personnalisés avec aperçu temps réel
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Aperçu</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="w-full h-64 rounded-lg border"
                  style={{ background: generateGradientCSS() }}
                />
                
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-mono text-gray-700">
                    background: {generateGradientCSS()};
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button onClick={copyCSS} className="flex-1">
                    <Copy className="w-4 h-4 mr-2" />
                    Copier CSS
                  </Button>
                  <Button onClick={downloadGradient} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    PNG
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <div className="space-y-6">
              {/* Type */}
              <Card>
                <CardHeader>
                  <CardTitle>Type de dégradé</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant={gradient.type === "linear" ? "default" : "outline"}
                      onClick={() => setGradient(prev => ({ ...prev, type: "linear" }))}
                    >
                      Linéaire
                    </Button>
                    <Button
                      variant={gradient.type === "radial" ? "default" : "outline"}
                      onClick={() => setGradient(prev => ({ ...prev, type: "radial" }))}
                    >
                      Radial
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Direction */}
              {gradient.type === "linear" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Direction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {directions.map((dir) => (
                        <Button
                          key={dir.value}
                          variant={gradient.direction === dir.value ? "default" : "outline"}
                          onClick={() => setGradient(prev => ({ ...prev, direction: dir.value }))}
                          size="sm"
                        >
                          {dir.name}
                        </Button>
                      ))}
                    </div>
                    
                    {gradient.direction === "custom" && (
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Angle: {angle}°
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={angle}
                          onChange={(e) => setAngle(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Colors */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Couleurs</CardTitle>
                    <div className="flex gap-2">
                      <Button onClick={randomGradient} size="sm" variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Aléatoire
                      </Button>
                      {gradient.colors.length < 5 && (
                        <Button onClick={addColor} size="sm">
                          + Ajouter
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {gradient.colors.map((color, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => updateColor(index, e.target.value)}
                          className="w-12 h-10 border rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={color}
                          onChange={(e) => updateColor(index, e.target.value)}
                          className="flex-1 px-3 py-2 border rounded"
                        />
                        {gradient.colors.length > 2 && (
                          <Button
                            onClick={() => removeColor(index)}
                            size="sm"
                            variant="outline"
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Presets */}
              <Card>
                <CardHeader>
                  <CardTitle>Dégradés prédéfinis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {presetGradients.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => setGradient(prev => ({ ...prev, colors: preset.colors }))}
                        className="p-3 rounded-lg border hover:border-gray-400 transition-colors"
                        style={{
                          background: `linear-gradient(to right, ${preset.colors.join(", ")})`
                        }}
                      >
                        <span className="text-white font-medium drop-shadow">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GradientCreator;
