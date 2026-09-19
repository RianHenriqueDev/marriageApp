"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, X, Calendar, MapPin, Sparkles, Heart } from "lucide-react";

interface InviteImageModalProps {
  guest: {
    name: string;
    token: string;
    category: string;
    flowType: string;
    customNote?: string | null;
  };
  onClose: () => void;
}

export function InviteImageModal({ guest, onClose }: InviteImageModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#0d1b2a",
      });

      const link = document.createElement("a");
      link.download = `quest-card-${guest.token}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Erro ao exportar imagem retrô:", err);
      alert("Não foi possível gerar a imagem retrô. Tente novamente.");
    } finally {
      setDownloading(false);
    }
  };

  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/c/${guest.token}`
      : `/c/${guest.token}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-pixel select-none">
      <div className="bg-[#1a1c23] rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 border-4 border-black pixel-shadow-lg my-6">
        <div className="flex items-center justify-between pb-3 border-b-2 border-stone-700">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-gold-400">
              VIP QUEST CARD (EXPORTAÇÃO PNG)
            </h3>
            <p className="text-[9px] text-stone-400 font-sans mt-0.5">
              Pronto para envio no WhatsApp ou exibição nas redes da guilda
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded hover:bg-stone-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Prévia do Cartão que será renderizado em PNG */}
        <div className="flex justify-center">
          <div
            ref={cardRef}
            className="w-[360px] min-h-[520px] bg-[#101926] p-6 rounded-2xl border-4 border-black pixel-shadow-lg flex flex-col justify-between text-center relative overflow-hidden text-white"
          >
            {/* Efeito Moldura Dourada Retrô */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gold-400" />
            <div className="absolute inset-2 border-2 border-[#d7aa5f]/50 pointer-events-none rounded-xl" />

            <div className="space-y-3 pt-2">
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-black/80 border border-gold-400 rounded text-gold-300 text-[8px] uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-gold-400" />
                CONVOCAÇÃO DE AVENTUREIRO
              </div>

              <div className="space-y-1">
                <span className="text-[8px] text-stone-400 tracking-widest uppercase block">
                  CAMPANHA MATRIMONIAL OFICIAL
                </span>
                <h1 className="text-lg font-extrabold text-gold-400 tracking-wide">
                  RIAN & JENIFFER
                </h1>
              </div>

              <div className="w-16 h-1 bg-gold-400 mx-auto" />

              <div className="pt-2">
                <span className="text-[8px] text-stone-400 uppercase">CONVOCADO DE HONRA:</span>
                <h2 className="text-sm font-bold text-white mt-0.5 text-shadow-pixel">
                  {guest.name}
                </h2>
                {guest.customNote && (
                  <p className="text-[8px] text-gold-200 italic mt-1 px-2">
                    &ldquo;{guest.customNote}&rdquo;
                  </p>
                )}
              </div>
            </div>

            {/* Sprites Pixel dos Noivos no Cartão */}
            <div className="my-3 flex items-center justify-center gap-4 py-2 bg-black/50 border border-stone-800 rounded-lg">
              <div className="text-center">
                <span className="text-[7px] text-gold-300 block">NOIVO</span>
                <span className="text-xl">🤵</span>
              </div>
              <div className="text-red-500 animate-pulse text-sm">💖</div>
              <div className="text-center">
                <span className="text-[7px] text-pink-300 block">NOIVA</span>
                <span className="text-xl">👰</span>
              </div>
            </div>

            {/* Informações da Cerimônia */}
            <div className="p-3 rounded-lg bg-black/60 border border-gold-400/60 space-y-1.5 text-[8px]">
              <div className="flex items-center justify-center gap-1 text-gold-300 font-bold">
                <Calendar className="w-3.5 h-3.5 text-gold-400" />
                12 DE DEZEMBRO DE 2026 • 10:30H
              </div>
              <div className="flex flex-col items-center justify-center text-stone-300">
                <div className="flex items-center gap-1 font-bold text-white">
                  <MapPin className="w-3 h-3 text-gold-400" />
                  1º CARTÓRIO DE REGISTRO CIVIL
                </div>
                <span className="text-[7px] text-stone-400">R. Visc. de Inhaúma, 1315 - Ribeirão Preto</span>
              </div>
            </div>

            {/* Rodapé do Cartão */}
            <div className="pt-2 border-t border-stone-800 space-y-1">
              <p className="text-[8px] text-gold-300 uppercase tracking-wider">
                CONFIRME SUA PRESENÇA NA QUEST:
              </p>
              <p className="text-[7px] text-emerald-400 break-all font-mono">
                {inviteUrl}
              </p>
              <div className="flex items-center justify-center gap-1 text-[8px] text-stone-400 pt-1">
                <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                <span>SUA PARTY TE ESPERA!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-2.5 pt-2 text-[9px]">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded bg-stone-800 text-stone-400 hover:text-white border-2 border-black pixel-shadow cursor-pointer"
          >
            FECHAR
          </button>
          <button
            type="button"
            disabled={downloading}
            onClick={handleDownload}
            className="flex-1 py-2.5 rounded bg-gold-500 hover:bg-gold-400 text-black font-bold border-2 border-black pixel-shadow flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            {downloading ? "EXPORTANDO..." : "BAIXAR CARTÃO (PNG)"}
          </button>
        </div>
      </div>
    </div>
  );
}
