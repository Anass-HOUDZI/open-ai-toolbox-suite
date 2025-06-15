
import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState, useRef, useEffect } from "react";
import { Download, RefreshCw, Palette } from "lucide-react";
import { toast } from "sonner";

const PatternGenerator = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [patternType, setPatternType] = useState("geometric");
  const [size, setSize] = useState(50);
  const [complexity, setComplexity] = useState(5);
  const [colorScheme, setColorScheme] = useState("modern");
  const [primaryColor, setPrimaryColor] = useState("#6366f1");
  const [secondaryColor, setSecondaryColor] = useState("#ec4899");

  const patternTypes = [
    { value: "geometric", label: "Géométrique" },
    { value: "organic", label: "Organique" },
    { value: "grid", label: "Grille" },
    { value: "wave", label: "Vagues" },
    { value: "spiral", label: "Spirale" }
  ];

  const colorSchemes = {
    modern: ["#6366f1", "#ec4899", "#10b981", "#f59e0b"],
    vintage: ["#92400e", "#b45309", "#d97706", "#f59e0b"],
    ocean: ["#0891b2", "#0e7490", "#164e63", "#155e75"],
    sunset: ["#dc2626", "#ea580c", "#f59e0b", "#eab308"],
    nature: ["#166534", "#15803d", "#16a34a", "#22c55e"]
  };

  const generatePattern = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const colors = colorScheme === 'custom' 
      ? [primaryColor, secondaryColor]
      : colorSchemes[colorScheme as keyof typeof colorSchemes];

    switch (patternType) {
      case 'geometric':
        generateGeometricPattern(ctx, colors);
        break;
      case 'organic':
        generateOrganicPattern(ctx, colors);
        break;
      case 'grid':
        generateGridPattern(ctx, colors);
        break;
      case 'wave':
        generateWavePattern(ctx, colors);
        break;
      case 'spiral':
        generateSpiralPattern(ctx, colors);
        break;
    }
  };

  const generateGeometricPattern = (ctx: CanvasRenderingContext2D, colors: string[]) => {
    for (let i = 0; i < complexity * 10; i++) {
      const x = Math.random() * 400;
      const y = Math.random() * 400;
      const radius = size;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      ctx.fillStyle = color + '80'; // Add transparency
      ctx.beginPath();
      
      if (Math.random() > 0.5) {
        // Circle
        ctx.arc(x, y, radius, 0, Math.PI * 2);
      } else {
        // Rectangle
        ctx.rect(x - radius, y - radius, radius * 2, radius * 2);
      }
      
      ctx.fill();
    }
  };

  const generateOrganicPattern = (ctx: CanvasRenderingContext2D, colors: string[]) => {
    for (let i = 0; i < complexity * 8; i++) {
      const x = Math.random() * 400;
      const y = Math.random() * 400;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      ctx.strokeStyle = color + '60';
      ctx.lineWidth = Math.random() * 3 + 1;
      ctx.beginPath();
      
      // Organic curves
      const controlX1 = x + (Math.random() - 0.5) * size;
      const controlY1 = y + (Math.random() - 0.5) * size;
      const controlX2 = x + (Math.random() - 0.5) * size;
      const controlY2 = y + (Math.random() - 0.5) * size;
      const endX = x + (Math.random() - 0.5) * size * 2;
      const endY = y + (Math.random() - 0.5) * size * 2;
      
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, endX, endY);
      ctx.stroke();
    }
  };

  const generateGridPattern = (ctx: CanvasRenderingContext2D, colors: string[]) => {
    const gridSize = size;
    for (let x = 0; x < 400; x += gridSize) {
      for (let y = 0; y < 400; y += gridSize) {
        if (Math.random() > 0.5) {
          const color = colors[Math.floor(Math.random() * colors.length)];
          ctx.fillStyle = color + '70';
          ctx.fillRect(x, y, gridSize - 2, gridSize - 2);
        }
      }
    }
  };

  const generateWavePattern = (ctx: CanvasRenderingContext2D, colors: string[]) => {
    for (let i = 0; i < complexity; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      ctx.strokeStyle = color + '80';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      const amplitude = size;
      const frequency = 0.02 + Math.random() * 0.02;
      const yOffset = Math.random() * 400;
      
      for (let x = 0; x < 400; x++) {
        const y = yOffset + Math.sin(x * frequency) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  };

  const generateSpiralPattern = (ctx: CanvasRenderingContext2D, colors: string[]) => {
    const centerX = 200;
    const centerY = 200;
    
    for (let i = 0; i < complexity; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      ctx.strokeStyle = color + '70';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      const spiralSize = size + Math.random() * 50;
      for (let angle = 0; angle < Math.PI * 8; angle += 0.1) {
        const radius = angle * spiralSize / 20;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        if (angle === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  };

  const downloadPattern = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `pattern-${patternType}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    toast.success("Pattern téléchargé !");
  };

  const copyPatternCSS = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL();
    const css = `background-image: url(${dataURL});
background-repeat: repeat;
background-size: 400px 400px;`;
    
    navigator.clipboard.writeText(css);
    toast.success("CSS copié !");
  };

  useEffect(() => {
    generatePattern();
  }, [patternType, size, complexity, colorScheme, primaryColor, secondaryColor]);

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
            <span className="ml-2">Pattern Generator</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Pattern Generator</h1>
          </div>
          <p className="text-xl text-white/90">
            Créez des motifs géométriques algorithmiques pour vos designs
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du motif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Type de motif</label>
                  <div className="grid grid-cols-2 gap-2">
                    {patternTypes.map((type) => (
                      <Button
                        key={type.value}
                        variant={patternType === type.value ? "default" : "outline"}
                        onClick={() => setPatternType(type.value)}
                        className="text-sm"
                      >
                        {type.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Taille des éléments: {size}px
                  </label>
                  <Slider
                    value={[size]}
                    onValueChange={(value) => setSize(value[0])}
                    max={100}
                    min={10}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Complexité: {complexity}
                  </label>
                  <Slider
                    value={[complexity]}
                    onValueChange={(value) => setComplexity(value[0])}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Palette de couleurs</label>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {Object.keys(colorSchemes).map((scheme) => (
                      <Button
                        key={scheme}
                        variant={colorScheme === scheme ? "default" : "outline"}
                        onClick={() => setColorScheme(scheme)}
                        className="text-sm capitalize"
                      >
                        {scheme}
                      </Button>
                    ))}
                    <Button
                      variant={colorScheme === 'custom' ? "default" : "outline"}
                      onClick={() => setColorScheme('custom')}
                      className="text-sm"
                    >
                      Personnalisé
                    </Button>
                  </div>

                  {colorScheme === 'custom' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs mb-1">Couleur 1</label>
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-full h-10 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Couleur 2</label>
                        <input
                          type="color"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="w-full h-10 border rounded"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button onClick={generatePattern} variant="outline" className="flex-1">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regénérer
                  </Button>
                  <Button onClick={copyPatternCSS} variant="outline" className="flex-1">
                    CSS
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Aperçu du motif</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <canvas
                      ref={canvasRef}
                      className="max-w-full h-auto border rounded"
                      style={{ maxHeight: '400px' }}
                    />
                  </div>
                  
                  <Button onClick={downloadPattern} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger PNG
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PatternGenerator;
