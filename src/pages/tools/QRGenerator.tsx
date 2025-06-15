
import { useState } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const QRGenerator = () => {
  const [text, setText] = useState("");
  const [size, setSize] = useState("200");
  const [format, setFormat] = useState("png");
  const [qrUrl, setQrUrl] = useState("");

  const sizes = [
    { value: "150", label: "150x150" },
    { value: "200", label: "200x200" },
    { value: "300", label: "300x300" },
    { value: "400", label: "400x400" },
    { value: "500", label: "500x500" }
  ];

  const formats = [
    { value: "png", label: "PNG" },
    { value: "svg", label: "SVG" }
  ];

  const generateQR = () => {
    if (!text.trim()) return;
    
    const encodedText = encodeURIComponent(text);
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}&format=${format}`;
    setQrUrl(url);
  };

  const downloadQR = () => {
    if (qrUrl) {
      const link = document.createElement('a');
      link.href = qrUrl;
      link.download = `qrcode.${format}`;
      link.click();
    }
  };

  const presetTexts = [
    "https://opentools-ai.com",
    "Contactez-nous: contact@example.com",
    "WiFi:T:WPA;S:MonWiFi;P:motdepasse;H:;;",
    "mailto:hello@example.com",
    "tel:+33123456789"
  ];

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
            <span className="ml-2">QR Code Generator</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">📱 QR Code Art Generator</h1>
          <p className="text-xl text-white/90">
            Créez des QR codes personnalisés pour vos URLs, textes et contacts
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="container max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Génération du QR Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Contenu à encoder</label>
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Entrez votre URL, texte, email, numéro de téléphone..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Taille</label>
                    <Select value={size} onValueChange={setSize}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sizes.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Format</label>
                    <Select value={format} onValueChange={setFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {formats.map((f) => (
                          <SelectItem key={f.value} value={f.value}>
                            {f.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={generateQR} 
                  className="w-full bg-gradient-visual hover:opacity-90"
                  disabled={!text.trim()}
                >
                  Générer QR Code
                </Button>

                <div>
                  <p className="text-sm font-medium mb-2">Exemples rapides :</p>
                  <div className="flex flex-wrap gap-2">
                    {presetTexts.map((preset, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setText(preset)}
                        className="text-xs"
                      >
                        {preset.length > 20 ? preset.substring(0, 20) + "..." : preset}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aperçu & Téléchargement</CardTitle>
              </CardHeader>
              <CardContent>
                {qrUrl ? (
                  <div className="text-center space-y-4">
                    <div className="bg-gray-50 rounded-2xl p-6 flex items-center justify-center">
                      <img 
                        src={qrUrl} 
                        alt="Generated QR Code" 
                        className="max-w-full h-auto"
                      />
                    </div>
                    
                    <div className="space-y-2 text-left">
                      <p className="text-sm text-muted-foreground">
                        <strong>Contenu:</strong> {text.length > 50 ? text.substring(0, 50) + "..." : text}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Taille:</strong> {size}x{size}px
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Format:</strong> {format.toUpperCase()}
                      </p>
                    </div>

                    <Button onClick={downloadQR} className="w-full">
                      Télécharger {format.toUpperCase()}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-16 text-muted-foreground">
                    <div className="w-48 h-48 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                      <span className="text-4xl">📱</span>
                    </div>
                    <p>Entrez du contenu et génèrez votre QR code</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>💡 Types de contenu supportés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">🌐 URLs</h4>
                  <p className="text-muted-foreground">
                    https://example.com
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">📧 Email</h4>
                  <p className="text-muted-foreground">
                    mailto:contact@example.com
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">📞 Téléphone</h4>
                  <p className="text-muted-foreground">
                    tel:+33123456789
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">📶 WiFi</h4>
                  <p className="text-muted-foreground">
                    WIFI:T:WPA;S:NomWiFi;P:motdepasse;;
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">📄 Texte</h4>
                  <p className="text-muted-foreground">
                    N'importe quel texte libre
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">📱 SMS</h4>
                  <p className="text-muted-foreground">
                    sms:+33123456789:Votre message
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

export default QRGenerator;
