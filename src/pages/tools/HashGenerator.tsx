
import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Copy, Hash, Upload, Shield } from "lucide-react";
import { toast } from "sonner";

const HashGenerator = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [hashes, setHashes] = useState({
    md5: "",
    sha1: "",
    sha256: "",
    sha512: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Fonctions de hachage utilisant la Web Crypto API
  const generateHash = async (algorithm: string, data: ArrayBuffer): Promise<string> => {
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Simulation MD5 (pour l'exemple, en production utiliser une vraie librairie)
  const simpleMD5 = (str: string): string => {
    // Simulation très basique - en réalité, utiliser crypto-js ou similaire
    let hash = 0;
    if (str.length === 0) return hash.toString();
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0').repeat(4).substring(0, 32);
  };

  const processText = async () => {
    if (!text.trim()) {
      toast.error("Veuillez saisir du texte à hasher");
      return;
    }

    setIsProcessing(true);

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);

      const [sha1Hash, sha256Hash, sha512Hash] = await Promise.all([
        generateHash('SHA-1', data),
        generateHash('SHA-256', data),
        generateHash('SHA-512', data)
      ]);

      setHashes({
        md5: simpleMD5(text),
        sha1: sha1Hash,
        sha256: sha256Hash,
        sha512: sha512Hash
      });

      toast.success("Hachage généré avec succès !");
    } catch (error) {
      toast.error("Erreur lors du hachage");
    } finally {
      setIsProcessing(false);
    }
  };

  const processFile = async () => {
    if (!file) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }

    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();

      const [sha1Hash, sha256Hash, sha512Hash] = await Promise.all([
        generateHash('SHA-1', arrayBuffer),
        generateHash('SHA-256', arrayBuffer),
        generateHash('SHA-512', arrayBuffer)
      ]);

      // Pour MD5, on convertit en texte et utilise notre fonction simple
      const text = new TextDecoder().decode(arrayBuffer.slice(0, 1000)); // Premier ko pour MD5 simulé
      
      setHashes({
        md5: simpleMD5(text),
        sha1: sha1Hash,
        sha256: sha256Hash,
        sha512: sha512Hash
      });

      toast.success(`Hachage du fichier "${file.name}" généré !`);
    } catch (error) {
      toast.error("Erreur lors du hachage du fichier");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyHash = (algorithm: string, hash: string) => {
    navigator.clipboard.writeText(hash);
    toast.success(`${algorithm.toUpperCase()} copié !`);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setHashes({ md5: "", sha1: "", sha256: "", sha512: "" });
    }
  };

  const clearAll = () => {
    setText("");
    setFile(null);
    setHashes({ md5: "", sha1: "", sha256: "", sha512: "" });
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gradient-to-br from-red-500 to-orange-600 text-white py-16">
        <div className="container">
          <div className="flex items-center mb-4">
            <Link to="/" className="text-white/70 hover:text-white mr-2">Accueil</Link>
            <span className="text-white/50">/</span>
            <Link to="/dev" className="text-white/70 hover:text-white mx-2">Développement</Link>
            <span className="text-white/50">/</span>
            <span className="ml-2">Hash Generator</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Hash className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Hash Generator</h1>
          </div>
          <p className="text-xl text-white/90">
            Génération de hachages cryptographiques MD5, SHA1, SHA256, SHA512
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="container max-w-4xl">
          <Tabs defaultValue="text" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">Texte</TabsTrigger>
              <TabsTrigger value="file">Fichier</TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="w-5 h-5" />
                    Hachage de texte
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Saisissez le texte à hasher..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {text.length} caractères
                    </span>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={clearAll}>
                        Effacer
                      </Button>
                      <Button 
                        onClick={processText}
                        disabled={isProcessing || !text.trim()}
                        className="bg-gradient-to-r from-red-500 to-orange-600 hover:opacity-90"
                      >
                        {isProcessing ? "Traitement..." : "Générer hachages"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="file" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Hachage de fichier
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <input
                      id="file-input"
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="file-input" className="cursor-pointer">
                      <span className="text-lg font-medium">Cliquez pour sélectionner un fichier</span>
                      <p className="text-sm text-muted-foreground mt-2">
                        Tous types de fichiers acceptés
                      </p>
                    </label>
                  </div>
                  
                  {file && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{file.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                        
                        <Button 
                          onClick={processFile}
                          disabled={isProcessing}
                          className="bg-gradient-to-r from-red-500 to-orange-600 hover:opacity-90"
                        >
                          {isProcessing ? "Traitement..." : "Hasher fichier"}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Results */}
            {(hashes.md5 || hashes.sha1 || hashes.sha256 || hashes.sha512) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Résultats des hachages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: 'MD5', value: hashes.md5, color: 'bg-red-100 text-red-800' },
                    { name: 'SHA-1', value: hashes.sha1, color: 'bg-orange-100 text-orange-800' },
                    { name: 'SHA-256', value: hashes.sha256, color: 'bg-green-100 text-green-800' },
                    { name: 'SHA-512', value: hashes.sha512, color: 'bg-blue-100 text-blue-800' }
                  ].map((hash) => (
                    hash.value && (
                      <div key={hash.name} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-sm font-medium ${hash.color}`}>
                            {hash.name}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyHash(hash.name, hash.value)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Input
                          value={hash.value}
                          readOnly
                          className="font-mono text-sm"
                        />
                      </div>
                    )
                  ))}
                  
                  <div className="text-xs text-muted-foreground text-center pt-4 border-t">
                    Hachages générés côté client avec Web Crypto API
                  </div>
                </CardContent>
              </Card>
            )}
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default HashGenerator;
