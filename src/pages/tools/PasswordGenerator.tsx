
import { useState } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Copy, Refresh, Key, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const PasswordGenerator = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState([16]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [customChars, setCustomChars] = useState("");
  const [passwordHistory, setPasswordHistory] = useState<string[]>([]);

  const calculateStrength = (pwd: string) => {
    let score = 0;
    let feedback = [];

    // Length scoring
    if (pwd.length >= 12) score += 25;
    else if (pwd.length >= 8) score += 15;
    else feedback.push("Utilisez au moins 12 caractères");

    // Character variety
    if (/[a-z]/.test(pwd)) score += 15;
    else feedback.push("Ajoutez des lettres minuscules");
    
    if (/[A-Z]/.test(pwd)) score += 15;
    else feedback.push("Ajoutez des lettres majuscules");
    
    if (/[0-9]/.test(pwd)) score += 15;
    else feedback.push("Ajoutez des chiffres");
    
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 30;
    else feedback.push("Ajoutez des symboles spéciaux");

    // Pattern detection
    if (!/(.)\1{2,}/.test(pwd)) score += 10; // No repeated chars
    if (!/123|abc|qwe/i.test(pwd)) score += 10; // No common sequences

    const strength = score >= 90 ? "Très Fort" : 
                    score >= 70 ? "Fort" : 
                    score >= 50 ? "Moyen" : "Faible";
    
    const color = score >= 90 ? "text-green-600" : 
                 score >= 70 ? "text-blue-600" : 
                 score >= 50 ? "text-yellow-600" : "text-red-600";

    return { score, strength, color, feedback };
  };

  const generatePassword = () => {
    let charset = "";
    
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (customChars) charset += customChars;

    if (excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, "");
    }

    if (!charset) {
      toast.error("Sélectionnez au moins un type de caractère");
      return;
    }

    let newPassword = "";
    const array = new Uint32Array(length[0]);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length[0]; i++) {
      newPassword += charset[array[i] % charset.length];
    }

    setPassword(newPassword);
    setPasswordHistory(prev => [newPassword, ...prev.slice(0, 9)]);
    toast.success("Mot de passe généré !");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copié dans le presse-papier");
  };

  const clearHistory = () => {
    setPasswordHistory([]);
    toast.success("Historique effacé");
  };

  const strength = password ? calculateStrength(password) : null;

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gradient-to-br from-red-500 to-orange-600 text-white py-16">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">🔐 Password Generator</h1>
          <p className="text-xl text-white/90">
            Générez des mots de passe sécurisés avec analyse de force en temps réel
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Generator Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Longueur: {length[0]} caractères
                  </label>
                  <Slider
                    value={length}
                    onValueChange={setLength}
                    max={64}
                    min={4}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="uppercase" 
                      checked={includeUppercase}
                      onCheckedChange={setIncludeUppercase}
                    />
                    <label htmlFor="uppercase" className="text-sm">Majuscules (A-Z)</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="lowercase" 
                      checked={includeLowercase}
                      onCheckedChange={setIncludeLowercase}
                    />
                    <label htmlFor="lowercase" className="text-sm">Minuscules (a-z)</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="numbers" 
                      checked={includeNumbers}
                      onCheckedChange={setIncludeNumbers}
                    />
                    <label htmlFor="numbers" className="text-sm">Chiffres (0-9)</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="symbols" 
                      checked={includeSymbols}
                      onCheckedChange={setIncludeSymbols}
                    />
                    <label htmlFor="symbols" className="text-sm">Symboles (!@#$%...)</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="exclude" 
                      checked={excludeSimilar}
                      onCheckedChange={setExcludeSimilar}
                    />
                    <label htmlFor="exclude" className="text-sm">Exclure caractères similaires (i, l, 1, L, o, 0, O)</label>
                  </div>
                </div>

                <div>
                  <label htmlFor="custom" className="text-sm font-medium mb-2 block">
                    Caractères personnalisés
                  </label>
                  <Input
                    id="custom"
                    value={customChars}
                    onChange={(e) => setCustomChars(e.target.value)}
                    placeholder="Caractères supplémentaires..."
                  />
                </div>

                <Button 
                  onClick={generatePassword} 
                  className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:opacity-90"
                >
                  <Refresh className="w-4 h-4 mr-2" />
                  Générer mot de passe
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Result Section */}
          <div className="space-y-6">
            {/* Generated Password */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Mot de passe généré
                </CardTitle>
              </CardHeader>
              <CardContent>
                {password ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Input
                        value={password}
                        readOnly
                        className="font-mono text-lg"
                      />
                      <Button 
                        size="sm"
                        onClick={() => copyToClipboard(password)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Strength Indicator */}
                    {strength && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Force:</span>
                          <span className={`font-bold ${strength.color}`}>
                            {strength.strength} ({strength.score}/100)
                          </span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all ${
                              strength.score >= 90 ? 'bg-green-600' :
                              strength.score >= 70 ? 'bg-blue-600' :
                              strength.score >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${strength.score}%` }}
                          />
                        </div>

                        {strength.feedback.length > 0 && (
                          <div className="space-y-1">
                            <h4 className="font-medium text-sm flex items-center gap-1">
                              <AlertTriangle className="w-4 h-4" />
                              Améliorations suggérées:
                            </h4>
                            {strength.feedback.map((tip, index) => (
                              <p key={index} className="text-sm text-gray-600">• {tip}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Key className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Cliquez sur "Générer" pour créer un mot de passe</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Password History */}
            {passwordHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Historique</span>
                    <Button size="sm" variant="outline" onClick={clearHistory}>
                      Effacer
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {passwordHistory.map((pwd, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <code className="flex-1 text-sm truncate">{pwd}</code>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyToClipboard(pwd)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Security Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Conseils de sécurité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Longueur
                </h4>
                <p className="text-gray-600">Utilisez au minimum 12 caractères, idéalement 16+</p>
              </div>
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Variété
                </h4>
                <p className="text-gray-600">Mélangez majuscules, minuscules, chiffres et symboles</p>
              </div>
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Unicité
                </h4>
                <p className="text-gray-600">Utilisez un mot de passe unique par compte</p>
              </div>
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Gestionnaire
                </h4>
                <p className="text-gray-600">Utilisez un gestionnaire de mots de passe</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PasswordGenerator;
