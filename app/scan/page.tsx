"use client";

import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { ModelViewerAR } from "@/components/interaction/ModelViewerAR";

export default function ScanPage() {
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (result: any) => {
    if (scannedId || loading || modelUrl) return; 
    
    // Support newer react-qr-scanner payload structure
    const newId = Array.isArray(result) ? result[0]?.rawValue : result;
    
    if (newId && typeof newId === 'string' && newId.length > 10) { // Check uuid length
      setScannedId(newId);
      setLoading(true);
      try {
        const res = await fetch(`/api/items/${newId}`);
        const data = await res.json();
        
        if (data.item?.fileUrl) {
          setModelUrl(data.item.fileUrl);
        } else {
          setError("Model 3D tidak ditemukan untuk QR ini.");
          setTimeout(() => { setError(null); setScannedId(null); }, 3000);
        }
      } catch (e) {
        setError("Gagal memuat item. Pastikan koneksi aman.");
        setTimeout(() => { setError(null); setScannedId(null); }, 3000);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col">
      {/* Background Camera Scanner */}
      <div className="absolute inset-0 z-0">
         <Scanner 
           onScan={handleScan} 
           components={{ finder: false }} 
           styles={{ video: { objectFit: "cover" } }}
         />
      </div>

      {loading && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-white rounded-full animate-spin mb-4" />
          <p className="text-white text-lg font-medium animate-pulse">Memuat Pengalaman 3D...</p>
        </div>
      )}

      {error && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-red-600/90 text-white px-6 py-3 rounded-full text-sm font-medium shadow-xl backdrop-blur-md text-center max-w-[80vw]">
          {error}
        </div>
      )}

      {modelUrl && (
        <>
          <div className="absolute inset-0 z-30 transition-opacity duration-1000">
            <ModelViewerAR src={modelUrl} />
          </div>
          
          <button 
            onClick={() => { setModelUrl(null); setScannedId(null); }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 bg-white/10 border border-white/20 backdrop-blur-md pb-3 pt-3 px-8 rounded-full text-white font-medium hover:bg-white/20 hover:scale-105 transition-all shadow-2xl"
          >
            Tutup 3D & Kembali Scan
          </button>
        </>
      )}

      {/* UI Overlay */}
      {!modelUrl && !loading && (
        <div className="absolute inset-0 pointer-events-none z-10 flex flex-col items-center justify-center">
           {/* Center Frame */}
           <div className="relative w-64 h-64 border-2 border-white/40 rounded-[2rem] shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]">
             {/* Corner brackets for tech vibe */}
             <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-[2rem]" />
             <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-[2rem]" />
             <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-[2rem]" />
             <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-[2rem]" />
           </div>
           
           <div className="mt-12 bg-black/50 px-6 py-3 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
             <p className="text-white/90 font-medium text-sm tracking-wide">
               Arahkan kamera ke QR Code Koleksi
             </p>
           </div>
        </div>
      )}
    </div>
  );
}
