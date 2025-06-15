
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import VisualTools from "./pages/VisualTools";
import TextTools from "./pages/TextTools";
import DevTools from "./pages/DevTools";
import SecurityTools from "./pages/SecurityTools";
import MediaTools from "./pages/MediaTools";
import AvatarGenerator from "./pages/tools/AvatarGenerator";
import QRGenerator from "./pages/tools/QRGenerator";
import ColorPaletteExtractor from "./pages/tools/ColorPaletteExtractor";
import JSONFormatter from "./pages/tools/JSONFormatter";
import TextSummarizer from "./pages/tools/TextSummarizer";
import LanguageDetector from "./pages/tools/LanguageDetector";
import PasswordGenerator from "./pages/tools/PasswordGenerator";
import Base64Tool from "./pages/tools/Base64Tool";
import RegexTester from "./pages/tools/RegexTester";
import HashGenerator from "./pages/tools/HashGenerator";
import ImageCompressor from "./pages/tools/ImageCompressor";
import AudioVisualizer from "./pages/tools/AudioVisualizer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/visual" element={<VisualTools />} />
          <Route path="/text" element={<TextTools />} />
          <Route path="/dev" element={<DevTools />} />
          <Route path="/security" element={<SecurityTools />} />
          <Route path="/media" element={<MediaTools />} />
          <Route path="/tools/avatar-generator" element={<AvatarGenerator />} />
          <Route path="/tools/qr-generator" element={<QRGenerator />} />
          <Route path="/tools/color-palette-extractor" element={<ColorPaletteExtractor />} />
          <Route path="/tools/json-formatter" element={<JSONFormatter />} />
          <Route path="/tools/text-summarizer" element={<TextSummarizer />} />
          <Route path="/tools/language-detector" element={<LanguageDetector />} />
          <Route path="/tools/password-generator" element={<PasswordGenerator />} />
          <Route path="/tools/base64-tool" element={<Base64Tool />} />
          <Route path="/tools/regex-tester" element={<RegexTester />} />
          <Route path="/tools/hash-generator" element={<HashGenerator />} />
          <Route path="/tools/image-compressor" element={<ImageCompressor />} />
          <Route path="/tools/audio-visualizer" element={<AudioVisualizer />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
