
import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3, Download, Filter } from "lucide-react";
import { toast } from "sonner";

const WordFrequencyAnalyzer = () => {
  const [text, setText] = useState("");
  const [wordFrequency, setWordFrequency] = useState<Array<{ word: string; count: number; percentage: number }>>([]);
  const [minLength, setMinLength] = useState(3);
  const [excludeCommon, setExcludeCommon] = useState(true);
  const [showTop, setShowTop] = useState(20);

  const commonWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with',
    'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if',
    'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just',
    'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see',
    'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back',
    'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want',
    'because', 'any', 'these', 'give', 'day', 'most', 'us'
  ]);

  const analyzeText = () => {
    if (!text.trim()) {
      toast.error("Veuillez saisir du texte à analyser");
      return;
    }

    // Clean and split text into words
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => {
        if (word.length < minLength) return false;
        if (excludeCommon && commonWords.has(word)) return false;
        return true;
      });

    // Count word frequency
    const frequency: { [key: string]: number } = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    // Convert to array and sort
    const totalWords = words.length;
    const frequencyArray = Object.entries(frequency)
      .map(([word, count]) => ({
        word,
        count,
        percentage: (count / totalWords) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, showTop);

    setWordFrequency(frequencyArray);
    toast.success(`Analyse terminée ! ${frequencyArray.length} mots analysés`);
  };

  const exportData = () => {
    if (wordFrequency.length === 0) {
      toast.error("Aucune donnée à exporter");
      return;
    }

    const csv = [
      'Mot,Fréquence,Pourcentage',
      ...wordFrequency.map(item => `${item.word},${item.count},${item.percentage.toFixed(2)}%`)
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'word-frequency-analysis.csv';
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Données exportées en CSV");
  };

  const sampleTexts = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "To be or not to be, that is the question. Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune.",
    "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness."
  ];

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
            <span className="ml-2">Word Frequency Analyzer</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Word Frequency Analyzer</h1>
          </div>
          <p className="text-xl text-white/90">
            Analysez la fréquence des mots dans vos textes avec visualisations
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="container max-w-6xl">
          <div className="grid gap-8">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle>Texte à analyser</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Tapez ou collez votre texte ici..."
                  className="w-full h-32 p-4 border rounded-lg resize-none"
                />
                
                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-2">
                    {sampleTexts.map((sample, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant="outline"
                        onClick={() => setText(sample)}
                      >
                        Exemple {index + 1}
                      </Button>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {text.split(/\s+/).filter(w => w.length > 0).length} mots
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Paramètres
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Longueur minimum: {minLength} lettres
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      value={minLength}
                      onChange={(e) => setMinLength(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Mots à afficher: {showTop}
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="50"
                      value={showTop}
                      onChange={(e) => setShowTop(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={excludeCommon}
                        onChange={(e) => setExcludeCommon(e.target.checked)}
                      />
                      <span className="text-sm">Exclure les mots courants</span>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={analyzeText}
                      className="w-full bg-gradient-text hover:opacity-90"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analyser
                    </Button>
                    
                    <Button
                      onClick={exportData}
                      variant="outline"
                      className="w-full"
                      disabled={wordFrequency.length === 0}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Exporter CSV
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Statistiques</CardTitle>
                </CardHeader>
                <CardContent>
                  {wordFrequency.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{wordFrequency.length}</div>
                        <div className="text-sm text-gray-600">Mots uniques</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {wordFrequency.reduce((sum, item) => sum + item.count, 0)}
                        </div>
                        <div className="text-sm text-gray-600">Total mots</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {wordFrequency[0]?.word || '-'}
                        </div>
                        <div className="text-sm text-gray-600">Plus fréquent</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {wordFrequency[0]?.count || 0}
                        </div>
                        <div className="text-sm text-gray-600">Occurrences max</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4" />
                      <p>Les statistiques apparaîtront après l'analyse</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Chart */}
            {wordFrequency.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Graphique de fréquence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={wordFrequency.slice(0, 15)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="word" 
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number, name: string) => [
                            name === 'count' ? `${value} occurrences` : `${value.toFixed(1)}%`,
                            name === 'count' ? 'Fréquence' : 'Pourcentage'
                          ]}
                        />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Word List */}
            {wordFrequency.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Liste détaillée</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-64 overflow-y-auto">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-white">
                        <tr className="border-b">
                          <th className="text-left p-2">Rang</th>
                          <th className="text-left p-2">Mot</th>
                          <th className="text-left p-2">Fréquence</th>
                          <th className="text-left p-2">Pourcentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wordFrequency.map((item, index) => (
                          <tr key={item.word} className="border-b hover:bg-gray-50">
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2 font-medium">{item.word}</td>
                            <td className="p-2">{item.count}</td>
                            <td className="p-2">{item.percentage.toFixed(2)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default WordFrequencyAnalyzer;
