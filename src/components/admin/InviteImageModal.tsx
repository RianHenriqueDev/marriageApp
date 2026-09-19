"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, X } from "lucide-react";
import { Guest } from "@prisma/client";

interface InviteImageModalProps {
  guest: Guest;
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
        pixelRatio: 2.5,
        backgroundColor: "#FDFBF7",
      });

      const link = document.createElement("a");
      link.download = `convite-${guest.token}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Erro ao gerar imagem:", err);
      alert("Não foi possível gerar a imagem. Tente novamente.");
    } finally {
      setDownloading(false);
    }
  };

  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/c/${guest.token}`
      : `/c/${guest.token}`;

  return (
    <div className="fixed inset-0 z-50 bg-content-primary/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface-card rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 border border-border-hairline shadow-editorial-lg my-6 animate-fade-up">
        <div className="flex items-center justify-between pb-3 border-b border-border-hairline">
          <div>
            <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-accent-olive font-semibold block">
              Cartão Digital
            </span>
            <h3 className="font-serif text-2xl font-normal text-content-primary">
              Exportar Convite em Imagem
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-content-secondary hover:text-content-primary rounded-full hover:bg-canvas-subtle transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* PRÉVIA DO CARTÃO EDITORIAL */}
        <div className="flex justify-center">
          <div
            ref={cardRef}
            className="w-[340px] bg-canvas-base p-8 rounded-3xl border border-border-hairline shadow-editorial text-center space-y-6 relative overflow-hidden"
          >
            {/* Monograma */}
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-card border border-border-hairline text-accent-olive mx-auto">
              <span className="font-serif text-base font-light tracking-wider">J & R</span>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-sans tracking-[0.25em] uppercase text-content-secondary block">
                Convite de Casamento
              </span>
              <h2 className="font-serif text-2xl text-content-primary font-normal">
                Jeniffer & Rian
              </h2>
            </div>

            <div className="gold-divider w-16 mx-auto" />

            <div className="space-y-1">
              <span className="text-[9px] font-sans tracking-[0.15em] uppercase text-content-muted block">
                Convidado(a)
              </span>
              <h3 className="font-serif text-xl font-medium text-accent-olive">
                {guest.name}
              </h3>
            </div>

            {/* Informações dos dois momentos */}
            <div className="space-y-2 text-left bg-surface-card p-4 rounded-2xl border border-border-hairline text-xs font-sans text-content-secondary">
              <div className="flex items-center justify-between text-content-primary font-medium border-b border-border-hairline/60 pb-1.5">
                <span>12 de Dezembro de 2026</span>
                <span>Ribeirão Preto</span>
              </div>
              <div className="space-y-1 pt-1 text-[11px]">
                <div className="font-medium text-content-primary">
                  10:30h — 1º Cartório de Registro Civil
                </div>
                <div className="text-content-muted text-[10px]">
                  Rua Visconde de Inhaúma, 1315 — Centro
                </div>
              </div>
              <div className="space-y-1 pt-1 text-[11px] border-t border-border-hairline/60">
                <div className="font-medium text-content-primary">
                  ~12:30h — Almoço na Churrascaria JP Steakhouse
                </div>
                <div className="text-content-muted text-[10px]">
                  Por adesão individual • Av. Alice de Moura Bragheto, 76
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border-hairline text-[10px] font-sans text-content-muted">
              Confirme sua presença pelo link exclusivo:
              <br />
              <span className="text-accent-olive font-medium break-all">{inviteUrl}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-full bg-canvas-subtle text-content-secondary font-sans text-xs hover:bg-canvas-subtle/80 transition-all cursor-pointer"
          >
            Fechar
          </button>
          <button
            type="button"
            disabled={downloading}
            onClick={handleDownload}
            className="flex-1 py-3 rounded-full bg-accent-olive text-white font-sans text-xs font-semibold tracking-wider uppercase hover:bg-accent-olive-hover transition-all cursor-pointer shadow-editorial flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" strokeWidth={1.5} />
            <span>{downloading ? "Gerando..." : "Baixar Imagem"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
