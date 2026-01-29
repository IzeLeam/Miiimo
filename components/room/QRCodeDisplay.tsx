"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { QRCodeSkeleton } from "@/components/ui/Skeleton";

interface QRCodeDisplayProps {
  url: string;
}

export function QRCodeDisplay({ url }: QRCodeDisplayProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function generateQR() {
      try {
        const QRCode = await import("qrcode");
        const dataUrl = await QRCode.toDataURL(url, {
          width: 280,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
          errorCorrectionLevel: "M",
        });
        setQrDataUrl(dataUrl);
      } catch (error) {
        console.error("Failed to generate QR code:", error);
      } finally {
        setLoading(false);
      }
    }

    generateQR();
  }, [url]);

  if (loading) {
    return <QRCodeSkeleton />;
  }

  if (!qrDataUrl) {
    return (
      <div className="w-[280px] h-[280px] flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-xl">
        <p className="text-neutral-500 text-sm">Failed to generate QR code</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="p-4 bg-white rounded-2xl shadow-sm border border-neutral-100">
        <Image
          src={qrDataUrl}
          alt="QR Code to share clipboard"
          width={280}
          height={280}
          className="rounded-lg"
          priority
        />
      </div>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 font-mono select-all">
        {url}
      </p>
    </div>
  );
}
