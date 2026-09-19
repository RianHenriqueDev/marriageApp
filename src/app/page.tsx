"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Countdown } from "@/components/ui/Countdown";
import { Heart, ChevronRight, Shield } from "lucide-react";

export default function QuietLuxuryLandingPage() {
  const router = useRouter();
  const [tokenInput, setTokenInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    <main className="min-h-screen bg-canvas-base text-content-primary flex flex-col justify-between py-8 px-4 sm:px-8">
      {/* HEADER SUPERIOR DISCRETO */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-4 text-xs font-sans tracking-[0.2em] uppercase text-content-secondary border-b border-border-hairline/70">
        <div className="flex items-center gap-2">
          <Heart className="w-3.5 h-3.5 text-accent-olive" strokeWidth={1.5} />
          <span>Convite de Casamento</span>
        </div>
        <span>12 de Dezembro de 2026</span>
      </header>

      {/* HERO SECTION EDITORIAL */}
      <section className="max-w-3xl mx-auto w-full text-center my-auto py-12 sm:py-16 space-y-8 animate-fade-up">
        {/* Monograma */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-card border border-border-hairline shadow-editorial text-accent-olive">
          <span className="font-serif text-2xl font-light tracking-wider">J & R</span>
        </div>

        {/* Título Principal */}
        <div className="space-y-3">
          <span className="text-xs sm:text-sm font-sans tracking-[0.3em] uppercase text-content-secondary block">
            A celebração do nosso amor
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-content-primary font-normal tracking-tight">
            Jeniffer & Rian
          </h1>
          <p className="text-base sm:text-lg font-sans text-content-secondary max-w-xl mx-auto pt-2 leading-relaxed">
            Com imensa alegria e bênçãos no coração, convidamos você para celebrar
            conosco o momento mais especial de nossas vidas.
          </p>
        </div>

        {/* DIVISOR DELICADO */}
        <div className="gold-divider w-32 mx-auto" />

        {/* CONTADOR REGRESSIVO */}
        <div className="max-w-md mx-auto">
          <Countdown />
        </div>

        {/* CARDS COM OS DOIS MOMENTOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left pt-4">
          {/* Momento 1 */}
          <div className="p-5 rounded-2xl bg-surface-card border border-border-hairline shadow-editorial space-y-2">
            <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-accent-olive font-semibold block">
              1º Momento • 10:30h
            </span>
            <h3 className="font-serif text-lg font-medium text-content-primary">
              Cerimônia Civil
            </h3>
            <p className="text-xs text-content-secondary leading-relaxed">
              1º Cartório de Registro Civil de Ribeirão Preto
              <br />
              <span className="text-content-muted">Rua Visconde de Inhaúma, 1315 — Centro</span>
            </p>
          </div>

          {/* Momento 2 */}
          <div className="p-5 rounded-2xl bg-surface-card border border-border-hairline shadow-editorial space-y-2">
            <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-accent-olive font-semibold block">
              2º Momento • ~12:30h
            </span>
            <h3 className="font-serif text-lg font-medium text-content-primary">
              Almoço de Celebração
            </h3>
            <p className="text-xs text-content-secondary leading-relaxed">
              Churrascaria JP Steakhouse (Por Adesão)
              <br />
              <span className="text-content-muted">Av. Alice de Moura Bragheto, 76 — City Ribeirão</span>
            </p>
          </div>
        </div>

        {/* BOTÃO PRINCIPAL DE ACESSO */}
        <div className="pt-6 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 rounded-full bg-accent-olive text-white font-sans text-xs font-semibold tracking-[0.15em] uppercase hover:bg-accent-olive-hover transition-all cursor-pointer shadow-editorial flex items-center gap-2"
          >
            <span>Acessar Meu Convite e Confirmar</span>
            <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <p className="text-xs text-content-muted">
            Insira o link ou código exclusivo recebido via WhatsApp
          </p>
        </div>
      </section>

      {/* FOOTER DISCRETO */}
      <footer className="max-w-4xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-border-hairline/70 text-xs font-sans text-content-muted">
        <div>12 de Dezembro de 2026 • Ribeirão Preto - SP</div>
        <Link
          href="/admin"
          className="hover:text-content-primary transition-colors flex items-center gap-1.5"
        >
          <Shield className="w-3.5 h-3.5 text-accent-gold" strokeWidth={1.5} />
          <span>Acesso dos Noivos</span>
        </Link>
      </footer>

      {/* MODAL DE BUSCA POR CÓDIGO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-content-primary/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-card border border-border-hairline shadow-editorial-lg rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 animate-fade-up">
            <div className="space-y-1">
              <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-accent-olive font-semibold block">
                Localizar Convite
              </span>
              <h3 className="font-serif text-2xl font-normal text-content-primary">
                Acessar seu Convite
              </h3>
              <p className="text-xs text-content-secondary leading-relaxed pt-1">
                Digite o código ou nome enviado pelos noivos para visualizar seus detalhes e confirmar sua presença:
              </p>
            </div>

            <form onSubmit={handleAccessInvite} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => {
                    setTokenInput(e.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="Ex: tios-paulo-e-lucia"
                  className="w-full px-4 py-3 rounded-xl bg-canvas-subtle/70 border border-border-hairline text-sm font-sans text-content-primary focus:outline-none focus:border-accent-olive focus:bg-surface-card transition-all placeholder:text-content-muted"
                />
                {errorMessage && (
                  <p className="text-xs text-red-600 mt-1">{errorMessage}</p>
                )}
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-full bg-canvas-subtle text-content-secondary font-sans text-xs hover:bg-canvas-subtle/80 transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-accent-olive text-white font-sans text-xs font-semibold uppercase tracking-wider hover:bg-accent-olive-hover transition-all cursor-pointer shadow-editorial"
                >
                  Acessar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
