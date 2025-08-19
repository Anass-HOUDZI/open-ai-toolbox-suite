
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import { CheckCircle, AlertTriangle, XCircle, Wrench } from "lucide-react";

const MaintenancePage = () => {
  const tools = [
    { name: "AI Avatar Generator", path: "/tools/avatar-generator", status: "working", category: "visual" },
    { name: "QR Code Generator", path: "/tools/qr-generator", status: "working", category: "visual" },
    { name: "Color Palette Extractor", path: "/tools/color-palette-extractor", status: "working", category: "visual" },
    { name: "JSON Formatter", path: "/tools/json-formatter", status: "working", category: "dev" },
    { name: "Language Detector", path: "/tools/language-detector", status: "working", category: "text" },
    { name: "Password Strength Checker", path: "/tools/password-strength", status: "working", category: "security" },
    { name: "CSS Minifier", path: "/tools/css-minifier", status: "working", category: "dev" },
    { name: "Icon Generator", path: "/tools/icon-generator", status: "working", category: "visual" },
    { name: "Grammar Checker", path: "/tools/grammar-checker", status: "working", category: "text" },
    { name: "Base64 Tool", path: "/tools/base64-tool", status: "working", category: "dev" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "working": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "error": return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Wrench className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "working": return <Badge variant="default" className="bg-green-100 text-green-800">Fonctionnel</Badge>;
      case "warning": return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Attention</Badge>;
      case "error": return <Badge variant="destructive">Erreur</Badge>;
      default: return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Header - Mobile First */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white py-8 sm:py-12 md:py-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Wrench className="w-6 h-6 sm:w-8 sm:h-8" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Status des Outils</h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-white/90">
            Vérification du statut de tous les outils de la suite Toolbox
          </p>
        </div>
      </div>

      {/* Tools Status - Mobile First */}
      <section className="py-8 sm:py-12">
        <div className="container px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="grid gap-3 sm:gap-4">
            {tools.map((tool) => (
              <Card key={tool.path} className="hover:shadow-lg transition-shadow">
                <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    {getStatusIcon(tool.status)}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm sm:text-base truncate">{tool.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground capitalize">{tool.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-3 justify-between sm:justify-end">
                    {getStatusBadge(tool.status)}
                    <Button asChild variant="outline" size="sm" className="h-9 touch-target">
                      <Link to={tool.path}>Tester</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary Card - Mobile First */}
          <Card className="mt-6 sm:mt-8">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Résumé Global</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">
                    {tools.filter(t => t.status === 'working').length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Outils Fonctionnels</div>
                </div>
                
                <div className="text-center p-3 sm:p-4 bg-yellow-50 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                    {tools.filter(t => t.status === 'warning').length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Attention</div>
                </div>
                
                <div className="text-center p-3 sm:p-4 bg-red-50 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-red-600">
                    {tools.filter(t => t.status === 'error').length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Erreurs</div>
                </div>
                
                <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">
                    {tools.length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Total Outils</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default MaintenancePage;
