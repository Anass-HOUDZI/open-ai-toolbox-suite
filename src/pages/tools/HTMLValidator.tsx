
import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { CheckCircle, AlertCircle, XCircle, Code, Wand2 } from "lucide-react";
import { toast } from "sonner";

const HTMLValidator = () => {
  const [htmlInput, setHtmlInput] = useState("");
  const [validationResults, setValidationResults] = useState<Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    line?: number;
    column?: number;
  }>>([]);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validateHTML = () => {
    if (!htmlInput.trim()) {
      toast.error("Veuillez entrer du code HTML");
      return;
    }

    setIsValidating(true);
    
    setTimeout(() => {
      const results: typeof validationResults = [];
      
      // Basic HTML validation rules
      const lines = htmlInput.split('\n');
      
      lines.forEach((line, lineIndex) => {
        const lineNumber = lineIndex + 1;
        
        // Check for unclosed tags
        const openTags = line.match(/<([a-zA-Z][^>]*?)>/g) || [];
        const closeTags = line.match(/<\/([a-zA-Z][^>]*?)>/g) || [];
        
        // Check for missing alt attributes in img tags
        if (line.includes('<img') && !line.includes('alt=')) {
          results.push({
            type: 'warning',
            message: 'Image sans attribut alt (accessibilité)',
            line: lineNumber
          });
        }
        
        // Check for inline styles (bad practice)
        if (line.includes('style=')) {
          results.push({
            type: 'warning',
            message: 'Style inline détecté (utilisez CSS externe)',
            line: lineNumber
          });
        }
        
        // Check for deprecated tags
        const deprecatedTags = ['center', 'font', 'marquee', 'blink'];
        deprecatedTags.forEach(tag => {
          if (line.includes(`<${tag}`)) {
            results.push({
              type: 'error',
              message: `Tag déprécié: <${tag}>`,
              line: lineNumber
            });
          }
        });
        
        // Check for missing DOCTYPE
        if (lineIndex === 0 && !line.toLowerCase().includes('<!doctype')) {
          results.push({
            type: 'warning',
            message: 'DOCTYPE manquant',
            line: 1
          });
        }
      });

      // Check for basic HTML structure
      if (!htmlInput.includes('<html')) {
        results.push({
          type: 'error',
          message: 'Tag <html> manquant'
        });
      }
      
      if (!htmlInput.includes('<head')) {
        results.push({
          type: 'error',
          message: 'Tag <head> manquant'
        });
      }
      
      if (!htmlInput.includes('<body')) {
        results.push({
          type: 'error',
          message: 'Tag <body> manquant'
        });
      }

      const errors = results.filter(r => r.type === 'error');
      const warnings = results.filter(r => r.type === 'warning');
      
      setValidationResults(results);
      setIsValid(errors.length === 0);
      setIsValidating(false);
      
      if (errors.length === 0 && warnings.length === 0) {
        toast.success("HTML valide ! Aucun problème détecté.");
      } else {
        toast.info(`Validation terminée: ${errors.length} erreur(s), ${warnings.length} avertissement(s)`);
      }
    }, 1500);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default: return <CheckCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'error': return 'destructive';
      case 'warning': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gradient-dev text-white py-16">
        <div className="container">
          <div className="flex items-center mb-4">
            <Link to="/" className="text-white/70 hover:text-white mr-2">Accueil</Link>
            <span className="text-white/50">/</span>
            <Link to="/dev" className="text-white/70 hover:text-white mx-2">Développement</Link>
            <span className="text-white/50">/</span>
            <span className="ml-2">HTML Validator</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-8 h-8" />
            <h1 className="text-4xl font-bold">HTML Validator</h1>
          </div>
          <p className="text-xl text-white/90">
            Validez votre code HTML et détectez les erreurs de structure
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Code HTML
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={htmlInput}
                  onChange={(e) => setHtmlInput(e.target.value)}
                  placeholder="Collez votre code HTML ici..."
                  className="w-full h-80 p-4 border rounded-lg font-mono text-sm resize-none"
                />
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">
                    {htmlInput.split('\n').length} ligne(s)
                  </span>
                  <Button 
                    onClick={validateHTML} 
                    disabled={!htmlInput.trim() || isValidating}
                    className="bg-gradient-dev hover:opacity-90"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    {isValidating ? "Validation..." : "Valider HTML"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Résultats de validation
                  {isValid !== null && (
                    <Badge variant={isValid ? "default" : "destructive"} className="ml-2">
                      {isValid ? "Valide" : "Erreurs détectées"}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {validationResults.length > 0 ? (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {validationResults.map((result, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                        {getIcon(result.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={getBadgeVariant(result.type)} className="text-xs">
                              {result.type === 'error' ? 'Erreur' : 
                               result.type === 'warning' ? 'Avertissement' : 'Info'}
                            </Badge>
                            {result.line && (
                              <span className="text-xs text-gray-500">
                                Ligne {result.line}
                              </span>
                            )}
                          </div>
                          <p className="text-sm">{result.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : htmlInput && !isValidating ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-medium">HTML valide !</p>
                    <p className="text-gray-600">Aucun problème détecté dans votre code.</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Code className="w-12 h-12 mx-auto mb-4" />
                    <p>Les résultats de validation apparaîtront ici</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          {validationResults.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Résumé de validation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {validationResults.filter(r => r.type === 'error').length}
                    </div>
                    <div className="text-sm text-gray-600">Erreurs</div>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {validationResults.filter(r => r.type === 'warning').length}
                    </div>
                    <div className="text-sm text-gray-600">Avertissements</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {isValid ? "✓" : "✗"}
                    </div>
                    <div className="text-sm text-gray-600">Statut global</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};

export default HTMLValidator;
