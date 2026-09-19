"use client";

import { useState, useEffect } from "react";
import { submitRsvp } from "@/app/actions/rsvp";
import { getScriptForGuest } from "@/data/scripts";
import { triggerCelebration } from "@/lib/confetti";
import { retroSound } from "@/lib/retroAudio";
import { Volume2, VolumeX, Heart, Sparkles } from "lucide-react";

interface GameplayFlowProps {
  guest: {
    token: string;
    name: string;
    gender: "M" | "F";
    category?: string;
    scriptId?: string | null;
    status: "PENDING" | "ACCEPTED" | "DECLINED";
    allowedPlusOnes: number;
    confirmedPlusOnes: number;
    customNote?: string | null;
  };
}

export function GameplayFlow({ guest }: GameplayFlowProps) {
  const script = getScriptForGuest(guest.scriptId, guest.gender);
  const [currentStatus, setCurrentStatus] = useState(guest.status);
  const [plusOnes, setPlusOnes] = useState(guest.confirmedPlusOnes || 0);

  // Áudio
  const [audioMuted, setAudioMuted] = useState(false);

  // Estados do Diálogo e Roteiro
  // Fase 0: Fala inicial dos noivos com saudação personalizada
  // Fase 1: Jogador escolheu choiceA ou choiceB -> Noivos reagem (reactionA / reactionB)
  const [stage, setStage] = useState<"INTRO" | "REACTION">("INTRO");
  const [chosenOption, setChosenOption] = useState<"A" | "B" | null>(null);

  const introText = `Fala, ${guest.name}! ${script.initialMessage}${
    guest.customNote ? ` ⚡ Recado dos Noivos: "${guest.customNote}"` : ""
  }`;

  const currentDialogue =
    stage === "INTRO"
      ? introText
      : chosenOption === "A"
      ? script.reactionA
      : script.reactionB;

  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // Efeitos visuais retrô
  const [isShaking, setIsShaking] = useState(false);
  const [cursorChoice, setCursorChoice] = useState<"A" | "B" | "ACCEPT" | "RUN">("A");

  // Botão Fujão (Recusar)
  const [dodgeCount, setDodgeCount] = useState(0);
  const [currentTaunt, setCurrentTaunt] = useState<string | null>(null);
  const [runButtonOffset, setRunButtonOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showRunConfirm, setShowRunConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const toggleAudio = () => {
    const nextState = !audioMuted;
    setAudioMuted(nextState);
    retroSound.enabled = !nextState;
    if (!nextState) retroSound.playSelect();
  };

  // Efeito Typewriter clássico estilo Pokémon / Final Fantasy
  useEffect(() => {
    if (currentStatus !== "PENDING") return;

    let index = 0;
    setDisplayedText("");
    setIsTyping(true);

    const interval = setInterval(() => {
      index++;
      if (index <= currentDialogue.length) {
        setDisplayedText(currentDialogue.slice(0, index));
        if (index % 2 === 0 && !audioMuted) {
          retroSound.playBeep();
        }
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [currentDialogue, currentStatus, audioMuted]);

  // Completar o texto imediatamente se o jogador clicar na caixa de diálogo
  const handleDialogueClick = () => {
    if (isTyping) {
      setDisplayedText(currentDialogue);
      setIsTyping(false);
      if (!audioMuted) retroSound.playSelect();
    }
  };

  // Jogador seleciona Choice A ou Choice B
  const handleSelectChoice = (choice: "A" | "B") => {
    if (!audioMuted) retroSound.playSelect();
    setChosenOption(choice);
    setStage("REACTION");
  };

  // Esquiva divertida do botão RUN / Recusar
  const handleRunDodge = () => {
    if (!audioMuted) retroSound.playDodge();

    if (dodgeCount >= 5) {
      setShowRunConfirm(true);
      return;
    }

    const nextCount = dodgeCount + 1;
    setDodgeCount(nextCount);

    const tauntIndex = Math.min(nextCount - 1, script.taunts.length - 1);
    setCurrentTaunt(script.taunts[tauntIndex]);

    const randomX = (Math.random() - 0.5) * 200;
    const randomY = (Math.random() - 0.5) * 110;
    setRunButtonOffset({ x: randomX, y: randomY });
  };

  // Confirmação final da Quest
  const handleConfirm = async (status: "ACCEPTED" | "DECLINED") => {
    setLoading(true);
    const res = await submitRsvp({
      token: guest.token,
      status,
      confirmedPlusOnes: status === "ACCEPTED" ? plusOnes : 0,
    });
    setLoading(false);

    if (res.success) {
      setCurrentStatus(status);
      setShowRunConfirm(false);

      if (status === "ACCEPTED") {
        setIsShaking(true);
        if (!audioMuted) retroSound.playVictory();
        triggerCelebration();
        setTimeout(() => setIsShaking(false), 600);
      }
    }
  };

  const playerClass =
    guest.category === "PADRINHOS"
      ? "Padrinho Nv. 99"
      : guest.category === "FAMILIA_IDOSOS"
      ? "Lorde da Família"
      : "Convidado Especial";

  // =========================================================================
  // 1. TELA DE SAVE COMPLETO / VIP PLAYER CARD (APÓS RESPONDER)
  // =========================================================================
  if (currentStatus === "ACCEPTED" || currentStatus === "DECLINED") {
    const isAccepted = currentStatus === "ACCEPTED";
    return (
      <div className="w-full max-w-[720px] mx-auto p-3 font-pixel select-none">
        <div className="relative bg-[#1a1c23] border-4 border-black pixel-shadow-lg rounded-2xl p-4 sm:p-6 overflow-hidden">
          {/* Top Bar do Console */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-black/60 mb-5 text-[#f6eed9] text-[10px] sm:text-xs">
            <span className="flex items-center gap-1 text-gold-400">
              <Sparkles className="w-4 h-4" /> SAVE SLOT #01: CONCLUÍDO
            </span>
            <span className="text-stone-400 tracking-wider">12.12.2026 // 10:30H</span>
          </div>

          {/* Banner Level Up */}
          {isAccepted && (
            <div className="bg-gold-500 text-black border-2 border-black pixel-shadow py-2.5 px-3 text-center mb-5 text-[10px] sm:text-xs tracking-wider animate-pulse">
              ★ LEVEL UP! PRESENÇA GARANTIDA PARA 12/12/2026 ★
            </div>
          )}

          {/* Ficha de Personagem (Player Pass VIP) com Moldura de Ouro */}
          <div className="relative bg-[#252836] border-4 border-[#ab732c] rounded-xl p-5 sm:p-8 pixel-shadow-gold text-white space-y-5 overflow-hidden">
            {/* Efeito Scanlines */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />

            {/* Carimbo Pixelado atravessado */}
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none border-4 px-6 py-2 text-xl sm:text-3xl font-bold tracking-widest uppercase rotate-[-15deg] opacity-90 z-20 ${
                isAccepted
                  ? "border-emerald-400 text-emerald-400 bg-emerald-950/85 shadow-[0_0_25px_rgba(52,211,153,0.6)]"
                  : "border-red-500 text-red-500 bg-red-950/85 shadow-[0_0_25px_rgba(239,68,68,0.6)]"
              }`}
            >
              {isAccepted ? "CONFIRMADO" : "AUSENTE"}
            </div>

            {/* Header da Ficha */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-[#ab732c]/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-[#133e33] border-2 border-black pixel-shadow rounded-lg flex items-center justify-center text-2xl">
                  {guest.gender === "F" ? "🧙‍♀️" : "⚔️"}
                </div>
                <div>
                  <span className="text-[9px] text-gold-400 uppercase tracking-widest block">
                    VIP PLAYER CARD • {playerClass}
                  </span>
                  <h2 className="text-sm sm:text-lg text-white font-bold tracking-wide">
                    {guest.name}
                  </h2>
                </div>
              </div>

              <div className="text-right text-[10px] text-stone-300">
                <span className="block text-gold-300">STATUS QUEST:</span>
                <span className="text-[9px] text-emerald-400 font-bold">
                  {isAccepted ? "MISSÃO CONFIRMADA" : "MISSÃO RECUSADA"}
                </span>
              </div>
            </div>

            {/* RPG Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] pt-1">
              <div className="bg-[#1a1c23] border-2 border-black p-3 rounded">
                <div className="flex justify-between mb-1 text-emerald-400">
                  <span>HP (ALEGRIA)</span>
                  <span>100 / 100</span>
                </div>
                <div className="w-full bg-stone-700 h-3 border border-black rounded-sm overflow-hidden">
                  <div className="bg-emerald-500 h-full w-full" />
                </div>
              </div>

              <div className="bg-[#1a1c23] border-2 border-black p-3 rounded">
                <div className="flex justify-between mb-1 text-gold-400">
                  <span>MP (CHOPP)</span>
                  <span>∞ / ∞</span>
                </div>
                <div className="w-full bg-stone-700 h-3 border border-black rounded-sm overflow-hidden">
                  <div className="bg-gold-500 h-full w-full" />
                </div>
              </div>
            </div>

            {/* Informações Oficiais da Cerimônia */}
            <div className="bg-[#1a1c23] border-2 border-black p-3.5 rounded text-[10px] space-y-1.5 text-stone-300">
              <div className="flex items-center justify-between text-gold-300 border-b border-stone-700 pb-1">
                <span>EVENTO:</span>
                <span>CASAMENTO RIAN & JENIFFER</span>
              </div>
              <div className="flex items-center justify-between">
                <span>DATA & HORA:</span>
                <span>12/12/2026 • 10:30H</span>
              </div>
              <div className="flex items-center justify-between">
                <span>LOCAL:</span>
                <span className="text-right">1º CARTÓRIO - RIBEIRÃO PRETO</span>
              </div>
              <div className="flex items-center justify-between text-stone-400 text-[9px]">
                <span>ENDEREÇO:</span>
                <span>R. Visconde de Inhaúma, 1315</span>
              </div>
              {isAccepted && plusOnes > 0 && (
                <div className="flex items-center justify-between text-emerald-400 pt-1 border-t border-stone-700">
                  <span>PARTY BUFF:</span>
                  <span>+{plusOnes} ACOMPANHANTE(S) REGISTRADO(S)</span>
                </div>
              )}
            </div>

            {/* Fala Final dos Noivos */}
            <div className="p-3 bg-[#133e33]/80 border-2 border-black rounded text-[10px] leading-relaxed text-[#f6eed9]">
              💬 &ldquo;{isAccepted ? script.acceptedMessage : script.declinedMessage}&rdquo;
            </div>

            {/* Informação de Save Travado */}
            <div className="pt-2 text-center text-[9px] text-stone-400">
              🔒 TICKET VIP BLOQUEADO NO CARTÓRIO • APRESENTE SEU NOME NA ENTRADA
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. CAMPANHA RPG RETRÔ ATIVA (PENDING)
  // =========================================================================
  return (
    <div
      className={`w-full max-w-[720px] mx-auto p-2 sm:p-4 font-pixel select-none ${
        isShaking ? "screen-shake" : ""
      }`}
    >
      {/* Moldura de Console GBA / Arcade 16-Bit */}
      <div className="relative bg-[#252730] border-4 border-black pixel-shadow-lg rounded-2xl sm:rounded-3xl p-3 sm:p-5 overflow-hidden">
        {/* Top Header do Console */}
        <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-black text-[#d7aa5f] text-[9px] sm:text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-black inline-block animate-pulse" />
            <span>THE WEDDING QUEST // 12.12.2026</span>
          </div>

          <button
            type="button"
            onClick={toggleAudio}
            title={audioMuted ? "Ativar som 8-bit" : "Mutar som 8-bit"}
            className="p-1.5 bg-[#1a1c23] hover:bg-black text-gold-400 border-2 border-black pixel-shadow-sm rounded cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
          >
            {audioMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* CENÁRIO PIXEL ART (GAME CANVAS) */}
        <div className="relative w-full h-[210px] sm:h-[260px] rounded-xl border-4 border-black overflow-hidden mb-3 bg-[#0d1b2a] flex flex-col justify-between">
          <div className="absolute inset-0 bg-gradient-to-b from-[#090a0f] via-[#141829] to-[#2b1b3d]" />

          {/* Lua e Estrelas Retrô */}
          <div className="absolute top-4 right-8 w-8 h-8 rounded-full bg-[#f6eed9] border-2 border-black shadow-[0_0_12px_rgba(246,238,217,0.8)]" />
          <div className="absolute top-12 left-10 w-1.5 h-1.5 bg-yellow-200" />
          <div className="absolute top-8 left-36 w-1 h-1 bg-yellow-100" />
          <div className="absolute top-20 right-28 w-1 h-1 bg-yellow-200" />

          {/* Altar / Capela com Vitral */}
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-32 sm:w-44 h-32 bg-[#1b263b]/70 border-2 border-black/80 flex flex-col items-center justify-start pt-2">
            <div className="w-10 sm:w-14 h-14 rounded-t-full bg-gradient-to-b from-[#d7aa5f]/60 to-[#0a261f]/60 border border-gold-300 flex items-center justify-center">
              <Heart className="w-4 h-4 text-gold-400 fill-gold-400 animate-pulse" />
            </div>
            <div className="text-[8px] text-gold-300 mt-1">10:30H</div>
          </div>

          {/* Chão com Grama Retrô */}
          <div className="absolute bottom-0 left-0 right-0 h-14 bg-[#1e3f20] border-t-4 border-[#0e2410]">
            <div className="w-full h-2 bg-[#2d5e30]" />
          </div>

          {/* HUD Topo */}
          <div className="relative z-10 m-2 flex justify-between text-[9px] text-white">
            <div className="bg-[#111]/80 border-2 border-black px-2 py-1 rounded">
              <span className="text-gold-400">HERÓI:</span> {guest.name}
            </div>
            <div className="bg-[#111]/80 border-2 border-black px-2 py-1 rounded text-emerald-400">
              {playerClass}
            </div>
          </div>

          {/* Sprites dos Noivos */}
          <div className="relative z-10 flex items-end justify-center gap-6 pb-2">
            {/* Rian */}
            <div className="flex flex-col items-center">
              <div className="text-[8px] text-gold-300 bg-black/80 px-1 border border-black mb-1">
                RIAN
              </div>
              <div className="w-12 h-14 bg-stone-900 border-2 border-black pixel-shadow-sm rounded flex flex-col items-center justify-between p-1">
                <div className="w-6 h-6 bg-[#fcd5b5] border border-black rounded-sm flex items-center justify-center text-xs">
                  🤵
                </div>
                <div className="w-8 h-5 bg-[#0a261f] border border-black flex items-center justify-center">
                  <div className="w-2 h-2 bg-gold-400 rotate-45" />
                </div>
              </div>
            </div>

            <div className="text-red-500 animate-bounce text-base pb-3">💖</div>

            {/* Jeniffer */}
            <div className="flex flex-col items-center">
              <div className="text-[8px] text-pink-300 bg-black/80 px-1 border border-black mb-1">
                JENIFFER
              </div>
              <div className="w-12 h-14 bg-white border-2 border-black pixel-shadow-sm rounded flex flex-col items-center justify-between p-1">
                <div className="w-6 h-6 bg-[#fcd5b5] border border-black rounded-sm flex items-center justify-center text-xs">
                  👰
                </div>
                <div className="w-9 h-5 bg-white border border-black" />
              </div>
            </div>
          </div>
        </div>

        {/* CAIXA DE DIÁLOGO ESTILO POKÉMON / FINAL FANTASY */}
        <div
          onClick={handleDialogueClick}
          className="relative bg-[#0c1b33] border-4 border-white pixel-shadow p-3.5 sm:p-5 rounded-xl mb-3 cursor-pointer min-h-[95px] sm:min-h-[110px] flex flex-col justify-between"
        >
          <div className="absolute inset-1 border border-white/40 pointer-events-none" />

          <div className="relative z-10 inline-block self-start -mt-6 sm:-mt-7 bg-[#d7aa5f] text-black border-2 border-black px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-wider">
            NOIVO RIAN & NOIVA JENIFFER:
          </div>

          <div className="relative z-10 text-white text-[10px] sm:text-xs leading-relaxed tracking-wide mt-1">
            {displayedText}
            {isTyping && <span className="inline-block w-2 h-3 bg-white ml-1 animate-pixel-blink" />}
          </div>

          <div className="relative z-10 self-end text-gold-400 text-xs sm:text-sm animate-pixel-blink">
            ▼
          </div>
        </div>

        {/* Taunt / Frase de Zoeira ao Tentar Fugir */}
        {currentTaunt && (
          <div className="bg-red-900/90 border-2 border-black text-red-200 text-[9px] sm:text-[10px] p-2 rounded pixel-shadow mb-3 text-center animate-bounce">
            ⚠️ {currentTaunt}
          </div>
        )}

        {/* INTERFACE DE DECISÕES: ETAPA 1 (ESCOLHA DO DIÁLOGO) OU ETAPA 2 (ACEITAR/RECUSAR) */}
        {stage === "INTRO" ? (
          /* FASE DE RESPOSTA DO JOGADOR (CHOICE A vs CHOICE B) */
          <div className="bg-[#11141a] border-4 border-black p-3.5 rounded-xl pixel-shadow space-y-2">
            <div className="text-[9px] text-gold-400 border-b border-stone-700 pb-1 flex justify-between items-center">
              <span>SUA VEZ DE FALAR (RESPOSTA):</span>
              <span className="text-[8px] text-stone-400">SELECIONE UMA FALA</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onMouseEnter={() => setCursorChoice("A")}
                onClick={() => handleSelectChoice("A")}
                className="text-left p-2.5 bg-[#1b263b] hover:bg-[#253654] text-white border-2 border-black pixel-shadow text-[9px] sm:text-[10px] flex items-center gap-1.5 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
              >
                <span className={cursorChoice === "A" ? "text-gold-300" : "opacity-0"}>►</span>
                <span>[A] {script.choiceA}</span>
              </button>

              <button
                type="button"
                onMouseEnter={() => setCursorChoice("B")}
                onClick={() => handleSelectChoice("B")}
                className="text-left p-2.5 bg-[#1b263b] hover:bg-[#253654] text-white border-2 border-black pixel-shadow text-[9px] sm:text-[10px] flex items-center gap-1.5 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
              >
                <span className={cursorChoice === "B" ? "text-gold-300" : "opacity-0"}>►</span>
                <span>[B] {script.choiceB}</span>
              </button>
            </div>
          </div>
        ) : (
          /* FASE FINAL: MENU DE BATALHA COM ACEITAR E BOTÃO FUJÃO */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Comandos Finais */}
            <div className="bg-[#11141a] border-4 border-black p-3 rounded-xl pixel-shadow flex flex-col justify-between space-y-2">
              <div className="text-[9px] text-gold-400 border-b border-stone-700 pb-1 flex justify-between items-center">
                <span>COMANDO FINAL DA QUEST:</span>
                <span className="text-[8px] text-emerald-400">DECISÃO</span>
              </div>

              <div className="space-y-2 pt-1">
                {/* Botão Aceitar Presença */}
                <button
                  type="button"
                  disabled={loading}
                  onMouseEnter={() => {
                    setCursorChoice("ACCEPT");
                    if (!audioMuted) retroSound.playSelect();
                  }}
                  onClick={() => handleConfirm("ACCEPTED")}
                  className="w-full text-left p-3 bg-emerald-800 hover:bg-emerald-700 text-white border-2 border-black pixel-shadow text-[10px] sm:text-xs flex items-center justify-between cursor-pointer active:translate-x-1 active:translate-y-1 active:shadow-none transition-transform"
                >
                  <span className="flex items-center gap-1.5">
                    <span className={cursorChoice === "ACCEPT" ? "text-gold-300" : "opacity-0"}>►</span>
                    <span>CONFIRMAR PRESENÇA!</span>
                  </span>
                  <span className="text-[9px] bg-black/40 px-1.5 py-0.5 rounded text-gold-300">
                    {loading ? "..." : "[ SIM ]"}
                  </span>
                </button>

                {/* Botão Fujão (Recusar) */}
                <div
                  style={{
                    transform: `translate(${runButtonOffset.x}px, ${runButtonOffset.y}px)`,
                    transition: "transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                >
                  <button
                    type="button"
                    onMouseEnter={() => {
                      setCursorChoice("RUN");
                      handleRunDodge();
                    }}
                    onTouchStart={() => {
                      setCursorChoice("RUN");
                      handleRunDodge();
                    }}
                    onClick={handleRunDodge}
                    className="w-full text-left p-2.5 bg-stone-700 hover:bg-red-800 text-stone-300 hover:text-white border-2 border-black pixel-shadow text-[9px] sm:text-[10px] flex items-center justify-between cursor-pointer select-none active:translate-x-1 active:translate-y-1 active:shadow-none"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className={cursorChoice === "RUN" ? "text-gold-300" : "opacity-0"}>►</span>
                      <span>
                        {dodgeCount === 0
                          ? "FUGIR DA FESTA"
                          : dodgeCount < 5
                          ? `ERRO AO FUGIR (${5 - dodgeCount}x)`
                          : "DESISTIR DEFINITIVO?"}
                      </span>
                    </span>
                    <span className="text-[8px] bg-black/50 px-1 py-0.5 rounded text-stone-400">
                      [ RUN ]
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Inventário de Acompanhantes */}
            <div className="bg-[#11141a] border-4 border-black p-3 rounded-xl pixel-shadow flex flex-col justify-between">
              <div>
                <div className="text-[9px] text-gold-400 border-b border-stone-700 pb-1 flex justify-between items-center mb-2">
                  <span>INVENTÁRIO / PARTY:</span>
                  <span className="text-[8px] text-stone-400">VAGAS</span>
                </div>

                {guest.allowedPlusOnes > 0 ? (
                  <div>
                    <span className="text-[9px] text-stone-300 block mb-2">
                      ACOMPANHANTES (MÁX: {guest.allowedPlusOnes}):
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {Array.from({ length: guest.allowedPlusOnes + 1 }).map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setPlusOnes(idx);
                            if (!audioMuted) retroSound.playSelect();
                          }}
                          className={`py-1.5 border-2 border-black pixel-shadow-sm text-[9px] cursor-pointer transition-transform ${
                            plusOnes === idx
                              ? "bg-gold-500 text-black font-bold translate-x-0.5 translate-y-0.5 shadow-none"
                              : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                          }`}
                        >
                          {idx === 0 ? "SÓ EU" : `+${idx}`}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-[9px] text-stone-400 leading-relaxed pt-2">
                    CONVITE INDIVIDUAL VIP.
                    <br />
                    SUA PRESENÇA É O BUFF DA NOSSA FESTA!
                  </div>
                )}
              </div>

              <div className="text-[8px] text-stone-500 text-center pt-2">
                SISTEMA ANTI-DESISTÊNCIA ATIVO
              </div>
            </div>
          </div>
        )}

        {/* Modal de Desistência Real se insistir 5 vezes */}
        {showRunConfirm && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#1a1c23] border-4 border-white pixel-shadow-lg rounded-xl max-w-sm w-full p-5 text-center space-y-4">
              <div className="text-2xl">⚠️</div>
              <h3 className="text-white text-xs font-bold">
                VOCÊ TEM CERTEZA QUE DESEJA ABANDONAR A QUEST?
              </h3>
              <p className="text-[9px] text-stone-400 leading-relaxed">
                Rian & Jeniffer gostariam muito de celebrar com você em 12/12/2026. Deseja mesmo confirmar ausência?
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!audioMuted) retroSound.playSelect();
                    setShowRunConfirm(false);
                  }}
                  className="w-full py-2 bg-emerald-800 hover:bg-emerald-700 text-white border-2 border-black pixel-shadow text-[10px] cursor-pointer"
                >
                  VOLTAR E CONFIRMAR PRESENÇA!
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleConfirm("DECLINED")}
                  className="w-full py-1.5 bg-stone-800 hover:bg-red-900 text-stone-400 hover:text-white border-2 border-black pixel-shadow-sm text-[8px] cursor-pointer"
                >
                  CONFIRMAR AUSÊNCIA DEFINITIVA
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
