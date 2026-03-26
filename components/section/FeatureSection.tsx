"use client";

import { motion } from "framer-motion";
import {
  Scan,
  Box,
  Volume2,
  History,
  Smartphone,
  ShieldCheck,
} from "lucide-react";

const FEATURES = [
  {
    icon: Smartphone,
    title: "WebAR Tanpa Aplikasi",
    description:
      "Nikmati pengalaman AR langsung melalui browser smartphone Anda tanpa perlu mengunduh aplikasi tambahan.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Box,
    title: "Model 3D Fidelity Tinggi",
    description:
      "Setiap artefak didigitalisasi dengan detail ultra-presisi untuk memberikan visualisasi yang mendekati aslinya.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Scan,
    title: "Scan QR Instant",
    description:
      "Cukup arahkan kamera ke QR Code di samping pajangan untuk membuka informasi mendalam secara otomatis.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Volume2,
    title: "Interactive Audio Guide",
    description:
      "Dengarkan narasi suara memukau di balik setiap mahakarya museum tanpa perlu lelah membaca teks.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: History,
    title: "Narasi Budaya Lengkap",
    description:
      "Pelajari sejarah, filosofi, dan asal-usul artefak melalui narasi tekstual yang komprehensif.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Pelestarian Digital",
    description:
      "Menjaga warisan budaya tetap abadi dalam format digital untuk generasi mendatang.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const FeatureSection = () => {
  return (
    <section
      id="fitur"
      className="w-full py-32 px-6 md:px-12 lg:px-24 bg-transparent transition-colors relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-24 max-w-3xl">
          <p className="text-emerald-500 font-bold tracking-[0.3em] uppercase text-[10px]">
            The Smartseum Edge
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-black dark:text-white leading-tight">
            Fitur Canggih Untuk{" "}
            <span className="text-emerald-500">Masa Depan</span> Museum.
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-light leading-relaxed pt-2">
            Kami menggabungkan seni dan teknologi untuk memberikan pengalaman
            yang tak terlupakan bagi setiap pengunjung.
          </p>
        </div>

        {/* Feature Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
        >
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className="group relative p-8 rounded-[2rem] border border-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/8 transition-all duration-500 hover:shadow-2xl hover:border-emerald-500/30 overflow-hidden"
              >
                {/* Accent Glow on Hover */}
                <div
                  className={`absolute -top-12 -right-12 w-24 h-24 blur-3xl rounded-full opacity-0 group-hover:opacity-20 transition-opacity ${feature.bg}`}
                />

                <div
                  className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <Icon className={`w-7 h-7 ${feature.color}`} />
                </div>

                <h3 className="text-xl font-bold tracking-tight text-black dark:text-white mb-3 group-hover:text-emerald-500 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-light">
                  {feature.description}
                </p>

                {/* Decorative Element */}
                <div className="mt-8 h-px w-0 group-hover:w-full bg-linear-to-r from-emerald-500/50 to-transparent transition-all duration-700" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureSection;
