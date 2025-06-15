
import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { LinkIcon, Copy, BarChart3, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface ShortenedURL {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  createdAt: Date;
}

const URLShortener = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedURL[]>([]);

  const generateShortCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const shortenUrl = async () => {
    if (!originalUrl.trim()) {
      toast.error("Veuillez entrer une URL");
      return;
    }

    if (!isValidUrl(originalUrl)) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }

    setIsLoading(true);

    try {
      const shortCode = generateShortCode();
      const shortUrl = `https://short.ly/${shortCode}`;
      
      const newShortenedUrl: ShortenedURL = {
        id: Date.now().toString(),
        originalUrl,
        shortCode,
        shortUrl,
        clicks: 0,
        createdAt: new Date()
      };

      setShortenedUrls(prev => [newShortenedUrl, ...prev]);
      setOriginalUrl("");
      toast.success("URL raccourcie avec succès !");
    } catch (error) {
      toast.error("Erreur lors du raccourcissement");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("URL copiée dans le presse-papiers !");
  };

  const simulateClick = (id: string) => {
    setShortenedUrls(prev => 
      prev.map(url => 
        url.id === id 
          ? { ...url, clicks: url.clicks + 1 }
          : url
      )
    );
    toast.info("Clic simulé pour la démo");
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
            <span className="ml-2">URL Shortener</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <LinkIcon className="w-8 h-8" />
            <h1 className="text-4xl font-bold">URL Shortener</h1>
          </div>
          <p className="text-xl text-white/90">
            Raccourcissez vos URLs avec analytics en temps réel
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="container max-w-4xl">
          {/* URL Shortener Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Raccourcir une URL</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="https://example.com/very-long-url..."
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && shortenUrl()}
                />
                <Button 
                  onClick={shortenUrl}
                  disabled={isLoading}
                  className="bg-gradient-dev hover:opacity-90"
                >
                  {isLoading ? "Raccourcissement..." : "Raccourcir"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* URLs List */}
          {shortenedUrls.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  URLs raccourcies ({shortenedUrls.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shortenedUrls.map((url) => (
                    <div key={url.id} className="border rounded-lg p-4">
                      <div className="grid gap-3">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">URL originale</label>
                          <p className="text-sm truncate">{url.originalUrl}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">URL raccourcie</label>
                          <div className="flex items-center gap-2">
                            <code className="text-sm bg-muted px-2 py-1 rounded flex-1">
                              {url.shortUrl}
                            </code>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(url.shortUrl)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => simulateClick(url.id)}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Créé le {url.createdAt.toLocaleString()}</span>
                          <Badge variant="outline">
                            {url.clicks} clic{url.clicks !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};

export default URLShortener;
