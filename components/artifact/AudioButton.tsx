"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useState, useEffect } from "react";

export function AudioButton({ title, text }: { title: string; text: string }) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const toggleAudio = () => {
    if (!("speechSynthesis" in window)) {
      alert("Browser Anda tidak mendukung fitur Voice-Over.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const fullText = `${title}. ${text}`;
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.lang = "id-ID";
      
      // Select an Indonesian voice if available
      const voices = window.speechSynthesis.getVoices();
      const idVoice = voices.find(v => v.lang === "id-ID" || v.lang === "id");
      if (idVoice) utterance.voice = idVoice;

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <button
      onClick={toggleAudio}
      className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md transition-all font-bold text-[10px] tracking-widest uppercase border ${
        isPlaying
          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse"
          : "bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-300 border-black/10 dark:border-white/10 hover:border-emerald-500/30 hover:text-emerald-500"
      }`}
      title={isPlaying ? "Hentikan Audio" : "Putar Narasi Audio"}
    >
      {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      {isPlaying ? "Membaca..." : "Dengarkan"}
    </button>
  );
}
