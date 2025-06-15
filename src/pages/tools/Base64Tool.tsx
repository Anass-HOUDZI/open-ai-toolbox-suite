
import { useState } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Upload, Download, FileText, Image } from "lucide-react";
import { toast } from "sonner";

const Base64Tool = () => {
  const [textInput, setTextInput] = useState("");
  const [textOutput, setTextOutput] = useState("");
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [fileOutput, setFileOutput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const encodeText = () => {
    if (!textInput.trim()) {
      toast.error("Veuillez entrer du texte à encoder");
      return;
    }

    try {
      const encoded = btoa(unescape(encodeURIComponent(textInput)));
      setTextOutput(encoded);
      toast.success("Texte encodé en Base64 !");
    } catch (error) {
      toast.error("Erreur lors de l'encodage");
      console.error(error);
    }
  };

  const decodeText = () => {
    if (!textInput.trim()) {
      toast.error("Veuillez entrer du Base64 à décoder");
      return;
    }

    try {
      const decoded = decodeURIComponent(escape(atob(textInput)));
      setTextOutput(decoded);
      toast.success("Base64 décodé en texte !");
    } catch (error) {
      toast.error("Base64 invalide ou corrompu");
      console.error(error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error("Fichier trop volumineux (max 10MB)");
      return;
    }

    setFileInput(file);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const base64 = result.split(',')[1]; // Remove data URL prefix
      setFileOutput(base64);
      
      // Preview for images
      if (file.type.startsWith('image/')) {
        setImagePreview(result);
      } else {
        setImagePreview(null);
      }
      
      toast.success("Fichier encodé en Base64 !");
    };
    
    reader.readAsDataURL(file);
  };

  const downloadFromBase64 = () => {
    if (!fileOutput) {
      toast.error("Aucun fichier à télécharger");
      return;
    }

    try {
      const byteCharacters = atob(fileOutput);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray]);
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileInput?.name || 'decoded_file';
      a.click();
      
      URL.revokeObjectURL(url);
      toast.success("Fichier téléchargé !");
    } catch (error) {
      toast.error("Erreur lors du téléchargement");
      console.error(error);
    }
  };

  const createDataUri = () => {
    if (!fileOutput || !fileInput) {
      toast.error("Aucun fichier encodé");
      return;
    }

    const dataUri = `data:${fileInput.type};base64,${fileOutput}`;
    navigator.clipboard.writeText(dataUri);
    toast.success("Data URI copié dans le presse-papier");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copié dans le presse-papier");
  };

  const clearAll = () => {
    setTextInput("");
    setTextOutput("");
    setFileInput(null);
    setFileOutput("");
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gradient-dev text-white py-16">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">🔧 Base64 Encoder/Decoder</h1>
          <p className="text-xl text-white/90">
            Encodez et décodez du texte et des fichiers en Base64
          </p>
        </div>
      </div>

      <div className="container py-8">
        <Tabs defaultValue="text" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Texte
            </TabsTrigger>
            <TabsTrigger value="file" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Fichier
            </TabsTrigger>
          </TabsList>

          {/* Text Tab */}
          <TabsContent value="text">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Texte d'entrée</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Entrez votre texte ici..."
                    className="min-h-[200px] font-mono text-sm"
                  />
                  <div className="flex gap-3">
                    <Button onClick={encodeText} className="flex-1">
                      Encoder en Base64
                    </Button>
                    <Button onClick={decodeText} variant="outline" className="flex-1">
                      Décoder depuis Base64
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Résultat
                    {textOutput && (
                      <Button 
                        size="sm" 
                        onClick={() => copyToClipboard(textOutput)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copier
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {textOutput ? (
                    <Textarea
                      value={textOutput}
                      readOnly
                      className="min-h-[200px] font-mono text-sm bg-gray-50"
                    />
                  ) : (
                    <div className="min-h-[200px] flex items-center justify-center text-gray-500 border border-gray-200 rounded-md">
                      <div className="text-center">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Le résultat apparaîtra ici</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* File Tab */}
          <TabsContent value="file">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload fichier</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">Cliquez pour sélectionner un fichier</p>
                      <p className="text-sm text-gray-400 mt-2">Max 10MB</p>
                    </label>
                  </div>

                  {fileInput && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-blue-600" />
                        <div>
                          <p className="font-medium">{fileInput.name}</p>
                          <p className="text-sm text-gray-600">
                            {(fileInput.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {imagePreview && (
                    <div className="text-center">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-w-full max-h-48 mx-auto rounded-lg border"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Base64 résultat
                    {fileOutput && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => copyToClipboard(fileOutput)}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copier
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={createDataUri}
                          variant="outline"
                        >
                          Data URI
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={downloadFromBase64}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {fileOutput ? (
                    <Textarea
                      value={fileOutput}
                      readOnly
                      className="min-h-[300px] font-mono text-xs bg-gray-50"
                    />
                  ) : (
                    <div className="min-h-[300px] flex items-center justify-center text-gray-500 border border-gray-200 rounded-md">
                      <div className="text-center">
                        <Image className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Le Base64 du fichier apparaîtra ici</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex justify-center mt-6">
          <Button onClick={clearAll} variant="outline">
            Effacer tout
          </Button>
        </div>

        {/* Info Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>À propos de Base64</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">📝 Encodage</h4>
                <p className="text-gray-600">Convertit données binaires en texte ASCII pour transmission sécurisée</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">🌐 Utilisation</h4>
                <p className="text-gray-600">URLs de données, email (MIME), stockage de fichiers en JSON</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">⚡ Performance</h4>
                <p className="text-gray-600">Augmente la taille de ~33%, mais garantit la compatibilité</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Base64Tool;
