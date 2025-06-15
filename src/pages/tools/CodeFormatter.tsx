
import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Code2, Copy, Download, Settings } from "lucide-react";
import { toast } from "sonner";

type Language = 'javascript' | 'typescript' | 'json' | 'css' | 'html' | 'xml' | 'sql';

const CodeFormatter = () => {
  const [code, setCode] = useState("");
  const [formattedCode, setFormattedCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('javascript');
  const [indentSize, setIndentSize] = useState(2);
  const [isLoading, setIsLoading] = useState(false);

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'json', label: 'JSON' },
    { value: 'css', label: 'CSS' },
    { value: 'html', label: 'HTML' },
    { value: 'xml', label: 'XML' },
    { value: 'sql', label: 'SQL' }
  ];

  const formatJSON = (jsonString: string, indent: number) => {
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, indent);
    } catch (error) {
      throw new Error('Invalid JSON');
    }
  };

  const formatCSS = (cssString: string, indent: number) => {
    const spaces = ' '.repeat(indent);
    return cssString
      .replace(/\s*{\s*/g, ' {\n' + spaces)
      .replace(/;\s*/g, ';\n' + spaces)
      .replace(/\s*}\s*/g, '\n}\n')
      .replace(/,\s*/g, ',\n')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line)
      .join('\n');
  };

  const formatHTML = (htmlString: string, indent: number) => {
    const spaces = ' '.repeat(indent);
    let formatted = htmlString;
    let indentLevel = 0;
    
    // Simple HTML formatting
    formatted = formatted.replace(/></g, '>\n<');
    const lines = formatted.split('\n');
    
    return lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      if (trimmed.startsWith('</')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const result = spaces.repeat(indentLevel) + trimmed;
      
      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
        indentLevel++;
      }
      
      return result;
    }).join('\n');
  };

  const formatSQL = (sqlString: string, indent: number) => {
    const spaces = ' '.repeat(indent);
    const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'GROUP BY', 'ORDER BY', 'HAVING', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP'];
    
    let formatted = sqlString.replace(/\s+/g, ' ').trim();
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      formatted = formatted.replace(regex, `\n${keyword.toUpperCase()}`);
    });
    
    return formatted.split('\n').map(line => {
      const trimmed = line.trim();
      return trimmed ? spaces + trimmed : '';
    }).join('\n').trim();
  };

  const formatJavaScript = (jsString: string, indent: number) => {
    const spaces = ' '.repeat(indent);
    let formatted = jsString;
    let indentLevel = 0;
    
    // Basic JavaScript formatting
    formatted = formatted.replace(/;/g, ';\n');
    formatted = formatted.replace(/\{/g, '{\n');
    formatted = formatted.replace(/\}/g, '\n}\n');
    
    const lines = formatted.split('\n');
    
    return lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      if (trimmed.includes('}')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const result = spaces.repeat(indentLevel) + trimmed;
      
      if (trimmed.includes('{')) {
        indentLevel++;
      }
      
      return result;
    }).join('\n');
  };

  const formatCode = () => {
    if (!code.trim()) {
      toast.error("Veuillez entrer du code à formater");
      return;
    }

    setIsLoading(true);

    try {
      let formatted = "";

      switch (selectedLanguage) {
        case 'json':
          formatted = formatJSON(code, indentSize);
          break;
        case 'css':
          formatted = formatCSS(code, indentSize);
          break;
        case 'html':
        case 'xml':
          formatted = formatHTML(code, indentSize);
          break;
        case 'sql':
          formatted = formatSQL(code, indentSize);
          break;
        case 'javascript':
        case 'typescript':
          formatted = formatJavaScript(code, indentSize);
          break;
        default:
          formatted = code;
      }

      setFormattedCode(formatted);
      toast.success("Code formaté avec succès !");
    } catch (error) {
      toast.error("Erreur lors du formatage : " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedCode);
    toast.success("Code copié dans le presse-papiers !");
  };

  const downloadCode = () => {
    const blob = new Blob([formattedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `formatted-code.${selectedLanguage === 'javascript' ? 'js' : selectedLanguage}`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Fichier téléchargé !");
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
            <span className="ml-2">Code Formatter</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Code2 className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Code Formatter</h1>
          </div>
          <p className="text-xl text-white/90">
            Formatage automatique de code multi-langages
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="container max-w-7xl">
          {/* Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Langage</label>
                  <select 
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                    className="w-full p-2 border rounded-md"
                  >
                    {languages.map(lang => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Taille indentation</label>
                  <select 
                    value={indentSize}
                    onChange={(e) => setIndentSize(Number(e.target.value))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value={2}>2 espaces</option>
                    <option value={4}>4 espaces</option>
                    <option value={8}>8 espaces</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <Button 
                    onClick={formatCode}
                    disabled={isLoading}
                    className="w-full bg-gradient-dev hover:opacity-90"
                  >
                    {isLoading ? "Formatage..." : "Formater le code"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Areas */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input */}
            <Card>
              <CardHeader>
                <CardTitle>Code source</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={`Collez votre code ${languages.find(l => l.value === selectedLanguage)?.label} ici...`}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={20}
                  className="font-mono text-sm"
                />
                <div className="mt-2">
                  <Badge variant="outline">
                    {code.length} caractères
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Output */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Code formaté
                  {formattedCode && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={copyToClipboard}>
                        <Copy className="w-4 h-4 mr-1" />
                        Copier
                      </Button>
                      <Button size="sm" variant="outline" onClick={downloadCode}>
                        <Download className="w-4 h-4 mr-1" />
                        Télécharger
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {formattedCode ? (
                  <>
                    <Textarea
                      value={formattedCode}
                      readOnly
                      rows={20}
                      className="font-mono text-sm bg-muted"
                    />
                    <div className="mt-2">
                      <Badge variant="outline">
                        {formattedCode.length} caractères
                      </Badge>
                    </div>
                  </>
                ) : (
                  <div className="h-96 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded">
                    Le code formaté apparaîtra ici
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

export default CodeFormatter;
