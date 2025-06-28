
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MobileDemo from "./pages/MobileDemo";
import MaintenancePage from "./pages/MaintenancePage";
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
import PasswordStrengthChecker from "./pages/tools/PasswordStrengthChecker";
import IconGenerator from "./pages/tools/IconGenerator";
import PatternGenerator from "./pages/tools/PatternGenerator";
import URLShortener from "./pages/tools/URLShortener";
import APITester from "./pages/tools/APITester";
import CodeFormatter from "./pages/tools/CodeFormatter";
import SQLFormatter from "./pages/tools/SQLFormatter";
import ImageConverter from "./pages/tools/ImageConverter";
import BackgroundRemover from "./pages/tools/BackgroundRemover";
import BarcodeGenerator from "./pages/tools/BarcodeGenerator";
import GradientCreator from "./pages/tools/GradientCreator";
import FaviconMaker from "./pages/tools/FaviconMaker";
import GrammarChecker from "./pages/tools/GrammarChecker";
import TextToSpeech from "./pages/tools/TextToSpeech";
import WordFrequencyAnalyzer from "./pages/tools/WordFrequencyAnalyzer";
import TextEncryption from "./pages/tools/TextEncryption";
import MarkdownEditor from "./pages/tools/MarkdownEditor";
import TextComparison from "./pages/tools/TextComparison";
import NotFound from "./pages/NotFound";
import CSSMinifier from "./pages/tools/CSSMinifier";
import HTMLValidator from "./pages/tools/HTMLValidator";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/mobile-demo" element={<MobileDemo />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
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
          <Route path="/tools/password-strength" element={<PasswordStrengthChecker />} />
          <Route path="/tools/icon-generator" element={<IconGenerator />} />
          <Route path="/tools/pattern-generator" element={<PatternGenerator />} />
          <Route path="/tools/url-shortener" element={<URLShortener />} />
          <Route path="/tools/api-tester" element={<APITester />} />
          <Route path="/tools/code-formatter" element={<CodeFormatter />} />
          <Route path="/tools/sql-formatter" element={<SQLFormatter />} />
          <Route path="/tools/image-converter" element={<ImageConverter />} />
          <Route path="/tools/background-remover" element={<BackgroundRemover />} />
          <Route path="/tools/barcode-generator" element={<BarcodeGenerator />} />
          <Route path="/tools/gradient-creator" element={<GradientCreator />} />
          <Route path="/tools/favicon-maker" element={<FaviconMaker />} />
          <Route path="/tools/grammar-checker" element={<GrammarChecker />} />
          <Route path="/tools/text-to-speech" element={<TextToSpeech />} />
          <Route path="/tools/word-frequency" element={<WordFrequencyAnalyzer />} />
          <Route path="/tools/text-encryption" element={<TextEncryption />} />
          <Route path="/tools/markdown-editor" element={<MarkdownEditor />} />
          <Route path="/tools/text-comparison" element={<TextComparison />} />
          <Route path="/tools/css-minifier" element={<CSSMinifier />} />
          <Route path="/tools/html-validator" element={<HTMLValidator />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
