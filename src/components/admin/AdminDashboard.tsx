"use client";

import { useState } from "react";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
  Check,
  Trash2,
  Edit2,
  Image as ImageIcon,
  Plus,
  Search,
  MessageCircle,
} from "lucide-react";
import { deleteGuest } from "@/app/admin/actions";
import { InviteImageModal } from "./InviteImageModal";
import { GuestFormModal } from "./GuestFormModal";
import { Guest } from "@prisma/client";
import { retroSound } from "@/lib/retroAudio";

interface AdminDashboardProps {
  initialGuests: Guest[];
}

export function AdminDashboard({ initialGuests }: AdminDashboardProps) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Modais
  const [imageModalGuest, setImageModalGuest] = useState<Guest | null>(null);
  const [formModalGuest, setFormModalGuest] = useState<Guest | null>(null);
  const [isNewGuestOpen, setIsNewGuestOpen] = useState(false);

  // Cálculos de métricas do RPG
  const totalGuests = guests.length;
  const acceptedGuests = guests.filter((g) => g.status === "ACCEPTED");
  const declinedGuests = guests.filter((g) => g.status === "DECLINED");
  const pendingGuests = guests.filter((g) => g.status === "PENDING");

  const totalConfirmedPeople = acceptedGuests.reduce(
    (acc, g) => acc + 1 + (g.confirmedPlusOnes || 0),
    0
  );

  const copyInviteLink = (guest: Guest) => {
    retroSound.playSelect();
    const path = guest.flowType === "GAMEPLAY" ? "c" : "convite";
    const url = `${window.location.origin}/${path}/${guest.token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(guest.token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const openWhatsAppBroadcast = (guest: Guest) => {
    retroSound.playSelect();
    const path = guest.flowType === "GAMEPLAY" ? "c" : "convite";
    const url = `${window.location.origin}/${path}/${guest.token}`;
    const text = encodeURIComponent(
      `Olá ${guest.name}! ⚔️💖\nVocê foi convocado(a) para a nossa Wedding Quest (Casamento de Rian & Jeniffer em 12/12/2026 às 10:30h)!\n\nAcesse o link exclusivo para confirmar sua presença e escolher suas opções na party:\n${url}\n\nEsperamos por você!`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleGuestSaved = (savedGuest: Guest, isEdit: boolean) => {
    retroSound.playVictory();
    if (isEdit) {
      setGuests((prev) =>
        prev.map((g) => (g.id === savedGuest.id ? savedGuest : g))
      );
    } else {
      setGuests((prev) => [savedGuest, ...prev]);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    retroSound.playDodge();
    if (confirm(`Deseja realmente remover o aventureiro "${name}" da guilda?`)) {
      const res = await deleteGuest(id);
      if (res.success) {
        setGuests((prev) => prev.filter((g) => g.id !== id));
      }
    }
  };

  // Filtragem dos convidados
  const filteredGuests = guests.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "ALL" || g.category === filterCategory;
    const matchesStatus = filterStatus === "ALL" || g.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* HUD DE RECURSOS (MÉTRICAS RETRÔ) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total de Aventureiros */}
        <div className="bg-[#1a1c23] border-4 border-black pixel-shadow p-4 rounded-xl">
          <div className="flex items-center justify-between text-[#895525] text-[9px]">
            <span>TOTAL AVENTUREIROS</span>
            <Users className="w-4 h-4 text-gold-400" />
          </div>
          <p className="text-2xl font-bold text-gold-400 mt-2">
            {totalGuests}
          </p>
          <span className="text-[8px] text-stone-400">Cadastrados na Guilda</span>
        </div>

        {/* Party Confirmada */}
        <div className="bg-[#1a1c23] border-4 border-black pixel-shadow p-4 rounded-xl">
          <div className="flex items-center justify-between text-emerald-400 text-[9px]">
            <span>PARTY CONFIRMADA</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">
            {totalConfirmedPeople}
          </p>
          <span className="text-[8px] text-stone-400">
            {acceptedGuests.length} titulares + buffs
          </span>
        </div>

        {/* Quests Pendentes */}
        <div className="bg-[#1a1c23] border-4 border-black pixel-shadow p-4 rounded-xl">
          <div className="flex items-center justify-between text-amber-400 text-[9px]">
            <span>QUESTS PENDENTES</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">
            {pendingGuests.length}
          </p>
          <span className="text-[8px] text-stone-400">
            {totalGuests > 0 ? Math.round((pendingGuests.length / totalGuests) * 100) : 0}% da guilda
          </span>
        </div>

        {/* Baixas / Recusas */}
        <div className="bg-[#1a1c23] border-4 border-black pixel-shadow p-4 rounded-xl">
          <div className="flex items-center justify-between text-red-400 text-[9px]">
            <span>BAIXAS / RECUSAS</span>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-400 mt-2">
            {declinedGuests.length}
          </p>
          <span className="text-[8px] text-stone-400">Abandonaram a quest</span>
        </div>
      </div>

      {/* GUILD MEMBERS: TABELA & AÇÕES */}
      <div className="bg-[#161922] border-4 border-black pixel-shadow-lg rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between border-b-2 border-black pb-3">
          {/* Busca por Nome */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar aventureiro pelo nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-black border-2 border-stone-700 text-gold-300 text-[9px] rounded focus:outline-none focus:border-gold-400"
            />
          </div>

          {/* Filtros e Spawn New Player */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2.5 py-2 bg-black border-2 border-stone-700 text-stone-300 text-[8px] rounded focus:outline-none"
            >
              <option value="ALL">TODAS CATEGORIAS</option>
              <option value="PADRINHOS">PADRINHOS</option>
              <option value="FAMILIA_IDOSOS">FAMÍLIA / IDOSOS</option>
              <option value="AMIGOS">AMIGOS</option>
              <option value="GERAL">GERAL</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-2 bg-black border-2 border-stone-700 text-stone-300 text-[8px] rounded focus:outline-none"
            >
              <option value="ALL">TODOS STATUS</option>
              <option value="ACCEPTED">CONFIRMADOS (HP CHEIO)</option>
              <option value="PENDING">PENDENTES</option>
              <option value="DECLINED">RECUSADOS</option>
            </select>

            <button
              onClick={() => {
                retroSound.playSelect();
                setIsNewGuestOpen(true);
              }}
              className="px-3.5 py-2 bg-gold-500 hover:bg-gold-400 text-black border-2 border-black pixel-shadow text-[9px] font-bold flex items-center gap-1.5 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              SPAWN NEW PLAYER
            </button>
          </div>
        </div>

        {/* Tabela de Membros da Guilda */}
        <div className="overflow-x-auto rounded-lg border-2 border-black">
          <table className="w-full text-left text-[9px]">
            <thead className="bg-[#11141a] text-gold-400 border-b-2 border-black">
              <tr>
                <th className="px-3 py-2.5">AVENTUREIRO</th>
                <th className="px-2.5 py-2.5">CLASSE / FLUXO</th>
                <th className="px-2.5 py-2.5">STATUS HP</th>
                <th className="px-2 py-2.5 text-center">PARTY</th>
                <th className="px-3 py-2.5 text-right">COMANDOS</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black bg-[#1a1c23]">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-stone-500 text-[9px]">
                    Nenhum aventureiro encontrado na guilda.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => {
                  const isCopied = copiedToken === guest.token;
                  return (
                    <tr key={guest.id} className="hover:bg-[#252836] transition-colors">
                      <td className="px-3 py-3">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{guest.gender === "F" ? "🧙‍♀️" : "⚔️"}</span>
                          <span>{guest.name}</span>
                        </div>
                        {guest.scriptId && (
                          <div className="text-[8px] text-gold-400">
                            Roteiro: [{guest.scriptId}]
                          </div>
                        )}
                        {guest.customNote && (
                          <div className="text-[8px] text-stone-400 truncate max-w-xs italic">
                            &ldquo;{guest.customNote}&rdquo;
                          </div>
                        )}
                      </td>

                      <td className="px-2.5 py-3">
                        <div className="flex flex-col gap-1 items-start">
                          <span
                            className={`text-[8px] font-bold px-1.5 py-0.5 rounded border border-black ${
                              guest.flowType === "GAMEPLAY"
                                ? "bg-purple-900/80 text-purple-300"
                                : "bg-blue-900/80 text-blue-300"
                            }`}
                          >
                            {guest.flowType}
                          </span>
                          <span className="text-[8px] text-stone-400">
                            {guest.category}
                          </span>
                        </div>
                      </td>

                      <td className="px-2.5 py-3">
                        <span
                          className={`inline-flex items-center gap-1 text-[8px] font-bold px-2 py-0.5 rounded border border-black ${
                            guest.status === "ACCEPTED"
                              ? "bg-emerald-950 text-emerald-400 border-emerald-600"
                              : guest.status === "DECLINED"
                              ? "bg-red-950 text-red-400 border-red-600"
                              : "bg-amber-950 text-amber-400 border-amber-600"
                          }`}
                        >
                          {guest.status === "ACCEPTED"
                            ? "HP 100% (CONFIRMADO)"
                            : guest.status === "DECLINED"
                            ? "HP 0% (RECUSADO)"
                            : "HP 50% (PENDENTE)"}
                        </span>
                      </td>

                      <td className="px-2 py-3 text-center font-bold text-gold-300">
                        {guest.status === "ACCEPTED"
                          ? `+${guest.confirmedPlusOnes}`
                          : `max ${guest.allowedPlusOnes}`}
                      </td>

                      <td className="px-3 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Copiar Link */}
                          <button
                            onClick={() => copyInviteLink(guest)}
                            title="Copiar Link da Quest"
                            className={`p-1.5 rounded border-2 border-black pixel-shadow-sm transition-colors flex items-center gap-1 cursor-pointer ${
                              isCopied
                                ? "bg-emerald-600 text-white"
                                : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                            }`}
                          >
                            {isCopied ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span className="text-[7px]">LINK</span>
                          </button>

                          {/* WhatsApp Broadcast */}
                          <button
                            onClick={() => openWhatsAppBroadcast(guest)}
                            title="Enviar convite via WhatsApp"
                            className="p-1.5 rounded bg-emerald-900 hover:bg-emerald-800 text-emerald-300 border-2 border-black pixel-shadow-sm cursor-pointer"
                          >
                            <MessageCircle className="w-3 h-3" />
                          </button>

                          {/* Exportar Imagem Retrô */}
                          <button
                            onClick={() => {
                              retroSound.playSelect();
                              setImageModalGuest(guest);
                            }}
                            title="Exportar Cartão de Jogador PNG"
                            className="p-1.5 rounded bg-gold-600 hover:bg-gold-500 text-black border-2 border-black pixel-shadow-sm cursor-pointer"
                          >
                            <ImageIcon className="w-3 h-3" />
                          </button>

                          {/* Editar */}
                          <button
                            onClick={() => {
                              retroSound.playSelect();
                              setFormModalGuest(guest);
                            }}
                            title="Editar Atributos"
                            className="p-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 border-2 border-black pixel-shadow-sm cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>

                          {/* Deletar */}
                          <button
                            onClick={() => handleDelete(guest.id, guest.name)}
                            title="Excluir da Guilda"
                            className="p-1.5 rounded bg-red-950 hover:bg-red-800 text-red-400 border-2 border-black pixel-shadow-sm cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Download de Imagem PNG Retrô */}
      {imageModalGuest && (
        <InviteImageModal
          guest={imageModalGuest}
          onClose={() => setImageModalGuest(null)}
        />
      )}

      {/* Modal de Spawn New Player */}
      {isNewGuestOpen && (
        <GuestFormModal
          onClose={() => setIsNewGuestOpen(false)}
          onGuestSaved={handleGuestSaved}
        />
      )}

      {/* Modal de Edição */}
      {formModalGuest && (
        <GuestFormModal
          guest={formModalGuest}
          onClose={() => setFormModalGuest(null)}
          onGuestSaved={handleGuestSaved}
        />
      )}
    </div>
  );
}
