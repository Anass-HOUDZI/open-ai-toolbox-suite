
import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Send, Plus, Trash2, Code } from "lucide-react";
import { toast } from "sonner";

interface Header {
  id: string;
  key: string;
  value: string;
}

interface APIResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  time: number;
}

const APITester = () => {
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/posts/1");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState<Header[]>([
    { id: "1", key: "Content-Type", value: "application/json" }
  ]);
  const [body, setBody] = useState("");
  const [response, setResponse] = useState<APIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addHeader = () => {
    const newHeader: Header = {
      id: Date.now().toString(),
      key: "",
      value: ""
    };
    setHeaders(prev => [...prev, newHeader]);
  };

  const updateHeader = (id: string, field: 'key' | 'value', value: string) => {
    setHeaders(prev => 
      prev.map(header => 
        header.id === id 
          ? { ...header, [field]: value }
          : header
      )
    );
  };

  const removeHeader = (id: string) => {
    setHeaders(prev => prev.filter(header => header.id !== id));
  };

  const sendRequest = async () => {
    if (!url.trim()) {
      toast.error("Veuillez entrer une URL");
      return;
    }

    setIsLoading(true);
    const startTime = Date.now();

    try {
      const requestHeaders: Record<string, string> = {};
      headers.forEach(header => {
        if (header.key.trim() && header.value.trim()) {
          requestHeaders[header.key.trim()] = header.value.trim();
        }
      });

      const requestOptions: RequestInit = {
        method,
        headers: requestHeaders,
        mode: 'cors'
      };

      if (method !== 'GET' && method !== 'HEAD' && body.trim()) {
        requestOptions.body = body;
      }

      const fetchResponse = await fetch(url, requestOptions);
      const endTime = Date.now();
      
      const responseHeaders: Record<string, string> = {};
      fetchResponse.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      let responseData;
      try {
        const text = await fetchResponse.text();
        responseData = text ? JSON.parse(text) : null;
      } catch {
        responseData = await fetchResponse.text();
      }

      const apiResponse: APIResponse = {
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        headers: responseHeaders,
        data: responseData,
        time: endTime - startTime
      };

      setResponse(apiResponse);
      toast.success("Requête envoyée avec succès !");
    } catch (error) {
      toast.error("Erreur lors de l'envoi de la requête");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-green-600";
    if (status >= 300 && status < 400) return "text-yellow-600";
    if (status >= 400 && status < 500) return "text-orange-600";
    return "text-red-600";
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
            <span className="ml-2">API Tester</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Send className="w-8 h-8" />
            <h1 className="text-4xl font-bold">API Tester</h1>
          </div>
          <p className="text-xl text-white/90">
            Testez vos APIs REST avec gestion complète des headers
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Request Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Requête</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Method and URL */}
                  <div className="flex gap-2">
                    <select 
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className="p-2 border rounded-md"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="PATCH">PATCH</option>
                      <option value="DELETE">DELETE</option>
                      <option value="HEAD">HEAD</option>
                      <option value="OPTIONS">OPTIONS</option>
                    </select>
                    <Input
                      placeholder="https://api.example.com/endpoint"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="flex-1"
                    />
                  </div>

                  {/* Headers */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Headers</label>
                      <Button size="sm" variant="outline" onClick={addHeader}>
                        <Plus className="w-4 h-4 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {headers.map((header) => (
                        <div key={header.id} className="flex gap-2">
                          <Input
                            placeholder="Header name"
                            value={header.key}
                            onChange={(e) => updateHeader(header.id, 'key', e.target.value)}
                            className="flex-1"
                          />
                          <Input
                            placeholder="Header value"
                            value={header.value}
                            onChange={(e) => updateHeader(header.id, 'value', e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeHeader(header.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Body */}
                  {method !== 'GET' && method !== 'HEAD' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Body</label>
                      <Textarea
                        placeholder='{"key": "value"}'
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        rows={6}
                      />
                    </div>
                  )}

                  <Button 
                    onClick={sendRequest}
                    disabled={isLoading}
                    className="w-full bg-gradient-dev hover:opacity-90"
                  >
                    {isLoading ? "Envoi..." : "Envoyer la requête"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Response Panel */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Réponse
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {response ? (
                    <div className="space-y-4">
                      {/* Status */}
                      <div className="flex items-center gap-4">
                        <Badge 
                          variant="outline" 
                          className={getStatusColor(response.status)}
                        >
                          {response.status} {response.statusText}
                        </Badge>
                        <Badge variant="outline">
                          {response.time}ms
                        </Badge>
                      </div>

                      {/* Headers */}
                      <div>
                        <h4 className="font-medium mb-2">Headers</h4>
                        <div className="bg-muted rounded-md p-3 text-sm max-h-40 overflow-y-auto">
                          <pre>
                            {Object.entries(response.headers).map(([key, value]) => (
                              <div key={key}>
                                <span className="text-blue-600">{key}:</span> {value}
                              </div>
                            ))}
                          </pre>
                        </div>
                      </div>

                      {/* Data */}
                      <div>
                        <h4 className="font-medium mb-2">Body</h4>
                        <div className="bg-muted rounded-md p-3 text-sm max-h-96 overflow-y-auto">
                          <pre>
                            {typeof response.data === 'string' 
                              ? response.data 
                              : JSON.stringify(response.data, null, 2)
                            }
                          </pre>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      Aucune réponse encore. Envoyez une requête pour voir la réponse ici.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default APITester;
