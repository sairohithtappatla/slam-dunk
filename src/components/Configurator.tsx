import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { GoogleGenAI, Type } from '@google/genai';
import { Product } from '../types';
import { Basketball } from './Basketball';
import { Pedestal } from './Pedestal';
import { audioService } from '../services/audioService';
import { X } from 'lucide-react';

interface ConfiguratorProps {
  onClose: () => void;
  onSave: (product: Product) => void;
  initialProduct: Product;
}

const COLORS = ["#C25E00", "#004d25", "#0077b6", "#6a040f", "#ff0080", "#1a1a1a", "#ffffff"];
const LINE_COLORS = ["#1a1a1a", "#ffffff", "#ffba08", "#aaffaa", "#00C2FF"];
const PATTERNS = ["classic", "street", "tech", "cross"];

export const Configurator: React.FC<ConfiguratorProps> = ({ onClose, onSave, initialProduct }) => {
  const [product, setProduct] = useState<Product>({ ...initialProduct });
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [explanation, setExplanation] = useState("");

  const handleColorChange = (color: string) => {
    let accent = color;
    if (color === "#1a1a1a") accent = "#ffffff";
    if (color === "#ffffff") accent = "#000000";
    if (color === "#004d25") accent = "#00ff41";
    if (color === "#0077b6") accent = "#00C2FF";
    if (color === "#6a040f") accent = "#ffba08";

    setProduct(prev => ({ ...prev, primaryColor: color, accentColor: accent }));
    audioService.playClick();
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setExplanation("");
    audioService.playClick();

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a professional 3D product designer. Generate a cohesive basketball design for: "${prompt}".
        Available Patterns: 'classic', 'street', 'tech', 'cross'.
        Output JSON: primaryColor, lineColor, accentColor, texturePattern, explanation (1 sentence).`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              primaryColor: { type: Type.STRING },
              lineColor: { type: Type.STRING },
              accentColor: { type: Type.STRING },
              texturePattern: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["primaryColor", "lineColor", "accentColor", "texturePattern", "explanation"]
          }
        }
      });

      if (response.text) {
        const data = JSON.parse(response.text);
        setProduct(prev => ({
          ...prev,
          primaryColor: data.primaryColor,
          lineColor: data.lineColor,
          accentColor: data.accentColor,
          texturePattern: data.texturePattern as any
        }));
        setExplanation(data.explanation);
        audioService.playSuccess();
      }
    } catch (error) {
      console.error("AI Generation failed", error);
      setExplanation("Connection error. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col md:flex-row animate-in fade-in duration-500">
      <div className="w-full md:w-2/3 h-[40vh] md:h-full relative order-1 md:order-2 bg-[#050505]">
        <Canvas shadows camera={{ fov: 40, position: [0, 0, 4.5] }}>
          <color attach="background" args={["#050505"]} />
          <ambientLight intensity={0.4} />
          <spotLight position={[-5, 10, 5]} angle={0.3} penumbra={1} intensity={2} castShadow />
          <Basketball product={product} scrollContainer={{ current: null } as any} isConfigurator />
          <OrbitControls autoRotate autoRotateSpeed={2} />
          <Environment preset="studio" />
        </Canvas>
        
        <div className="absolute top-8 right-8 pointer-events-none text-right z-10">
          <h1 className="text-white/20 font-anton text-4xl md:text-8xl tracking-widest uppercase">Custom</h1>
          <p className="text-white/30 font-mono text-xs md:text-sm tracking-[0.5em] uppercase -mt-2">Lab Edition</p>
        </div>
      </div>

      <div className="w-full md:w-1/3 h-[60vh] md:h-full bg-[#0a0a0a] border-t md:border-t-0 md:border-l border-white/10 flex flex-col order-2 md:order-1 relative z-20 shadow-2xl">
        <div className="p-6 md:p-8 pb-4 border-b border-white/5 flex items-center justify-between">
          <button onClick={onClose} className="text-gray-500 hover:text-white flex items-center gap-2 text-xs uppercase tracking-widest interactive">
            <X size={16} /> Back to Shop
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 no-scrollbar">
          <div>
            <h2 className="text-white font-anton text-3xl md:text-4xl mb-1 uppercase">DESIGN YOUR LEGACY</h2>
            <p className="text-gray-400 text-sm">Create a ball that matches your game.</p>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-3 block">Base Color</label>
            <div className="flex flex-wrap gap-3">
              {COLORS.map(c => (
                <button 
                  key={c}
                  onClick={() => handleColorChange(c)}
                  className={`w-10 h-10 rounded-full border-2 transition-all interactive ${product.primaryColor === c ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-3 block">Line Color</label>
            <div className="flex flex-wrap gap-3">
              {LINE_COLORS.map(c => (
                <button 
                  key={c}
                  onClick={() => setProduct(p => ({ ...p, lineColor: c }))}
                  className={`w-8 h-8 rounded-full border-2 transition-all interactive ${product.lineColor === c ? 'border-white scale-110' : 'border-white/10 hover:scale-105'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-3 block">Grip Texture</label>
            <div className="grid grid-cols-2 gap-3">
              {PATTERNS.map(p => (
                <button 
                  key={p}
                  onClick={() => setProduct(prev => ({ ...prev, texturePattern: p as any }))}
                  className={`px-4 py-3 rounded text-xs font-bold uppercase transition-all interactive border ${product.texturePattern === p ? 'bg-white text-black border-white' : 'bg-transparent text-gray-400 border-white/20 hover:border-white/50'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border bg-white/5 rounded-lg relative overflow-hidden group transition-colors duration-500" style={{ borderColor: `${product.accentColor}40` }}>
            <label className="text-xs font-mono uppercase tracking-widest mb-3 block flex items-center gap-2" style={{ color: product.accentColor }}>
              AI Texture Lab
            </label>
            <textarea 
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder='Describe a vibe (e.g. "Cyberpunk neon tiger")'
              className="w-full bg-black/50 border border-white/20 rounded p-3 text-xs text-white placeholder-gray-600 outline-none resize-none h-24 mb-3 transition-colors duration-300"
              style={{ borderColor: prompt ? product.accentColor : 'rgba(255,255,255,0.2)' }}
            />
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-white/10 hover:bg-white/20 text-white text-[10px] uppercase tracking-widest py-3 rounded transition-colors disabled:opacity-50 interactive flex items-center justify-center gap-2"
            >
              {isGenerating ? "Generating..." : "Generate Design"}
            </button>
            {explanation && <div className="mt-3 text-[10px] text-gray-400 italic border-l-2 pl-2" style={{ borderColor: product.accentColor }}>"{explanation}"</div>}
          </div>
        </div>

        <div className="p-6 md:p-8 border-t border-white/10 bg-[#0a0a0a] z-30">
          <button 
            onClick={() => onSave(product)}
            className="w-full py-4 font-bold uppercase tracking-widest text-white hover:text-white transition-all duration-300 interactive shadow-glow hover:brightness-110"
            style={{ backgroundColor: product.accentColor }}
          >
            Add to Collection
          </button>
        </div>
      </div>
    </div>
  );
};
