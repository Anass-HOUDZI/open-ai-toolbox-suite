
import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { Upload, Download, RefreshCw, Scissors } from "lucide-react";
import { toast } from "sonner";

const BackgroundRemover = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error("Veuillez sélectionner un fichier image");
      return;
    }

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
      // Dans une vraie implémentation, vous utiliseriez l'API Remove.bg
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
          
          // Simuler la suppression d'arrière-plan (effet démo)
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Algorithme simple pour démo : rendre transparent les pixels clairs
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const brightness = (r + g + b) / 3;
            
            // Si le pixel est clair (probablement arrière-plan), le rendre transparent
            if (brightness > 200) {
              data[i + 3] = 0; // Alpha = 0 (transparent)
            }
          }
          
          ctx.putImageData(imageData, 0, 0);
          setProcessedImage(canvas.toDataURL('image/png'));
          toast.success("Arrière-plan supprimé avec succès !");
        }
      };

      img.src = originalImage;
    } catch (error) {
      toast.error("Erreur lors du traitement");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadProcessed = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `${fileName.split('.')[0]}_no_bg.png`;
    link.click();
    toast.success("Téléchargement démarré !");
  };

  const reset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
            <span className="ml-2">Background Remover</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Scissors className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Background Remover</h1>
          </div>
          <p className="text-xl text-white/90">
            Supprimez l'arrière-plan de vos images automatiquement
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="container max-w-6xl">
          {!originalImage ? (
            /* Upload Area */
            <Card>
              <CardHeader>
                <CardTitle>Télécharger une image</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-xl font-medium mb-2">Cliquez pour sélectionner une image</p>
                  <p className="text-muted-foreground">
                    Formats supportés : JPG, PNG (max 10MB)
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
              </CardContent>
            </Card>
          ) : (
            /* Processing Area */
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Traitement de l'image</h2>
                <div className="flex gap-2">
                  {processedImage && (
                    <Button onClick={downloadProcessed}>
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  )}
                  <Button variant="outline" onClick={reset}>
                    Nouvelle image
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Original Image */}
                <Card>
                  <CardHeader>
                    <CardTitle>Image originale</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-square bg-checkerboard rounded-lg overflow-hidden">
                      <img 
                        src={originalImage} 
                        alt="Original" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <Button 
                        onClick={removeBackground}
                        disabled={isProcessing}
                        className="bg-gradient-media hover:opacity-90"
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Traitement...
                          </>
                        ) : (
                          <>
                            <Scissors className="w-4 h-4 mr-2" />
                            Supprimer l'arrière-plan
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Processed Image */}
                <Card>
                  <CardHeader>
                    <CardTitle>Résultat</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-square bg-checkerboard rounded-lg overflow-hidden">
                      {processedImage ? (
                        <img 
                          src={processedImage} 
                          alt="Processed" 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          {isProcessing ? (
                            <div className="text-center">
                              <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
                              <p>Traitement en cours...</p>
                            </div>
                          ) : (
                            <p>L'image traitée apparaîtra ici</p>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Info */}
              <Card>
                <CardContent className="pt-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Note :</strong> Ceci est une démo simplifiée. Dans une implémentation réelle, 
                      cet outil utiliserait l'API Remove.bg ou un modèle d'IA comme REMBG pour une suppression 
                      d'arrière-plan précise et professionnelle.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      <style>
        {`
          .bg-checkerboard {
            background-image: 
              linear-gradient(45deg, #ccc 25%, transparent 25%), 
              linear-gradient(-45deg, #ccc 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #ccc 75%), 
              linear-gradient(-45deg, transparent 75%, #ccc 75%);
            background-size: 20px 20px;
            background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
          }
        `}
      </style>
    </div>
  );
};

export default BackgroundRemover;
