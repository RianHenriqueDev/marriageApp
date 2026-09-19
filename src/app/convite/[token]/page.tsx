import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ClassicFlow } from "@/components/rsvp/ClassicFlow";
import { GameplayFlow } from "@/components/rsvp/GameplayFlow";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    token: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const guest = await prisma.guest.findUnique({
      where: { token: params.token },
    });

    if (!guest) {
      return {
        title: "Convite de Casamento | 12.12.2026",
      };
    }

    return {
      title: `Convite de Casamento para ${guest.name} | 12.12.2026`,
      description: `${guest.name}, você foi convidado especial para o nosso casamento! Confirme sua presença.`,
    };
  } catch {
    return {
      title: "Convite de Casamento | 12.12.2026",
    };
  }
}

export default async function GuestInvitationPage({ params }: PageProps) {
  let guest = null;

  try {
    guest = await prisma.guest.findUnique({
      where: { token: params.token },
    });
  } catch (error) {
    console.error("Erro ao buscar convidado:", error);
  }

  if (!guest) {
    return notFound();
  }

  const isGameplay = guest.flowType === "GAMEPLAY";

  return (
    <main
      className={`min-h-screen relative flex flex-col justify-between p-3 sm:p-6 ${
        isGameplay
          ? "bg-[#0b0c10] text-stone-200"
          : "bg-gradient-to-b from-[#fdfcf8] to-[#f7f3ec]"
      }`}
    >
      {/* Background Decorativo apenas no modo Clássico */}
      {!isGameplay && (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-gold-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-0 w-96 h-96 bg-emerald-100/20 rounded-full blur-3xl" />
        </div>
      )}

      {/* Top Header */}
      <header className="max-w-xl mx-auto w-full flex items-center justify-between pb-4">
        <Link
          href="/"
          className={`inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase transition-colors ${
            isGameplay
              ? "text-gold-400 hover:text-white font-pixel text-[10px]"
              : "text-stone-500 hover:text-emeraldDeep"
          }`}
        >
          <Heart className="w-4 h-4 text-gold-500 fill-gold-400" />
          Rian & Jeniffer • 12/12/2026
        </Link>
      </header>

      {/* Renderização condicional conforme flowType */}
      <div className="flex-1 flex items-center justify-center py-2">
        {isGameplay ? (
          <GameplayFlow
            guest={{
              token: guest.token,
              name: guest.name,
              gender: guest.gender,
              category: guest.category,
              scriptId: guest.scriptId,
              status: guest.status,
              allowedPlusOnes: guest.allowedPlusOnes,
              confirmedPlusOnes: guest.confirmedPlusOnes,
              customNote: guest.customNote,
            }}
          />
        ) : (
          <ClassicFlow
            guest={{
              token: guest.token,
              name: guest.name,
              status: guest.status,
              allowedPlusOnes: guest.allowedPlusOnes,
              confirmedPlusOnes: guest.confirmedPlusOnes,
              customNote: guest.customNote,
            }}
          />
        )}
      </div>

      <footer
        className={`max-w-xl mx-auto w-full text-center pt-4 text-xs ${
          isGameplay ? "text-stone-600 font-pixel text-[8px]" : "text-stone-400"
        }`}
      >
        Local: 1º Cartório de Registro Civil de Ribeirão Preto • R. Visc. de Inhaúma, 1315 • 12/12/2026
      </footer>
    </main>
  );
}
