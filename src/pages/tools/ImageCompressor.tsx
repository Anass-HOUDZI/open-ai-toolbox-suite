
import { useState, useRef } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Upload, Download, Image as ImageIcon, Zap } from "lucide-react";
import { toast } from "sonner";

interface ProcessedImage {
  original: File;
  compressed: Blob;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  originalUrl: string;
  compressedUrl: string;
}

const ImageCompressor = () => {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState([80]);
  const [maxWidth, setMaxWidth] = useState([1920]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const workerRef = useRef<Worker | null>(null);

  const compressImage = async (file: File): Promise<ProcessedImage> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        try {
          // Calculate new dimensions
          let { width, height } = img;
          const maxW = maxWidth[0];
          
          if (width > maxW) {
            height = (height * maxW) / width;
            width = maxW;
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress with better performance
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressionRatio = ((file.size - blob.size) / file.size) * 100;
                
                resolve({
                  original: file,
                  compressed: blob,
                  originalSize: file.size,
                  compressedSize: blob.size,
                  compressionRatio,
                  originalUrl: URL.createObjectURL(file),
                  compressedUrl: URL.createObjectURL(blob)
                });
              } else {
                reject(new Error('Compression failed'));
              }
            },
            file.type === 'image/png' ? 'image/png' : 'image/jpeg',
            quality[0] / 100
          );
          
          // Clean up
          URL.revokeObjectURL(img.src);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;

    // Validate files and size limit
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 25 * 1024 * 1024; // 25MB limit
      return isImage && isValidSize;
    });
    
    if (validFiles.length !== files.length) {
      toast.error("Seuls les fichiers image sous 25MB sont acceptés");
    }

    if (validFiles.length === 0) return;

    setIsProcessing(true);
    
    try {
      const processed = [];
      const batchSize = 3; // Process in batches to avoid memory issues
      
      for (let i = 0; i < validFiles.length; i += batchSize) {
        const batch = validFiles.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map(file => compressImage(file))
        );
        processed.push(...batchResults);
        
        // Small delay between batches
        if (i + batchSize < validFiles.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      setImages(processed);
      toast.success(`${processed.length} image(s) compressée(s) !`);
    } catch (error) {
      console.error('Compression error:', error);
      toast.error("Erreur lors de la compression");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = (image: ProcessedImage) => {
    const a = document.createElement('a');
    a.href = image.compressedUrl;
    a.download = `compressed_${image.original.name}`;
    a.click();
    toast.success("Image téléchargée !");
  };

  const downloadAll = () => {
    images.forEach((image, index) => {
      setTimeout(() => downloadImage(image), index * 500);
    });
  };

  const clearAll = () => {
    // Cleanup URLs
    images.forEach(image => {
      URL.revokeObjectURL(image.originalUrl);
      URL.revokeObjectURL(image.compressedUrl);
    });
    setImages([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalOriginalSize = images.reduce((sum, img) => sum + img.originalSize, 0);
  const totalCompressedSize = images.reduce((sum, img) => sum + img.compressedSize, 0);
  const totalSavings = totalOriginalSize > 0 ? ((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100 : 0;

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white py-16">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">🖼️ Image Compressor</h1>
          <p className="text-xl text-white/90">
            Compressez vos images tout en préservant la qualité visuelle
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Paramètres de compression
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Qualité: {quality[0]}%
                </label>
                <Slider
                  value={quality}
                  onValueChange={setQuality}
                  max={100}
                  min={10}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Plus élevé = meilleure qualité, fichiers plus gros
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Largeur max: {maxWidth[0]}px
                </label>
                <Slider
                  value={maxWidth}
                  onValueChange={setMaxWidth}
                  max={4000}
                  min={400}
                  step={100}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Les images plus grandes seront redimensionnées
                </p>
              </div>
            </div>

            {/* Upload Area */}
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              {isProcessing ? (
                <div className="space-y-4">
                  <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-purple-600 font-medium">Compression en cours...</p>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Cliquez pour sélectionner des images</p>
                  <p className="text-sm text-gray-400 mt-2">PNG, JPG, WebP - Jusqu'à 50 images</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        {images.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Statistiques globales
                <div className="flex gap-2">
                  <Button onClick={downloadAll} size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger tout
                  </Button>
                  <Button onClick={clearAll} size="sm" variant="outline">
                    Effacer tout
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{images.length}</div>
                  <div className="text-sm text-gray-600">Images</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{formatFileSize(totalOriginalSize)}</div>
                  <div className="text-sm text-gray-600">Taille originale</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{formatFileSize(totalCompressedSize)}</div>
                  <div className="text-sm text-gray-600">Taille compressée</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{totalSavings.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Économie</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {images.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-sm truncate">{image.original.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Image Comparison */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center">
                      <img 
                        src={image.originalUrl} 
                        alt="Original" 
                        className="w-full h-24 object-cover rounded border"
                      />
                      <p className="text-xs text-gray-600 mt-1">Original</p>
                    </div>
                    <div className="text-center">
                      <img 
                        src={image.compressedUrl} 
                        alt="Compressed" 
                        className="w-full h-24 object-cover rounded border"
                      />
                      <p className="text-xs text-gray-600 mt-1">Compressé</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Taille originale:</span>
                      <span className="font-medium">{formatFileSize(image.originalSize)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taille compressée:</span>
                      <span className="font-medium text-green-600">{formatFileSize(image.compressedSize)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Réduction:</span>
                      <span className="font-bold text-purple-600">{image.compressionRatio.toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Compression</span>
                      <span>{image.compressionRatio.toFixed(1)}%</span>
                    </div>
                    <Progress value={image.compressionRatio} className="h-2" />
                  </div>

                  {/* Download Button */}
                  <Button 
                    onClick={() => downloadImage(image)}
                    className="w-full"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {images.length === 0 && !isProcessing && (
          <Card>
            <CardContent className="text-center py-12">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Aucune image à afficher</h3>
              <p className="text-gray-600 mb-4">Uploadez des images pour commencer la compression</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ImageCompressor;
