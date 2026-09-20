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
  MessageSquareQuote,
} from "lucide-react";
import { deleteGuest } from "@/app/admin/actions";
import { InviteImageModal } from "./InviteImageModal";
import { GuestFormModal } from "./GuestFormModal";
import { GuestMessageModal } from "./GuestMessageModal";
import { Guest, AttendanceSelection, RsvpState, GuestCategory } from "@prisma/client";

export const GUEST_CATEGORY_LABELS: Record<GuestCategory, { label: string; tag: string }> = {
  [GuestCategory.BRIDE_FRIEND]: { label: "Amigo(a) da Noiva", tag: "Amigo • Noiva" },
  [GuestCategory.GROOM_FRIEND]: { label: "Amigo(a) do Noivo", tag: "Amigo • Noivo" },
  [GuestCategory.MUTUAL_FRIEND]: { label: "Amigo(a) de Ambos", tag: "Amigo • Ambos" },
  [GuestCategory.BRIDE_ACQUAINTANCE]: { label: "Conhecido(a) da Noiva", tag: "Conhecido • Noiva" },
  [GuestCategory.GROOM_ACQUAINTANCE]: { label: "Conhecido(a) do Noivo", tag: "Conhecido • Noivo" },
  [GuestCategory.MUTUAL_ACQUAINTANCE]: { label: "Conhecido(a) de Ambos", tag: "Conhecido • Ambos" },
  [GuestCategory.BRIDE_FAMILY]: { label: "Família da Noiva", tag: "Família • Noiva" },
  [GuestCategory.GROOM_FAMILY]: { label: "Família do Noivo", tag: "Família • Noivo" },
  [GuestCategory.MUTUAL_FAMILY]: { label: "Família de Ambos", tag: "Família • Ambos" },
};

interface AdminDashboardProps {
  initialGuests: Guest[];
}

