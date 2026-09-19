"use client";

import { useState } from "react";
import { AttendanceSelection, RsvpState } from "@prisma/client";
import { submitRsvp } from "@/app/actions/rsvp";
import { triggerCelebration } from "@/lib/confetti";
import { Countdown } from "@/components/ui/Countdown";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Heart,
  ChevronRight,
  Info,
} from "lucide-react";

interface GuestInvitationViewProps {
  guest: {
    id: string;
    token: string;
    name: string;
    phone?: string | null;
    maxGuests: number;
    confirmedGuests: number;
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
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceSelection>(
    guest.attendance !== AttendanceSelection.DECLINED ? guest.attendance : AttendanceSelection.BOTH
  );
  const [confirmedCount, setConfirmedCount] = useState<number>(
    guest.confirmedGuests > 0 ? guest.confirmedGuests : Math.min(1, guest.maxGuests)
  );
  const [message, setMessage] = useState<string>(guest.guestMessage || "");
  const [loading, setLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const isConfirmed = currentStatus === RsvpState.CONFIRMED;
  const isDeclined = currentStatus === RsvpState.DECLINED;

  const handleConfirm = async (targetAttendance: AttendanceSelection) => {
    setLoading(true);
    setFeedbackError(null);

    const res = await submitRsvp({
      token: guest.token,
      attendance: targetAttendance,
      confirmedGuests: targetAttendance === AttendanceSelection.DECLINED ? 0 : confirmedCount,
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
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 animate-fade-up">
      {/* CARD PRINCIPAL EDITORIAL */}
      <div className="bg-surface-card border border-border-hairline shadow-editorial rounded-3xl p-6 sm:p-12 space-y-10 relative overflow-hidden">
        {/* Monograma & Cabeçalho Delicado */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-canvas-subtle/80 text-accent-olive border border-border-hairline mb-1">
            <span className="font-serif text-lg tracking-wider font-light">J & R</span>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-sans tracking-[0.25em] uppercase text-content-secondary block">
              Celebração de Casamento
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif text-content-primary font-normal tracking-tight">
              Jeniffer & Rian
            </h1>
          </div>

          <div className="gold-divider w-24 mx-auto my-3" />

          {/* Nome do Convidado Convocado */}
          <div className="pt-2">
            <span className="text-[11px] font-sans tracking-[0.2em] uppercase text-content-muted block mb-1">
              Convite especial para
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-accent-olive font-medium">
              {guest.name}
            </h2>
            <p className="text-sm font-sans text-content-secondary mt-2 max-w-md mx-auto leading-relaxed">
              É uma imensa alegria compartilhar o início desta nova jornada com você.
            </p>
          </div>
        </div>

        {/* CONTADOR REGRESSIVO */}
        <div className="py-2 border-y border-border-hairline/60">
          <div className="text-center text-[11px] font-sans tracking-[0.2em] uppercase text-content-secondary mb-2">
            Contagem regressiva para 12 de Dezembro de 2026
          </div>
          <Countdown />
        </div>

        {/* DETALHAMENTO DOS DOIS MOMENTOS */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h3 className="font-serif text-xl sm:text-2xl text-content-primary font-normal">
              Programação do Dia
            </h3>
            <p className="text-xs font-sans text-content-secondary tracking-wide">
              Sábado, 12 de Dezembro de 2026
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* MOMENTO 1: CERIMÔNIA NO CARTÓRIO */}
            <div className="p-5 sm:p-6 rounded-2xl bg-canvas-subtle/70 border border-border-hairline space-y-3 transition-all hover:bg-canvas-subtle">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-surface-card flex items-center justify-center text-accent-olive shadow-editorial-sm">
                    <Heart className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="text-[10px] font-sans tracking-[0.18em] uppercase text-accent-olive font-semibold block">
                      1º Momento
                    </span>
                    <h4 className="font-serif text-lg font-medium text-content-primary">
                      Cerimônia Civil (Cartório)
                    </h4>
                  </div>
                </div>
                <span className="text-[11px] font-sans px-2.5 py-1 rounded-full bg-surface-card text-content-secondary border border-border-hairline font-medium">
                  Presença Livre
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-content-secondary pl-1 sm:pl-10">
                <div className="flex items-center gap-2 text-content-primary font-medium">
                  <Clock className="w-3.5 h-3.5 text-accent-olive" strokeWidth={1.5} />
                  <span>10:30 horas</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-accent-olive shrink-0 mt-0.5" strokeWidth={1.5} />
                  <span>
                    1º Cartório de Registro Civil de Ribeirão Preto
                    <br />
                    <span className="text-content-muted">Rua Visconde de Inhaúma, 1315 — Centro</span>
                  </span>
                </div>
              </div>
            </div>

            {/* MOMENTO 2: ALMOÇO DE CELEBRAÇÃO */}
            <div className="p-5 sm:p-6 rounded-2xl bg-canvas-subtle/70 border border-border-hairline space-y-3 transition-all hover:bg-canvas-subtle">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-surface-card flex items-center justify-center text-accent-olive shadow-editorial-sm">
                    <Calendar className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="text-[10px] font-sans tracking-[0.18em] uppercase text-accent-olive font-semibold block">
                      2º Momento
                    </span>
                    <h4 className="font-serif text-lg font-medium text-content-primary">
                      Almoço de Celebração
                    </h4>
                  </div>
                </div>
                <span className="text-[11px] font-sans px-2.5 py-1 rounded-full bg-surface-card text-content-secondary border border-border-hairline font-medium">
                  Por Adesão
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-content-secondary pl-1 sm:pl-10">
                <div className="flex items-center gap-2 text-content-primary font-medium">
                  <Clock className="w-3.5 h-3.5 text-accent-olive" strokeWidth={1.5} />
                  <span>Logo após a cerimônia (~12:30 horas)</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-accent-olive shrink-0 mt-0.5" strokeWidth={1.5} />
                  <span>
                    Churrascaria JP SteakHouse
                    <br />
                    <span className="text-content-muted">
                      Av. Alice de Moura Bragheto, 76 — City Ribeirão, Ribeirão Preto
                    </span>
                  </span>
                </div>
              </div>

              {/* Mensagem Acolhedora sobre Adesão */}
              <div className="mt-2 p-3.5 rounded-xl bg-surface-card/90 border border-border-hairline text-xs text-content-secondary leading-relaxed flex gap-2.5">
                <Info className="w-4 h-4 text-accent-olive shrink-0 mt-0.5" strokeWidth={1.5} />
                <p>
                  Após o cartório, celebraremos com um almoço especial na Churrascaria JP Steakhouse.
                  Para que possamos comemorar juntos em um ambiente amplo e acolhedor, o almoço será
                  por adesão (comanda individual com consumo acertado diretamente com o restaurante).
                  Sua presença ao nosso lado é o nosso maior presente!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FEEDBACK ERROR */}
        {feedbackError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 font-sans">
            {feedbackError}
          </div>
        )}

        {/* STATUS CONFIRMADO / RECUSADO OU FORMULÁRIO DE CONFIRMAÇÃO */}
        {isConfirmed ? (
          <div className="text-center p-6 sm:p-8 bg-canvas-subtle/90 border border-accent-olive/30 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-accent-olive text-white flex items-center justify-center mx-auto shadow-editorial-sm">
              <CheckCircle2 className="w-6 h-6" strokeWidth={1.5} />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-sans tracking-[0.2em] uppercase text-accent-olive font-semibold block">
                Presença Confirmada
              </span>
              <h3 className="font-serif text-2xl font-normal text-content-primary">
                Agradecemos pelo carinho, {guest.name}!
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-content-secondary max-w-md mx-auto">
              Sua confirmação foi registrada com sucesso.
              {confirmedCount > 1 && ` Total de pessoas confirmadas: ${confirmedCount}.`}
            </p>

            <div className="inline-block px-4 py-2 rounded-full bg-surface-card border border-border-hairline text-xs font-sans text-content-primary font-medium">
              {currentAttendance === AttendanceSelection.BOTH && "Participação: Cerimônia Civil + Almoço JP Steakhouse"}
              {currentAttendance === AttendanceSelection.ONLY_CEREMONY && "Participação: Apenas Cerimônia no Cartório"}
              {currentAttendance === AttendanceSelection.ONLY_RESTAURANT && "Participação: Apenas Almoço na JP Steakhouse"}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCurrentStatus(RsvpState.PENDING)}
                className="text-xs text-accent-olive hover:underline font-medium cursor-pointer"
              >
                Deseja alterar sua resposta?
              </button>
            </div>
          </div>
        ) : isDeclined ? (
          <div className="text-center p-6 sm:p-8 bg-canvas-subtle/80 border border-border-hairline rounded-2xl space-y-3">
            <h3 className="font-serif text-2xl font-normal text-content-primary">
              Compreendemos com todo o carinho
            </h3>
            <p className="text-xs sm:text-sm text-content-secondary max-w-md mx-auto">
              Sentiremos sua falta neste dia, mas sabemos que estará conosco em pensamento e orações!
            </p>
            <button
              type="button"
              onClick={() => setCurrentStatus(RsvpState.PENDING)}
              className="text-xs text-accent-olive underline font-medium cursor-pointer mt-2"
            >
              Mudei de ideia, desejo confirmar presença
            </button>
          </div>
        ) : (
          /* FORMULÁRIO DE CONFIRMAÇÃO ELEGANTE */
          <div className="space-y-6 pt-2">
            <div className="text-center space-y-1">
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-content-primary">
                Confirmação de Presença
              </h3>
              <p className="text-xs font-sans text-content-secondary">
                Por gentileza, informe em quais momentos poderemos contar com você:
              </p>
            </div>

            {/* SELEÇÃO DE MOMENTOS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Opção 1: AMBOS */}
              <button
                type="button"
                onClick={() => setSelectedAttendance(AttendanceSelection.BOTH)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedAttendance === AttendanceSelection.BOTH
                    ? "bg-accent-olive text-white border-accent-olive shadow-editorial"
                    : "bg-surface-card text-content-primary border-border-hairline hover:border-accent-olive/40"
                }`}
              >
                <span className="text-xs font-serif font-medium block">
                  Cerimônia + Almoço
                </span>
                <span className={`text-[11px] font-sans mt-1 block leading-tight ${
                  selectedAttendance === AttendanceSelection.BOTH ? "text-white/80" : "text-content-secondary"
                }`}>
                  Estará presente nos dois momentos do dia
                </span>
              </button>

              {/* Opção 2: APENAS CARTÓRIO */}
              <button
                type="button"
                onClick={() => setSelectedAttendance(AttendanceSelection.ONLY_CEREMONY)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedAttendance === AttendanceSelection.ONLY_CEREMONY
                    ? "bg-accent-olive text-white border-accent-olive shadow-editorial"
                    : "bg-surface-card text-content-primary border-border-hairline hover:border-accent-olive/40"
                }`}
              >
                <span className="text-xs font-serif font-medium block">
                  Apenas Cerimônia
                </span>
                <span className={`text-[11px] font-sans mt-1 block leading-tight ${
                  selectedAttendance === AttendanceSelection.ONLY_CEREMONY ? "text-white/80" : "text-content-secondary"
                }`}>
                  Acompanhará o juramento no Cartório
                </span>
              </button>

              {/* Opção 3: APENAS RESTAURANTE */}
              <button
                type="button"
                onClick={() => setSelectedAttendance(AttendanceSelection.ONLY_RESTAURANT)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedAttendance === AttendanceSelection.ONLY_RESTAURANT
                    ? "bg-accent-olive text-white border-accent-olive shadow-editorial"
                    : "bg-surface-card text-content-primary border-border-hairline hover:border-accent-olive/40"
                }`}
              >
                <span className="text-xs font-serif font-medium block">
                  Apenas Almoço
                </span>
                <span className={`text-[11px] font-sans mt-1 block leading-tight ${
                  selectedAttendance === AttendanceSelection.ONLY_RESTAURANT ? "text-white/80" : "text-content-secondary"
                }`}>
                  Celebrará no almoço na JP Steakhouse
                </span>
              </button>
            </div>

            {/* SELEÇÃO DE QUANTIDADE DE CONVIDADOS SE maxGuests > 1 */}
            {guest.maxGuests > 1 && (
              <div className="p-4 rounded-2xl bg-canvas-subtle/70 border border-border-hairline space-y-2">
                <label className="flex items-center justify-between text-xs font-sans text-content-primary font-medium">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-accent-olive" strokeWidth={1.5} />
                    Quantas pessoas confirmarão presença?
                  </span>
                  <span className="text-content-muted text-[11px]">
                    (Limite: até {guest.maxGuests} pessoas)
                  </span>
                </label>

                <div className="flex gap-2 pt-1">
                  {Array.from({ length: guest.maxGuests }).map((_, idx) => {
                    const count = idx + 1;
                    return (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setConfirmedCount(count)}
                        className={`flex-1 py-2.5 rounded-full text-xs font-sans font-medium border transition-all cursor-pointer ${
                          confirmedCount === count
                            ? "bg-accent-olive text-white border-accent-olive shadow-editorial-sm"
                            : "bg-surface-card text-content-primary border-border-hairline hover:bg-canvas-subtle"
                        }`}
                      >
                        {count} {count === 1 ? "pessoa" : "pessoas"}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MENSAGEM / RECADO ESPECIAL PARA OS NOIVOS */}
            <div className="space-y-1.5">
              <label className="block text-xs font-sans text-content-secondary font-medium">
                Deixe uma mensagem carinhosa para Jeniffer & Rian (opcional):
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Escreva seus votos ou mensagem aos noivos..."
                className="w-full px-4 py-3 rounded-2xl bg-canvas-subtle/50 border border-border-hairline text-xs font-sans text-content-primary placeholder:text-content-muted focus:outline-none focus:border-accent-olive focus:bg-surface-card transition-all"
              />
            </div>

            {/* BOTÕES FINAIS */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleConfirm(selectedAttendance)}
                className="flex-1 py-3.5 px-6 rounded-full bg-accent-olive text-white font-sans text-xs font-semibold tracking-wider uppercase hover:bg-accent-olive-hover transition-all cursor-pointer shadow-editorial active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>{loading ? "Registrando..." : "Confirmar Presença com Alegria"}</span>
                <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleConfirm(AttendanceSelection.DECLINED)}
                className="py-3 px-5 rounded-full bg-surface-card text-content-secondary border border-border-hairline font-sans text-xs hover:bg-canvas-subtle transition-all cursor-pointer"
              >
                Não poderei comparecer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RODAPÉ DO CONVITE */}
      <footer className="text-center text-xs font-sans text-content-muted space-y-1">
        <p>Jeniffer & Rian • 12 de Dezembro de 2026</p>
        <p>Ribeirão Preto — São Paulo</p>
      </footer>
    </div>
  );
}
