import { prisma } from "@/lib/prisma";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import Link from "next/link";
import { ArrowLeft, LogOut } from "lucide-react";
import { Guest } from "@prisma/client";
import { cookies } from "next/headers";
import { logoutAdmin } from "./actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Painel de Gestão de Convidados | Jeniffer & Rian",
  description: "Gerenciamento da lista de convidados e confirmações de presença para 12/12/2026.",
};

export default async function AdminPage() {
  const cookieStore = cookies();
  const isAuthenticated = cookieStore.get("admin_session")?.value === "authenticated";

  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  let guests: Guest[] = [];

  try {
    guests = await prisma.guest.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Aviso: banco de dados ainda não conectado:", error);
  }

  return (
    <main className="min-h-screen bg-canvas-base text-content-primary p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
      {/* Top Header Editorial */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border-hairline bg-surface-card p-6 rounded-3xl shadow-editorial">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-content-secondary hover:text-accent-olive mb-2 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar à página inicial</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-serif text-content-primary font-medium tracking-tight">
            Painel de Convidados • Jeniffer & Rian
          </h1>
          <p className="text-xs text-content-secondary mt-1">
            Acompanhamento de confirmações para a cerimônia e almoço em 12/12/2026.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right px-4 py-2 rounded-2xl bg-canvas-subtle border border-border-hairline">
            <span className="text-[10px] font-sans tracking-[0.15em] uppercase text-content-muted block">
              Data do Casamento
            </span>
            <span className="text-xs text-content-primary font-medium">
              12.12.2026 • 10:30h
            </span>
          </div>

          <form action={logoutAdmin}>
            <button
              type="submit"
              title="Encerrar sessão"
              className="p-2.5 bg-canvas-subtle hover:bg-red-50 text-content-secondary hover:text-red-700 border border-border-hairline text-xs rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
              <span className="hidden sm:inline text-xs">Sair</span>
            </button>
          </form>
        </div>
      </header>

      {/* Dashboard com métricas e tabela */}
      <AdminDashboard initialGuests={guests} />
    </main>
  );
}
