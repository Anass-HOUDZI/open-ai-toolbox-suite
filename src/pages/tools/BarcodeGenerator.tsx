
import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useEffect } from "react";
import { Download, Copy, BarChart } from "lucide-react";
import { toast } from "sonner";

const BarcodeGenerator = () => {
  const [text, setText] = useState("123456789012");
  const [barcodeType, setBarcodeType] = useState<'code128' | 'ean13' | 'upc' | 'code39'>('code128');
  const [showText, setShowText] = useState(true);
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const barcodeTypes = [
    { value: 'code128', label: 'Code 128', pattern: 'Alphanumerique' },
    { value: 'ean13', label: 'EAN-13', pattern: '13 chiffres' },
    { value: 'upc', label: 'UPC-A', pattern: '12 chiffres' },
    { value: 'code39', label: 'Code 39', pattern: 'Alphanumerique + symboles' }
  ];

  // Patterns simplifiés pour la démo
  const generateBarcodePattern = (text: string, type: string): string => {
    // Ceci est une simulation très simplifiée
    // Dans une vraie implémentation, utilisez une bibliothèque comme JsBarcode
    
    const patterns: { [key: string]: string } = {
      '0': '3211',
      '1': '2221',
      '2': '2122',
      '3': '1411',
      '4': '1132',
      '5': '1231',
      '6': '1114',
      '7': '1312',
      '8': '1213',
      '9': '3112',
      'A': '1211',
      'B': '1121',
      'C': '2111'
    };

    let pattern = '11'; // Start pattern
    
    for (const char of text.toUpperCase()) {
      if (patterns[char]) {
        pattern += patterns[char];
      } else {
        pattern += '1111'; // Default pattern
      }
    }
    
    pattern += '11'; // End pattern
    return pattern;
  };

  const drawBarcode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Validate input based on barcode type
    let validatedText = text;
    if (barcodeType === 'ean13' && text.length !== 13) {
      validatedText = text.padStart(13, '0').substring(0, 13);
    } else if (barcodeType === 'upc' && text.length !== 12) {
      validatedText = text.padStart(12, '0').substring(0, 12);
    }

    const pattern = generateBarcodePattern(validatedText, barcodeType);
    const barWidth = width;
    const barHeight = height;
    const textHeight = showText ? 20 : 0;
    
    canvas.width = pattern.length * barWidth + 40;
    canvas.height = barHeight + textHeight + 20;

    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw bars
    ctx.fillStyle = 'black';
    let x = 20;
    
    for (let i = 0; i < pattern.length; i++) {
      const barThickness = parseInt(pattern[i]);
      if (i % 2 === 0) { // Black bar
        ctx.fillRect(x, 10, barWidth * barThickness, barHeight);
      }
      x += barWidth * barThickness;
    }

    // Draw text
    if (showText) {
      ctx.fillStyle = 'black';
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(validatedText, canvas.width / 2, barHeight + 25);
    }
  };

  useEffect(() => {
    drawBarcode();
  }, [text, barcodeType, showText, width, height]);

  const downloadBarcode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `barcode-${text}-${barcodeType}.png`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success("Code-barres téléchargé !");
      }
    });
  };

  const copyBarcode = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          toast.success("Code-barres copié dans le presse-papiers !");
        }
      });
    } catch (error) {
      toast.error("Erreur lors de la copie");
    }
  };

  const generateRandomCode = () => {
    let code = '';
    const length = barcodeType === 'ean13' ? 13 : barcodeType === 'upc' ? 12 : 10;
    
    for (let i = 0; i < length; i++) {
      if (barcodeType === 'code39' && Math.random() > 0.7) {
        code += String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
      } else {
        code += Math.floor(Math.random() * 10); // 0-9
      }
    }
    
    setText(code);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gradient-media text-white py-16">
        <div className="container">
          <div className="flex items-center mb-4">
            <Link to="/" className="text-white/70 hover:text-white mr-2">Accueil</Link>
            <span className="text-white/50">/</span>
            <Link to="/media" className="text-white/70 hover:text-white mx-2">Audio & Image</Link>
            <span className="text-white/50">/</span>
            <span className="ml-2">Barcode Generator</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <BarChart className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Barcode Generator</h1>
          </div>
          <p className="text-xl text-white/90">
            Générez des codes-barres professionnels en plusieurs formats
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="container max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Configuration du code-barres</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Type de code-barres</label>
                  <select 
                    value={barcodeType} 
                    onChange={(e) => setBarcodeType(e.target.value as any)}
                    className="w-full p-2 border rounded-md"
                  >
                    {barcodeTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label} ({type.pattern})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Contenu</label>
                  <div className="flex gap-2">
                    <Input
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder={barcodeType === 'ean13' ? '1234567890123' : '123456789'}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      onClick={generateRandomCode}
                      className="whitespace-nowrap"
                    >
                      Aléatoire
                    </Button>
                  </div>
                  {barcodeType === 'ean13' && text.length !== 13 && (
                    <p className="text-sm text-orange-600 mt-1">
                      EAN-13 nécessite exactement 13 chiffres (sera complété automatiquement)
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Largeur barre ({width}px)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Hauteur ({height}px)
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showText"
                    checked={showText}
                    onChange={(e) => setShowText(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="showText" className="text-sm font-medium">
                    Afficher le texte sous le code-barres
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button onClick={downloadBarcode} className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger PNG
                  </Button>
                  <Button variant="outline" onClick={copyBarcode} className="flex-1">
                    <Copy className="w-4 h-4 mr-2" />
                    Copier
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Aperçu
                  <Badge variant="outline">
                    {barcodeTypes.find(t => t.value === barcodeType)?.label}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-6 flex justify-center items-center min-h-[200px]">
                  <canvas 
                    ref={canvasRef}
                    className="max-w-full h-auto border bg-white"
                  />
                </div>

                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note :</strong> Ceci est une démo simplifiée. Pour une utilisation professionnelle, 
                    utilisez une bibliothèque spécialisée comme JsBarcode qui supporte tous les standards 
                    de codes-barres avec validation complète.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BarcodeGenerator;
