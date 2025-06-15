
import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { GitCompare, Download, Copy, BarChart3 } from "lucide-react";
import { toast } from "sonner";

const TextComparison = () => {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [comparisonResult, setComparisonResult] = useState<{
    additions: string[];
    deletions: string[];
    differences: Array<{ type: 'add' | 'remove' | 'equal'; text: string }>;
    similarity: number;
    stats: {
      words1: number;
      words2: number;
      lines1: number;
      lines2: number;
      chars1: number;
      chars2: number;
    };
  } | null>(null);

  // Simple diff algorithm
  const calculateDiff = () => {
    if (!text1.trim() || !text2.trim()) {
      toast.error("Veuillez saisir les deux textes à comparer");
      return;
    }

    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const words1 = text1.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const words2 = text2.toLowerCase().split(/\s+/).filter(w => w.length > 0);

    // Calculate basic stats
    const stats = {
      words1: words1.length,
      words2: words2.length,
      lines1: lines1.length,
      lines2: lines2.length,
      chars1: text1.length,
      chars2: text2.length
    };

    // Simple word-based diff
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    
    const additions = Array.from(set2).filter(word => !set1.has(word));
    const deletions = Array.from(set1).filter(word => !set2.has(word));
    
    // Calculate similarity (Jaccard similarity)
    const intersection = Array.from(set1).filter(word => set2.has(word)).length;
    const union = set1.size + set2.size - intersection;
    const similarity = union > 0 ? (intersection / union) * 100 : 0;

    // Generate visual diff (simplified)
    const differences: Array<{ type: 'add' | 'remove' | 'equal'; text: string }> = [];
    
    const maxLines = Math.max(lines1.length, lines2.length);
    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';
      
      if (line1 === line2) {
        differences.push({ type: 'equal', text: line1 });
      } else {
        if (line1 && !line2) {
          differences.push({ type: 'remove', text: line1 });
        } else if (!line1 && line2) {
          differences.push({ type: 'add', text: line2 });
        } else {
          differences.push({ type: 'remove', text: line1 });
          differences.push({ type: 'add', text: line2 });
        }
      }
    }

    setComparisonResult({
      additions,
      deletions,
      differences,
      similarity,
      stats
    });

    toast.success("Comparaison terminée");
  };

  const exportReport = () => {
    if (!comparisonResult) {
      toast.error("Aucune comparaison à exporter");
      return;
    }

    const report = `# Rapport de Comparaison de Texte

## Statistiques
- Similarité: ${comparisonResult.similarity.toFixed(2)}%
- Texte 1: ${comparisonResult.stats.lines1} lignes, ${comparisonResult.stats.words1} mots, ${comparisonResult.stats.chars1} caractères
- Texte 2: ${comparisonResult.stats.lines2} lignes, ${comparisonResult.stats.words2} mots, ${comparisonResult.stats.chars2} caractères

## Mots ajoutés (${comparisonResult.additions.length})
${comparisonResult.additions.map(word => `- ${word}`).join('\n')}

## Mots supprimés (${comparisonResult.deletions.length})
${comparisonResult.deletions.map(word => `- ${word}`).join('\n')}

## Différences ligne par ligne
${comparisonResult.differences.map((diff, index) => {
  const prefix = diff.type === 'add' ? '+ ' : diff.type === 'remove' ? '- ' : '  ';
  return `${prefix}${diff.text}`;
}).join('\n')}
`;

    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'text-comparison-report.md';
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Rapport exporté");
  };

  const copyDiff = () => {
    if (!comparisonResult) return;
    
    const diffText = comparisonResult.differences.map(diff => {
      const prefix = diff.type === 'add' ? '+ ' : diff.type === 'remove' ? '- ' : '  ';
      return `${prefix}${diff.text}`;
    }).join('\n');
    
    navigator.clipboard.writeText(diffText);
    toast.success("Différences copiées");
  };

  const loadSampleTexts = () => {
    setText1(`The quick brown fox jumps over the lazy dog.
This is the first version of the text.
It contains some basic content.
With multiple lines and paragraphs.`);

    setText2(`The quick brown fox leaps over the lazy cat.
This is the second version of the text.
It contains some modified content.
With multiple lines and paragraphs.
And an additional line at the end.`);
  };

  const swapTexts = () => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
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
            <span className="ml-2">Text Comparison</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <GitCompare className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Text Comparison</h1>
          </div>
          <p className="text-xl text-white/90">
            Comparez des textes et visualisez les différences avec précision
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="container max-w-7xl">
          {/* Controls */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2">
                  <Button
                    onClick={loadSampleTexts}
                    variant="outline"
                    size="sm"
                  >
                    Charger exemple
                  </Button>
                  <Button
                    onClick={swapTexts}
                    variant="outline"
                    size="sm"
                  >
                    Inverser textes
                  </Button>
                  <Button
                    onClick={() => {
                      setText1("");
                      setText2("");
                      setComparisonResult(null);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Effacer tout
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={calculateDiff}
                    className="bg-gradient-text hover:opacity-90"
                    disabled={!text1.trim() || !text2.trim()}
                  >
                    <GitCompare className="w-4 h-4 mr-2" />
                    Comparer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Text Inputs */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Texte 1 (Original)</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={text1}
                  onChange={(e) => setText1(e.target.value)}
                  placeholder="Collez le premier texte ici..."
                  className="w-full h-64 p-4 border rounded-lg resize-none font-mono text-sm"
                />
                <div className="mt-2 text-sm text-gray-500">
                  {text1.split('\n').length} lignes, {text1.split(/\s+/).filter(w => w.length > 0).length} mots, {text1.length} caractères
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Texte 2 (Comparé)</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={text2}
                  onChange={(e) => setText2(e.target.value)}
                  placeholder="Collez le second texte ici..."
                  className="w-full h-64 p-4 border rounded-lg resize-none font-mono text-sm"
                />
                <div className="mt-2 text-sm text-gray-500">
                  {text2.split('\n').length} lignes, {text2.split(/\s+/).filter(w => w.length > 0).length} mots, {text2.length} caractères
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          {comparisonResult && (
            <div className="space-y-6">
              {/* Statistics */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Statistiques de comparaison
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        onClick={copyDiff}
                        size="sm"
                        variant="outline"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copier diff
                      </Button>
                      <Button
                        onClick={exportReport}
                        size="sm"
                        variant="outline"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Exporter rapport
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {comparisonResult.similarity.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Similarité</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {comparisonResult.additions.length}
                      </div>
                      <div className="text-sm text-gray-600">Mots ajoutés</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {comparisonResult.deletions.length}
                      </div>
                      <div className="text-sm text-gray-600">Mots supprimés</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-600">
                        {comparisonResult.differences.filter(d => d.type !== 'equal').length}
                      </div>
                      <div className="text-sm text-gray-600">Différences</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Word Changes */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600">Mots ajoutés</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {comparisonResult.additions.length > 0 ? (
                      <div className="max-h-32 overflow-y-auto">
                        <div className="flex flex-wrap gap-2">
                          {comparisonResult.additions.map((word, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                              +{word}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">Aucun mot ajouté</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">Mots supprimés</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {comparisonResult.deletions.length > 0 ? (
                      <div className="max-h-32 overflow-y-auto">
                        <div className="flex flex-wrap gap-2">
                          {comparisonResult.deletions.map((word, index) => (
                            <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                              -{word}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">Aucun mot supprimé</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Visual Diff */}
              <Card>
                <CardHeader>
                  <CardTitle>Différences ligne par ligne</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-96 overflow-y-auto bg-gray-50 p-4 rounded font-mono text-sm">
                    {comparisonResult.differences.map((diff, index) => (
                      <div
                        key={index}
                        className={`${
                          diff.type === 'add' ? 'bg-green-100 text-green-800' :
                          diff.type === 'remove' ? 'bg-red-100 text-red-800' :
                          'text-gray-700'
                        } px-2 py-1 whitespace-pre-wrap`}
                      >
                        <span className="mr-2">
                          {diff.type === 'add' ? '+' : diff.type === 'remove' ? '-' : ' '}
                        </span>
                        {diff.text}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TextComparison;
