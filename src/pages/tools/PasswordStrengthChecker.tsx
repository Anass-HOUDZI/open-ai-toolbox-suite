
import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Shield, Eye, EyeOff, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const PasswordStrengthChecker = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [analysis, setAnalysis] = useState<{
    score: number;
    strength: string;
    color: string;
    feedback: string[];
    requirements: Array<{ text: string; met: boolean }>;
    estimatedCrackTime: string;
  } | null>(null);

  const analyzePassword = (pwd: string) => {
    if (!pwd) {
      setAnalysis(null);
      return;
    }

    let score = 0;
    const feedback: string[] = [];
    const requirements = [
      { text: "Au moins 8 caractères", met: pwd.length >= 8 },
      { text: "Contient des minuscules", met: /[a-z]/.test(pwd) },
      { text: "Contient des majuscules", met: /[A-Z]/.test(pwd) },
      { text: "Contient des chiffres", met: /\d/.test(pwd) },
      { text: "Contient des caractères spéciaux", met: /[!@#$%^&*(),.?":{}|<>]/.test(pwd) }
    ];

    // Score basé sur la longueur
    if (pwd.length >= 8) score += 20;
    if (pwd.length >= 12) score += 10;
    if (pwd.length >= 16) score += 10;

    // Score basé sur la complexité
    requirements.forEach(req => {
      if (req.met) score += 12;
    });

    // Pénalités pour patterns communs
    if (/123456|password|qwerty|abc/i.test(pwd)) {
      score -= 20;
      feedback.push("Évitez les séquences communes comme '123456' ou 'password'");
    }

    if (/(.)\1{2,}/.test(pwd)) {
      score -= 10;
      feedback.push("Évitez de répéter le même caractère plusieurs fois");
    }

    // Feedback positif
    if (pwd.length >= 12) feedback.push("Excellente longueur de mot de passe");
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) feedback.push("Bonne utilisation de caractères spéciaux");

    score = Math.max(0, Math.min(100, score));

    let strength = "Très faible";
    let color = "text-red-500";
    let estimatedCrackTime = "Instantané";

    if (score >= 80) {
      strength = "Très fort";
      color = "text-green-500";
      estimatedCrackTime = "Plusieurs siècles";
    } else if (score >= 60) {
      strength = "Fort";
      color = "text-green-400";
      estimatedCrackTime = "Plusieurs années";
    } else if (score >= 40) {
      strength = "Moyen";
      color = "text-yellow-500";
      estimatedCrackTime = "Quelques mois";
    } else if (score >= 20) {
      strength = "Faible";
      color = "text-orange-500";
      estimatedCrackTime = "Quelques jours";
    }

    setAnalysis({
      score,
      strength,
      color,
      feedback,
      requirements,
      estimatedCrackTime
    });
  };

  const generateStrongPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let result = "";
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
    analyzePassword(result);
    toast.success("Mot de passe fort généré !");
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gradient-to-br from-red-500 to-orange-600 text-white py-16">
        <div className="container">
          <div className="flex items-center mb-4">
            <Link to="/" className="text-white/70 hover:text-white mr-2">Accueil</Link>
            <span className="text-white/50">/</span>
            <Link to="/security" className="text-white/70 hover:text-white mx-2">Sécurité</Link>
            <span className="text-white/50">/</span>
            <span className="ml-2">Password Strength Checker</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Password Strength Checker</h1>
          </div>
          <p className="text-xl text-white/90">
            Analysez la force de vos mots de passe avec des recommandations de sécurité
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="container max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle>Mot de passe à analyser</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Saisissez votre mot de passe..."
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      analyzePassword(e.target.value);
                    }}
                    className="pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>

                <Button 
                  onClick={generateStrongPassword}
                  variant="outline"
                  className="w-full"
                >
                  Générer un mot de passe fort
                </Button>

                {analysis && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Force du mot de passe</span>
                        <Badge className={analysis.color}>
                          {analysis.strength}
                        </Badge>
                      </div>
                      <Progress value={analysis.score} className="h-3" />
                      <div className="text-right text-sm text-muted-foreground mt-1">
                        {analysis.score}/100
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Temps de cassage estimé</h4>
                      <p className="text-sm text-muted-foreground">{analysis.estimatedCrackTime}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analysis Section */}
            <Card>
              <CardHeader>
                <CardTitle>Analyse de sécurité</CardTitle>
              </CardHeader>
              <CardContent>
                {!analysis ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Saisissez un mot de passe pour voir l'analyse</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Requirements */}
                    <div>
                      <h4 className="font-medium mb-3">Critères de sécurité</h4>
                      <div className="space-y-2">
                        {analysis.requirements.map((req, index) => (
                          <div key={index} className="flex items-center gap-2">
                            {req.met ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className={`text-sm ${req.met ? 'text-green-600' : 'text-red-600'}`}>
                              {req.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Feedback */}
                    {analysis.feedback.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">Recommandations</h4>
                        <div className="space-y-2">
                          {analysis.feedback.map((tip, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{tip}</span>
                            </div>
                          ))}
                        </div>
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

export default PasswordStrengthChecker;
