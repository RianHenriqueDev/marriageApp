import Link from "next/link";
import { Skull, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0a0c10] text-white font-pixel select-none flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#161922] border-4 border-red-600 pixel-shadow-lg rounded-2xl p-6 sm:p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-red-950/80 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto text-red-400 animate-bounce">
          <Skull className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-extrabold text-red-500 tracking-wider">
            GAME OVER!
          </h1>
          <p className="text-[10px] sm:text-xs text-stone-300 leading-relaxed">
            CONVIDADO NÃO ENCONTRADO NO BANCO DE DADOS DA GUILDA!
          </p>
        </div>

        <p className="text-[9px] text-stone-400">
          Verifique o link enviado pelo casal ou consulte os Game Masters (Rian & Jeniffer).
        </p>

        <div className="pt-2 flex flex-col gap-2.5">
          <Link
            href="/"
            className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-black border-2 border-black pixel-shadow text-[10px] font-bold flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>PRESS START / VOLTAR AO INÍCIO</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
