"use client";

import { useState } from "react";
import { createGuest, updateGuest } from "@/app/admin/actions";
import { X } from "lucide-react";
import { Guest, AttendanceSelection, RsvpState } from "@prisma/client";

interface GuestFormModalProps {
  guest?: Guest | null;
  onClose: () => void;
  onGuestSaved?: (savedGuest: Guest, isEdit: boolean) => void;
}

export function GuestFormModal({ guest, onClose, onGuestSaved }: GuestFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-surface-card border border-border-hairline shadow-editorial-lg rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 animate-fade-up">
        <div className="flex items-center justify-between pb-3 border-b border-border-hairline">
          <div>
            <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-accent-olive font-semibold block">
              {guest ? "Editar Registro" : "Novo Convidado"}
            </span>
            <h3 className="font-serif text-2xl font-normal text-content-primary">
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
              className="w-full px-4 py-3 bg-canvas-subtle/60 border border-border-hairline rounded-xl text-content-primary focus:outline-none focus:border-accent-olive focus:bg-surface-card transition-all placeholder:text-content-muted"
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
              className="w-full px-4 py-3 bg-canvas-subtle/60 border border-border-hairline rounded-xl text-content-primary focus:outline-none focus:border-accent-olive focus:bg-surface-card transition-all placeholder:text-content-muted"
            />
            <p className="text-[10px] text-content-muted mt-1">
              O convidado responderá diretamente no link se virá com cônjuge e a quantidade de filhos.
            </p>
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
                  className="w-full px-3 py-2.5 bg-canvas-subtle/60 border border-border-hairline rounded-xl text-content-primary focus:outline-none focus:border-accent-olive"
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
                  className="w-full px-3 py-2.5 bg-canvas-subtle/60 border border-border-hairline rounded-xl text-content-primary focus:outline-none focus:border-accent-olive"
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
              className="flex-1 py-3 rounded-full bg-canvas-subtle text-content-secondary font-sans text-xs hover:bg-canvas-subtle/80 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-full bg-accent-olive text-white font-sans text-xs font-semibold tracking-wider uppercase hover:bg-accent-olive-hover transition-all cursor-pointer shadow-editorial"
            >
              {loading ? "Salvando..." : guest ? "Salvar Alterações" : "Criar Convite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
