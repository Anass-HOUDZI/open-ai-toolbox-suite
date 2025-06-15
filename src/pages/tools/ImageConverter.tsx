
import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useRef } from "react";
import { Upload, Download, RefreshCw, ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ConvertedFile {
  id: string;
  originalName: string;
  originalFormat: string;
  targetFormat: string;
  originalSize: number;
  convertedSize: number;
  originalUrl: string;
  convertedUrl: string;
  isConverting: boolean;
}

const ImageConverter = () => {
  const [files, setFiles] = useState<ConvertedFile[]>([]);
  const [targetFormat, setTargetFormat] = useState<'jpeg' | 'png' | 'webp'>('webp');
  const [quality, setQuality] = useState(0.9);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = ['image/jpeg', 'image/png', 'image/webp'];
  const formatOptions = [
    { value: 'jpeg', label: 'JPEG', mime: 'image/jpeg' },
    { value: 'png', label: 'PNG', mime: 'image/png' },
    { value: 'webp', label: 'WebP', mime: 'image/webp' }
  ];

  const getFileFormat = (file: File): string => {
    return file.type.split('/')[1].toUpperCase();
  };

  const convertImage = async (file: File, format: string, quality: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Conversion failed'));
              }
            },
            `image/${format}`,
            format === 'jpeg' ? quality : undefined
          );
        } else {
          reject(new Error('Canvas context not available'));
        }
      };

      img.onerror = () => reject(new Error('Image load failed'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (selectedFiles: FileList) => {
    const validFiles = Array.from(selectedFiles).filter(file => 
      supportedFormats.includes(file.type)
    );

    if (validFiles.length === 0) {
      toast.error("Aucun fichier image valide sélectionné");
      return;
    }

    for (const file of validFiles) {
      const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const originalFormat = getFileFormat(file);
      
      // Skip if same format
      if (originalFormat.toLowerCase() === targetFormat) {
        toast.info(`${file.name} est déjà au format ${targetFormat.toUpperCase()}`);
        continue;
      }

      const newFile: ConvertedFile = {
        id: fileId,
        originalName: file.name,
        originalFormat,
        targetFormat: targetFormat.toUpperCase(),
        originalSize: file.size,
        convertedSize: 0,
        originalUrl: URL.createObjectURL(file),
        convertedUrl: '',
        isConverting: true
      };

      setFiles(prev => [...prev, newFile]);

      try {
        const convertedBlob = await convertImage(file, targetFormat, quality);
        const convertedUrl = URL.createObjectURL(convertedBlob);

        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { 
                ...f, 
                convertedUrl, 
                convertedSize: convertedBlob.size, 
                isConverting: false 
              }
            : f
        ));

        toast.success(`${file.name} converti avec succès !`);
      } catch (error) {
        setFiles(prev => prev.filter(f => f.id !== fileId));
        toast.error(`Erreur lors de la conversion de ${file.name}`);
      }
    }
  };

  const downloadFile = (file: ConvertedFile) => {
    const link = document.createElement('a');
    link.href = file.convertedUrl;
    link.download = `${file.originalName.split('.')[0]}.${targetFormat}`;
    link.click();
    toast.success("Téléchargement démarré !");
  };

  const downloadAll = () => {
    const completedFiles = files.filter(f => !f.isConverting && f.convertedUrl);
    completedFiles.forEach(file => downloadFile(file));
  };

  const clearAll = () => {
    files.forEach(file => {
      URL.revokeObjectURL(file.originalUrl);
      if (file.convertedUrl) URL.revokeObjectURL(file.convertedUrl);
    });
    setFiles([]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gradient-media text-white py-16">
        <div className="container">
          <div className="flex items-center mb-4">
            <Link to="/" className="text-white/70 hover:text-white mr-2">Accueil</Link>
            <span className="text-white/50">/</span>
            <Link to="/media" className="text-white/70 hover:text-white mx-2">Audio & Image</Link>
            <span className="text-white/50">/</span>
            <span className="ml-2">Image Converter</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <ImageIcon className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Image Format Converter</h1>
          </div>
          <p className="text-xl text-white/90">
            Convertissez vos images entre JPEG, PNG et WebP
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="container max-w-4xl">
          {/* Upload Area */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Conversion d'images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Format de sortie</label>
                  <select 
                    value={targetFormat} 
                    onChange={(e) => setTargetFormat(e.target.value as 'jpeg' | 'png' | 'webp')}
                    className="w-full p-2 border rounded-md"
                  >
                    {formatOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {targetFormat === 'jpeg' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Qualité ({Math.round(quality * 100)}%)
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={quality}
                      onChange={(e) => setQuality(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}
              </div>

              <div 
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">Cliquez pour sélectionner des images</p>
                <p className="text-sm text-muted-foreground">
                  Formats supportés : JPEG, PNG, WebP (max 50MB par fichier)
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                className="hidden"
              />
            </CardContent>
          </Card>

          {/* Files List */}
          {files.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Fichiers en conversion ({files.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button onClick={downloadAll} disabled={files.some(f => f.isConverting)}>
                      <Download className="w-4 h-4 mr-2" />
                      Tout télécharger
                    </Button>
                    <Button variant="outline" onClick={clearAll}>
                      Effacer tout
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {files.map((file) => (
                    <div key={file.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{file.originalName}</p>
                          <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                            <span>{file.originalFormat} → {file.targetFormat}</span>
                            <span>{formatFileSize(file.originalSize)}</span>
                            {file.convertedSize > 0 && (
                              <span>→ {formatFileSize(file.convertedSize)}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {file.isConverting ? (
                            <Badge variant="outline">
                              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                              Conversion...
                            </Badge>
                          ) : (
                            <>
                              <Badge variant="outline" className="text-green-600">
                                Terminé
                              </Badge>
                              <Button
                                size="sm"
                                onClick={() => downloadFile(file)}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </>
                          )}
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

export default ImageConverter;
