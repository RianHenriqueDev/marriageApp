"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Countdown } from "@/components/ui/Countdown";
import { WeddingMonogram } from "@/components/ui/WeddingMonogram";
import { Shield, ArrowRight } from "lucide-react";

export default function LuxuryLandingPage() {
  const router = useRouter();
  const [tokenInput, setTokenInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAccessInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) {
      setErrorMessage("Por favor, digite o código do seu convite.");
      return;
    }
    const token = tokenInput.trim().toLowerCase();
    router.push(`/c/${token}`);
  };

  return (
    <main className="min-h-screen bg-[#F8F6F0] text-[#1A1A19] flex flex-col justify-between py-10 px-4 sm:px-8 selection:bg-[#C5A880]/20 selection:text-[#2C3328]">
      {/* CABEÇALHO SUTIL */}
      <header className="max-w-xl mx-auto w-full flex items-center justify-between text-[11px] font-sans tracking-[0.25em] uppercase text-[#7C7C74] pb-4">
        <span>Convite Oficial</span>
        <span>12 • 12 • 2026</span>
      </header>

      {/* ÁREA CENTRAL PRINCIPAL */}
      <section className="max-w-[580px] mx-auto w-full text-center my-auto py-8 sm:py-12 space-y-10 animate-fade-up">
        {/* MONOGRAMA J & R EM TAMANHO DESTACADO */}
        <div className="flex justify-center pt-2">
          <WeddingMonogram size="xl" className="mx-auto" />
        </div>

        {/* NOMES EM TIPOGRAFIA PLAYFAIR DISPLAY EDITORIAL */}
        <div className="space-y-3">
          <span className="text-xs font-sans tracking-[0.3em] uppercase text-[#7C7C74] block">
            Com a bênção de Deus e de nossas famílias
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif text-[#1A1A19] font-normal tracking-tight flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <span>Jeniffer</span>
            <span className="text-[#C5A880] text-2xl sm:text-4xl animate-pulse">♥</span>
            <span>Rian</span>
          </h1>
          <p className="text-sm sm:text-base font-sans text-[#7C7C74] max-w-md mx-auto pt-1 leading-relaxed">
            Convidam para a celebração de seu matrimônio a realizar-se no dia 12 de Dezembro de 2026.
          </p>
        </div>

        {/* DIVISOR DELICADO */}
        <div className="w-20 h-[1px] bg-[#C5A880]/60 mx-auto" />

        {/* CONTAGEM REGRESSIVA MINIMALISTA EM COLUNAS FINAS */}
        <div className="py-1">
          <Countdown />
        </div>

        {/* 
          CAMPO CENTRAL EM FORMATO DE ENVELOPE DELICADO:
          "Possui um convite exclusivo? Digite seu código de convidado:"
          com input de linha única (border-b border-[#C5A880] bg-transparent text-center)
        */}
        <div className="relative bg-white border border-[#E8E2D5] outline outline-1 outline-[#C5A880]/30 outline-offset-[-8px] shadow-[0_15px_40px_rgba(0,0,0,0.04)] rounded-2xl p-6 sm:p-10 space-y-5 max-w-md mx-auto">
          <div className="space-y-1">
            <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#C5A880] font-semibold block">
              Acesso Restrito
            </span>
            <p className="text-xs sm:text-sm font-serif text-[#1A1A19]">
              Possui um convite exclusivo?
            </p>
            <p className="text-[11px] font-sans text-[#7C7C74]">
              Digite seu código de convidado:
            </p>
          </div>

          <form onSubmit={handleAccessInvite} className="space-y-4 pt-1">
            <div>
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => {
                  setTokenInput(e.target.value);
                  setErrorMessage("");
                }}
                placeholder="ex: tios-paulo-e-lucia"
                className="w-full py-2.5 bg-transparent border-b border-[#C5A880] text-center text-sm font-sans text-[#1A1A19] placeholder:text-[#9E9E96]/60 placeholder:text-xs focus:outline-none focus:border-[#2C3328] transition-colors"
              />
              {errorMessage && (
                <p className="text-[11px] font-sans text-red-700 mt-2">{errorMessage}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-full bg-[#2C3328] hover:bg-[#1E241B] text-white font-sans text-[11px] font-semibold tracking-[0.2em] uppercase transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <span>ABRIR MEU CONVITE</span>
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER DELICADO */}
      <footer className="max-w-xl mx-auto w-full flex items-center justify-between pt-6 border-t border-[#E8E2D5] text-[11px] font-sans text-[#9E9E96]">
        <span>Ribeirão Preto — SP</span>
        <Link
          href="/admin"
          className="hover:text-[#2C3328] transition-colors flex items-center gap-1"
        >
          <Shield className="w-3 h-3 text-[#C5A880]" strokeWidth={1.5} />
          <span>Acesso dos Noivos</span>
        </Link>
      </footer>
    </main>
  );
}
