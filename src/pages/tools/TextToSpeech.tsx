
import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { Play, Pause, Square, Volume2, Download, Settings } from "lucide-react";
import { toast } from "sonner";

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voice, setVoice] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available voices
  const loadVoices = () => {
    const availableVoices = speechSynthesis.getVoices();
    setVoices(availableVoices);
    if (availableVoices.length > 0 && !voice) {
      setVoice(availableVoices[0].name);
    }
  };

  // Load voices on component mount and when voices change
  useState(() => {
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  });

  const speak = () => {
    if (!text.trim()) {
      toast.error("Veuillez saisir du texte à lire");
      return;
    }

    if (isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = voices.find(v => v.name === voice);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      toast.error("Erreur lors de la lecture");
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const pause = () => {
    speechSynthesis.pause();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const downloadAudio = () => {
    toast.info("Fonctionnalité à venir - Téléchargement audio");
  };

  const presetTexts = [
    "Bonjour ! Ceci est un test de synthèse vocale.",
    "The quick brown fox jumps over the lazy dog.",
    "La tecnología de síntesis de voz es fascinante.",
    "Die Sprachsynthese-Technologie ist faszinierend."
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gradient-text text-white py-16">
        <div className="container">
          <div className="flex items-center mb-4">
            <Link to="/" className="text-white/70 hover:text-white mr-2">Accueil</Link>
            <span className="text-white/50">/</span>
            <Link to="/text" className="text-white/70 hover:text-white mx-2">Traitement Texte</Link>
            <span className="text-white/50">/</span>
            <span className="ml-2">Text to Speech</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Volume2 className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Text to Speech</h1>
          </div>
          <p className="text-xl text-white/90">
            Convertissez votre texte en parole avec des voix naturelles
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="container max-w-4xl">
          <div className="grid gap-8">
            {/* Text Input */}
            <Card>
              <CardHeader>
                <CardTitle>Texte à lire</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Tapez ou collez votre texte ici..."
                  className="w-full h-32 p-4 border rounded-lg resize-none"
                />
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">
                    {text.length} caractères
                  </span>
                  <div className="flex gap-2">
                    {presetTexts.map((preset, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant="outline"
                        onClick={() => setText(preset)}
                      >
                        Exemple {index + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Contrôles de lecture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-6">
                    <Button
                      onClick={speak}
                      disabled={isPlaying && !isPaused}
                      className="flex-1 bg-gradient-text hover:opacity-90"
                    >
                      {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                      {isPaused ? "Reprendre" : "Lire"}
                    </Button>
                    
                    <Button
                      onClick={pause}
                      disabled={!isPlaying}
                      variant="outline"
                    >
                      <Pause className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      onClick={stop}
                      disabled={!isPlaying && !isPaused}
                      variant="outline"
                    >
                      <Square className="w-4 h-4" />
                    </Button>
                  </div>

                  <Button
                    onClick={downloadAudio}
                    variant="outline"
                    className="w-full"
                    disabled
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger l'audio (Bientôt)
                  </Button>
                </CardContent>
              </Card>

              {/* Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Paramètres vocaux
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Voice Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Voix
                    </label>
                    <select
                      value={voice}
                      onChange={(e) => setVoice(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      {voices.map((v) => (
                        <option key={v.name} value={v.name}>
                          {v.name} ({v.lang})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Rate */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Vitesse: {rate.toFixed(1)}x
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={rate}
                      onChange={(e) => setRate(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Pitch */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tonalité: {pitch.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={pitch}
                      onChange={(e) => setPitch(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Volume */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Volume: {Math.round(volume * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TextToSpeech;
