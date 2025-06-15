
import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Copy, Globe, Languages, BarChart3 } from "lucide-react";
import { toast } from "sonner";

const LanguageDetector = () => {
  const [text, setText] = useState("");
  const [results, setResults] = useState<Array<{
    language: string;
    code: string;
    confidence: number;
    native: string;
  }>>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Simulateur de détection de langue basé sur des patterns simples
  const detectLanguage = async (inputText: string) => {
    setIsAnalyzing(true);
    
    // Simulation d'une analyse
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const patterns = {
      'fr': {
        patterns: ['le ', 'la ', 'les ', 'de ', 'et ', 'à ', 'un ', 'une ', 'ce ', 'que '],
        name: 'Français',
        native: 'Français'
      },
      'en': {
        patterns: ['the ', 'and ', 'to ', 'of ', 'a ', 'in ', 'is ', 'it ', 'you ', 'that '],
        name: 'English',
        native: 'English'
      },
      'es': {
        patterns: ['el ', 'la ', 'de ', 'que ', 'y ', 'en ', 'un ', 'es ', 'se ', 'no '],
        name: 'Español',
        native: 'Español'
      },
      'it': {
        patterns: ['il ', 'di ', 'che ', 'e ', 'la ', 'un ', 'a ', 'per ', 'non ', 'in '],
        name: 'Italiano',
        native: 'Italiano'
      },
      'de': {
        patterns: ['der ', 'die ', 'und ', 'in ', 'den ', 'von ', 'zu ', 'das ', 'mit ', 'sich '],
        name: 'Deutsch',
        native: 'Deutsch'
      }
    };
    
    const scores = {};
    const lowerText = inputText.toLowerCase();
    
    Object.entries(patterns).forEach(([code, { patterns: langPatterns }]) => {
      let score = 0;
      langPatterns.forEach(pattern => {
        const matches = (lowerText.match(new RegExp(pattern, 'g')) || []).length;
        score += matches;
      });
      scores[code] = score;
    });
    
    const totalScore = Object.values(scores).reduce((a: number, b: number) => a + b, 0);
    
    const detectionResults = Object.entries(scores)
      .map(([code, score]: [string, number]) => ({
        language: patterns[code].name,
        code: code.toUpperCase(),
        confidence: totalScore > 0 ? Math.round((score / totalScore) * 100) : 0,
        native: patterns[code].native
      }))
      .filter(result => result.confidence > 0)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);
    
    setResults(detectionResults);
    setIsAnalyzing(false);
    
    if (detectionResults.length > 0) {
      toast.success(`Langue détectée: ${detectionResults[0].language} (${detectionResults[0].confidence}%)`);
    } else {
      toast.error("Impossible de détecter la langue. Essayez avec plus de texte.");
    }
  };

  const handleAnalyze = () => {
    if (text.trim().length < 10) {
      toast.error("Veuillez saisir au moins 10 caractères pour une détection précise.");
      return;
    }
    detectLanguage(text);
  };

  const copyResult = (result: typeof results[0]) => {
    navigator.clipboard.writeText(`${result.language} (${result.code}) - ${result.confidence}%`);
    toast.success("Résultat copié !");
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
            <span className="ml-2">Language Detector</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Languages className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Language Detector</h1>
          </div>
          <p className="text-xl text-white/90">
            Détection automatique de langue avec analyse de probabilité
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="container max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Texte à analyser
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Collez votre texte ici pour détecter automatiquement la langue..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {text.length} caractères
                  </span>
                  
                  <Button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || text.trim().length < 10}
                    className="bg-gradient-text hover:opacity-90"
                  >
                    {isAnalyzing ? "Analyse..." : "Détecter la langue"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Résultats de détection
                </CardTitle>
              </CardHeader>
              <CardContent>
                {results.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Languages className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune analyse effectuée</p>
                    <p className="text-sm mt-2">Saisissez du texte et cliquez sur "Détecter"</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {results.map((result, index) => (
                      <div key={result.code} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Badge variant={index === 0 ? "default" : "secondary"}>
                              {result.code}
                            </Badge>
                            <div>
                              <div className="font-medium">{result.language}</div>
                              <div className="text-sm text-muted-foreground">{result.native}</div>
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyResult(result)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Confiance</span>
                            <span className="font-medium">{result.confidence}%</span>
                          </div>
                          <Progress value={result.confidence} className="h-2" />
                        </div>
                      </div>
                    ))}
                    
                    {results.length > 0 && (
                      <div className="text-xs text-muted-foreground text-center pt-4 border-t">
                        Détection basée sur l'analyse des patterns linguistiques
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LanguageDetector;
