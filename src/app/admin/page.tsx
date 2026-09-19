import { prisma } from "@/lib/prisma";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import Link from "next/link";
import { ArrowLeft, Shield, LogOut } from "lucide-react";
import { Guest } from "@prisma/client";
import { cookies } from "next/headers";
import { logoutAdmin } from "./actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Game Master Debug Console | Painel dos Noivos",
  description: "Gerenciamento completo da guilda, aventureiros e missões para 12/12/2026.",
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
    <main className="min-h-screen bg-[#0a0c10] text-[#f6eed9] p-3 sm:p-6 max-w-7xl mx-auto space-y-6 font-pixel select-none">
      {/* Top Header Estilo Debug Console */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-4 border-black bg-[#161922] p-4 rounded-xl pixel-shadow-lg">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[9px] text-stone-400 hover:text-gold-400 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            [ RETORNAR AO TITLE SCREEN ]
          </Link>
          <h1 className="text-base sm:text-xl font-extrabold text-gold-400 flex items-center gap-2 tracking-wider">
            <Shield className="w-5 h-5 text-gold-500" />
            GAME MASTER / DEBUG CONSOLE
          </h1>
          <p className="text-[9px] text-stone-400 mt-1 font-sans">
            Painel de controle de aventureiros, slots de party e cartões para 12/12/2026.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right bg-[#11141a] px-3.5 py-2 rounded-lg border-2 border-black pixel-shadow">
            <span className="text-[8px] font-bold text-gold-400 block">
              QUEST LAUNCH DATE
            </span>
            <span className="text-[10px] text-white font-bold">
              12.12.2026 • 10:30H
            </span>
          </div>

          <form action={logoutAdmin}>
            <button
              type="submit"
              title="Encerrar sessão de Game Master"
              className="p-2.5 bg-red-950 hover:bg-red-800 text-red-400 border-2 border-black pixel-shadow text-[8px] rounded-lg font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SAIR</span>
            </button>
          </form>
        </div>
      </header>

      {/* Dashboard com métricas de RPG e tabela da guilda */}
      <AdminDashboard initialGuests={guests} />
    </main>
  );
}
