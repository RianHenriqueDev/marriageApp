"use client";

import { useState } from "react";
import { createGuest, updateGuest } from "@/app/admin/actions";
import { X, Sparkles } from "lucide-react";
import { Guest } from "@prisma/client";
import { SCRIPTS } from "@/data/scripts";

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
      setError(res.error || "Erro ao salvar aventureiro.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-pixel select-none">
      <div className="bg-[#1a1c23] rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 border-4 border-black pixel-shadow-lg text-white max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b-2 border-stone-700">
          <h3 className="text-xs sm:text-sm font-bold text-gold-400">
            {guest ? "EDITAR AVENTUREIRO" : "SPAWN NEW PLAYER (NOVO CADASTRO)"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded hover:bg-stone-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-2.5 bg-red-950 text-red-300 text-[9px] rounded border border-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-[9px]">
          <div>
            <label className="block text-gold-300 font-bold mb-1">
              NOME DO AVENTUREIRO / GUILDA
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={guest?.name || ""}
              placeholder="Ex: Carlos Moura, Vô João e Vó Maria"
              className="w-full px-3 py-2 bg-black border-2 border-stone-700 rounded text-gold-300 text-[9px] focus:outline-none focus:border-gold-400 font-pixel"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gold-300 font-bold mb-1">
                GÊNERO (AVATAR)
              </label>
              <select
                name="gender"
                defaultValue={guest?.gender || "M"}
                className="w-full px-2.5 py-2 bg-black border-2 border-stone-700 rounded text-stone-200 text-[9px] focus:outline-none focus:border-gold-400 font-pixel"
              >
                <option value="M">Masculino (Guerreiro)</option>
                <option value="F">Feminino (Maga/Diva)</option>
              </select>
            </div>

            <div>
              <label className="block text-gold-300 font-bold mb-1">
                CATEGORIA
              </label>
              <select
                name="category"
                defaultValue={guest?.category || "AMIGOS"}
                className="w-full px-2.5 py-2 bg-black border-2 border-stone-700 rounded text-stone-200 text-[9px] focus:outline-none focus:border-gold-400 font-pixel"
              >
                <option value="PADRINHOS">Padrinhos</option>
                <option value="FAMILIA_IDOSOS">Família / Idosos</option>
                <option value="AMIGOS">Amigos</option>
                <option value="GERAL">Geral</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gold-300 font-bold mb-1">
                TIPO DE FLUXO
              </label>
              <select
                name="flowType"
                defaultValue={guest?.flowType || "GAMEPLAY"}
                className="w-full px-2.5 py-2 bg-black border-2 border-stone-700 rounded text-stone-200 text-[9px] focus:outline-none focus:border-gold-400 font-pixel"
              >
                <option value="GAMEPLAY">GamePlay (16-Bit RPG)</option>
                <option value="CLASSIC">Clássico (Pergaminho)</option>
              </select>
            </div>

            <div>
              <label className="block text-gold-300 font-bold mb-1">
                SLOTS PARTY (BUFFS)
              </label>
              <input
                type="number"
                name="allowedPlusOnes"
                min="0"
                max="10"
                defaultValue={guest?.allowedPlusOnes ?? 0}
                className="w-full px-2.5 py-2 bg-black border-2 border-stone-700 rounded text-gold-300 text-[9px] focus:outline-none focus:border-gold-400 font-pixel"
              />
            </div>
          </div>

          {guest && (
            <div>
              <label className="block text-gold-300 font-bold mb-1">
                STATUS DE PRESENÇA NAS FASES
              </label>
              <select
                name="attendance"
                defaultValue={guest.attendance || "BOTH"}
                className="w-full px-2.5 py-2 bg-black border-2 border-stone-700 rounded text-stone-200 text-[9px] focus:outline-none focus:border-gold-400 font-pixel"
              >
                <option value="BOTH">⚔️ FASE 1 & 2 (Cartório + Banquete JP Steakhouse)</option>
                <option value="ONLY_CEREMONY">📜 FASE 1 (Apenas Cartório / 0 Gold)</option>
                <option value="ONLY_DINNER">🥩 FASE 2 (Apenas JP Steakhouse / Paga seu Loot)</option>
                <option value="NONE">❌ NENHUMA (Recusou)</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-gold-300 font-bold mb-1">
              ROTEIRO (DEIXE VAZIO PARA SORTEAR 1 DOS 30 AUTOMÁTICO)
            </label>
            <select
              name="scriptId"
              defaultValue={guest?.scriptId || ""}
              className="w-full px-2.5 py-2 bg-black border-2 border-stone-700 rounded text-stone-200 text-[8px] focus:outline-none focus:border-gold-400 font-pixel"
            >
              <option value="">[AUTO: Sorteio Único Inteligente Sem Repetição]</option>
              <optgroup label="--- ROTEIROS MASCULINOS (15) ---">
                {Object.values(SCRIPTS)
                  .filter((s) => s.gender === "M")
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      [{s.id}] {s.title}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="--- ROTEIROS FEMININOS (15) ---">
                {Object.values(SCRIPTS)
                  .filter((s) => s.gender === "F")
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      [{s.id}] {s.title}
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-gold-300 font-bold mb-1">
              RECADO ESPECIAL / NOTA DOS NOIVOS
            </label>
            <textarea
              name="customNote"
              rows={2}
              defaultValue={guest?.customNote || ""}
              placeholder="Ex: Traga sua famosa alegria! Ou: Não ouse atrasar!"
              className="w-full px-3 py-2 bg-black border-2 border-stone-700 rounded text-stone-200 text-[9px] focus:outline-none focus:border-gold-400 font-pixel"
            />
          </div>

          <div className="flex gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded bg-stone-800 text-stone-400 hover:text-white border-2 border-black pixel-shadow text-[9px] cursor-pointer"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded bg-gold-500 hover:bg-gold-400 text-black border-2 border-black pixel-shadow text-[9px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {loading ? "SALVANDO..." : "SPAWN PLAYER"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
