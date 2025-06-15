
import { useState, useRef } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Download, Copy, Palette } from "lucide-react";
import { toast } from "sonner";

interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

const ColorPaletteExtractor = () => {
  const [image, setImage] = useState<string | null>(null);
  const [palette, setPalette] = useState<Color[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const extractColors = (imageData: ImageData): Color[] => {
    const data = imageData.data;
    const colorCounts = new Map<string, number>();

    // Sample pixels (every 4th pixel for performance)
    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const alpha = data[i + 3];

      if (alpha > 128) { // Skip transparent pixels
        const hex = rgbToHex(r, g, b);
        colorCounts.set(hex, (colorCounts.get(hex) || 0) + 1);
      }
    }

    // Get top 8 most frequent colors
    const sortedColors = Array.from(colorCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    return sortedColors.map(([hex]) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      
      return {
        hex,
        rgb: { r, g, b },
        hsl: rgbToHsl(r, g, b)
      };
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Veuillez sélectionner un fichier image valide");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImage(result);
      processImage(result);
    };
    reader.readAsDataURL(file);
  };

  const processImage = (imageSrc: string) => {
    setIsExtracting(true);
    const img = new Image();
    
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Resize image for performance (max 400px)
      const maxSize = 400;
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      
      const extractedColors = extractColors(imageData);
      setPalette(extractedColors);
      setIsExtracting(false);
      
      toast.success(`${extractedColors.length} couleurs extraites !`);
    };
    
    img.src = imageSrc;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié dans le presse-papier`);
  };

  const exportPalette = () => {
    if (palette.length === 0) return;
    
    const cssVars = palette.map((color, index) => 
      `  --color-${index + 1}: ${color.hex};`
    ).join('\n');
    
    const css = `:root {\n${cssVars}\n}`;
    
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'palette.css';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Palette exportée en CSS !");
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gradient-visual text-white py-16">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">🎨 Color Palette Extractor</h1>
          <p className="text-xl text-white/90">
            Extrayez automatiquement les couleurs dominantes de vos images
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {image ? (
                  <img src={image} alt="Uploaded" className="max-w-full max-h-64 mx-auto rounded-lg" />
                ) : (
                  <div>
                    <Palette className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Cliquez pour sélectionner une image</p>
                    <p className="text-sm text-gray-400 mt-2">PNG, JPG, WebP jusqu'à 10MB</p>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {isExtracting && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 text-purple-600">
                    <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    Extraction des couleurs...
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Palette Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Palette Extraite
                {palette.length > 0 && (
                  <Button 
                    size="sm" 
                    onClick={exportPalette}
                    className="ml-auto"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSS
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {palette.length > 0 ? (
                <div className="space-y-3">
                  {palette.map((color, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div 
                        className="w-12 h-12 rounded-lg border shadow-sm"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="flex-1 grid grid-cols-3 gap-2 text-sm">
                        <button
                          onClick={() => copyToClipboard(color.hex, "HEX")}
                          className="text-left hover:bg-gray-50 p-1 rounded"
                        >
                          <div className="font-mono font-bold">{color.hex}</div>
                          <div className="text-gray-500">HEX</div>
                        </button>
                        <button
                          onClick={() => copyToClipboard(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`, "RGB")}
                          className="text-left hover:bg-gray-50 p-1 rounded"
                        >
                          <div className="font-mono">{color.rgb.r}, {color.rgb.g}, {color.rgb.b}</div>
                          <div className="text-gray-500">RGB</div>
                        </button>
                        <button
                          onClick={() => copyToClipboard(`hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`, "HSL")}
                          className="text-left hover:bg-gray-50 p-1 rounded"
                        >
                          <div className="font-mono">{color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%</div>
                          <div className="text-gray-500">HSL</div>
                        </button>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(color.hex, "Couleur")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Palette className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Uploadez une image pour extraire sa palette de couleurs</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default ColorPaletteExtractor;
