"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";

function InnerScannerAR({ src }: { src: string }) {
  useEffect(() => {
    import("@google/model-viewer");
  }, []);

  return (
    <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
      {React.createElement("model-viewer", {
        src: src,
        alt: "A 3D model",
        ar: true,
        "auto-rotate": true,
        "camera-controls": true,
        style: { width: "100%", height: "100%", backgroundColor: "transparent", pointerEvents: "auto" }
      })}
    </div>
  );
}

export const ModelViewerAR = dynamic(() => Promise.resolve(InnerScannerAR), { ssr: false });
