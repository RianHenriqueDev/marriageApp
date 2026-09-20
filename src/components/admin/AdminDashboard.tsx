"use client";

import { useState } from "react";
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
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
import { Guest, AttendanceSelection, RsvpState } from "@prisma/client";

interface AdminDashboardProps {
  initialGuests: Guest[];
}

export function AdminDashboard({ initialGuests }: AdminDashboardProps) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterAttendance, setFilterAttendance] = useState<string>("ALL");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Modais
  const [imageModalGuest, setImageModalGuest] = useState<Guest | null>(null);
  const [formModalGuest, setFormModalGuest] = useState<Guest | null>(null);
  const [isNewGuestOpen, setIsNewGuestOpen] = useState(false);

  // Métricas
  const totalGuests = guests.length;
  const confirmedGuestsList = guests.filter((g) => g.status === RsvpState.CONFIRMED);
  const pendingGuestsList = guests.filter((g) => g.status === RsvpState.PENDING);
  const declinedGuestsList = guests.filter((g) => g.status === RsvpState.DECLINED);

  const totalConfirmedHeadcount = confirmedGuestsList.reduce(
    (acc, g) => acc + (g.confirmedGuests || 1),
    0
  );

  const countBoth = confirmedGuestsList.filter((g) => g.attendance === AttendanceSelection.BOTH).length;
  const countCeremony = confirmedGuestsList.filter((g) => g.attendance === AttendanceSelection.ONLY_CEREMONY).length;
  const countRestaurant = confirmedGuestsList.filter((g) => g.attendance === AttendanceSelection.ONLY_RESTAURANT).length;

  const copyInviteLink = (guest: Guest) => {
    const url = `${window.location.origin}/c/${guest.token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(guest.token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const openWhatsAppBroadcast = (guest: Guest) => {
    const url = `${window.location.origin}/c/${guest.token}`;
    const text = encodeURIComponent(
      `Olá, ${guest.name}! ✨\nCom muita alegria, convidamos você para celebrar nosso casamento no dia 12 de Dezembro de 2026.\n\nAcesse o link abaixo para visualizar todos os detalhes e confirmar sua presença:\n${url}\n\nCom carinho, Jeniffer & Rian.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleGuestSaved = (savedGuest: Guest, isEdit: boolean) => {
    if (isEdit) {
      setGuests((prev) =>
        prev.map((g) => (g.id === savedGuest.id ? savedGuest : g))
      );
    } else {
      setGuests((prev) => [savedGuest, ...prev]);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Deseja realmente remover "${name}" da lista de convidados?`)) {
      const res = await deleteGuest(id);
      if (res.success) {
        setGuests((prev) => prev.filter((g) => g.id !== id));
      }
    }
  };

  const filteredGuests = guests.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || g.status === filterStatus;
    const matchesAttendance = filterAttendance === "ALL" || g.attendance === filterAttendance;
    return matchesSearch && matchesStatus && matchesAttendance;
  });

  return (
    <div className="space-y-8 animate-fade-up">
      {/* CARDS DE MÉTRICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cadastrado */}
        <div className="bg-surface-card border border-border-hairline shadow-editorial p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-content-secondary text-xs">
            <span className="font-sans uppercase tracking-[0.15em]">Convites Emitidos</span>
            <Users className="w-4 h-4 text-accent-olive" strokeWidth={1.5} />
          </div>
          <p className="font-serif text-3xl font-normal text-content-primary">
            {totalGuests}
          </p>
          <span className="text-[11px] text-content-muted block">
            Famílias e convidados cadastrados
          </span>
        </div>

        {/* Total Confirmado */}
        <div className="bg-surface-card border border-border-hairline shadow-editorial p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-accent-olive text-xs">
            <span className="font-sans uppercase tracking-[0.15em] font-medium">Pessoas Confirmadas</span>
            <CheckCircle2 className="w-4 h-4 text-accent-olive" strokeWidth={1.5} />
          </div>
          <p className="font-serif text-3xl font-normal text-accent-olive">
            {totalConfirmedHeadcount}
          </p>
          <div className="text-[11px] text-content-secondary space-y-0.5 pt-0.5">
            <div>Cerimônia + Almoço: {countBoth}</div>
            <div>Só Cartório: {countCeremony} | Só Almoço: {countRestaurant}</div>
          </div>
        </div>

        {/* Pendentes */}
        <div className="bg-surface-card border border-border-hairline shadow-editorial p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-content-secondary text-xs">
            <span className="font-sans uppercase tracking-[0.15em]">Respostas Pendentes</span>
            <Clock className="w-4 h-4 text-accent-gold" strokeWidth={1.5} />
          </div>
          <p className="font-serif text-3xl font-normal text-content-primary">
            {pendingGuestsList.length}
          </p>
          <span className="text-[11px] text-content-muted block">
            {totalGuests > 0 ? Math.round((pendingGuestsList.length / totalGuests) * 100) : 0}% aguardando confirmação
          </span>
        </div>

        {/* Não Comparecerão */}
        <div className="bg-surface-card border border-border-hairline shadow-editorial p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-content-secondary text-xs">
            <span className="font-sans uppercase tracking-[0.15em]">Ausentes</span>
            <XCircle className="w-4 h-4 text-content-muted" strokeWidth={1.5} />
          </div>
          <p className="font-serif text-3xl font-normal text-content-secondary">
            {declinedGuestsList.length}
          </p>
          <span className="text-[11px] text-content-muted block">
            Não poderão comparecer
          </span>
        </div>
      </div>

      {/* TABELA DE GESTÃO DE CONVIDADOS */}
      <div className="bg-surface-card border border-border-hairline shadow-editorial rounded-3xl p-6 space-y-5">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between border-b border-border-hairline pb-4">
          {/* Busca por Nome */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Buscar convidado pelo nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-canvas-subtle/70 border border-border-hairline text-xs font-sans text-content-primary placeholder:text-content-muted focus:outline-none focus:border-accent-olive focus:bg-surface-card transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filtro de Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-full bg-canvas-subtle/70 border border-border-hairline text-xs font-sans text-content-secondary focus:outline-none focus:border-accent-olive"
            >
              <option value="ALL">Todos os Status</option>
              <option value={RsvpState.CONFIRMED}>Confirmados</option>
              <option value={RsvpState.PENDING}>Pendentes</option>
              <option value={RsvpState.DECLINED}>Ausentes</option>
            </select>

            {/* Filtro de Fases */}
            <select
              value={filterAttendance}
              onChange={(e) => setFilterAttendance(e.target.value)}
              className="px-3 py-2 rounded-full bg-canvas-subtle/70 border border-border-hairline text-xs font-sans text-content-secondary focus:outline-none focus:border-accent-olive"
            >
              <option value="ALL">Todas as Fases</option>
              <option value={AttendanceSelection.BOTH}>Cerimônia + Almoço</option>
              <option value={AttendanceSelection.ONLY_CEREMONY}>Só Cerimônia</option>
              <option value={AttendanceSelection.ONLY_RESTAURANT}>Só Almoço</option>
            </select>

            {/* Botão Novo Convidado */}
            <button
              onClick={() => {
                setFormModalGuest(null);
                setIsNewGuestOpen(true);
              }}
              className="px-4 py-2 rounded-full bg-accent-olive text-white text-xs font-sans font-semibold tracking-wider uppercase hover:bg-accent-olive-hover transition-all cursor-pointer shadow-editorial flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" strokeWidth={1.5} />
              <span>Novo Convidado</span>
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto rounded-2xl border border-border-hairline">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-canvas-subtle/70 text-content-secondary border-b border-border-hairline">
              <tr>
                <th className="px-4 py-3 font-medium">Nome do Convidado</th>
                <th className="px-3 py-3 font-medium">Status RSVP</th>
                <th className="px-3 py-3 font-medium">Participação</th>
                <th className="px-3 py-3 text-center font-medium">Confirmados</th>
                <th className="px-4 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline/60 bg-surface-card">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-content-muted">
                    Nenhum convidado encontrado.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => {
                  const isCopied = copiedToken === guest.token;
                  return (
                    <tr key={guest.id} className="hover:bg-canvas-subtle/40 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-content-primary">
                          {guest.name}
                        </div>
                        {guest.phone && (
                          <div className="text-[11px] text-content-muted">
                            {guest.phone}
                          </div>
                        )}
                        {guest.guestMessage && (
                          <div className="text-[11px] text-accent-olive italic truncate max-w-xs mt-0.5">
                            &ldquo;{guest.guestMessage}&rdquo;
                          </div>
                        )}
                      </td>

                      <td className="px-3 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border ${
                            guest.status === RsvpState.CONFIRMED
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : guest.status === RsvpState.DECLINED
                              ? "bg-stone-100 text-stone-600 border-stone-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          {guest.status === RsvpState.CONFIRMED && "Confirmado"}
                          {guest.status === RsvpState.PENDING && "Pendente"}
                          {guest.status === RsvpState.DECLINED && "Ausente"}
                        </span>
                      </td>

                      <td className="px-3 py-3.5 text-[11px] text-content-secondary">
                        {guest.status === RsvpState.CONFIRMED ? (
                          <span>
                            {guest.attendance === AttendanceSelection.BOTH && "Cerimônia + Almoço"}
                            {guest.attendance === AttendanceSelection.ONLY_CEREMONY && "Apenas Cerimônia"}
                            {guest.attendance === AttendanceSelection.ONLY_RESTAURANT && "Apenas Almoço"}
                          </span>
                        ) : (
                          <span className="text-content-muted">—</span>
                        )}
                      </td>

                      <td className="px-3 py-3.5 text-center text-content-primary">
                        {guest.status === RsvpState.CONFIRMED ? (
                          <div>
                            <span className="font-semibold text-accent-olive">
                              {guest.confirmedGuests} {guest.confirmedGuests === 1 ? "pessoa" : "pessoas"}
                            </span>
                            <div className="text-[10px] text-content-muted">
                              {guest.hasSpouse && "• c/ cônjuge "}
                              {guest.childrenCount > 0 && `• ${guest.childrenCount} filho(s)`}
                              {!guest.hasSpouse && guest.childrenCount === 0 && "• titular"}
                            </div>
                          </div>
                        ) : guest.status === RsvpState.DECLINED ? (
                          <span className="text-content-muted">0</span>
                        ) : (
                          <span className="text-content-muted text-[11px]">Aguardando</span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Copiar Link */}
                          <button
                            type="button"
                            onClick={() => copyInviteLink(guest)}
                            title="Copiar link do convite"
                            className="p-1.5 rounded-full hover:bg-canvas-subtle text-content-secondary hover:text-accent-olive transition-colors cursor-pointer"
                          >
                            {isCopied ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>

                          {/* WhatsApp */}
                          <button
                            type="button"
                            onClick={() => openWhatsAppBroadcast(guest)}
                            title="Enviar convite pelo WhatsApp"
                            className="p-1.5 rounded-full hover:bg-emerald-50 text-content-secondary hover:text-emerald-700 transition-colors cursor-pointer"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>

                          {/* Exportar Imagem */}
                          <button
                            type="button"
                            onClick={() => setImageModalGuest(guest)}
                            title="Gerar cartão em imagem"
                            className="p-1.5 rounded-full hover:bg-canvas-subtle text-content-secondary hover:text-accent-olive transition-colors cursor-pointer"
                          >
                            <ImageIcon className="w-4 h-4" />
                          </button>

                          {/* Editar */}
                          <button
                            type="button"
                            onClick={() => setFormModalGuest(guest)}
                            title="Editar convidado"
                            className="p-1.5 rounded-full hover:bg-canvas-subtle text-content-secondary hover:text-accent-olive transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Excluir */}
                          <button
                            type="button"
                            onClick={() => handleDelete(guest.id, guest.name)}
                            title="Excluir da lista"
                            className="p-1.5 rounded-full hover:bg-red-50 text-content-secondary hover:text-red-700 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Modais */}
      {isNewGuestOpen && (
        <GuestFormModal
          onClose={() => setIsNewGuestOpen(false)}
          onGuestSaved={handleGuestSaved}
        />
      )}

      {formModalGuest && (
        <GuestFormModal
          guest={formModalGuest}
          onClose={() => setFormModalGuest(null)}
          onGuestSaved={handleGuestSaved}
        />
      )}

      {imageModalGuest && (
        <InviteImageModal
          guest={imageModalGuest}
          onClose={() => setImageModalGuest(null)}
        />
      )}
    </div>
  );
}
