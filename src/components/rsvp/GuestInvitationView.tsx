"use client";

import { useState } from "react";
import { AttendanceSelection, RsvpState } from "@prisma/client";
import { submitRsvp } from "@/app/actions/rsvp";
import { triggerCelebration } from "@/lib/confetti";
import { WeddingMonogram } from "@/components/ui/WeddingMonogram";
import {
  Check,
  ExternalLink,
  ChevronRight,
  Minus,
  Plus,
} from "lucide-react";

interface GuestInvitationViewProps {
  guest: {
    id: string;
    token: string;
    name: string;
    phone?: string | null;
    maxGuests: number;
    confirmedGuests: number;
    hasSpouse?: boolean;
    childrenCount?: number;
    attendance: AttendanceSelection;
    status: RsvpState;
    guestMessage?: string | null;
  };
}

export function GuestInvitationView({ guest }: GuestInvitationViewProps) {
  const [currentStatus, setCurrentStatus] = useState<RsvpState>(guest.status);
  const [currentAttendance, setCurrentAttendance] = useState<AttendanceSelection>(
    guest.attendance || AttendanceSelection.BOTH
  );

  // Estados dos checkboxes independentes de momentos
  const [attendingCeremony, setAttendingCeremony] = useState<boolean>(
    guest.attendance === AttendanceSelection.BOTH ||
      guest.attendance === AttendanceSelection.ONLY_CEREMONY ||
      guest.status === RsvpState.PENDING
  );
  const [attendingLunch, setAttendingLunch] = useState<boolean>(
    guest.attendance === AttendanceSelection.BOTH ||
      guest.attendance === AttendanceSelection.ONLY_RESTAURANT ||
      guest.status === RsvpState.PENDING
  );

  // Seletores autônomos de Cônjuge e Filhos
  const [hasSpouse, setHasSpouse] = useState<boolean>(Boolean(guest.hasSpouse));
  const [childrenCount, setChildrenCount] = useState<number>(guest.childrenCount || 0);

  // Total de pessoas confirmadas calculadas em tempo real
  const totalGuests = 1 + (hasSpouse ? 1 : 0) + childrenCount;

  const [message, setMessage] = useState<string>(guest.guestMessage || "");
  const [loading, setLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const isConfirmed = currentStatus === RsvpState.CONFIRMED;
  const isDeclined = currentStatus === RsvpState.DECLINED;

  // Converter os checkboxes no enum correspondente
  const getSelectedAttendance = (): AttendanceSelection => {
    if (attendingCeremony && attendingLunch) return AttendanceSelection.BOTH;
    if (attendingCeremony) return AttendanceSelection.ONLY_CEREMONY;
    if (attendingLunch) return AttendanceSelection.ONLY_RESTAURANT;
    return AttendanceSelection.DECLINED;
  };

  const handleConfirm = async (forcedDeclined: boolean = false) => {
    setLoading(true);
    setFeedbackError(null);

    const targetAttendance = forcedDeclined ? AttendanceSelection.DECLINED : getSelectedAttendance();

    if (!forcedDeclined && targetAttendance === AttendanceSelection.DECLINED) {
      setFeedbackError("Por favor, selecione ao menos um dos momentos para confirmar presença.");
      setLoading(false);
      return;
    }

    const res = await submitRsvp({
      token: guest.token,
      attendance: targetAttendance,
      hasSpouse,
      childrenCount,
      guestMessage: message,
    });

    setLoading(false);

    if (res.success && res.guest) {
      setCurrentStatus(res.guest.status);
      setCurrentAttendance(res.guest.attendance);
      if (res.guest.status === RsvpState.CONFIRMED) {
        triggerCelebration();
      }
    } else {
      setFeedbackError(res.error || "Ocorreu um erro ao registrar sua confirmação.");
    }
  };

  return (
    <div className="w-full max-w-[580px] mx-auto px-4 py-8 sm:py-14 animate-fade-up">
      {/* 
        CARTÃO DE PAPELARIA DE LUXO (CONVITE PRENSADO EM LINHO):
        - Fundo branco linho suave
        - Borda externa fina #E8E2D5
        - Borda interna decorativa outline dourada suave com offset
        - Sombra nobre e difusa
      */}
      <div className="relative bg-white border border-[#E8E2D5] outline outline-1 outline-[#C5A880]/40 outline-offset-[-10px] sm:outline-offset-[-14px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] rounded-2xl p-7 sm:p-14 text-[#1A1A19] space-y-10">
        {/* TOPO: MONOGRAMA CIRCULAR VETORIAL (J & R) */}
        <div className="text-center space-y-4 pt-2">
          <WeddingMonogram size="lg" className="mx-auto" />

          <div className="space-y-1 pt-1">
            <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.28em] uppercase text-[#7C7C74] block">
              Celebração de Casamento
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-[#1A1A19]">
              Jeniffer & Rian
            </h1>
          </div>

          <div className="w-16 h-[1px] bg-[#C5A880]/50 mx-auto my-3" />

          {/* DEDICATÓRIA FORMAL AO CONVIDADO */}
          <div className="pt-1">
            <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#9E9E96] block mb-1">
              Convidamos com imenso carinho
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#2C3328] font-medium tracking-tight">
              {guest.name}
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[#7C7C74] mt-2.5 max-w-sm mx-auto leading-relaxed">
              Para testemunhar e celebrar a nossa união no dia 12 de Dezembro de 2026.
            </p>
          </div>
        </div>

        {/* CRONOLOGIA SOFISTICADA DOS DOIS MOMENTOS */}
        <div className="space-y-6 pt-2">
          <div className="text-center">
            <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#7C7C74] font-medium">
              Programação do Dia
            </span>
          </div>

          <div className="space-y-6 divide-y divide-[#E8E2D5]">
            {/* 01 • CERIMÔNIA CIVIL */}
            <div className="space-y-3 pt-2 first:pt-0">
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] font-sans tracking-[0.25em] uppercase text-[#C5A880] font-semibold">
                  01 • CERIMÔNIA CIVIL
                </span>
                <span className="font-serif text-sm text-[#2C3328] font-medium">
                  10:30h
                </span>
              </div>

              <div className="space-y-1 text-xs font-sans text-[#7C7C74]">
                <h3 className="font-serif text-base text-[#1A1A19] font-medium">
                  1º Cartório de Registro Civil
                </h3>
                <p className="text-[#9E9E96]">
                  Rua Visconde de Inhaúma, 1315 — Centro, Ribeirão Preto - SP
                </p>
                <p className="text-[11px] italic text-[#7C7C74] pt-0.5">
                  Testemunho solene e troca das alianças.
                </p>
              </div>

              <a
                href="https://maps.google.com/?q=Rua+Visconde+de+Inhaúma,+1315,+Ribeirão+Preto"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-sans text-[#2C3328] hover:text-[#C5A880] border-b border-[#2C3328]/30 hover:border-[#C5A880] pb-0.5 transition-colors pt-1"
              >
                <span>Como chegar</span>
                <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
              </a>
            </div>

            {/* 02 • ALMOÇO */}
            <div className="space-y-3 pt-6">
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] font-sans tracking-[0.25em] uppercase text-[#C5A880] font-semibold">
                  02 • ALMOÇO
                </span>
                <span className="font-serif text-sm text-[#2C3328] font-medium">
                  12:00h
                </span>
              </div>

              <div className="space-y-1 text-xs font-sans text-[#7C7C74]">
                <h3 className="font-serif text-base text-[#1A1A19] font-medium">
                  Churrascaria JP Steakhouse
                </h3>
                <p className="text-[#9E9E96]">
                  Av. Alice de Moura Bragheto, 76 — City Ribeirão, Ribeirão Preto - SP
                </p>
              </div>

              {/* AVISO GENTIL DE ADESÃO INDIVIDUAL */}
              <div className="p-4 rounded-xl bg-[#F5EFEB] border border-[#E2D9CC] text-xs font-sans text-[#5A5A55] leading-relaxed">
                Celebraremos este início com um almoço na Churrascaria JP Steakhouse.
                Para desfrutarmos juntos com total comodidade em um espaço amplo, o almoço será
                por adesão individual (comanda de consumo individual acertada diretamente no local).
                A sua companhia ao nosso lado é a nossa maior alegria!
              </div>

              <a
                href="https://maps.google.com/?q=JP+SteakHouse+Ribeirao+Preto"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-sans text-[#2C3328] hover:text-[#C5A880] border-b border-[#2C3328]/30 hover:border-[#C5A880] pb-0.5 transition-colors pt-1"
              >
                <span>Como chegar</span>
                <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>

        {/* FEEDBACK DE ERRO */}
        {feedbackError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 font-sans">
            {feedbackError}
          </div>
        )}

        {/* STATUS CONFIRMADO OU FORMULÁRIO */}
        {isConfirmed ? (
          <div className="text-center p-6 sm:p-8 bg-[#F8F6F0] border border-[#E8E2D5] rounded-xl space-y-3 animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-[#2C3328] text-white flex items-center justify-center mx-auto">
              <Check className="w-5 h-5" strokeWidth={2} />
            </div>

            <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#C5A880] font-semibold block">
              Presença Confirmada
            </span>

            <h3 className="font-serif text-2xl text-[#1A1A19] font-normal">
              Agradecemos de coração, {guest.name}!
            </h3>

            <p className="text-xs font-sans text-[#7C7C74] max-w-sm mx-auto leading-relaxed">
              Sua resposta foi registrada com sucesso.
              {totalGuests > 1 ? (
                <span className="block mt-1 text-[#2C3328] font-medium">
                  {totalGuests} pessoas confirmadas
                  {hasSpouse && " (você + cônjuge"}
                  {childrenCount > 0 && (hasSpouse ? ` + ${childrenCount} filho(s))` : ` (você + ${childrenCount} filho(s))`)}
                  {!hasSpouse && childrenCount === 0 && ")"}
                </span>
              ) : (
                <span className="block mt-1 text-[#2C3328] font-medium">
                  Presença confirmada individualmente.
                </span>
              )}
            </p>

            <div className="text-[11px] font-sans text-[#2C3328] font-medium pt-1">
              {currentAttendance === AttendanceSelection.BOTH && "• Cerimônia Civil no Cartório e Almoço na JP Steakhouse"}
              {currentAttendance === AttendanceSelection.ONLY_CEREMONY && "• Apenas Cerimônia Civil no Cartório"}
              {currentAttendance === AttendanceSelection.ONLY_RESTAURANT && "• Apenas Almoço na JP Steakhouse"}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCurrentStatus(RsvpState.PENDING)}
                className="text-xs font-sans text-[#7C7C74] hover:text-[#2C3328] underline transition-colors cursor-pointer"
              >
                Deseja alterar sua resposta?
              </button>
            </div>
          </div>
        ) : isDeclined ? (
          <div className="text-center p-6 sm:p-8 bg-[#F8F6F0] border border-[#E8E2D5] rounded-xl space-y-3 animate-fade-in">
            <h3 className="font-serif text-2xl text-[#1A1A19] font-normal">
              Compreendemos com todo carinho
            </h3>
            <p className="text-xs font-sans text-[#7C7C74] max-w-sm mx-auto leading-relaxed">
              Sentiremos sua falta, mas sabemos que estará torcendo por nós com bênçãos no coração!
            </p>
            <button
              type="button"
              onClick={() => setCurrentStatus(RsvpState.PENDING)}
              className="text-xs font-sans text-[#2C3328] underline transition-colors cursor-pointer pt-1"
            >
              Mudei de ideia, desejo confirmar presença
            </button>
          </div>
        ) : (
          /* FORMULÁRIO EDITORIAL COM CHECKBOXES E CONTADORES */
          <div className="space-y-6 pt-2 border-t border-[#E8E2D5]">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#7C7C74] font-medium block">
                Confirmação de Presença
              </span>
              <p className="text-xs font-sans text-[#9E9E96]">
                Marque abaixo em quais momentos teremos a alegria de sua companhia:
              </p>
            </div>

            {/* CHECKBOXES ELEGANTE DE MOMENTOS INDEPENDENTES */}
            <div className="space-y-2.5">
              {/* Opção Cerimônia */}
              <button
                type="button"
                onClick={() => setAttendingCeremony(!attendingCeremony)}
                className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  attendingCeremony
                    ? "bg-[#F5EFEB] border-[#C5A880] text-[#1A1A19]"
                    : "bg-white border-[#E8E2D5] text-[#7C7C74] hover:border-[#C5A880]/50"
                }`}
              >
                <div>
                  <span className="font-serif text-sm font-medium block text-[#1A1A19]">
                    Cerimônia Civil no Cartório
                  </span>
                  <span className="text-[11px] font-sans text-[#7C7C74] block mt-0.5">
                    10:30h • Rua Visconde de Inhaúma, 1315
                  </span>
                </div>
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    attendingCeremony
                      ? "bg-[#2C3328] border-[#2C3328] text-white"
                      : "border-[#C5A880]/60 bg-white"
                  }`}
                >
                  {attendingCeremony && <Check className="w-3.5 h-3.5" strokeWidth={2.5} />}
                </div>
              </button>

              {/* Opção Almoço */}
              <button
                type="button"
                onClick={() => setAttendingLunch(!attendingLunch)}
                className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  attendingLunch
                    ? "bg-[#F5EFEB] border-[#C5A880] text-[#1A1A19]"
                    : "bg-white border-[#E8E2D5] text-[#7C7C74] hover:border-[#C5A880]/50"
                }`}
              >
                <div>
                  <span className="font-serif text-sm font-medium block text-[#1A1A19]">
                    Almoço na JP Steakhouse
                  </span>
                  <span className="text-[11px] font-sans text-[#7C7C74] block mt-0.5">
                    12:00h • Almoço por adesão individual
                  </span>
                </div>
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    attendingLunch
                      ? "bg-[#2C3328] border-[#2C3328] text-white"
                      : "border-[#C5A880]/60 bg-white"
                  }`}
                >
                  {attendingLunch && <Check className="w-3.5 h-3.5" strokeWidth={2.5} />}
                </div>
              </button>
            </div>

            {/* SELETORES DE CÔNJUGE E FILHOS (RESPOSTA DIRETA DO CONVIDADO) */}
            <div className="p-5 rounded-2xl bg-[#F8F6F0] border border-[#E8E2D5] space-y-4">
              <div>
                <span className="font-serif text-sm font-medium text-[#1A1A19] block">
                  Acompanhantes da Família
                </span>
                <span className="text-[11px] font-sans text-[#7C7C74]">
                  Informe se você virá acompanhado(a) de seu cônjuge e/ou filho(s):
                </span>
              </div>

              {/* Opção Cônjuge */}
              <button
                type="button"
                onClick={() => setHasSpouse(!hasSpouse)}
                className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  hasSpouse
                    ? "bg-white border-[#C5A880] shadow-sm text-[#1A1A19]"
                    : "bg-white/60 border-[#E8E2D5] text-[#7C7C74] hover:border-[#C5A880]/50"
                }`}
              >
                <div>
                  <span className="font-sans text-xs font-semibold block text-[#1A1A19]">
                    Cônjuge / Parceiro(a)
                  </span>
                  <span className="text-[11px] font-sans text-[#7C7C74] block">
                    {hasSpouse ? "Presença confirmada" : "Não levará cônjuge"}
                  </span>
                </div>
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    hasSpouse
                      ? "bg-[#2C3328] border-[#2C3328] text-white"
                      : "border-[#C5A880]/60 bg-white"
                  }`}
                >
                  {hasSpouse && <Check className="w-3.5 h-3.5" strokeWidth={2.5} />}
                </div>
              </button>

              {/* Opção Filhos com Contador */}
              <div className="p-3.5 rounded-xl bg-white border border-[#E8E2D5] flex items-center justify-between">
                <div>
                  <span className="font-sans text-xs font-semibold text-[#1A1A19] block">
                    Filho(s)
                  </span>
                  <span className="text-[11px] font-sans text-[#7C7C74]">
                    {childrenCount === 0
                      ? "Nenhum filho acompanhando"
                      : `${childrenCount} filho(s) confirmado(s)`}
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-[#F8F6F0] border border-[#E8E2D5] px-2.5 py-1.5 rounded-full shadow-sm">
                  <button
                    type="button"
                    disabled={childrenCount <= 0}
                    onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                    className="p-1 text-[#2C3328] hover:text-[#C5A880] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>

                  <span className="font-serif text-base font-medium text-[#1A1A19] min-w-[20px] text-center">
                    {childrenCount}
                  </span>

                  <button
                    type="button"
                    disabled={childrenCount >= 10}
                    onClick={() => setChildrenCount(Math.min(10, childrenCount + 1))}
                    className="p-1 text-[#2C3328] hover:text-[#C5A880] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* Resumo do Total de Presentes */}
              <div className="pt-1 flex items-center justify-between text-xs font-sans text-[#2C3328] px-1">
                <span className="text-[#7C7C74]">Total de pessoas confirmadas:</span>
                <span className="font-medium bg-white px-2.5 py-0.5 rounded-full border border-[#E8E2D5]">
                  {totalGuests} {totalGuests === 1 ? "pessoa" : "pessoas"} (você{hasSpouse ? " + cônjuge" : ""}{childrenCount > 0 ? ` + ${childrenCount} filho(s)` : ""})
                </span>
              </div>
            </div>

            {/* RECADO CARINHOSO AOS NOIVOS */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-sans text-[#7C7C74] font-medium">
                Deixe uma mensagem especial para Jeniffer & Rian (opcional):
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                placeholder="Escreva seus votos aos noivos..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#E8E2D5] text-xs font-sans text-[#1A1A19] placeholder:text-[#9E9E96] focus:outline-none focus:border-[#C5A880] focus:bg-white transition-all"
              />
            </div>

            {/* BOTÃO DE CONFIRMAÇÃO PRINCIPAL */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleConfirm(false)}
                className="w-full py-4 px-6 rounded-full bg-[#2C3328] hover:bg-[#1E241B] text-white font-sans text-xs font-semibold tracking-[0.2em] uppercase transition-all cursor-pointer shadow-editorial active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>{loading ? "Registrando..." : "CONFIRMAR NOSSA PRESENÇA"}</span>
                <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleConfirm(true)}
                  className="text-[11px] font-sans text-[#7C7C74] hover:text-[#2C3328] transition-colors cursor-pointer"
                >
                  Infelizmente não poderei comparecer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RODAPÉ DO CONVITE */}
      <footer className="text-center text-[11px] font-sans text-[#9E9E96] space-y-1 mt-6">
        <p>Jeniffer & Rian • 12 de Dezembro de 2026</p>
        <p>Ribeirão Preto — São Paulo</p>
      </footer>
    </div>
  );
}
