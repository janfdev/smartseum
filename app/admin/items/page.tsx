"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Upload,
  Box,
  QrCode,
  Trash2,
  ExternalLink,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  Pencil,
  X,
  Save,
} from "lucide-react";

type Item = {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  qrCodeUrl: string | null;
  creatorName: string | null;
  year: number | null;
  origin: string | null;
  createdAt: string;
};

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function AdminItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // Create State
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadMsg, setUploadMsg] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Edit State
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/items");
      const data = await res.json();
      if (data.items) setItems(data.items);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // ─── CREATE ────────────────────────────────────────────────────────
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadStatus("uploading");
    setUploadMsg("");

    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/items", { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok && data.item) {
        setItems((prev) => [data.item, ...prev]);
        setUploadStatus("success");
        setUploadMsg("Artefak berhasil diarsipkan & QR digenerate.");
        setFileName(null);
        formRef.current?.reset();
        setTimeout(() => setUploadStatus("idle"), 4000);
      } else {
        setUploadStatus("error");
        setUploadMsg(data.error || "Gagal mengupload.");
      }
    } catch {
      setUploadStatus("error");
      setUploadMsg("Koneksi gagal. Coba lagi.");
    }
  };

  // ─── UPDATE ────────────────────────────────────────────────────────
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editItem) return;

    setIsUpdating(true);
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const origin = formData.get("origin") as string;
    const creatorName = formData.get("creator_name") as string;
    const yearStr = formData.get("year") as string;
    let year = null;
    if (yearStr) {
      if (!/^\d+$/.test(yearStr)) {
        alert("Kolom tahun hanya boleh berisi angka.");
        setIsUpdating(false);
        return;
      }
      year = parseInt(yearStr, 10);
    }

    try {
      const res = await fetch(`/api/items/${editItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, origin, creatorName, year }),
      });
      const data = await res.json();

      if (res.ok && data.item) {
        setItems((prev) =>
          prev.map((item) => (item.id === data.item.id ? data.item : item)),
        );
        setEditItem(null);
      } else {
        alert(data.error || "Gagal memperbarui item");
      }
    } catch (error) {
      alert("Koneksi gagal. Coba lagi.");
    } finally {
      setIsUpdating(false);
    }
  };

  // ─── DELETE ────────────────────────────────────────────────────────
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus artefak "${title}"? Data tidak dapat dikembalikan.`))
      return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menghapus item");
      }
    } catch (error) {
      alert("Koneksi gagal. Coba lagi.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));

  const withQR = items.filter((i) => i.qrCodeUrl).length;
  const recent = items.filter(
    (i) =>
      Date.now() - new Date(i.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000,
  ).length;

  return (
    <>
      <div className="min-h-full bg-[#f7f7f5] dark:bg-[#080808] text-neutral-900 dark:text-neutral-100 font-sans relative">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-8 space-y-8">
          {/* ── Stats Row ── */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              {
                label: "Total Artefak",
                value: loading ? "—" : items.length,
                icon: <Box className="w-5 h-5" />,
                color: "text-blue-500",
                bg: "bg-blue-500/8 dark:bg-blue-500/10",
              },
              {
                label: "QR Digenerate",
                value: loading ? "—" : withQR,
                icon: <QrCode className="w-5 h-5" />,
                color: "text-emerald-500",
                bg: "bg-emerald-500/8 dark:bg-emerald-500/10",
              },
              {
                label: "Ditambah Minggu Ini",
                value: loading ? "—" : recent,
                icon: <Clock className="w-5 h-5" />,
                color: "text-violet-500",
                bg: "bg-violet-500/8 dark:bg-violet-500/10",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white dark:bg-white/4 border border-neutral-200/60 dark:border-white/6 rounded-2xl p-5 flex items-center gap-4 shadow-sm dark:shadow-none"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center ${s.color} ${s.bg}`}
                >
                  {s.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold tabular-nums">{s.value}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Two Column Layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Upload Form (2 cols) */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-white/4 border border-neutral-200/60 dark:border-white/6 shadow-sm dark:shadow-none rounded-2xl p-6 sticky top-24">
                <h2 className="text-base font-bold mb-1 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-blue-500" />
                  Upload Artefak Baru
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
                  Upload file .glb dan sistem akan generate QR secara otomatis.
                </p>

                {/* Status Banner */}
                {uploadStatus !== "idle" && (
                  <div
                    className={`flex items-center gap-2.5 text-sm p-3.5 rounded-xl mb-5 font-medium ${
                      uploadStatus === "success"
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                        : uploadStatus === "error"
                          ? "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20"
                          : "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20"
                    }`}
                  >
                    {uploadStatus === "success" && (
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    )}
                    {uploadStatus === "error" && (
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    )}
                    {uploadStatus === "uploading" && (
                      <div className="w-4 h-4 rounded-full border-2 border-current/30 border-t-current animate-spin flex-shrink-0" />
                    )}
                    {uploadStatus === "uploading"
                      ? "Memproses & mengupload..."
                      : uploadMsg}
                  </div>
                )}

                <form
                  ref={formRef}
                  onSubmit={handleUpload}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">
                      Nama Artefak *
                    </label>
                    <input
                      required
                      name="title"
                      type="text"
                      placeholder="Contoh: Fosil Pterodactyl"
                      className="w-full h-11 px-4 rounded-xl border border-neutral-200 dark:border-white/8 bg-neutral-50 dark:bg-white/5 focus:bg-white dark:focus:bg-white/8 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-sm placeholder:text-neutral-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">
                      Deskripsi
                    </label>
                    <textarea
                      name="description"
                      rows={4}
                      placeholder="Kisah di balik koleksi ini..."
                      className="w-full p-3.5 rounded-xl border border-neutral-200 dark:border-white/8 bg-neutral-50 dark:bg-white/5 focus:bg-white dark:focus:bg-white/8 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-sm resize-none placeholder:text-neutral-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">
                      Asal / Origin *
                    </label>
                    <input
                      required
                      name="origin"
                      type="text"
                      placeholder="Contoh: Indonesia"
                      className="w-full h-11 px-4 rounded-xl border border-neutral-200 dark:border-white/8 bg-neutral-50 dark:bg-white/5 focus:bg-white dark:focus:bg-white/8 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-sm placeholder:text-neutral-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">
                        Kreator
                      </label>
                      <input
                        name="creator_name"
                        type="text"
                        placeholder="Contoh: Mpu Gandring"
                        className="w-full h-11 px-4 rounded-xl border border-neutral-200 dark:border-white/8 bg-neutral-50 dark:bg-white/5 focus:bg-white dark:focus:bg-white/8 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-sm placeholder:text-neutral-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">
                        Tahun
                      </label>
                      <input
                        name="year"
                        type="text"
                        pattern="\d*"
                        placeholder="Contoh: 1200"
                        className="w-full h-11 px-4 rounded-xl border border-neutral-200 dark:border-white/8 bg-neutral-50 dark:bg-white/5 focus:bg-white dark:focus:bg-white/8 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-sm placeholder:text-neutral-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">
                      File 3D (.glb) *
                    </label>
                    <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 dark:border-white/10 rounded-xl p-6 cursor-pointer hover:border-blue-400 dark:hover:border-blue-400/50 transition-colors group bg-neutral-50/50 dark:bg-white/3">
                      <input
                        required
                        type="file"
                        name="file"
                        accept=".glb"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) =>
                          setFileName(e.target.files?.[0]?.name ?? null)
                        }
                      />
                      <Box className="w-8 h-8 text-neutral-400 dark:text-neutral-600 mb-2 group-hover:text-blue-400 transition-colors" />
                      <span className="text-sm font-medium text-center text-neutral-500 dark:text-neutral-400">
                        {fileName ? (
                          <span className="text-blue-500 font-semibold">
                            {fileName}
                          </span>
                        ) : (
                          "Klik untuk pilih file .glb"
                        )}
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={uploadStatus === "uploading"}
                    className="w-full h-11 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {uploadStatus === "uploading"
                      ? "Memproses..."
                      : "Upload & Generate QR"}
                  </button>
                </form>
              </div>
            </div>

            {/* Artifact Table (3 cols) */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-white/4 border border-neutral-200/60 dark:border-white/6 shadow-sm dark:shadow-none rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-100 dark:border-white/5 flex items-center justify-between">
                  <h2 className="text-base font-bold">Daftar Koleksi</h2>
                  <span className="text-xs font-mono text-neutral-400 bg-neutral-100 dark:bg-white/6 px-2.5 py-1 rounded-full">
                    {items.length} item
                  </span>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-7 h-7 border-2 border-neutral-200 dark:border-white/10 border-t-blue-500 rounded-full animate-spin" />
                  </div>
                ) : items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3 text-neutral-400">
                    <Box className="w-10 h-10 opacity-30" />
                    <p className="text-sm font-medium">
                      Belum ada koleksi. Upload sekarang!
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100 dark:divide-white/5">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 px-6 py-4 hover:bg-neutral-50 dark:hover:bg-white/3 transition-colors group"
                      >
                        {/* QR Thumbnail */}
                        <div className="w-12 h-12 flex-shrink-0 rounded-xl border border-neutral-200 dark:border-white/8 bg-neutral-100 dark:bg-white/5 flex items-center justify-center overflow-hidden">
                          {item.qrCodeUrl ? (
                            <img
                              src={item.qrCodeUrl}
                              alt="QR"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <QrCode className="w-5 h-5 text-neutral-400" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                            {formatDate(item.createdAt)}
                            {!item.qrCodeUrl && (
                              <span className="ml-2 text-amber-500 font-medium">
                                · No QR
                              </span>
                            )}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          {/* Edit Item */}
                          <button
                            onClick={() => setEditItem(item)}
                            title="Edit"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {/* Delete Item */}
                          <button
                            onClick={() => handleDelete(item.id, item.title)}
                            disabled={deletingId === item.id}
                            title="Hapus"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all disabled:opacity-50"
                          >
                            {deletingId === item.id ? (
                              <div className="w-4 h-4 rounded-full border-2 border-red-500/30 border-t-red-500 animate-spin flex-shrink-0" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>

                          {item.qrCodeUrl && (
                            <a
                              href={item.qrCodeUrl}
                              download
                              title="Download QR"
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/8 hover:text-neutral-900 dark:hover:text-white transition-all"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )}

                          <Link
                            href={`/item/${item.id}`}
                            title="Lihat Detail (AR)"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/8 hover:text-neutral-900 dark:hover:text-white transition-all"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Edit Modal ─────────────────────────────────────────────────── */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm dark:bg-black/80">
          <div className="w-full max-w-md bg-white dark:bg-[#111] border border-neutral-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-white/5">
              <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Pencil className="w-4 h-4 text-blue-500" />
                Edit Artefak
              </h2>
              <button
                onClick={() => setEditItem(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:text-white/30 dark:hover:text-white/70 dark:hover:bg-white/6 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">
                  Nama Artefak *
                </label>
                <input
                  required
                  name="title"
                  type="text"
                  defaultValue={editItem.title}
                  placeholder="Contoh: Fosil Pterodactyl"
                  className="w-full h-11 px-4 rounded-xl border border-neutral-200 dark:border-white/8 bg-neutral-50 dark:bg-white/5 focus:bg-white dark:focus:bg-white/8 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-sm placeholder:text-neutral-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={editItem.description || ""}
                  placeholder="Kisah di balik koleksi ini..."
                  className="w-full p-3.5 rounded-xl border border-neutral-200 dark:border-white/8 bg-neutral-50 dark:bg-white/5 focus:bg-white dark:focus:bg-white/8 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-sm resize-none placeholder:text-neutral-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">
                  Asal / Origin *
                </label>
                <input
                  required
                  name="origin"
                  type="text"
                  defaultValue={editItem.origin || ""}
                  placeholder="Contoh: Italia"
                  className="w-full h-11 px-4 rounded-xl border border-neutral-200 dark:border-white/8 bg-neutral-50 dark:bg-white/5 focus:bg-white dark:focus:bg-white/8 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-sm placeholder:text-neutral-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">
                    Kreator
                  </label>
                  <input
                    name="creator_name"
                    type="text"
                    defaultValue={editItem.creatorName || ""}
                    placeholder="Contoh: Mpu Gandring"
                    className="w-full h-11 px-4 rounded-xl border border-neutral-200 dark:border-white/8 bg-neutral-50 dark:bg-white/5 focus:bg-white dark:focus:bg-white/8 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-sm placeholder:text-neutral-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">
                    Tahun
                  </label>
                  <input
                    name="year"
                    type="text"
                    pattern="\d*"
                    defaultValue={editItem.year || ""}
                    placeholder="Contoh: 1200"
                    className="w-full h-11 px-4 rounded-xl border border-neutral-200 dark:border-white/8 bg-neutral-50 dark:bg-white/5 focus:bg-white dark:focus:bg-white/8 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-sm placeholder:text-neutral-400"
                  />
                </div>
              </div>

              {/* Note about 3D Model */}
              <div className="p-3 bg-neutral-50 dark:bg-white/5 rounded-xl border border-neutral-200/50 dark:border-white/5 flex items-start gap-3">
                <Box className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                <p className="text-xs text-neutral-500 dark:text-white/40 leading-relaxed">
                  File 3D (.glb) saat ini tidak dapat diubah setelah diupload
                  untuk menjaga integritas QR code. Jika artefak berbeda, harap
                  hapus dan upload ulang.
                </p>
              </div>

              {/* Modal Footer */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="h-10 px-4 rounded-xl text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="h-10 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin flex-shrink-0" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isUpdating ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
