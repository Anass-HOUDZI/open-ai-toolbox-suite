
import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRef, useEffect, useState } from "react";
import { Mic, MicOff, Play, Pause, Upload, BarChart3 } from "lucide-react";
import { toast } from "sonner";

const AudioVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | AudioBufferSourceNode | null>(null);
  const animationIdRef = useRef<number>(0);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [visualizationType, setVisualizationType] = useState("bars");
  const [sensitivity, setSensitivity] = useState([100]);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const setupAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
    }
  };

  const startMicrophone = async () => {
    try {
      setupAudioContext();
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      sourceRef.current = audioContextRef.current!.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current!);
      
      setIsRecording(true);
      startVisualization();
      toast.success("Microphone activé !");
    } catch (error) {
      toast.error("Impossible d'accéder au microphone");
    }
  };

  const stopMicrophone = () => {
    if (sourceRef.current && 'mediaStream' in sourceRef.current) {
      const tracks = (sourceRef.current as any).mediaStream.getTracks();
      tracks.forEach((track: MediaStreamTrack) => track.stop());
    }
    
    stopVisualization();
    setIsRecording(false);
    toast.success("Microphone désactivé");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      toast.success("Fichier audio chargé !");
    } else {
      toast.error("Veuillez sélectionner un fichier audio valide");
    }
  };

  const playAudioFile = async () => {
    if (!audioFile) return;

    try {
      setupAudioContext();
      
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
      
      audioElementRef.current = new Audio(URL.createObjectURL(audioFile));
      const source = audioContextRef.current!.createMediaElementSource(audioElementRef.current);
      source.connect(analyserRef.current!);
      analyserRef.current!.connect(audioContextRef.current!.destination);
      
      sourceRef.current = source as any;
      
      audioElementRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        stopVisualization();
      });
      
      await audioElementRef.current.play();
      setIsPlaying(true);
      startVisualization();
      toast.success("Lecture en cours !");
    } catch (error) {
      toast.error("Erreur lors de la lecture du fichier");
    }
  };

  const pauseAudioFile = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      setIsPlaying(false);
      stopVisualization();
    }
  };

  const startVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current) return;

    const ctx = canvas.getContext('2d')!;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationIdRef.current = requestAnimationFrame(draw);
      
      analyserRef.current!.getByteFrequencyData(dataArray);
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const sensitivity = getSensitivity();
      
      if (visualizationType === 'bars') {
        drawBars(ctx, dataArray, canvas, sensitivity);
      } else if (visualizationType === 'wave') {
        drawWaveform(ctx, dataArray, canvas, sensitivity);
      } else {
        drawCircle(ctx, dataArray, canvas, sensitivity);
      }
    };

    draw();
  };

  const stopVisualization = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
  };

  const getSensitivity = () => sensitivity[0] / 100;

  const drawBars = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, canvas: HTMLCanvasElement, sens: number) => {
    const barWidth = (canvas.width / dataArray.length) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
      barHeight = (dataArray[i] * sens) * (canvas.height / 255);
      
      const r = Math.floor((i / dataArray.length) * 255);
      const g = Math.floor(barHeight / 2);
      const b = 255 - Math.floor((i / dataArray.length) * 255);
      
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      
      x += barWidth + 1;
    }
  };

  const drawWaveform = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, canvas: HTMLCanvasElement, sens: number) => {
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#00ff00';
    ctx.beginPath();

    const sliceWidth = canvas.width / dataArray.length;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
      const v = (dataArray[i] * sens) / 128.0;
      const y = (v * canvas.height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.stroke();
  };

  const drawCircle = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, canvas: HTMLCanvasElement, sens: number) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 50;

    for (let i = 0; i < dataArray.length; i++) {
      const angle = (i / dataArray.length) * 2 * Math.PI;
      const amplitude = (dataArray[i] * sens) / 255;
      
      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + amplitude * 50);
      const y2 = centerY + Math.sin(angle) * (radius + amplitude * 50);
      
      const r = Math.floor((i / dataArray.length) * 255);
      const g = Math.floor(amplitude * 255);
      const b = 255 - Math.floor((i / dataArray.length) * 255);
      
      ctx.strokeStyle = `rgb(${r},${g},${b})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    return () => {
      stopVisualization();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white py-16">
        <div className="container">
          <div className="flex items-center mb-4">
            <Link to="/" className="text-white/70 hover:text-white mr-2">Accueil</Link>
            <span className="text-white/50">/</span>
            <Link to="/media" className="text-white/70 hover:text-white mx-2">Audio & Image</Link>
            <span className="text-white/50">/</span>
            <span className="ml-2">Audio Visualizer</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Audio Visualizer</h1>
          </div>
          <p className="text-xl text-white/90">
            Visualisation audio temps réel avec spectrograms et formes d'onde
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Controls */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contrôles Audio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Button 
                      onClick={isRecording ? stopMicrophone : startMicrophone}
                      variant={isRecording ? "destructive" : "default"}
                      className="w-full"
                    >
                      {isRecording ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                      {isRecording ? "Arrêter" : "Microphone"}
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Fichier Audio</label>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileUpload}
                      className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                    />
                    {audioFile && (
                      <Button 
                        onClick={isPlaying ? pauseAudioFile : playAudioFile}
                        variant="outline"
                        className="w-full"
                      >
                        {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                        {isPlaying ? "Pause" : "Lire"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Paramètres</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type de visualisation</label>
                    <Select value={visualizationType} onValueChange={setVisualizationType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bars">Barres</SelectItem>
                        <SelectItem value="wave">Forme d'onde</SelectItem>
                        <SelectItem value="circle">Circulaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sensibilité: {sensitivity[0]}%</label>
                    <Slider
                      value={sensitivity}
                      onValueChange={setSensitivity}
                      max={200}
                      min={10}
                      step={10}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Visualization */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Visualisation Audio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-black rounded-lg p-4">
                    <canvas 
                      ref={canvasRef}
                      className="w-full h-96 rounded"
                      style={{ backgroundColor: '#000000' }}
                    />
                  </div>
                  
                  <div className="mt-4 text-sm text-muted-foreground text-center">
                    {isRecording && "🎤 Enregistrement en cours..."}
                    {isPlaying && "▶️ Lecture en cours..."}
                    {!isRecording && !isPlaying && "Activez le microphone ou chargez un fichier audio"}
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

export default AudioVisualizer;
