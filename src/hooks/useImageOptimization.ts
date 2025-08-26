import { useCallback } from 'react';

export const useImageOptimization = () => {
  const optimizeImage = useCallback((src: string, options: {
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
    format?: 'webp' | 'jpeg' | 'png';
  } = {}) => {
    return new Promise<string>((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const { quality = 0.8, maxWidth = 1920, maxHeight = 1080, format = 'webp' } = options;
        
        let { width, height } = img;
        
        // Resize if needed
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        
        try {
          const optimizedDataUrl = canvas.toDataURL(`image/${format}`, quality);
          resolve(optimizedDataUrl);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = src;
    });
  }, []);

  const preloadImage = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to preload image'));
      img.src = src;
    });
  }, []);

  return { optimizeImage, preloadImage };
};