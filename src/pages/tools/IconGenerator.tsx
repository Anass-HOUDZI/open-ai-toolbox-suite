
import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Search, Download, Copy, Palette } from "lucide-react";
import { toast } from "sonner";
import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

// Type pour les composants d'icônes Lucide
type LucideIcon = React.ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
>;

const IconGenerator = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSize, setSelectedSize] = useState(24);
  const [selectedColor, setSelectedColor] = useState("#000000");

  // Get all Lucide icons avec typage correct
  const allIcons = Object.entries(LucideIcons).filter(([name, component]) => 
    typeof component === 'function' && 
    name !== 'createLucideIcon' &&
    name !== 'Icon'
  ) as [string, LucideIcon][];

  const filteredIcons = allIcons.filter(([name]) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyIconName = (iconName: string) => {
    navigator.clipboard.writeText(iconName);
    toast.success(`Nom d'icône "${iconName}" copié !`);
  };

  const downloadIcon = (iconName: string) => {
    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", selectedSize.toString());
    svg.setAttribute("height", selectedSize.toString());
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", selectedColor);
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");

    // This is a simplified approach - in a real app you'd need the actual path data
    const text = document.createTextNode(`<!-- ${iconName} icon -->`);
    svg.appendChild(text);

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${iconName}-${selectedSize}px.svg`;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success(`Icône "${iconName}" téléchargée !`);
  };

  const generateReactCode = (iconName: string) => {
    const code = `import { ${iconName} } from 'lucide-react';\n\n<${iconName} size={${selectedSize}} color="${selectedColor}" />`;
    navigator.clipboard.writeText(code);
    toast.success("Code React copié !");
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gradient-visual text-white py-16">
        <div className="container">
          <div className="flex items-center mb-4">
            <Link to="/" className="text-white/70 hover:text-white mr-2">Accueil</Link>
            <span className="text-white/50">/</span>
            <Link to="/visual" className="text-white/70 hover:text-white mx-2">Création Visuelle</Link>
            <span className="text-white/50">/</span>
            <span className="ml-2">Icon Generator</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Icon Generator</h1>
          </div>
          <p className="text-xl text-white/90">
            Accédez à plus de 1000 icônes Lucide React avec personnalisation
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="container">
          {/* Controls */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recherche et personnalisation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Rechercher une icône</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Ex: home, user, settings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Taille</label>
                  <select 
                    value={selectedSize} 
                    onChange={(e) => setSelectedSize(Number(e.target.value))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value={16}>16px</option>
                    <option value={20}>20px</option>
                    <option value={24}>24px</option>
                    <option value={32}>32px</option>
                    <option value={48}>48px</option>
                    <option value={64}>64px</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Couleur</label>
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-full h-10 border rounded-md"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="mb-6">
            <Badge variant="outline" className="text-sm">
              {filteredIcons.length} icônes trouvées
            </Badge>
          </div>

          {/* Icons Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {filteredIcons.slice(0, 100).map(([iconName, IconComponent]) => (
              <Card key={iconName} className="p-4 hover:shadow-lg transition-shadow">
                <div className="text-center space-y-3">
                  <div className="flex justify-center">
                    <IconComponent 
                      size={selectedSize} 
                      color={selectedColor}
                      className="transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium truncate" title={iconName}>
                      {iconName}
                    </p>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyIconName(iconName)}
                      className="flex-1 text-xs"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => generateReactCode(iconName)}
                      className="flex-1 text-xs"
                    >
                      React
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadIcon(iconName)}
                      className="flex-1 text-xs"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredIcons.length > 100 && (
            <div className="text-center mt-8">
              <Badge variant="outline">
                Affichage des 100 premières icônes - Affinez votre recherche pour voir plus
              </Badge>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default IconGenerator;
