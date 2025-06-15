
import { useState } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Copy, FileText, Zap, BarChart3 } from "lucide-react";
import { toast } from "sonner";

const TextSummarizer = () => {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [summaryLength, setSummaryLength] = useState([30]);
  const [isProcessing, setIsProcessing] = useState(false);

  const extractKeywords = (text: string): string[] => {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const stopWords = ['que', 'qui', 'quoi', 'dont', 'pour', 'dans', 'avec', 'sans', 'sous', 'sur', 'vers', 'chez'];
    const filteredWords = words.filter(word => !stopWords.includes(word));
    
    const wordFreq: { [key: string]: number } = {};
    filteredWords.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    
    return Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  };

  const scoresentences = (sentences: string[], keywords: string[]): { sentence: string; score: number }[] => {
    return sentences.map(sentence => {
      const words = sentence.toLowerCase().split(/\s+/);
      const score = keywords.reduce((acc, keyword) => {
        return acc + (words.includes(keyword) ? 1 : 0);
      }, 0);
      
      return { sentence: sentence.trim(), score };
    });
  };

  const summarizeText = () => {
    if (!inputText.trim()) {
      toast.error("Veuillez entrer du texte à résumer");
      return;
    }

    setIsProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      try {
        // Split into sentences
        const sentences = inputText
          .split(/[.!?]+/)
          .filter(s => s.trim().length > 10);

        if (sentences.length < 2) {
          toast.error("Le texte doit contenir au moins 2 phrases");
          setIsProcessing(false);
          return;
        }

        // Extract keywords
        const keywords = extractKeywords(inputText);

        // Score sentences
        const scoredSentences = scoresentences(sentences, keywords);

        // Calculate number of sentences for summary
        const targetLength = Math.max(1, Math.floor(sentences.length * summaryLength[0] / 100));

        // Select top sentences
        const topSentences = scoredSentences
          .sort((a, b) => b.score - a.score)
          .slice(0, targetLength)
          .sort((a, b) => inputText.indexOf(a.sentence) - inputText.indexOf(b.sentence))
          .map(item => item.sentence);

        const result = topSentences.join('. ') + '.';
        setSummary(result);
        setIsProcessing(false);
        
        toast.success(`Résumé généré ! ${topSentences.length} phrases sélectionnées.`);
      } catch (error) {
        console.error('Error summarizing text:', error);
        toast.error("Erreur lors du résumé du texte");
        setIsProcessing(false);
      }
    }, 1000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copié dans le presse-papier");
  };

  const loadSample = () => {
    const sample = `L'intelligence artificielle (IA) est une technologie révolutionnaire qui transforme notre monde. Elle permet aux machines d'apprendre, de raisonner et de prendre des décisions comme les humains. Les applications de l'IA sont vastes et touchent de nombreux domaines.

Dans le secteur de la santé, l'IA aide à diagnostiquer des maladies plus rapidement et avec plus de précision. Les algorithmes peuvent analyser des images médicales et détecter des anomalies que l'œil humain pourrait manquer.

L'industrie automobile utilise l'IA pour développer des véhicules autonomes. Ces voitures peuvent naviguer dans le trafic, éviter les obstacles et prendre des décisions en temps réel pour assurer la sécurité des passagers.

En finance, l'IA détecte les fraudes, analyse les risques et optimise les investissements. Les banques utilisent des chatbots intelligents pour améliorer le service client et réduire les coûts opérationnels.

L'éducation bénéficie également de l'IA avec des systèmes de tutorat personnalisés qui s'adaptent au rythme d'apprentissage de chaque étudiant. Cette personnalisation améliore l'efficacité de l'enseignement.

Cependant, l'IA soulève aussi des questions éthiques importantes. Il faut s'assurer que ces technologies sont développées de manière responsable et équitable pour tous.`;
    
    setInputText(sample);
  };

  const wordCount = inputText.trim().split(/\s+/).filter(word => word.length > 0).length;
  const summaryWordCount = summary.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gradient-text text-white py-16">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">📝 Text Summarizer</h1>
          <p className="text-xl text-white/90">
            Générez automatiquement des résumés intelligents de vos textes longs
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Paramètres de résumé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Longueur du résumé: {summaryLength[0]}% du texte original
                </label>
                <Slider
                  value={summaryLength}
                  onValueChange={setSummaryLength}
                  max={70}
                  min={10}
                  step={5}
                  className="w-full"
                />
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={summarizeText} 
                  disabled={isProcessing || !inputText.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Générer résumé
                    </>
                  )}
                </Button>
                <Button onClick={loadSample} variant="outline">
                  Charger exemple
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Texte original
                {wordCount > 0 && (
                  <span className="ml-auto text-sm font-normal text-gray-500">
                    {wordCount} mots
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Collez votre texte ici (minimum 50 mots recommandé)..."
                className="min-h-[400px] text-sm"
              />
            </CardContent>
          </Card>

          {/* Summary Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Résumé généré
                {summaryWordCount > 0 && (
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-sm font-normal text-gray-500">
                      {summaryWordCount} mots
                    </span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(summary)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copier
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {summary ? (
                <div className="space-y-4">
                  <Textarea
                    value={summary}
                    readOnly
                    className="min-h-[300px] text-sm bg-gray-50"
                  />
                  
                  {/* Statistics */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {((summaryWordCount / wordCount) * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-blue-700">Réduction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {wordCount - summaryWordCount}
                      </div>
                      <div className="text-sm text-blue-700">Mots économisés</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="min-h-[400px] flex items-center justify-center text-gray-500 border border-gray-200 rounded-md">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Le résumé apparaîtra ici après génération</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Comment ça fonctionne ?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">🔍 Analyse</h4>
                <p className="text-gray-600">Extraction des mots-clés les plus fréquents et significatifs du texte</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">📊 Scoring</h4>
                <p className="text-gray-600">Attribution d'un score à chaque phrase selon sa pertinence</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">✨ Sélection</h4>
                <p className="text-gray-600">Choix des meilleures phrases pour créer un résumé cohérent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TextSummarizer;
