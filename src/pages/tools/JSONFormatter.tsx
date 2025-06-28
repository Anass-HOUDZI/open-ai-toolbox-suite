
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ToolLayout } from "@/components/common/ToolLayout";
import { useClipboard } from "@/hooks/useClipboard";
import { CheckCircle, XCircle, Copy, Download, FileJson, Code } from "lucide-react";
import { toast } from "sonner";

const JSONFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState<string>("");
  const { copyToClipboard } = useClipboard();

  const formatJSON = () => {
    if (!input.trim()) {
      toast.error("Veuillez entrer du JSON à formater");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setIsValid(true);
      setError("");
      toast.success("JSON formaté avec succès !");
    } catch (err) {
      setIsValid(false);
      setOutput("");
      if (err instanceof Error) {
        setError(err.message);
        toast.error("JSON invalide : " + err.message);
      }
    }
  };

  const minifyJSON = () => {
    if (!input.trim()) {
      toast.error("Veuillez entrer du JSON à minifier");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setIsValid(true);
      setError("");
      toast.success("JSON minifié avec succès !");
    } catch (err) {
      setIsValid(false);
      setOutput("");
      if (err instanceof Error) {
        setError(err.message);
        toast.error("JSON invalide : " + err.message);
      }
    }
  };

  const validateJSON = () => {
    if (!input.trim()) {
      toast.error("Veuillez entrer du JSON à valider");
      return;
    }

    try {
      JSON.parse(input);
      setIsValid(true);
      setError("");
      toast.success("JSON valide !");
    } catch (err) {
      setIsValid(false);
      if (err instanceof Error) {
        setError(err.message);
        toast.error("JSON invalide : " + err.message);
      }
    }
  };

  const downloadJSON = () => {
    if (!output) {
      toast.error("Rien à télécharger");
      return;
    }

    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Fichier téléchargé !");
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setIsValid(null);
    setError("");
  };

  const loadSample = () => {
    const sample = {
      "name": "OpenToolsAI",
      "version": "1.0.0",
      "tools": [
        {
          "id": 1,
          "name": "JSON Formatter",
          "category": "development",
          "active": true
        },
        {
          "id": 2,
          "name": "Color Extractor", 
          "category": "visual",
          "active": true
        }
      ],
      "config": {
        "theme": "dark",
        "lang": "fr"
      }
    };
    setInput(JSON.stringify(sample, null, 2));
  };

  return (
    <ToolLayout
      title="JSON Formatter/Validator"
      description="Formatez, validez et minifiez vos données JSON facilement"
      icon={<FileJson className="w-8 h-8" />}
      category="Développement"
      categoryPath="/dev"
      gradientClass="bg-gradient-dev"
    >
      <div className="max-w-6xl mx-auto">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button onClick={formatJSON} className="bg-green-600 hover:bg-green-700">
            <Code className="w-4 h-4 mr-2" />
            Formater
          </Button>
          <Button onClick={minifyJSON} className="bg-blue-600 hover:bg-blue-700">
            Minifier
          </Button>
          <Button onClick={validateJSON} className="bg-purple-600 hover:bg-purple-700">
            <CheckCircle className="w-4 h-4 mr-2" />
            Valider
          </Button>
          <Button onClick={loadSample} variant="outline">
            Charger exemple
          </Button>
          <Button onClick={clearAll} variant="outline">
            Effacer tout
          </Button>
        </div>

        {/* Status Indicator */}
        {isValid !== null && (
          <div className={`flex items-center gap-2 p-4 rounded-lg mb-6 ${
            isValid ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {isValid ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">JSON valide</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5" />
                <span className="font-medium">JSON invalide</span>
                {error && <span className="ml-2">: {error}</span>}
              </>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson className="w-5 h-5" />
                JSON Input
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Collez votre JSON ici..."
                className="min-h-[400px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson className="w-5 h-5" />
                JSON Output
                {output && (
                  <div className="ml-auto flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(output)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copier
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={downloadJSON}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {output ? (
                <Textarea
                  value={output}
                  readOnly
                  className="min-h-[400px] font-mono text-sm bg-gray-50"
                />
              ) : (
                <div className="min-h-[400px] flex items-center justify-center text-gray-500 border border-gray-200 rounded-md">
                  <div className="text-center">
                    <FileJson className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Le JSON formaté apparaîtra ici</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Fonctionnalités</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">✨ Formatage</h4>
                <p className="text-gray-600">Indentation automatique avec 2 espaces pour une meilleure lisibilité</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">🗜️ Minification</h4>
                <p className="text-gray-600">Supprime les espaces et sauts de ligne pour réduire la taille</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">✅ Validation</h4>
                <p className="text-gray-600">Vérification syntaxe avec messages d'erreur détaillés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default JSONFormatter;
