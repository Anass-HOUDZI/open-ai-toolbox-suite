
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import VisualTools from "./pages/VisualTools";
import TextTools from "./pages/TextTools";
import DevTools from "./pages/DevTools";
import AvatarGenerator from "./pages/tools/AvatarGenerator";
import QRGenerator from "./pages/tools/QRGenerator";
import ColorPaletteExtractor from "./pages/tools/ColorPaletteExtractor";
import JSONFormatter from "./pages/tools/JSONFormatter";
import TextSummarizer from "./pages/tools/TextSummarizer";
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
          <Route path="/tools/avatar-generator" element={<AvatarGenerator />} />
          <Route path="/tools/qr-generator" element={<QRGenerator />} />
          <Route path="/tools/color-palette-extractor" element={<ColorPaletteExtractor />} />
          <Route path="/tools/json-formatter" element={<JSONFormatter />} />
          <Route path="/tools/text-summarizer" element={<TextSummarizer />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
