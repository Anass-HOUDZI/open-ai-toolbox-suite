
import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, TestTube, BookOpen, Zap } from "lucide-react";
import { toast } from "sonner";

const RegexTester = () => {
  const [pattern, setPattern] = useState("");
  const [testString, setTestString] = useState("");
  const [flags, setFlags] = useState({
    global: true,
    ignoreCase: false,
    multiline: false,
    dotAll: false,
    unicode: false,
    sticky: false
  });

  const regexResult = useMemo(() => {
    if (!pattern || !testString) return null;

    try {
      const flagString = Object.entries(flags)
        .filter(([_, enabled]) => enabled)
        .map(([flag]) => {
          switch (flag) {
            case 'global': return 'g';
            case 'ignoreCase': return 'i';
            case 'multiline': return 'm';
            case 'dotAll': return 's';
            case 'unicode': return 'u';
            case 'sticky': return 'y';
            default: return '';
          }
        })
        .join('');

      const regex = new RegExp(pattern, flagString);
      const matches = Array.from(testString.matchAll(regex));
      
      return {
        isValid: true,
        matches,
        isMatch: regex.test(testString),
        regex: regex.toString()
      };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        matches: [],
        isMatch: false,
        regex: ''
      };
    }
  }, [pattern, testString, flags]);

  const highlightMatches = (text: string, matches: RegExpMatchArray[]) => {
    if (!matches.length) return text;

    let result = text;
    let offset = 0;

    matches.forEach((match, index) => {
      if (match.index !== undefined) {
        const start = match.index + offset;
        const end = start + match[0].length;
        const highlightedMatch = `<mark class="bg-yellow-300 px-1 rounded">${match[0]}</mark>`;
        
        result = result.slice(0, start) + highlightedMatch + result.slice(end);
        offset += highlightedMatch.length - match[0].length;
      }
    });

    return result;
  };

  const commonPatterns = [
    { name: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" },
    { name: "URL", pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)" },
    { name: "Téléphone FR", pattern: "0[1-9](?:[0-9]{8})" },
    { name: "Code postal FR", pattern: "(?:0[1-9]|[1-8]\\d|9[0-8])\\d{3}" },
    { name: "Mot de passe fort", pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$" },
    { name: "IPv4", pattern: "\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b" },
    { name: "Hexadecimal", pattern: "^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$" },
    { name: "Date (DD/MM/YYYY)", pattern: "^(0[1-9]|[12][0-9]|3[01])\\/(0[1-9]|1[012])\\/\\d{4}$" }
  ];

  const loadPattern = (patternData: { name: string; pattern: string }) => {
    setPattern(patternData.pattern);
    toast.success(`Pattern "${patternData.name}" chargé`);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié dans le presse-papier`);
  };

  const loadSampleText = () => {
    const sample = `Voici quelques exemples de données à tester :
Email: john.doe@example.com, jane_smith@test.org
Téléphones: 0123456789, 0698765432
URLs: https://www.example.com, http://test.fr/page?param=value
Codes postaux: 75001, 69000, 13001
Dates: 15/03/2024, 01/12/2023
Couleurs hex: #FF5733, #00FF00, #123ABC`;
    
    setTestString(sample);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gradient-dev text-white py-16">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">🔧 Regex Tester</h1>
          <p className="text-xl text-white/90">
            Testez et debuggez vos expressions régulières en temps réel
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="w-5 h-5" />
                  Expression régulière
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Input
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    placeholder="Entrez votre regex ici..."
                    className="font-mono text-lg"
                  />
                  
                  {regexResult && (
                    <div className="flex items-center gap-4">
                      <span className={`text-sm px-2 py-1 rounded ${
                        regexResult.isValid 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {regexResult.isValid ? '✓ Valide' : '✗ Invalide'}
                      </span>
                      {regexResult.isValid && (
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {regexResult.regex}
                        </code>
                      )}
                    </div>
                  )}

                  {regexResult && !regexResult.isValid && (
                    <div className="text-red-600 text-sm">
                      Erreur: {regexResult.error}
                    </div>
                  )}
                </div>

                {/* Flags */}
                <div>
                  <h4 className="font-medium mb-3">Options (flags)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="global" 
                        checked={flags.global}
                        onCheckedChange={(checked) => setFlags(prev => ({ ...prev, global: !!checked }))}
                      />
                      <label htmlFor="global" className="text-sm">Global (g)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="ignoreCase" 
                        checked={flags.ignoreCase}
                        onCheckedChange={(checked) => setFlags(prev => ({ ...prev, ignoreCase: !!checked }))}
                      />
                      <label htmlFor="ignoreCase" className="text-sm">Ignore case (i)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="multiline" 
                        checked={flags.multiline}
                        onCheckedChange={(checked) => setFlags(prev => ({ ...prev, multiline: !!checked }))}
                      />
                      <label htmlFor="multiline" className="text-sm">Multiline (m)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="dotAll" 
                        checked={flags.dotAll}
                        onCheckedChange={(checked) => setFlags(prev => ({ ...prev, dotAll: !!checked }))}
                      />
                      <label htmlFor="dotAll" className="text-sm">Dot all (s)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="unicode" 
                        checked={flags.unicode}
                        onCheckedChange={(checked) => setFlags(prev => ({ ...prev, unicode: !!checked }))}
                      />
                      <label htmlFor="unicode" className="text-sm">Unicode (u)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="sticky" 
                        checked={flags.sticky}
                        onCheckedChange={(checked) => setFlags(prev => ({ ...prev, sticky: !!checked }))}
                      />
                      <label htmlFor="sticky" className="text-sm">Sticky (y)</label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Texte de test
                  <Button size="sm" onClick={loadSampleText} variant="outline">
                    Charger exemple
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  placeholder="Entrez le texte à tester..."
                  className="min-h-[200px] font-mono text-sm"
                />
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle>Résultats</CardTitle>
              </CardHeader>
              <CardContent>
                {regexResult && regexResult.isValid ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded text-sm font-medium ${
                        regexResult.isMatch 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {regexResult.isMatch ? 'Correspondance trouvée' : 'Aucune correspondance'}
                      </span>
                      <span className="text-sm text-gray-600">
                        {regexResult.matches.length} résultat(s)
                      </span>
                    </div>

                    {regexResult.matches.length > 0 && (
                      <div className="space-y-3">
                        <div 
                          className="p-4 bg-gray-50 rounded-lg font-mono text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: highlightMatches(testString, regexResult.matches)
                          }}
                        />

                        <div className="space-y-2">
                          <h4 className="font-medium">Détails des correspondances :</h4>
                          {regexResult.matches.map((match, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded border">
                              <div>
                                <span className="font-mono font-bold">{match[0]}</span>
                                <span className="text-sm text-gray-600 ml-2">
                                  Position: {match.index} - {(match.index || 0) + match[0].length - 1}
                                </span>
                              </div>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => copyToClipboard(match[0], 'Correspondance')}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <TestTube className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Entrez une regex et du texte pour voir les résultats</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Patterns Library */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Patterns courants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {commonPatterns.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => loadPattern(item)}
                      className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border text-sm transition-colors"
                    >
                      <div className="font-medium">{item.name}</div>
                      <code className="text-xs text-gray-600 break-all">
                        {item.pattern.slice(0, 40)}{item.pattern.length > 40 ? '...' : ''}
                      </code>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Aide rapide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium mb-1">Caractères spéciaux</h4>
                    <code className="text-xs">. * + ? ^ $ | \ [ ] { } ( )</code>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Classes</h4>
                    <div className="space-y-1 text-xs">
                      <div><code>\d</code> - Chiffres (0-9)</div>
                      <div><code>\w</code> - Mots (a-z, A-Z, 0-9, _)</div>
                      <div><code>\s</code> - Espaces</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Quantificateurs</h4>
                    <div className="space-y-1 text-xs">
                      <div><code>*</code> - 0 ou plus</div>
                      <div><code>+</code> - 1 ou plus</div>
                      <div><code>?</code> - 0 ou 1</div>
                      <div><code>{`{n,m}`}</code> - Entre n et m</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegexTester;
