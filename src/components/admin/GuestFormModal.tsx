"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { createGuest, updateGuest } from "@/app/admin/actions";
import { X } from "lucide-react";
import { Guest, AttendanceSelection, RsvpState, GuestCategory } from "@prisma/client";

interface GuestFormModalProps {
  guest?: Guest | null;
  onClose: () => void;
  onGuestSaved?: (savedGuest: Guest, isEdit: boolean) => void;
}

export function GuestFormModal({ guest, onClose, onGuestSaved }: GuestFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = guest
      ? await updateGuest(guest.id, formData)
      : await createGuest(formData);

    setLoading(false);

    if (res.success && res.guest) {
      if (onGuestSaved) {
        onGuestSaved(res.guest, !!guest);
      }
      onClose();
    } else {
      setError(res.error || "Erro ao salvar convidado.");
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="bg-surface-card border border-border-hairline shadow-none rounded-2xl sm:rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 animate-fade-up max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-border-hairline">
          <div>
            <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-accent-olive font-semibold block">
              {guest ? "Editar Registro" : "Novo Convidado"}
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-normal text-content-primary">
              {guest ? guest.name : "Cadastrar Convidado"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-content-secondary hover:text-content-primary rounded-full hover:bg-canvas-subtle transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-800 text-xs rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block text-content-primary font-medium mb-1.5">
              Nome Formal no Convite *
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={guest?.name || ""}
              placeholder="Ex: Tios Paulo & Lúcia, Carlos Moura"
              className="w-full px-4 py-3 bg-canvas-subtle/60 border border-border-hairline rounded-xl text-content-primary focus:outline-none focus:border-accent-olive focus:bg-surface-card transition-all placeholder:text-content-muted text-sm sm:text-xs"
            />
          </div>

          <div>
            <label className="block text-content-primary font-medium mb-1.5">
              WhatsApp (Opcional)
            </label>
            <input
              type="text"
              name="phone"
              defaultValue={guest?.phone || ""}
              placeholder="(16) 99999-9999"
              className="w-full px-4 py-3 bg-canvas-subtle/60 border border-border-hairline rounded-xl text-content-primary focus:outline-none focus:border-accent-olive focus:bg-surface-card transition-all placeholder:text-content-muted text-sm sm:text-xs"
            />
            <p className="text-[10px] text-content-muted mt-1">
              O convidado responderá diretamente no link se virá com cônjuge e a quantidade de filhos.
            </p>
          </div>

          <div>
            <label className="block text-content-primary font-medium mb-1.5">
              Vínculo com os Noivos
            </label>
            <select
              name="category"
              defaultValue={guest?.category || GuestCategory.MUTUAL_FRIEND}
              className="w-full px-4 py-3 bg-canvas-subtle/60 border border-border-hairline rounded-xl text-content-primary focus:outline-none focus:border-accent-olive focus:bg-surface-card transition-all text-xs cursor-pointer"
            >
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

          {guest && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-content-primary font-medium mb-1.5">
                  Presença / Fases
                </label>
                <select
                  name="attendance"
                  defaultValue={guest.attendance}
                  className="w-full px-3 py-2.5 bg-canvas-subtle/60 border border-border-hairline rounded-xl text-content-primary focus:outline-none focus:border-accent-olive text-xs cursor-pointer"
                >
                  <option value={AttendanceSelection.BOTH}>Cerimônia + Almoço</option>
                  <option value={AttendanceSelection.ONLY_CEREMONY}>Apenas Cerimônia</option>
                  <option value={AttendanceSelection.ONLY_RESTAURANT}>Apenas Almoço</option>
                  <option value={AttendanceSelection.DECLINED}>Não comparecerá</option>
                </select>
              </div>

              <div>
                <label className="block text-content-primary font-medium mb-1.5">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={guest.status}
                  className="w-full px-3 py-2.5 bg-canvas-subtle/60 border border-border-hairline rounded-xl text-content-primary focus:outline-none focus:border-accent-olive text-xs cursor-pointer"
                >
                  <option value={RsvpState.CONFIRMED}>Confirmado</option>
                  <option value={RsvpState.PENDING}>Pendente</option>
                  <option value={RsvpState.DECLINED}>Ausente</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-border-hairline">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 min-h-[44px] rounded-full bg-canvas-subtle text-content-secondary font-sans text-xs hover:bg-canvas-subtle/80 transition-all cursor-pointer active:scale-[0.98]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 min-h-[44px] rounded-full bg-accent-olive text-white font-sans text-xs font-semibold tracking-wider uppercase hover:bg-accent-olive-hover transition-all cursor-pointer shadow-editorial active:scale-[0.98]"
            >
              {loading ? "Salvando..." : guest ? "Salvar Alterações" : "Criar Convite"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
