import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { GuestInvitationView } from "@/components/rsvp/GuestInvitationView";
import Link from "next/link";
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
        title: "Casamento Jeniffer & Rian | 12.12.2026",
      };
    }

    return {
      title: `Convite de Casamento • ${guest.name} | Jeniffer & Rian`,
      description: `${guest.name}, você é nosso convidado especial para o casamento de Jeniffer & Rian. Confirme sua presença para 12/12/2026.`,
    };
  } catch {
    return {
      title: "Casamento Jeniffer & Rian | 12.12.2026",
    };
  }
}

export default async function FullGuestInvitationPage({ params }: PageProps) {
  let guest = null;

  try {
    guest = await prisma.guest.findUnique({
      where: { token: params.token },
    });
  } catch (error) {
    console.error("Erro ao carregar convidado:", error);
  }

  if (!guest) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-canvas-base flex flex-col justify-between py-6 sm:py-10">
      <header className="max-w-2xl mx-auto w-full px-4 sm:px-6 flex items-center justify-between text-xs text-content-secondary">
        <Link
          href="/"
          className="font-serif tracking-wide hover:text-accent-olive transition-colors text-sm text-content-primary font-medium"
        >
          Jeniffer & Rian
        </Link>
        <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.15em] text-content-muted uppercase">
          12.12.2026
        </span>
      </header>

      <div className="flex-1 flex items-center justify-center">
        <GuestInvitationView guest={guest} />
      </div>

      <footer className="px-4 text-center text-[11px] sm:text-xs text-content-muted py-4">
        1º Cartório de Registro Civil & Churrascaria JP Steakhouse • Ribeirão Preto
      </footer>
    </main>
  );
}
