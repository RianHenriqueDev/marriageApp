import Link from "next/link";
import { WeddingMonogram } from "@/components/ui/WeddingMonogram";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F8F6F0] text-[#1A1A19] flex flex-col justify-between py-8 px-4 sm:px-8 selection:bg-[#C5A880]/20 selection:text-[#2C3328]">
      <header className="max-w-xl mx-auto w-full flex items-center justify-between text-[10px] sm:text-[11px] font-sans tracking-[0.25em] uppercase text-[#7C7C74]">
        <span>Jeniffer & Rian</span>
        <span>12 • 12 • 2026</span>
      </header>

      <div className="max-w-md w-full mx-auto my-auto bg-white border border-[#E8E2D5] outline outline-1 outline-[#C5A880]/30 outline-offset-[-6px] sm:outline-offset-[-8px] rounded-2xl p-6 sm:p-10 text-center space-y-6 animate-fade-up">
        <div className="flex justify-center">
          <WeddingMonogram size="md" className="mx-auto" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#C5A880] font-semibold block">
            Convite Não Encontrado
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#1A1A19] font-normal tracking-tight">
            Página ou Convite Inexistente
          </h1>
          <p className="text-xs font-sans text-[#7C7C74] leading-relaxed pt-1">
            Não encontramos este convite em nossos registros. Por favor, confira o código digitado ou entre em contato com os noivos.
          </p>
        </div>

        <div className="w-12 h-[1px] bg-[#C5A880]/50 mx-auto" />

        <div className="pt-1">
          <Link
            href="/"
            className="w-full py-3.5 px-6 min-h-[44px] rounded-full bg-[#2C3328] hover:bg-[#1E241B] text-white font-sans text-xs font-semibold tracking-[0.18em] uppercase transition-all cursor-pointer shadow-editorial flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar à Página Inicial</span>
          </Link>
        </div>
      </div>

      <footer className="text-center text-[11px] font-sans text-[#9E9E96] py-2">
        Casamento Jeniffer & Rian • Ribeirão Preto - SP
      </footer>
    </main>
  );
}