export function AdminDashboard({ initialGuests }: AdminDashboardProps) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterAttendance, setFilterAttendance] = useState<string>("ALL");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Modais
  const [imageModalGuest, setImageModalGuest] = useState<Guest | null>(null);
  const [formModalGuest, setFormModalGuest] = useState<Guest | null>(null);
  const [messageModalGuest, setMessageModalGuest] = useState<Guest | null>(null);
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
    const matchesCategory = filterCategory === "ALL" || g.category === filterCategory;
    return matchesSearch && matchesStatus && matchesAttendance && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* CARDS DE MÉTRICAS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Total Cadastrado */}
        <div className="bg-surface-card border border-border-hairline shadow-editorial p-3.5 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-content-secondary text-[11px] sm:text-xs">
            <span className="font-sans uppercase tracking-[0.12em] sm:tracking-[0.15em]">Convites</span>
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-olive" strokeWidth={1.5} />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-normal text-content-primary">
            {totalGuests}
          </p>
          <span className="text-[10px] sm:text-[11px] text-content-muted block truncate">
            Famílias cadastradas
          </span>
        </div>

        {/* Total Confirmado */}
        <div className="bg-surface-card border border-border-hairline shadow-editorial p-3.5 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-accent-olive text-[11px] sm:text-xs">
            <span className="font-sans uppercase tracking-[0.12em] sm:tracking-[0.15em] font-medium">Confirmados</span>
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-olive" strokeWidth={1.5} />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-normal text-accent-olive">
            {totalConfirmedHeadcount}
          </p>
          <div className="text-[10px] sm:text-[11px] text-content-secondary space-y-0.5 pt-0.5">
            <div className="truncate">Ambos: {countBoth}</div>
            <div className="truncate text-content-muted">Cartório: {countCeremony} | Almoço: {countRestaurant}</div>
          </div>
        </div>

        {/* Pendentes */}
        <div className="bg-surface-card border border-border-hairline shadow-editorial p-3.5 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-content-secondary text-[11px] sm:text-xs">
            <span className="font-sans uppercase tracking-[0.12em] sm:tracking-[0.15em]">Pendentes</span>
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-gold" strokeWidth={1.5} />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-normal text-content-primary">
            {pendingGuestsList.length}
          </p>
          <span className="text-[10px] sm:text-[11px] text-content-muted block truncate">
            {totalGuests > 0 ? Math.round((pendingGuestsList.length / totalGuests) * 100) : 0}% aguardando
          </span>
        </div>

        {/* Não Comparecerão */}
        <div className="bg-surface-card border border-border-hairline shadow-editorial p-3.5 sm:p-5 rounded-2xl space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-content-secondary text-[11px] sm:text-xs">
            <span className="font-sans uppercase tracking-[0.12em] sm:tracking-[0.15em]">Ausentes</span>
            <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-content-muted" strokeWidth={1.5} />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-normal text-content-secondary">
            {declinedGuestsList.length}
          </p>
          <span className="text-[10px] sm:text-[11px] text-content-muted block truncate">
            Não comparecerão
          </span>
        </div>
      </div>

      {/* GESTÃO DE CONVIDADOS */}
      <div className="bg-surface-card border border-border-hairline shadow-editorial rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 space-y-4 sm:space-y-5">
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

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1 sm:flex-initial">
              {/* Filtro de Status */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 sm:py-2.5 rounded-full bg-canvas-subtle/70 border border-border-hairline text-xs font-sans text-content-secondary focus:outline-none focus:border-accent-olive cursor-pointer"
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
                className="w-full px-3 py-2 sm:py-2.5 rounded-full bg-canvas-subtle/70 border border-border-hairline text-xs font-sans text-content-secondary focus:outline-none focus:border-accent-olive cursor-pointer"
              >
                <option value="ALL">Todas as Fases</option>
                <option value={AttendanceSelection.BOTH}>Cerimônia + Almoço</option>
                <option value={AttendanceSelection.ONLY_CEREMONY}>Só Cerimônia</option>
                <option value={AttendanceSelection.ONLY_RESTAURANT}>Só Almoço</option>
              </select>

              {/* Filtro de Vínculo */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 sm:py-2.5 rounded-full bg-canvas-subtle/70 border border-border-hairline text-xs font-sans text-content-secondary focus:outline-none focus:border-accent-olive cursor-pointer"
              >
                <option value="ALL">Todos os Vínculos</option>
                <optgroup label="Amigos">
                  <option value={GuestCategory.BRIDE_FRIEND}>Amigo(a) da Noiva</option>
                  <option value={GuestCategory.GROOM_FRIEND}>Amigo(a) do Noivo</option>
                  <option value={GuestCategory.MUTUAL_FRIEND}>Amigo(a) de Ambos</option>
                </optgroup>
                <optgroup label="Conhecidos">
                  <option value={GuestCategory.BRIDE_ACQUAINTANCE}>Conhecido(a) da Noiva</option>
                  <option value={GuestCategory.GROOM_ACQUAINTANCE}>Conhecido(a) do Noivo</option>
                  <option value={GuestCategory.MUTUAL_ACQUAINTANCE}>Conhecido(a) de Ambos</option>
                </optgroup>
                <optgroup label="Família">
                  <option value={GuestCategory.BRIDE_FAMILY}>Família da Noiva</option>
                  <option value={GuestCategory.GROOM_FAMILY}>Família do Noivo</option>
                  <option value={GuestCategory.MUTUAL_FAMILY}>Família de Ambos</option>
                </optgroup>
              </select>
            </div>

            {/* Botão Novo Convidado */}
            <button
              onClick={() => {
                setFormModalGuest(null);
                setIsNewGuestOpen(true);
              }}
              className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-full bg-accent-olive text-white text-xs font-sans font-semibold tracking-wider uppercase hover:bg-accent-olive-hover transition-all cursor-pointer shadow-editorial flex items-center gap-1.5 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" strokeWidth={1.5} />
              <span>Novo Convidado</span>
            </button>
          </div>
        </div>

        {/* VISUALIZAÇÃO DESKTOP: TABELA TABULAR */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-border-hairline">
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
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          {guest.category && (
                            <span className="text-[10px] font-sans font-medium text-accent-olive bg-canvas-subtle px-2 py-0.5 rounded-full border border-border-hairline">
                              {GUEST_CATEGORY_LABELS[guest.category]?.tag || guest.category}
                            </span>
                          )}
                          {guest.phone && (
                            <span className="text-[11px] text-content-muted">
                              {guest.phone}
                            </span>
                          )}
                        </div>
                        {guest.guestMessage && (
                          <div className="mt-1.5 flex items-start gap-1.5 max-w-sm">
                            <button
                              type="button"
                              onClick={() => setMessageModalGuest(guest)}
                              title="Clique para ler a mensagem completa"
                              className="text-left group/msg p-1.5 -ml-1.5 rounded-lg hover:bg-canvas-subtle transition-colors cursor-pointer block"
                            >
                              <div className="flex items-center gap-1 text-[10px] font-medium text-accent-gold uppercase tracking-wider">
                                <MessageSquareQuote className="w-3 h-3 text-accent-gold" />
                                <span>Recado dos noivos</span>
                              </div>
                              <p className="text-[11px] text-content-secondary group-hover/msg:text-content-primary italic line-clamp-2 mt-0.5 leading-snug">
                                &ldquo;{guest.guestMessage}&rdquo;
                              </p>
                              <span className="text-[9.5px] text-accent-olive font-medium group-hover/msg:underline mt-0.5 inline-block">
                                Ver mensagem completa →
                              </span>
                            </button>
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

                          {/* Ler Mensagem do Convidado */}
                          {guest.guestMessage && (
                            <button
                              type="button"
                              onClick={() => setMessageModalGuest(guest)}
                              title="Ler mensagem completa do convidado"
                              className="p-1.5 rounded-full hover:bg-amber-50 text-accent-gold hover:text-amber-800 transition-colors cursor-pointer"
                            >
                              <MessageSquareQuote className="w-4 h-4" />
                            </button>
                          )}

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

        {/* VISUALIZAÇÃO MOBILE: CARDS ADAPTATIVOS SEM ROLAGEM HORIZONTAL */}
        <div className="block md:hidden space-y-3">
          {filteredGuests.length === 0 ? (
            <div className="p-8 text-center text-xs text-content-muted bg-canvas-subtle/40 rounded-2xl border border-border-hairline">
              Nenhum convidado encontrado.
            </div>
          ) : (
            filteredGuests.map((guest) => {
              const isCopied = copiedToken === guest.token;
              return (
                <div
                  key={guest.id}
                  className="bg-surface-card border border-border-hairline rounded-2xl p-4 shadow-editorial-sm space-y-3 transition-all hover:border-accent-olive/40"
                >
                  {/* Topo: Nome e Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-serif text-base font-medium text-content-primary truncate">
                        {guest.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        {guest.category && (
                          <span className="text-[10px] font-sans font-medium text-accent-olive bg-canvas-subtle px-2 py-0.5 rounded-full border border-border-hairline">
                            {GUEST_CATEGORY_LABELS[guest.category]?.tag || guest.category}
                          </span>
                        )}
                        {guest.phone && (
                          <span className="text-[11px] font-sans text-content-muted">
                            {guest.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`shrink-0 inline-flex items-center gap-1 text-[10px] font-medium px-2.5 py-1 rounded-full border ${
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
                  </div>

                  {/* Detalhes de Participação e Pessoas */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-sans bg-canvas-subtle/50 p-2.5 rounded-xl border border-border-hairline/60">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-content-muted block">
                        Presença
                      </span>
                      <span className="font-medium text-content-secondary text-[11px] block mt-0.5">
                        {guest.status === RsvpState.CONFIRMED ? (
                          guest.attendance === AttendanceSelection.BOTH
                            ? "Cerimônia + Almoço"
                            : guest.attendance === AttendanceSelection.ONLY_CEREMONY
                            ? "Só Cerimônia"
                            : "Só Almoço"
                        ) : guest.status === RsvpState.DECLINED ? (
                          "Não comparecerá"
                        ) : (
                          "Aguardando resposta"
                        )}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-content-muted block">
                        Pessoas
                      </span>
                      <span className="font-medium text-accent-olive text-[11px] block mt-0.5">
                        {guest.status === RsvpState.CONFIRMED ? (
                          <>
                            {guest.confirmedGuests} {guest.confirmedGuests === 1 ? "pessoa" : "pessoas"}
                            <span className="text-[10px] font-normal text-content-muted block">
                              {guest.hasSpouse && "• c/ cônjuge "}
                              {guest.childrenCount > 0 && `• ${guest.childrenCount} filho(s)`}
                              {!guest.hasSpouse && guest.childrenCount === 0 && "• titular"}
                            </span>
                          </>
                        ) : guest.status === RsvpState.DECLINED ? (
                          "0 pessoas"
                        ) : (
                          <span className="text-content-muted">Pendente</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Mensagem do Convidado */}
                  {guest.guestMessage && (
                    <button
                      type="button"
                      onClick={() => setMessageModalGuest(guest)}
                      title="Toque para abrir mensagem completa"
                      className="w-full text-left p-3 rounded-xl bg-canvas-subtle/60 border border-border-hairline/80 space-y-1 hover:border-accent-gold transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-[10px] font-sans font-medium text-accent-gold uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <MessageSquareQuote className="w-3.5 h-3.5" />
                          <span>Mensagem aos Noivos</span>
                        </span>
                        <span className="text-accent-olive font-semibold group-hover:underline text-[10px]">
                          Ver tudo →
                        </span>
                      </div>
                      <p className="text-xs font-serif italic text-content-primary leading-relaxed line-clamp-3">
                        &ldquo;{guest.guestMessage}&rdquo;
                      </p>
                    </button>
                  )}

                  {/* Barra de Ações Touch-Friendly */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-border-hairline/60 gap-1.5 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* WhatsApp */}
                      <button
                        type="button"
                        onClick={() => openWhatsAppBroadcast(guest)}
                        title="Enviar convite pelo WhatsApp"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-medium border border-emerald-200/80 transition-all cursor-pointer active:scale-95"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                        <span>WhatsApp</span>
                      </button>

                      {/* Copiar Link */}
                      <button
                        type="button"
                        onClick={() => copyInviteLink(guest)}
                        title="Copiar link do convite"
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all cursor-pointer active:scale-95 ${
                          isCopied
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-canvas-subtle text-content-secondary hover:text-accent-olive border-border-hairline"
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar Link</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Exportar Imagem */}
                      <button
                        type="button"
                        onClick={() => setImageModalGuest(guest)}
                        title="Gerar cartão em imagem"
                        className="p-2 rounded-lg bg-canvas-subtle text-content-secondary hover:text-accent-olive border border-border-hairline transition-colors cursor-pointer active:scale-95"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                      </button>

                      {/* Editar */}
                      <button
                        type="button"
                        onClick={() => setFormModalGuest(guest)}
                        title="Editar convidado"
                        className="p-2 rounded-lg bg-canvas-subtle text-content-secondary hover:text-accent-olive border border-border-hairline transition-colors cursor-pointer active:scale-95"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Excluir */}
                      <button
                        type="button"
                        onClick={() => handleDelete(guest.id, guest.name)}
                        title="Excluir da lista"
                        className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200/80 transition-colors cursor-pointer active:scale-95"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
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

      {messageModalGuest && (
        <GuestMessageModal
          guest={messageModalGuest}
          onClose={() => setMessageModalGuest(null)}
        />
      )}
    </div>
  );
}
