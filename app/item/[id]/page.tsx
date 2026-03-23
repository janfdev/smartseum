import { db } from "@/lib/db";
import { items } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ModelViewerAR } from "@/components/interaction/ModelViewerAR";
import Link from "next/link";

export default async function ItemDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const itemData = await db.select().from(items).where(eq(items.id, id));
  
  if (itemData.length === 0) {
    notFound();
  }

  const item = itemData[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* 3D Header Section */}
      <div className="w-full h-[55vh] min-h-[450px] relative overflow-hidden bg-gradient-to-b from-slate-200 to-slate-100 shadow-inner">
        <Link 
          href="/scan" 
          className="absolute top-6 left-6 z-[60] bg-white/60 backdrop-blur-md px-5 py-2.5 rounded-full text-[0.9rem] font-semibold flex items-center gap-2 hover:bg-white transition-all border border-slate-200 shadow-sm text-slate-800 hover:scale-105"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Scan
        </Link>
        
        {/* Decorative background grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>
        
        {/* Model AR rendered absolute within this relative div */}
        <div className="absolute inset-0 w-full h-full" style={{ isolation: "isolate" }}>
          <ModelViewerAR src={item.fileUrl} />
        </div>
        
        {/* Tooltip hint floating */}
        <div className="absolute bottom-16 right-6 z-[60] bg-white/80 backdrop-blur px-4 py-2 rounded-xl border shadow-sm flex items-center gap-3 animate-pulse">
           <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
           </svg>
           <span className="text-xs font-semibold text-slate-700">Geser untuk memutar 3D</span>
        </div>
      </div>

      {/* Details Section */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 -mt-10 relative z-[70]">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100/50 backdrop-blur-3xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="inline-block bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-blue-200">
              Koleksi Museum
            </div>
            {item.qrCodeUrl && (
               <a href={item.qrCodeUrl} download className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors bg-slate-50 px-3 py-1 rounded-full border">
                 <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                 QR Code
               </a>
            )}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.15]">
            {item.title}
          </h1>
          <div className="w-12 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mb-8"></div>
          
          <div className="prose prose-slate lg:prose-lg max-w-none">
            {item.description ? (
              <p className="whitespace-pre-wrap text-slate-600 leading-relaxed font-medium text-[1.05rem]">
                {item.description}
              </p>
            ) : (
              <p className="italic text-slate-400 bg-slate-50 p-4 rounded-xl border border-slate-100">
                Informasi detail mengenai koleksi ini sedang disiapkan oleh kurator museum.
              </p>
            )}
          </div>
        </div>
        
        {/* Footer Area */}
        <div className="mt-12 text-center text-sm font-medium text-slate-400 pb-8 flex items-center justify-center gap-2">
           <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
           </svg>
           SmartSeum AR Interactive System
        </div>
      </div>
    </div>
  );
}
