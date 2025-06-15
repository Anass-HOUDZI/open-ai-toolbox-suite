
import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Lock, Unlock, Key, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const TextEncryption = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [algorithm, setAlgorithm] = useState("caesar");

  // Caesar Cipher
  const caesarCipher = (text: string, shift: number, encrypt: boolean) => {
    const actualShift = encrypt ? shift : -shift;
    return text.replace(/[a-zA-Z]/g, (char) => {
      const start = char <= 'Z' ? 65 : 97;
      return String.fromCharCode(((char.charCodeAt(0) - start + actualShift + 26) % 26) + start);
    });
  };

  // Base64 Encoding
  const base64Encode = (text: string) => {
    try {
      return btoa(unescape(encodeURIComponent(text)));
    } catch (e) {
      return text;
    }
  };

  const base64Decode = (text: string) => {
    try {
      return decodeURIComponent(escape(atob(text)));
    } catch (e) {
      return text;
    }
  };

  // Simple XOR Cipher
  const xorCipher = (text: string, key: string) => {
    if (!key) return text;
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(
        text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return result;
  };

  // ROT13
  const rot13 = (text: string) => {
    return text.replace(/[a-zA-Z]/g, (char) => {
      const start = char <= 'Z' ? 65 : 97;
      return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
    });
  };

  // Reverse Text
  const reverseText = (text: string) => {
    return text.split('').reverse().join('');
  };

  const processText = () => {
    if (!inputText.trim()) {
      toast.error("Veuillez saisir du texte");
      return;
    }

    let result = "";

    try {
      switch (algorithm) {
        case "caesar":
          const shift = password ? parseInt(password) || 3 : 3;
          result = caesarCipher(inputText, shift, mode === "encrypt");
          break;

        case "base64":
          result = mode === "encrypt" 
            ? base64Encode(inputText)
            : base64Decode(inputText);
          break;

        case "xor":
          if (!password) {
            toast.error("Mot de passe requis pour XOR");
            return;
          }
          result = xorCipher(inputText, password);
          break;

        case "rot13":
          result = rot13(inputText);
          break;

        case "reverse":
          result = reverseText(inputText);
          break;

        default:
          result = inputText;
      }

      setOutputText(result);
      toast.success(`Texte ${mode === "encrypt" ? "chiffré" : "déchiffré"} avec succès`);
    } catch (error) {
      toast.error("Erreur lors du traitement");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copié dans le presse-papiers");
  };

  const swapTexts = () => {
    setInputText(outputText);
    setOutputText(inputText);
    setMode(mode === "encrypt" ? "decrypt" : "encrypt");
  };

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let result = "";
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
    toast.success("Mot de passe généré");
  };

  const algorithms = [
    { value: "caesar", name: "César (Décalage)", needsPassword: true, passwordLabel: "Décalage (nombre)" },
    { value: "base64", name: "Base64", needsPassword: false },
    { value: "xor", name: "XOR", needsPassword: true, passwordLabel: "Clé XOR" },
    { value: "rot13", name: "ROT13", needsPassword: false },
    { value: "reverse", name: "Inversion", needsPassword: false }
  ];

  const currentAlg = algorithms.find(a => a.value === algorithm);

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
            <span className="ml-2">Text Encryption</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Text Encryption</h1>
          </div>
          <p className="text-xl text-white/90">
            Chiffrez et déchiffrez vos textes avec différents algorithmes
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="container max-w-6xl">
          <div className="grid gap-8">
            {/* Mode & Algorithm Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Mode */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Mode</label>
                    <div className="flex gap-2">
                      <Button
                        variant={mode === "encrypt" ? "default" : "outline"}
                        onClick={() => setMode("encrypt")}
                        className="flex-1"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Chiffrer
                      </Button>
                      <Button
                        variant={mode === "decrypt" ? "default" : "outline"}
                        onClick={() => setMode("decrypt")}
                        className="flex-1"
                      >
                        <Unlock className="w-4 h-4 mr-2" />
                        Déchiffrer
                      </Button>
                    </div>
                  </div>

                  {/* Algorithm */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Algorithme</label>
                    <select
                      value={algorithm}
                      onChange={(e) => setAlgorithm(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      {algorithms.map((alg) => (
                        <option key={alg.value} value={alg.value}>
                          {alg.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Password/Key Input */}
                {currentAlg?.needsPassword && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">
                      {currentAlg.passwordLabel || "Mot de passe"}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={currentAlg.passwordLabel || "Entrez le mot de passe"}
                        className="flex-1 p-2 border rounded"
                      />
                      {algorithm === "xor" && (
                        <Button
                          onClick={generateRandomPassword}
                          variant="outline"
                          size="sm"
                        >
                          <Key className="w-4 h-4 mr-2" />
                          Générer
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    Texte {mode === "encrypt" ? "à chiffrer" : "à déchiffrer"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Tapez votre texte ici..."
                    className="w-full h-64 p-4 border rounded-lg resize-none font-mono"
                  />
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-500">
                      {inputText.length} caractères
                    </span>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => copyToClipboard(inputText)}
                        size="sm"
                        variant="outline"
                        disabled={!inputText}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copier
                      </Button>
                      <Button
                        onClick={() => setInputText("")}
                        size="sm"
                        variant="outline"
                      >
                        Effacer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Output */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      Texte {mode === "encrypt" ? "chiffré" : "déchiffré"}
                    </CardTitle>
                    <Button
                      onClick={swapTexts}
                      size="sm"
                      variant="outline"
                      disabled={!outputText}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Inverser
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={outputText}
                    readOnly
                    placeholder="Le résultat apparaîtra ici..."
                    className="w-full h-64 p-4 border rounded-lg resize-none font-mono bg-gray-50"
                  />
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-500">
                      {outputText.length} caractères
                    </span>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => copyToClipboard(outputText)}
                        size="sm"
                        variant="outline"
                        disabled={!outputText}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copier
                      </Button>
                      <Button
                        onClick={processText}
                        className="bg-gradient-text hover:opacity-90"
                        disabled={!inputText.trim()}
                      >
                        {mode === "encrypt" ? (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Chiffrer
                          </>
                        ) : (
                          <>
                            <Unlock className="w-4 h-4 mr-2" />
                            Déchiffrer
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Algorithm Info */}
            <Card>
              <CardHeader>
                <CardTitle>À propos de {currentAlg?.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {algorithm === "caesar" && (
                    <p>Le chiffre de César décale chaque lettre de l'alphabet d'un nombre fixe de positions. C'est l'un des chiffrements les plus anciens et les plus simples.</p>
                  )}
                  {algorithm === "base64" && (
                    <p>Base64 est un encodage qui convertit les données binaires en texte ASCII. Ce n'est pas un vrai chiffrement mais plutôt un encodage.</p>
                  )}
                  {algorithm === "xor" && (
                    <p>Le chiffre XOR applique l'opération OU exclusif entre chaque caractère du texte et la clé. Plus la clé est longue et aléatoire, plus le chiffrement est sûr.</p>
                  )}
                  {algorithm === "rot13" && (
                    <p>ROT13 est un cas particulier du chiffre de César avec un décalage de 13. Appliquer ROT13 deux fois redonne le texte original.</p>
                  )}
                  {algorithm === "reverse" && (
                    <p>L'inversion de texte inverse simplement l'ordre des caractères. Ce n'est pas un vrai chiffrement mais peut masquer le contenu.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TextEncryption;
