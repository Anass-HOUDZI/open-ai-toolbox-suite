
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import PwaReloadPrompt from '@/components/PwaReloadPrompt'
import OnlineStatusIndicator from '@/components/OnlineStatusIndicator'
import { Toaster } from "@/components/ui/sonner"


createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Toaster richColors />
    <PwaReloadPrompt />
    <OnlineStatusIndicator />
  </>
);
