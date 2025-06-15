
import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Database, Copy, Download, Settings } from "lucide-react";
import { toast } from "sonner";

type SQLDialect = 'standard' | 'mysql' | 'postgresql' | 'sqlite' | 'oracle';

const SQLFormatter = () => {
  const [sqlCode, setSqlCode] = useState("");
  const [formattedSQL, setFormattedSQL] = useState("");
  const [dialect, setDialect] = useState<SQLDialect>('standard');
  const [indentSize, setIndentSize] = useState(2);
  const [uppercaseKeywords, setUppercaseKeywords] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const dialects = [
    { value: 'standard', label: 'SQL Standard' },
    { value: 'mysql', label: 'MySQL' },
    { value: 'postgresql', label: 'PostgreSQL' },
    { value: 'sqlite', label: 'SQLite' },
    { value: 'oracle', label: 'Oracle' }
  ];

  const sqlKeywords = [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN',
    'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'UNION ALL',
    'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE',
    'ALTER', 'DROP', 'INDEX', 'VIEW', 'DATABASE', 'SCHEMA', 'PRIMARY KEY',
    'FOREIGN KEY', 'REFERENCES', 'CONSTRAINT', 'NOT NULL', 'DEFAULT',
    'AND', 'OR', 'NOT', 'IN', 'BETWEEN', 'LIKE', 'IS', 'NULL',
    'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'AS', 'DISTINCT', 'ALL',
    'EXISTS', 'SUBQUERY', 'WITH', 'RECURSIVE'
  ];

  const formatSQL = (sql: string) => {
    const spaces = ' '.repeat(indentSize);
    let formatted = sql.replace(/\s+/g, ' ').trim();
    
    // Keywords to uppercase if option is enabled
    if (uppercaseKeywords) {
      sqlKeywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'gi');
        formatted = formatted.replace(regex, keyword.toUpperCase());
      });
    }

    // Add line breaks before major keywords
    const majorKeywords = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'UNION'];
    majorKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      formatted = formatted.replace(regex, `\n${uppercaseKeywords ? keyword.toUpperCase() : keyword}`);
    });

    // Add line breaks before JOIN clauses
    const joinKeywords = ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'JOIN'];
    joinKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'gi');
      formatted = formatted.replace(regex, `\n${spaces}${uppercaseKeywords ? keyword.toUpperCase() : keyword}`);
    });

    // Format SELECT fields
    formatted = formatted.replace(/SELECT\s+/gi, match => {
      return `${match}\n${spaces}`;
    });

    // Format commas in SELECT
    formatted = formatted.replace(/,(?=\s*\w)/g, `,\n${spaces}`);

    // Clean up extra whitespace and format parentheses
    const lines = formatted.split('\n');
    let indentLevel = 0;
    
    return lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      // Decrease indent for closing parentheses
      if (trimmed.startsWith(')')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const result = spaces.repeat(indentLevel) + trimmed;
      
      // Increase indent for opening parentheses
      if (trimmed.includes('(') && !trimmed.includes(')')) {
        indentLevel++;
      }
      
      return result;
    }).join('\n').trim();
  };

  const optimizeSQL = (sql: string) => {
    let optimized = sql;
    
    // Remove unnecessary spaces
    optimized = optimized.replace(/\s+/g, ' ');
    
    // Suggest improvements (comments)
    const suggestions = [];
    
    if (optimized.toLowerCase().includes('select *')) {
      suggestions.push('-- Évitez SELECT *, spécifiez les colonnes nécessaires');
    }
    
    if (!optimized.toLowerCase().includes('limit') && optimized.toLowerCase().includes('select')) {
      suggestions.push('-- Considérez ajouter LIMIT pour limiter les résultats');
    }
    
    if (optimized.toLowerCase().includes('order by') && !optimized.toLowerCase().includes('limit')) {
      suggestions.push('-- ORDER BY sans LIMIT peut être coûteux sur de gros datasets');
    }
    
    if (suggestions.length > 0) {
      optimized = suggestions.join('\n') + '\n\n' + optimized;
    }
    
    return optimized;
  };

  const formatSQLCode = () => {
    if (!sqlCode.trim()) {
      toast.error("Veuillez entrer du code SQL à formater");
      return;
    }

    setIsLoading(true);

    try {
      let formatted = formatSQL(sqlCode);
      formatted = optimizeSQL(formatted);
      
      setFormattedSQL(formatted);
      toast.success("SQL formaté avec succès !");
    } catch (error) {
      toast.error("Erreur lors du formatage SQL");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedSQL);
    toast.success("SQL copié dans le presse-papiers !");
  };

  const downloadSQL = () => {
    const blob = new Blob([formattedSQL], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'formatted-query.sql';
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Fichier SQL téléchargé !");
  };

  const loadSampleQuery = () => {
    const sampleSQL = `select u.id, u.name, u.email, p.title, p.content, c.name as category from users u inner join posts p on u.id = p.user_id left join categories c on p.category_id = c.id where u.active = 1 and p.published_at is not null order by p.created_at desc limit 10;`;
    setSqlCode(sampleSQL);
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
            <span className="ml-2">SQL Formatter</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-8 h-8" />
            <h1 className="text-4xl font-bold">SQL Formatter</h1>
          </div>
          <p className="text-xl text-white/90">
            Formatage et optimisation de requêtes SQL
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
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Dialecte SQL</label>
                  <select 
                    value={dialect}
                    onChange={(e) => setDialect(e.target.value as SQLDialect)}
                    className="w-full p-2 border rounded-md"
                  >
                    {dialects.map(d => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Indentation</label>
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

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="uppercase"
                    checked={uppercaseKeywords}
                    onChange={(e) => setUppercaseKeywords(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="uppercase" className="text-sm font-medium">
                    Mots-clés en majuscules
                  </label>
                </div>
                
                <div className="flex items-end gap-2">
                  <Button 
                    onClick={formatSQLCode}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-dev hover:opacity-90"
                  >
                    {isLoading ? "Formatage..." : "Formater"}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={loadSampleQuery}
                    size="sm"
                  >
                    Exemple
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SQL Areas */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input */}
            <Card>
              <CardHeader>
                <CardTitle>Requête SQL source</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Collez votre requête SQL ici..."
                  value={sqlCode}
                  onChange={(e) => setSqlCode(e.target.value)}
                  rows={20}
                  className="font-mono text-sm"
                />
                <div className="mt-2 flex justify-between">
                  <Badge variant="outline">
                    {sqlCode.length} caractères
                  </Badge>
                  <Badge variant="outline">
                    {sqlCode.split('\n').length} lignes
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Output */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  SQL formaté et optimisé
                  {formattedSQL && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={copyToClipboard}>
                        <Copy className="w-4 h-4 mr-1" />
                        Copier
                      </Button>
                      <Button size="sm" variant="outline" onClick={downloadSQL}>
                        <Download className="w-4 h-4 mr-1" />
                        Télécharger
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {formattedSQL ? (
                  <>
                    <Textarea
                      value={formattedSQL}
                      readOnly
                      rows={20}
                      className="font-mono text-sm bg-muted"
                    />
                    <div className="mt-2 flex justify-between">
                      <Badge variant="outline">
                        {formattedSQL.length} caractères
                      </Badge>
                      <Badge variant="outline">
                        {formattedSQL.split('\n').length} lignes
                      </Badge>
                    </div>
                  </>
                ) : (
                  <div className="h-96 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded">
                    La requête formatée apparaîtra ici
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

export default SQLFormatter;
