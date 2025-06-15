
import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CheckCircle, AlertCircle, BookOpen, Wand2 } from "lucide-react";
import { toast } from "sonner";

const GrammarChecker = () => {
  const [text, setText] = useState("");
  const [checkedText, setCheckedText] = useState("");
  const [errors, setErrors] = useState<Array<{
    type: string;
    message: string;
    suggestion: string;
    position: { start: number; end: number };
  }>>([]);
  const [isChecking, setIsChecking] = useState(false);

  // Simple grammar/spelling rules for demonstration
  const grammarRules = [
    { pattern: /\bi\b/g, suggestion: "I", type: "capitalization", message: "Le pronom 'I' doit être en majuscule" },
    { pattern: /\b(their|there|they're)\b/g, suggestion: "their/there/they're", type: "spelling", message: "Vérifiez l'usage de their/there/they're" },
    { pattern: /\b(your|you're)\b/g, suggestion: "your/you're", type: "spelling", message: "Vérifiez l'usage de your/you're" },
    { pattern: /\b(its|it's)\b/g, suggestion: "its/it's", type: "spelling", message: "Vérifiez l'usage de its/it's" },
    { pattern: /\.\s+[a-z]/g, suggestion: "Majuscule", type: "capitalization", message: "Commencez les phrases par une majuscule" },
    { pattern: /\s{2,}/g, suggestion: " ", type: "spacing", message: "Espaces multiples détectés" },
    { pattern: /\bteh\b/g, suggestion: "the", type: "spelling", message: "Faute de frappe courante" },
    { pattern: /\brecieve\b/g, suggestion: "receive", type: "spelling", message: "Orthographe incorrecte" }
  ];

  const checkGrammar = () => {
    setIsChecking(true);
    
    setTimeout(() => {
      const foundErrors: typeof errors = [];
      let correctedText = text;

      grammarRules.forEach(rule => {
        let match;
        while ((match = rule.pattern.exec(text)) !== null) {
          foundErrors.push({
            type: rule.type,
            message: rule.message,
            suggestion: rule.suggestion,
            position: { start: match.index, end: match.index + match[0].length }
          });
        }
        correctedText = correctedText.replace(rule.pattern, rule.suggestion);
      });

      setErrors(foundErrors);
      setCheckedText(correctedText);
      setIsChecking(false);
      
      if (foundErrors.length === 0) {
        toast.success("Aucune erreur détectée !");
      } else {
        toast.info(`${foundErrors.length} erreur(s) détectée(s)`);
      }
    }, 1500);
  };

  const applySuggestion = (index: number) => {
    const error = errors[index];
    const newText = text.substring(0, error.position.start) + 
                   error.suggestion + 
                   text.substring(error.position.end);
    setText(newText);
    
    // Remove the applied error
    setErrors(errors.filter((_, i) => i !== index));
    toast.success("Correction appliquée !");
  };

  const getErrorTypeIcon = (type: string) => {
    switch (type) {
      case "spelling": return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "grammar": return <BookOpen className="w-4 h-4 text-orange-500" />;
      case "capitalization": return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gradient-text text-white py-16">
        <div className="container">
          <div className="flex items-center mb-4">
            <Link to="/" className="text-white/70 hover:text-white mr-2">Accueil</Link>
            <span className="text-white/50">/</span>
            <Link to="/text" className="text-white/70 hover:text-white mx-2">Traitement Texte</Link>
            <span className="text-white/50">/</span>
            <span className="ml-2">Grammar Checker</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Grammar Checker</h1>
          </div>
          <p className="text-xl text-white/90">
            Vérifiez et corrigez automatiquement la grammaire et l'orthographe
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input */}
            <Card>
              <CardHeader>
                <CardTitle>Texte à vérifier</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Tapez ou collez votre texte ici..."
                  className="w-full h-64 p-4 border rounded-lg resize-none"
                />
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">
                    {text.length} caractères
                  </span>
                  <Button 
                    onClick={checkGrammar} 
                    disabled={!text.trim() || isChecking}
                    className="bg-gradient-text hover:opacity-90"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    {isChecking ? "Vérification..." : "Vérifier"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle>Résultats de la vérification</CardTitle>
              </CardHeader>
              <CardContent>
                {errors.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {errors.map((error, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-start gap-2">
                          {getErrorTypeIcon(error.type)}
                          <div className="flex-1">
                            <p className="font-medium capitalize">{error.type}</p>
                            <p className="text-sm text-gray-600">{error.message}</p>
                            <p className="text-sm mt-1">
                              <span className="text-gray-500">Suggestion:</span>
                              <span className="font-medium ml-1">{error.suggestion}</span>
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => applySuggestion(index)}
                            variant="outline"
                          >
                            Appliquer
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : text && !isChecking ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-medium">Excellent !</p>
                    <p className="text-gray-600">Aucune erreur détectée dans votre texte.</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-4" />
                    <p>Les erreurs détectées apparaîtront ici</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Corrected Text */}
          {checkedText && errors.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Texte corrigé</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="whitespace-pre-wrap">{checkedText}</p>
                </div>
                <Button 
                  onClick={() => navigator.clipboard.writeText(checkedText)}
                  className="mt-4"
                  variant="outline"
                >
                  Copier le texte corrigé
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};

export default GrammarChecker;
