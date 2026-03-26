import { db } from "@/lib/db";
import { items } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Scan, ShieldCheck, Sparkles } from "lucide-react";
import { ModelViewer } from "@/components/artifact/ModelViewer";
import LandingLayout from "@/components/ui/LandingLayout";
import { AudioButton } from "@/components/artifact/AudioButton";

export default async function ItemDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const itemData = await db.select().from(items).where(eq(items.id, id));

  if (itemData.length === 0) notFound();

  const item = itemData[0];
  const displayYear = item.year ?? new Date(item.createdAt).getFullYear();
  const shortId = item.id.split("-").pop()?.toUpperCase() ?? item.id;

  return (
    <LandingLayout>
      <main className="min-h-screen bg-transparent text-black dark:text-white font-sans relative">
        {/* ─── FLOATING NAV ─── */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6">
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-gray-500 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors text-sm font-medium"
          >
            <span className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-md flex items-center justify-center group-hover:border-emerald-500/50 group-hover:bg-emerald-500/5 transition-all">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </span>
            <span className="hidden sm:inline">Back to Gallery</span>
          </Link>

          <div className="flex items-center gap-3 px-4 py-2 bg-white/50 dark:bg-white/5 backdrop-blur-md rounded-full border border-black/10 dark:border-white/10 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-[10px] text-gray-500 dark:text-white/40 font-mono uppercase tracking-[0.2em]">
              RECORD_ID: {shortId}
            </span>
          </div>
        </nav>

        {/* ─── HERO 3D VIEWER ─── */}
        <section
          className="relative w-full overflow-hidden"
          style={{ height: "75vh", minHeight: 500 }}
        >
          {/* Subtle Cyber Grid (Local to viewer to ground it) */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />

          {/* Depth Gradients */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-white dark:from-black to-transparent z-10 pointer-events-none" />

          <div className="absolute inset-0 z-0">
            <ModelViewer modelUrl={item.fileUrl} />
          </div>

          {/* Floating UI Elements */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
            <div className="px-4 py-2 bg-black/80 dark:bg-white/10 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-bold tracking-[0.3em] uppercase text-white/70 animate-in fade-in slide-in-from-bottom-2 duration-700">
              Interactive 3D Simulation Active
            </div>
          </div>
        </section>

        {/* ─── CONTENT BODY ─── */}
        <article className="relative z-20 max-w-6xl mx-auto px-6 md:px-12 pb-32">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10 mb-20">
            <header className="space-y-6 flex-1">
              <div className="flex items-center gap-3">
                <p className="text-[10px] tracking-[0.4em] uppercase text-emerald-500 font-bold">
                  Artifact Discovery
                </p>
                <div className="h-px w-12 bg-emerald-500/30" />
                <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-mono">
                  Origin: {item.origin || "Unknown"} · {displayYear}
                </span>
              </div>

              <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none text-black dark:text-white">
                {item.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 pt-4">
                <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-full">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Digital Archive
                </span>

                <AudioButton
                  title={item.title}
                  text={
                    item.description ||
                    "Identifikasi mendalam terhadap objek ini sedang dalam proses penelitian lanjutan oleh tim kurator."
                  }
                />
              </div>
            </header>

            {item.qrCodeUrl && (
              <a
                href={item.qrCodeUrl}
                download
                className="group flex flex-col items-center gap-4 p-6 bg-white dark:bg-white/5 backdrop-blur-md rounded-[2rem] border border-black/5 dark:border-white/10 hover:border-emerald-500/50 transition-all shadow-xl"
              >
                <div className="relative w-24 h-24 bg-white p-2 rounded-xl">
                  <img
                    src={item.qrCodeUrl}
                    alt="QR code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-gray-500 group-hover:text-emerald-500 transition-colors">
                  <Download className="w-3 h-3" />
                  Save Passport
                </div>
              </a>
            )}
          </div>

          {/* Analysis Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-24">
            <div className="lg:col-span-8 space-y-8">
              <div className="space-y-2">
                <p className="text-xs font-bold tracking-[0.3em] uppercase text-emerald-500/60">
                  Historical Context
                </p>
                <div className="h-0.5 w-12 bg-emerald-500/20 rounded-full" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-xl md:text-3xl leading-relaxed font-light">
                {item.description
                  ? item.description
                  : "Identifikasi mendalam terhadap objek ini sedang dalam proses penelitian lanjutan oleh tim kurator museum."}
              </p>
            </div>

            <aside className="lg:col-span-4 space-y-10">
              <div className="p-8 rounded-[2rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-md space-y-8">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 dark:text-white/20 mb-3">
                    Artifact Year
                  </p>
                  <p className="text-2xl font-black text-black dark:text-white tabular-nums">
                    {displayYear}
                  </p>
                </div>
                <div className="h-px bg-black/10 dark:bg-white/10" />
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 dark:text-white/20 mb-3">
                    Creator / Discovery
                  </p>
                  <p className="text-lg font-bold text-gray-700 dark:text-white/70">
                    {item.creatorName || "Unknown / Unrecorded"}
                  </p>
                </div>
                <div className="h-px bg-black/10 dark:bg-white/10" />
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 dark:text-white/20 mb-3">
                    Digital Fingerprint
                  </p>
                  <p className="text-[10px] font-mono text-gray-400 break-all leading-tight">
                    {item.id}
                  </p>
                </div>
              </div>
            </aside>
          </div>

          {/* Action Footer */}
          <div className="pt-12 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                <Scan className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-black dark:text-white font-black tracking-tight">
                  SmartMuseum v4.0
                </p>
                <p className="text-xs text-gray-500 dark:text-white/40">
                  Next-Gen Cultural Preservation
                </p>
              </div>
            </div>

            <Link
              href="/scan"
              className="group flex items-center gap-3 px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-sm hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all overflow-hidden relative"
            >
              <span className="relative z-10 flex items-center gap-2">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Daftar Scan Lainnya
              </span>
              <div className="absolute inset-0 bg-emerald-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
          </div>
        </article>
      </main>
    </LandingLayout>
  );
}
