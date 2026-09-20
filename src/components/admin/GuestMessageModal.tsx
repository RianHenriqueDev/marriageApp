"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Heart, MessageSquareQuote } from "lucide-react";
import { Guest } from "@prisma/client";

interface GuestMessageModalProps {
  guest: Guest;
  onClose: () => void;
}

export function GuestMessageModal({ guest, onClose }: GuestMessageModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="bg-surface-card border border-border-hairline shadow-none rounded-2xl sm:rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 animate-fade-up max-h-[85vh] overflow-y-auto">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between pb-3 border-b border-border-hairline">
          <div>
            <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-accent-olive font-semibold block">
              Mensagem para os Noivos
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-normal text-content-primary">
              {guest.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-content-secondary hover:text-content-primary rounded-full hover:bg-canvas-subtle transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Card com a mensagem completa */}
        <div className="relative p-5 rounded-2xl bg-canvas-subtle/60 border border-border-hairline/80 space-y-3">
          <div className="flex items-center gap-2 text-accent-gold">
            <MessageSquareQuote className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-[11px] font-sans uppercase tracking-wider text-accent-olive/80 font-medium">
              Recado Especial
            </span>
          </div>

          <p className="font-serif text-base sm:text-lg text-content-primary italic leading-relaxed whitespace-pre-wrap">
            &ldquo;{guest.guestMessage}&rdquo;
          </p>

          <div className="pt-2 flex items-center justify-between text-[11px] font-sans text-content-muted border-t border-border-hairline/40">
            <span>Enviado com carinho</span>
            <Heart className="w-3.5 h-3.5 text-accent-gold fill-accent-gold/20" />
          </div>
        </div>

        {/* Botão de Fechar */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 min-h-[44px] rounded-full bg-accent-olive text-white font-sans text-xs font-semibold tracking-wider uppercase hover:bg-accent-olive-hover transition-all cursor-pointer shadow-editorial active:scale-[0.98]"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
