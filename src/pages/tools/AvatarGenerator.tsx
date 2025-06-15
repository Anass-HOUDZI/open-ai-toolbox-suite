
import { useState } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const AvatarGenerator = () => {
  const [seed, setSeed] = useState("");
  const [style, setStyle] = useState("avataaars");
  const [avatarUrl, setAvatarUrl] = useState("");

  const styles = [
    { value: "avataaars", label: "Avataaars" },
    { value: "big-smile", label: "Big Smile" },
    { value: "bottts", label: "Bottts" },
    { value: "identicon", label: "Identicon" },
    { value: "initials", label: "Initials" },
    { value: "personas", label: "Personas" },
    { value: "pixel-art", label: "Pixel Art" }
  ];

  const generateAvatar = () => {
    const seedValue = seed || Math.random().toString(36).substring(7);
    const url = `https://api.dicebear.com/7.x/${style}/svg?seed=${seedValue}`;
    setAvatarUrl(url);
    setSeed(seedValue);
  };

  const downloadAvatar = () => {
    if (avatarUrl) {
      const link = document.createElement('a');
      link.href = avatarUrl;
      link.download = `avatar-${seed}.svg`;
      link.click();
    }
  };

  const randomizeSeed = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    setSeed(randomSeed);
    generateAvatar();
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gradient-visual text-white py-12">
        <div className="container">
          <div className="flex items-center mb-4">
            <Link to="/" className="text-white/70 hover:text-white mr-2">Accueil</Link>
            <span className="text-white/50">/</span>
            <Link to="/visual" className="text-white/70 hover:text-white mx-2">Création Visuelle</Link>
            <span className="text-white/50">/</span>
            <span className="ml-2">AI Avatar Generator</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">🎭 AI Avatar Generator</h1>
          <p className="text-xl text-white/90">
            Créez des avatars uniques et personnalisés grâce à l'API DiceBear
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="container max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de génération</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Seed (texte unique)</label>
                  <Input
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    placeholder="Entrez un texte unique ou laissez vide"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Style d'avatar</label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {styles.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3">
                  <Button onClick={generateAvatar} className="flex-1 bg-gradient-visual hover:opacity-90">
                    Générer Avatar
                  </Button>
                  <Button onClick={randomizeSeed} variant="outline">
                    Aléatoire
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aperçu & Téléchargement</CardTitle>
              </CardHeader>
              <CardContent>
                {avatarUrl ? (
                  <div className="text-center space-y-4">
                    <div className="w-48 h-48 mx-auto bg-gray-100 rounded-2xl p-4 flex items-center justify-center">
                      <img 
                        src={avatarUrl} 
                        alt="Generated Avatar" 
                        className="w-full h-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Seed: {seed}</p>
                      <p className="text-sm text-muted-foreground">Style: {styles.find(s => s.value === style)?.label}</p>
                    </div>

                    <Button onClick={downloadAvatar} className="w-full">
                      Télécharger SVG
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-16 text-muted-foreground">
                    <div className="w-48 h-48 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                      <span className="text-4xl">🎭</span>
                    </div>
                    <p>Générez votre premier avatar pour le voir apparaître ici</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>💡 Comment ça marche ?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Seed personnalisé</h4>
                  <p className="text-muted-foreground">
                    Le "seed" est le texte qui détermine l'apparence de votre avatar. Le même seed génère toujours le même avatar.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Styles variés</h4>
                  <p className="text-muted-foreground">
                    Choisissez parmi 7 styles différents : avatars humains, robots, pixels art et plus encore.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Format SVG</h4>
                  <p className="text-muted-foreground">
                    Les avatars sont générés en format SVG vectoriel, parfait pour toutes les tailles d'affichage.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">100% Gratuit</h4>
                  <p className="text-muted-foreground">
                    Utilisez l'API DiceBear gratuitement, sans limite et sans inscription.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default AvatarGenerator;
