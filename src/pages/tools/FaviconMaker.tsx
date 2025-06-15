
import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { Upload, Download, Square, Circle, Type } from "lucide-react";
import { toast } from "sonner";

const FaviconMaker = () => {
  const [faviconType, setFaviconType] = useState<"upload" | "text" | "icon">("text");
  const [text, setText] = useState("A");
  const [backgroundColor, setBackgroundColor] = useState("#667eea");
  const [textColor, setTextColor] = useState("#ffffff");
  const [shape, setShape] = useState<"square" | "circle">("square");
  const [fontSize, setFontSize] = useState(24);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sizes = [16, 32, 48, 64, 128, 180, 192, 512];

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error("Veuillez sélectionner un fichier image");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setFaviconType("upload");
    };
    reader.readAsDataURL(file);
  };

  const generateFavicon = (size: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    // Background
    if (shape === "circle") {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
      ctx.fillStyle = backgroundColor;
      ctx.fill();
    } else {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, size, size);
    }

    if (faviconType === "text") {
      // Text favicon
      ctx.fillStyle = textColor;
      ctx.font = `bold ${Math.floor(size * fontSize / 32)}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text.charAt(0).toUpperCase(), size / 2, size / 2);
    } else if (faviconType === "upload" && uploadedImage) {
      // Image favicon
      const img = new Image();
      img.onload = () => {
        if (shape === "circle") {
          ctx.save();
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
          ctx.clip();
        }
        ctx.drawImage(img, 0, 0, size, size);
        if (shape === "circle") {
          ctx.restore();
        }
      };
      img.src = uploadedImage;
      return canvas; // Return immediately for async image loading
    }

    return canvas;
  };

  const downloadFavicon = (size: number) => {
    const canvas = generateFavicon(size);
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `favicon-${size}x${size}.png`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success(`Favicon ${size}x${size} téléchargé !`);
      }
    });
  };

  const downloadAll = () => {
    sizes.forEach((size, index) => {
      setTimeout(() => downloadFavicon(size), index * 200);
    });
    toast.success("Téléchargement de tous les formats démarré !");
  };

  const generateICO = () => {
    // Simplified ICO generation - just download the 32x32 version as .ico
    const canvas = generateFavicon(32);
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'favicon.ico';
        link.click();
        URL.revokeObjectURL(url);
        toast.success("Favicon ICO téléchargé !");
      }
    });
  };

  // Preview canvas
  const previewCanvas = generateFavicon(128);

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
            <span className="ml-2">Favicon Maker</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Square className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Favicon Maker</h1>
          </div>
          <p className="text-xl text-white/90">
            Créez des favicons professionnels dans tous les formats requis
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
                <div className="text-center">
                  <div className="inline-block p-8 bg-gray-50 rounded-lg mb-4">
                    {previewCanvas && (
                      <canvas
                        ref={canvasRef}
                        width={128}
                        height={128}
                        className="border"
                        style={{
                          imageRendering: "pixelated"
                        }}
                      />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {[16, 32, 48, 64].map((size) => (
                      <div key={size} className="text-center">
                        <div 
                          className="w-full aspect-square bg-gray-100 rounded flex items-center justify-center mb-2"
                          style={{ fontSize: `${size/4}px` }}
                        >
                          {faviconType === "text" ? text.charAt(0).toUpperCase() : "📷"}
                        </div>
                        <span className="text-xs text-gray-500">{size}px</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={downloadAll} className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger tout
                    </Button>
                    <Button onClick={generateICO} variant="outline">
                      ICO
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <div className="space-y-6">
              {/* Type Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Type de favicon</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant={faviconType === "text" ? "default" : "outline"}
                      onClick={() => setFaviconType("text")}
                    >
                      <Type className="w-4 h-4 mr-2" />
                      Texte
                    </Button>
                    <Button
                      variant={faviconType === "upload" ? "default" : "outline"}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Image
                    </Button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    className="hidden"
                  />
                </CardContent>
              </Card>

              {/* Text Options */}
              {faviconType === "text" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Options texte</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Texte
                      </label>
                      <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        maxLength={2}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="A"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Taille: {fontSize}px
                      </label>
                      <input
                        type="range"
                        min="16"
                        max="32"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Couleur texte
                        </label>
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-full h-10 border rounded cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Couleur fond
                        </label>
                        <input
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-full h-10 border rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Shape */}
              <Card>
                <CardHeader>
                  <CardTitle>Forme</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant={shape === "square" ? "default" : "outline"}
                      onClick={() => setShape("square")}
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Carré
                    </Button>
                    <Button
                      variant={shape === "circle" ? "default" : "outline"}
                      onClick={() => setShape("circle")}
                    >
                      <Circle className="w-4 h-4 mr-2" />
                      Cercle
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Download Individual Sizes */}
              <Card>
                <CardHeader>
                  <CardTitle>Téléchargements individuels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-2">
                    {sizes.map((size) => (
                      <Button
                        key={size}
                        onClick={() => downloadFavicon(size)}
                        variant="outline"
                        size="sm"
                      >
                        {size}px
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Info */}
              <Card>
                <CardContent className="pt-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Formats inclus</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• 16x16 - Standard favicon</li>
                      <li>• 32x32 - Retina favicon</li>
                      <li>• 180x180 - Apple touch icon</li>
                      <li>• 192x192 - Android chrome</li>
                      <li>• 512x512 - PWA</li>
                    </ul>
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

export default FaviconMaker;
