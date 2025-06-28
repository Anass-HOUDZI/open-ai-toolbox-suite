
import { useState } from "react";
import { toast } from "sonner";

export const useFileHandler = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File, allowedTypes?: string[]) => {
    if (allowedTypes && !allowedTypes.some(type => selectedFile.type.startsWith(type))) {
      toast.error("Type de fichier non supporté");
      return false;
    }

    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setFileUrl(url);
    return true;
  };

  const clearFile = () => {
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    setFile(null);
    setFileUrl(null);
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Fichier téléchargé !");
  };

  return {
    file,
    fileUrl,
    handleFileSelect,
    clearFile,
    downloadFile
  };
};
