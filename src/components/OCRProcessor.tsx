"use client";

import { useState, useRef } from "react";
import { createWorker } from "tesseract.js";
import { Camera, Image as ImageIcon, Loader2, Search, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OCRProcessorProps {
  onResult: (name: string, mobile: string) => void;
  onClose: () => void;
}

export default function OCRProcessor({ onResult, onClose }: OCRProcessorProps) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!image) return;
    setLoading(true);
    setProgress(0);

    try {
      const worker = await createWorker('eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') setProgress(Math.floor(m.progress * 100));
        }
      });
      
      const { data: { text } } = await worker.recognize(image);
      await worker.terminate();

      // Simple logic to find a potential mobile number (10 digits)
      const phoneMatch = text.match(/\b\d{10}\b/);
      const mobile = phoneMatch ? phoneMatch[0] : "";
      
      // Clean up text for name (first line or prominent word)
      const lines = text.split('\n').filter(l => l.trim().length > 3);
      const name = lines[0] || "Extracted Name";

      onResult(name, mobile);
    } catch (error) {
      console.error("OCR Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 max-w-md w-full shadow-2xl border border-border overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-black flex items-center gap-2">
           <Camera size={24} className="text-indigo-600" />
           SNAP & SCAN
        </h3>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
          <X size={20} />
        </button>
      </div>

      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="aspect-video rounded-[24px] border-4 border-dashed border-slate-100 dark:border-zinc-800 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group"
        >
          <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-sm">
             <ImageIcon size={32} />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-slate-600 dark:text-zinc-300">Upload File Cover View</p>
            <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mt-1">Supports JPG, PNG</p>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative aspect-video rounded-[24px] overflow-hidden border border-border group">
             <img src={image} alt="Upload Preview" className="w-full h-full object-cover" />
             {!loading && (
               <button 
                 onClick={() => setImage(null)}
                 className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
               >
                 <X size={16} />
               </button>
             )}
             
             {loading && (
               <div className="absolute inset-0 bg-indigo-600/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white">
                  <Loader2 size={40} className="animate-spin mb-4" />
                  <p className="text-lg font-black tracking-widest uppercase">Analyzing... {progress}%</p>
                  <div className="w-full h-1.5 bg-white/20 rounded-full mt-4 overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${progress}%` }}
                       className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]" 
                     />
                  </div>
               </div>
             )}
          </div>

          <button
            onClick={processImage}
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black rounded-2xl shadow-xl shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 group"
          >
            {loading ? "SCANNING..." : (
              <>
                START SMART OCR
                <Search size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      )}

      <div className="mt-6 flex items-start gap-3 p-4 bg-blue-500/5 dark:bg-blue-500/10 rounded-2xl border border-blue-500/10">
         <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
         <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold leading-relaxed">
            Our AI will automatically fetch the Party Name and Contact Number from the image for instant entry.
         </p>
      </div>
    </div>
  );
}
