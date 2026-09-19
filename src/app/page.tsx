"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Countdown } from "@/components/ui/Countdown";
import { Sparkles, Heart, Shield, Gamepad2, Play, KeyRound } from "lucide-react";
import { retroSound } from "@/lib/retroAudio";

export default function RetroTitleScreen() {
  const router = useRouter();
  const [savedToken, setSavedToken] = useState<string | null>(null);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [codeError, setCodeError] = useState("");

  // Verificar se já possui token salvo no navegador
  useEffect(() => {
    try {
      const stored = localStorage.getItem("wedding_guest_token");
      if (stored) {
        setSavedToken(stored);
      }
    } catch {}
  }, []);

  const handlePressStart = () => {
    retroSound.playVictory();
    if (savedToken) {
      router.push(`/c/${savedToken}`);
    } else {
      setIsLoadModalOpen(true);
    }
  };

  const handleLoadGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) {
      setCodeError("Insira seu código de aventureiro!");
      retroSound.playDodge();
      return;
    }
    retroSound.playSelect();
    const token = inputCode.trim().toLowerCase();
    try {
      localStorage.setItem("wedding_guest_token", token);
    } catch {}
    router.push(`/c/${token}`);
  };

  return (
    <main className="min-h-screen bg-[#070b12] text-white font-pixel select-none flex flex-col justify-between relative overflow-hidden p-4 sm:p-6">
      {/* Background Retrô: Céu Noturno com Estrelas em Pixel */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden bg-gradient-to-b from-[#03060c] via-[#0d1527] to-[#1a263d]">
        <div className="absolute top-10 left-12 w-2 h-2 bg-yellow-200 animate-pixel-blink" />
        <div className="absolute top-24 left-1/4 w-1.5 h-1.5 bg-yellow-100" />
        <div className="absolute top-16 right-16 w-3 h-3 bg-yellow-300 animate-pixel-blink" />
        <div className="absolute top-40 right-1/3 w-1.5 h-1.5 bg-yellow-100" />
        <div className="absolute top-32 left-1/2 w-2 h-2 bg-yellow-200" />

        {/* Lua em Pixel Art */}
        <div className="absolute top-8 right-12 w-14 h-14 rounded-full bg-[#f6eed9] border-4 border-black shadow-[0_0_20px_rgba(246,238,217,0.7)]" />

        {/* Silhueta de Castelo / Capela ao Fundo */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[340px] sm:w-[500px] h-[160px] bg-[#070e1b]/80 border-t-4 border-black flex flex-col items-center justify-start pt-3">
          <div className="w-16 h-20 bg-[#d7aa5f]/20 border-2 border-[#d7aa5f] rounded-t-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-gold-400 fill-gold-400 animate-pulse" />
          </div>
        </div>

        {/* Chão de Grama Retrô */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#122815] border-t-4 border-black">
          <div className="w-full h-2 bg-[#1e4622]" />
        </div>
      </div>

      {/* Top Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between text-[9px] sm:text-[11px] text-gold-400 pb-4">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-gold-400" />
          <span>16-BIT CARTRIDGE V2.0</span>
        </div>
        <div className="text-stone-400">12.12.2026 • 10:30H</div>
      </header>

      {/* Título Estilo Fliperama / Arcade Clássico */}
      <section className="max-w-2xl mx-auto w-full text-center my-auto py-6 flex flex-col items-center space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/60 border-2 border-gold-400 rounded text-gold-300 text-[8px] sm:text-[10px] tracking-wider uppercase">
          <Sparkles className="w-3 h-3 text-gold-400" />
          CAMPANHA NUPCIAL OFICIAL
        </div>

        {/* Logotipo Retrô */}
        <div className="space-y-2">
          <h1 className="text-xl sm:text-4xl md:text-5xl font-extrabold text-gold-400 tracking-wider text-shadow-pixel leading-tight drop-shadow-[4px_4px_0px_#000]">
            THE WEDDING QUEST
          </h1>
          <div className="text-xs sm:text-xl text-white font-bold tracking-widest text-[#f6eed9] flex flex-wrap items-center justify-center gap-2">
            <span>JENIFFER</span>
            <Heart className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-red-500 fill-red-500 animate-bounce" />
            <span>RIAN</span>
          </div>
        </div>

        {/* Contador Regressivo Retrô */}
        <div className="w-full max-w-md bg-[#11141a]/90 border-4 border-black pixel-shadow p-2.5 sm:p-3 rounded-xl overflow-hidden">
          <div className="text-[8px] sm:text-[9px] text-gold-400 mb-2 border-b border-stone-800 pb-1">
            TEMPO RESTANTE ATÉ A CERIMÔNIA:
          </div>
          <Countdown />
        </div>

        {/* Botão de PRESS START Animado */}
        <div className="pt-2 sm:pt-4 flex flex-col items-center gap-3 w-full px-2">
          <button
            type="button"
            onClick={handlePressStart}
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-[#c79038] hover:bg-[#d7aa5f] text-black border-4 border-black pixel-shadow-lg text-xs sm:text-sm font-extrabold tracking-widest animate-pulse hover:animate-none active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>PRESS START</span>
          </button>

          {savedToken ? (
            <Link
              href={`/c/${savedToken}`}
              className="text-[8px] sm:text-[10px] text-emerald-400 hover:text-emerald-300 underline text-center max-w-full break-words"
            >
              [ CONTINUE: CARREGAR PASSE VIP SALVO ]
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setIsLoadModalOpen(true)}
              className="text-[8px] sm:text-[9px] text-stone-400 hover:text-gold-300 underline cursor-pointer text-center"
            >
              [ INSERIR CÓDIGO DO CONVITE MANUALMENTE ]
            </button>
          )}
        </div>
      </section>

      {/* Rodapé Retrô */}
      <footer className="max-w-4xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t-2 border-black/80 text-[7px] sm:text-[9px] text-stone-500 text-center sm:text-left">
        <div>1º CARTÓRIO DE REGISTRO CIVIL • RIBEIRÃO PRETO - SP</div>
        <Link
          href="/admin"
          className="text-stone-500 hover:text-gold-400 flex items-center gap-1 transition-colors"
        >
          <Shield className="w-3 h-3 text-gold-500" />
          Game Master Access (Admin)
        </Link>
      </footer>

      {/* Modal Retrô: LOAD GAME (Inserir Token) */}
      {isLoadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a1c23] border-4 border-white pixel-shadow-lg rounded-xl max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center gap-2 text-gold-400 text-xs border-b border-stone-700 pb-2">
              <KeyRound className="w-4 h-4" />
              <span>LOAD GAME: CÓDIGO VIP</span>
            </div>

            <p className="text-[9px] text-stone-300 leading-relaxed">
              Insira o código do seu convite enviado no seu WhatsApp para acessar sua missão:
            </p>

            <form onSubmit={handleLoadGame} className="space-y-3">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value);
                  setCodeError("");
                }}
                placeholder="Ex: carlos-moura-a7x9"
                className="w-full px-3 py-2.5 bg-black border-2 border-gold-400 text-gold-300 text-[10px] rounded focus:outline-none placeholder:text-stone-600 font-pixel"
              />

              {codeError && (
                <div className="text-[8px] text-red-400 font-bold">{codeError}</div>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsLoadModalOpen(false)}
                  className="flex-1 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 border-2 border-black pixel-shadow text-[9px] cursor-pointer"
                >
                  VOLTAR
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-600 text-white border-2 border-black pixel-shadow text-[9px] cursor-pointer"
                >
                  ENTRAR!
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
