"use client";

import { useState } from "react";
import { submitRsvp } from "@/app/actions/rsvp";
import { triggerCelebration } from "@/lib/confetti";
import { retroSound } from "@/lib/retroAudio";
import { Check, Users, Sparkles, BookOpen } from "lucide-react";
import { Countdown } from "@/components/ui/Countdown";

import { PhaseAttendance, RsvpStatus } from "@prisma/client";

interface ClassicFlowProps {
  guest: {
    token: string;
    name: string;
    status: RsvpStatus;
    allowedPlusOnes: number;
    confirmedPlusOnes: number;
    customNote?: string | null;
    attendance?: PhaseAttendance;
  };
}

export function ClassicFlow({ guest }: ClassicFlowProps) {
  const [currentStatus, setCurrentStatus] = useState<RsvpStatus>(guest.status);
  const [currentAttendance, setCurrentAttendance] = useState<PhaseAttendance>(
    guest.attendance || PhaseAttendance.BOTH
  );
  const [selectedPhase, setSelectedPhase] = useState<PhaseAttendance>(
    guest.attendance && guest.attendance !== "NONE" ? guest.attendance : PhaseAttendance.BOTH
  );
  const [plusOnes, setPlusOnes] = useState(guest.confirmedPlusOnes || 0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirm = async (status: RsvpStatus, attendancePhase?: PhaseAttendance) => {
    setLoading(true);
    setErrorMessage(null);

    const targetAttendance = status === "DECLINED" ? PhaseAttendance.NONE : (attendancePhase || selectedPhase);

    const res = await submitRsvp({
      token: guest.token,
      status,
      confirmedPlusOnes: status === "ACCEPTED" ? plusOnes : 0,
      attendance: targetAttendance,
    });

    setLoading(false);

    if (res.success) {
      setCurrentStatus(status);
      setCurrentAttendance(targetAttendance);
      if (status === "ACCEPTED") {
        retroSound.playVictory();
        triggerCelebration();
      }
    } else {
      setErrorMessage(res.error || "Ocorreu um erro. Tente novamente.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full select-none px-1">
      {/* Moldura de Livro de Missões / Pergaminho Retrô */}
      <div className="relative bg-[#fbf5e8] border-4 border-[#2b1810] shadow-[8px_8px_0px_0px_#111] rounded-2xl p-4 sm:p-10 text-[#2b1810] space-y-4 sm:space-y-6">
        {/* Selo do Livro de Honra */}
        <div className="flex items-center justify-between border-b-4 border-[#2b1810] pb-3">
          <div className="flex items-center gap-2 font-pixel text-[9px] sm:text-xs text-[#895525]">
            <BookOpen className="w-4 h-4" />
            <span>LIVRO DE HONRA • CONVITE OFICIAL</span>
          </div>
          <span className="font-pixel text-[8px] sm:text-[9px] bg-[#d7aa5f] text-black px-2 py-0.5 border-2 border-black rounded">
            12.12.2026
          </span>
        </div>

        {/* Saudação com Tipografia Nobre e Legível */}
        <div className="text-center space-y-3 pt-2">
          <span className="font-pixel text-[9px] uppercase tracking-widest text-[#895525] block">
            Bênção e Presença Especial
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#0a261f]">
            {guest.name}
          </h1>

          {guest.customNote ? (
            <p className="text-sm sm:text-base italic px-5 py-3 bg-[#ede2d4]/80 border-2 border-[#2b1810] rounded-xl font-medium">
              &ldquo;{guest.customNote}&rdquo;
            </p>
          ) : (
            <p className="text-sm sm:text-base leading-relaxed text-stone-700">
              A sua bênção e a sua presença são o nosso maior presente neste dia sagrado.
            </p>
          )}
        </div>

        {/* Informações das Duas Etapas */}
        <div className="space-y-3">
          {/* Fase 1 */}
          <div className="p-3.5 bg-white/80 border-2 border-[#2b1810] rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-pixel text-[9px] text-[#0a261f] font-bold">
                📜 1ª FASE: O JURAMENTO SOLENE (CARTÓRIO)
              </span>
              <span className="font-pixel text-[8px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-400">
                0 GOLD • GRÁTIS
              </span>
            </div>
            <p className="text-xs text-stone-700 font-medium">
              12/12/2026 às 10:30h • 1º Cartório de Registro Civil de Ribeirão Preto
            </p>
            <p className="text-[11px] text-stone-500">
              Rua Visconde de Inhaúma, 1315 - Centro
            </p>
          </div>

          {/* Fase 2 */}
          <div className="p-3.5 bg-white/80 border-2 border-[#2b1810] rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-pixel text-[9px] text-[#895525] font-bold">
                🥩 2ª FASE: O GRANDE ALMOÇO (JP STEAKHOUSE)
              </span>
              <span className="font-pixel text-[8px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-400">
                PAGA SEU LOOT
              </span>
            </div>
            <p className="text-xs text-stone-700 font-medium">
              Almoço com rodízio após a cerimônia (~12:30h) • Churrascaria JP Steakhouse
            </p>
            <p className="text-[11px] text-stone-500">
              Av. Alice de Moura Bragheto, 76 - City Ribeirão
            </p>
            <p className="text-[11px] text-[#895525] italic pt-1">
              * O noivo gastou todo o ouro nas alianças! Rodízio de almoço individual por comanda (cada convidado/casal acerta o seu consumo).
            </p>
          </div>

          <div className="pt-1">
            <Countdown />
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-100 text-red-800 text-xs rounded-lg border-2 border-red-400 font-bold">
            {errorMessage}
          </div>
        )}

        {/* Status de Confirmação */}
        {currentStatus === "ACCEPTED" ? (
          <div className="text-center py-6 px-4 bg-emerald-50 border-4 border-emerald-700 rounded-xl space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2 shadow">
              <Check className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-emerald-900">
              Presença Confirmada com Amor!
            </h2>
            <p className="text-xs sm:text-sm text-stone-700">
              Que grande alegria ter você conosco neste dia tão esperado!
              {plusOnes > 0 && ` Acompanhantes confirmados: +${plusOnes}.`}
            </p>
            <div className="p-2 bg-emerald-100/70 rounded-lg text-xs font-bold text-emerald-900 mt-2">
              Participação:{" "}
              {currentAttendance === "BOTH"
                ? "Cartório + Banquete JP Steakhouse"
                : currentAttendance === "ONLY_CEREMONY"
                ? "Apenas Cerimônia no Cartório"
                : "Apenas Banquete no JP Steakhouse"}
            </div>
            <p className="font-pixel text-[9px] text-emerald-800 pt-2">
              ★ SALVO NO LIVRO DE HONRA DO CASAMENTO ★
            </p>
          </div>
        ) : currentStatus === "DECLINED" ? (
          <div className="text-center py-6 px-4 bg-stone-100 border-4 border-stone-400 rounded-xl space-y-2">
            <h2 className="font-serif text-xl font-bold text-stone-800">
              Resposta Registrada
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Compreendemos com todo o carinho e guardamos você em nossas orações e coração!
            </p>
            <button
              onClick={() => setCurrentStatus("PENDING")}
              className="mt-3 text-xs text-[#895525] underline font-bold cursor-pointer"
            >
              Mudei de ideia, desejo confirmar presença
            </button>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {/* Escolha das Fases */}
            <div className="p-3 bg-[#ede2d4]/60 border-2 border-[#2b1810] rounded-xl space-y-2">
              <label className="block font-pixel text-[9px] text-[#2b1810] font-bold">
                SELECIONE EM QUAIS MOMENTOS VOCÊ ESTARÁ CONOSCO:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPhase(PhaseAttendance.BOTH)}
                  className={`p-2.5 rounded-lg border-2 text-left cursor-pointer transition-all ${
                    selectedPhase === PhaseAttendance.BOTH
                      ? "bg-[#0a261f] text-white border-black shadow-[2px_2px_0px_0px_#000]"
                      : "bg-white text-stone-800 border-stone-400 hover:bg-stone-50"
                  }`}
                >
                  <div className="font-bold text-xs">Cartório + Almoço</div>
                  <div className="text-[10px] opacity-80">Nos dois momentos</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPhase(PhaseAttendance.ONLY_CEREMONY)}
                  className={`p-2.5 rounded-lg border-2 text-left cursor-pointer transition-all ${
                    selectedPhase === PhaseAttendance.ONLY_CEREMONY
                      ? "bg-[#0a261f] text-white border-black shadow-[2px_2px_0px_0px_#000]"
                      : "bg-white text-stone-800 border-stone-400 hover:bg-stone-50"
                  }`}
                >
                  <div className="font-bold text-xs">Apenas Cartório</div>
                  <div className="text-[10px] opacity-80">Cerimônia solene</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPhase(PhaseAttendance.ONLY_DINNER)}
                  className={`p-2.5 rounded-lg border-2 text-left cursor-pointer transition-all ${
                    selectedPhase === PhaseAttendance.ONLY_DINNER
                      ? "bg-[#0a261f] text-white border-black shadow-[2px_2px_0px_0px_#000]"
                      : "bg-white text-stone-800 border-stone-400 hover:bg-stone-50"
                  }`}
                >
                  <div className="font-bold text-xs">Apenas JP Steakhouse</div>
                  <div className="text-[10px] opacity-80">Banquete da Taverna</div>
                </button>
              </div>
            </div>

            {/* Vagas de Acompanhante se houver */}
            {guest.allowedPlusOnes > 0 && (
              <div className="p-3.5 bg-[#ede2d4]/50 border-2 border-[#2b1810] rounded-xl">
                <label className="flex items-center justify-between text-xs font-bold text-[#2b1810] mb-2 font-pixel text-[9px]">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    CONFIRMAR ACOMPANHANTES:
                  </span>
                  <span className="text-stone-500 font-sans">
                    (Limite: {guest.allowedPlusOnes})
                  </span>
                </label>
                <div className="flex gap-2">
                  {Array.from({ length: guest.allowedPlusOnes + 1 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPlusOnes(i)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold border-2 border-black transition-all cursor-pointer ${
                        plusOnes === i
                          ? "bg-[#0a261f] text-white shadow-[2px_2px_0px_0px_#000]"
                          : "bg-white text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      {i === 0 ? "Apenas Eu" : `+${i}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Dois Botões Claros e Acessíveis sem Pegadinhas */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleConfirm("ACCEPTED", selectedPhase)}
                className="flex-1 py-4 px-6 rounded-xl bg-[#0a261f] text-[#f6eed9] font-pixel text-[11px] sm:text-xs border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:bg-[#133e33] active:translate-x-1 active:translate-y-1 active:shadow-none transition-transform flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-gold-400" />
                {loading ? "SALVANDO..." : "CONFIRMAR PRESENÇA COM ALEGRIA"}
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleConfirm("DECLINED")}
                className="py-3.5 px-5 rounded-xl bg-stone-200 text-stone-700 font-pixel text-[9px] border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-stone-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
              >
                NÃO PODEREI COMPARECER
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
