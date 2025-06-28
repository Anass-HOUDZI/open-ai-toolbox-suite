
import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { Upload, Download, RefreshCw, Scissors } from "lucide-react";
import { toast } from "sonner";
import { useFileHandler } from "@/hooks/useFileHandler";

const BackgroundRemover = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleFileSelect } = useFileHandler();

  const handleFileUpload = (file: File) => {
    if (!handleFileSelect(file, ['image/'])) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setProcessedImage(null);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const removeBackground = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    toast.info("Traitement en cours... (Démo)");

    try {
      // Simulation du traitement avec Remove.bg API
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Pour la démo, on retourne l'image originale avec un effet de transparence simulé
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (ctx) {
          // Dessiner l'image originale
          ctx.drawImage(img, 0, 0);
          
          // Simuler la suppression d'arrière-plan (effet démo basique)
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Effet basique de transparence pour la démo
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Si couleur proche du blanc (arrière-plan probable)
            if (r > 200 && g > 200 && b > 200) {
              data[i + 3] = 0; // Rendre transparent
            }
          }
          
          ctx.putImageData(imageData, 0, 0);
          setProcessedImage(canvas.toDataURL('image/png'));
        }
      };
      
      img.src = originalImage;
      toast.success("Background supprimé ! (Version démo)");
    } catch (error) {
      toast.error("Erreur lors du traitement");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadProcessedImage = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `no-bg-${fileName}`;
    link.click();
    toast.success("Image téléchargée !");
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white py-16">
        <div className="container">
          <div className="flex items-center mb-4">
            <Link to="/" className="text-white/70 hover:text-white mr-2">Accueil</Link>
            <span className="text-white/50">/</span>
            <Link to="/media" className="text-white/70 hover:text-white mx-2">Média</Link>
            <span className="text-white/50">/</span>
            <span className="ml-2">Background Remover</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Scissors className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Background Remover</h1>
          </div>
          <p className="text-xl text-white/90">
            Supprimez automatiquement l'arrière-plan de vos images
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="container max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Image Originale</CardTitle>
              </CardHeader>
              <CardContent>
                {!originalImage ? (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium mb-2">Cliquez pour uploader une image</p>
                    <p className="text-sm text-gray-500">Formats supportés: JPG, PNG, WebP</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <img
                      src={originalImage}
                      alt="Original"
                      className="w-full max-h-64 object-contain rounded-lg"
                    />
                    <p className="text-sm text-gray-500">{fileName}</p>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Changer d'image
                    </Button>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  className="hidden"
                />
              </CardContent>
            </Card>

            {/* Result Section */}
            <Card>
              <CardHeader>
                <CardTitle>Résultat</CardTitle>
              </CardHeader>
              <CardContent>
                {!processedImage ? (
                  <div className="border border-gray-200 rounded-lg p-8 text-center min-h-64 flex items-center justify-center">
                    <div>
                      <Scissors className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500">L'image traitée apparaîtra ici</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <img
                        src={processedImage}
                        alt="Processed"
                        className="w-full max-h-64 object-contain"
                      />
                    </div>
                    <Button
                      onClick={downloadProcessedImage}
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger PNG
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button
              onClick={removeBackground}
              disabled={!originalImage || isProcessing}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                <>
                  <Scissors className="w-5 h-5 mr-2" />
                  Supprimer l'arrière-plan
                </>
              )}
            </Button>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Note importante</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Cette version est une démonstration basique. Pour de meilleurs résultats, utilisez des services comme Remove.bg 
                ou des bibliothèques de machine learning spécialisées dans la segmentation d'images.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default BackgroundRemover;
