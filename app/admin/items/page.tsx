"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

// Require ModelViewer dynamically to avoid SSR document is not defined
// Also standard Next.js doesn't natively recognize model-viewer in TS without module declaration,
// but we just render it or use the component we made.
import { ModelViewerAR } from "@/components/interaction/ModelViewerAR";

export default function AdminItemsPage() {
  type Item = {
    id: string;
    title: string;
    description: string;
    fileUrl: string;
    qrCodeUrl: string;
  };
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/items");
      const data = await res.json();
      if (data.items) {
        setItems(data.items);
      }
    } catch (e) {
      console.error("Failed to fetch items", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setMessage(null);
    
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/items", { 
        method: "POST", 
        body: formData 
      });
      const data = await res.json();
      
      if (res.ok && data.item) {
        setItems([data.item, ...items]);
        setMessage({ type: "success", text: "Berhasil mengupload model dan QR code telah digenerate!" });
        (e.target as HTMLFormElement).reset();
      } else {
        setMessage({ type: "error", text: data.error || "Gagal mengupload model!" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Terjadi kesalahan sistem saat upload." });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 pt-24 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manajemen 3D Items</h1>
            <p className="text-slate-500 mt-2">Kelola data model 3D dan QR code scanner museum.</p>
          </div>
        </header>

        {/* Upload Form */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Koleksi Baru
          </h2>
          
          {message && (
            <div className={`p-4 mb-6 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Nama/Judul Koleksi *</label>
                <input 
                  required 
                  name="title" 
                  type="text"
                  placeholder="Contoh: Tyrannosaurus Rex" 
                  className="w-full h-11 px-4 rounded-xl border-slate-200 border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Deskripsi Singkat</label>
                <textarea 
                  name="description" 
                  rows={4}
                  placeholder="Informasi detail mengenai koleksi..." 
                  className="w-full p-4 rounded-xl border-slate-200 border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none"
                />
              </div>
            </div>

            <div className="flex flex-col h-full space-y-4">
              <div className="flex-1 flex flex-col justify-center">
                <label className="block text-sm font-semibold mb-2 text-slate-700">File 3D (.glb) *</label>
                <div className="relative border-2 border-dashed border-slate-300 rounded-2xl h-full flex flex-col items-center justify-center p-6 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                  <input 
                    required 
                    type="file" 
                    name="file" 
                    accept=".glb" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-600">Klik / Tarik file .glb kesini</span>
                  <span className="text-xs text-slate-400 mt-1 text-center">Maks ukuran sesuai Cloudinary</span>
                </div>
              </div>
              <Button type="submit" disabled={uploading} className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-[0.95rem]">
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> 
                    Mengupload & Generating QR...
                  </span>
                ) : "Upload & Generate QR Code"}
              </Button>
            </div>
          </form>
        </div>

        {/* List Items */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Database Koleksi 3D</h2>
          {loading ? (
            <div className="text-center py-20 text-slate-500 animate-pulse font-medium">Memuat data koleksi...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 bg-white border border-dashed rounded-2xl text-slate-500 font-medium">Belum ada koleksi 3D. Upload sekarang!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                  {/* 3D Viewer */}
                  <div className="h-56 relative bg-gradient-to-b from-slate-100 to-slate-50 flex items-center justify-center p-4">
                    <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur text-xs font-semibold px-2 py-1 rounded-md text-slate-600 border shadow-sm">
                      3D Preview
                    </div>
                    {/* model-viewer in admin page */}
                    {item.fileUrl && (
                      <div className="w-full h-full relative" style={{ isolation: "isolate" }}>
                        {/* {React.createElement("model-viewer", { src: item.fileUrl, "auto-rotate": true, "camera-controls": true, style: { width: "100%", height: "100%" } })} 
                            Wait, we can reuse ModelViewerAR here instead! 
                        */}
                        <ModelViewerAR src={item.fileUrl} />
                      </div>
                    )}
                  </div>
                  
                  {/* Content Info */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg text-slate-900 mb-2 truncate">{item.title}</h3>
                    <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed flex-1">
                      {item.description || "Tidak ada deskripsi"}
                    </p>
                    
                    {/* QR Code Section */}
                    {item.qrCodeUrl && (
                      <div className="mt-auto p-4 bg-slate-50 rounded-xl border text-center flex justify-between items-center group cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors">
                        <div className="flex items-center gap-4 text-left">
                          <img 
                            src={item.qrCodeUrl} 
                            alt={`QR for ${item.title}`} 
                            className="w-14 h-14 object-contain rounded-md bg-white border p-1"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 group-hover:text-blue-500 transition-colors">QR Scanner</p>
                            <p className="text-sm font-semibold text-slate-700">Scan & View in AR</p>
                          </div>
                        </div>
                        <a 
                          href={item.qrCodeUrl} 
                          download={`QR-${item.title}.png`}
                          target="_blank"
                          rel="noreferrer" 
                          className="w-10 h-10 rounded-full bg-white border shadow-sm flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
