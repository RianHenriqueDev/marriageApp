"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

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

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="bg-surface-card rounded-2xl sm:rounded-3xl max-w-md w-full p-4 sm:p-6 space-y-3 sm:space-y-4 border border-border-hairline shadow-none max-h-[85vh] flex flex-col justify-between animate-fade-up">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between pb-2 border-b border-border-hairline">
          <div>
            <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-accent-olive font-semibold block">
              Cartão Digital
            </span>
            <h3 className="font-serif text-lg sm:text-2xl font-normal text-content-primary">
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

        {/* PRÉVIA DO CARTÃO EDITORIAL (ÁREA ROLÁVEL COMPACTA) */}
        <div className="overflow-y-auto flex-1 py-1 flex justify-center">
          <div
            ref={cardRef}
            className="w-full max-w-[320px] bg-canvas-base p-5 sm:p-6 rounded-3xl border border-border-hairline shadow-editorial text-center space-y-3 sm:space-y-4 relative overflow-hidden"
          >
            {/* Monograma */}
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface-card border border-border-hairline text-accent-olive mx-auto">
              <span className="font-serif text-sm font-light tracking-wider">J ♥ R</span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[9px] font-sans tracking-[0.25em] uppercase text-content-secondary block">
                Convite de Casamento
              </span>
              <h2 className="font-serif text-xl text-content-primary font-normal">
                Jeniffer ♥ Rian
              </h2>
            </div>

            <div className="gold-divider w-14 mx-auto" />

            <div className="space-y-0.5">
              <span className="text-[9px] font-sans tracking-[0.15em] uppercase text-content-muted block">
                Convidado(a)
              </span>
              <h3 className="font-serif text-lg font-medium text-accent-olive">
                {guest.name}
              </h3>
            </div>

            {/* Informações dos dois momentos */}
            <div className="space-y-2 text-left bg-surface-card p-3.5 rounded-2xl border border-border-hairline text-xs font-sans text-content-secondary">
              <div className="flex items-center justify-between text-content-primary font-medium border-b border-border-hairline/60 pb-1">
                <span className="text-[11px]">12 de Dezembro de 2026</span>
                <span className="text-[11px]">Ribeirão Preto</span>
              </div>
              <div className="space-y-0.5 pt-0.5 text-[10.5px]">
                <div className="font-medium text-content-primary">
                  10:30h — 1º Cartório de Registro Civil
                </div>
                <div className="text-content-muted text-[9.5px]">
                  Rua Visconde de Inhaúma, 1315 — Centro
                </div>
              </div>
              <div className="space-y-0.5 pt-1 border-t border-border-hairline/60 text-[10.5px]">
                <div className="font-medium text-content-primary">
                  12:00h — Almoço na Churrascaria JP Steakhouse
                </div>
                <div className="text-content-muted text-[9.5px]">
                  Por adesão individual • Av. Alice de Moura Bragheto, 76
                </div>
              </div>
            </div>

            <div className="pt-1.5 border-t border-border-hairline text-[9.5px] font-sans text-content-muted">
              Confirme sua presença pelo link exclusivo:
              <br />
              <span className="text-accent-olive font-medium break-all">{inviteUrl}</span>
            </div>
          </div>
        </div>

        {/* Ações do Modal */}
        <div className="flex gap-3 pt-1 border-t border-border-hairline/60">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full bg-canvas-subtle text-content-secondary font-sans text-xs hover:bg-canvas-subtle/80 transition-all cursor-pointer"
          >
            Fechar
          </button>
          <button
            type="button"
            disabled={downloading}
            onClick={handleDownload}
            className="flex-1 py-2.5 rounded-full bg-accent-olive text-white font-sans text-xs font-semibold tracking-wider uppercase hover:bg-accent-olive-hover transition-all cursor-pointer shadow-editorial flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" strokeWidth={1.5} />
            <span>{downloading ? "Gerando..." : "Baixar Imagem"}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
