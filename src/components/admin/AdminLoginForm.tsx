"use client";

import { useState } from "react";
import { Shield, KeyRound, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { loginAdmin } from "@/app/admin/actions";
import { retroSound } from "@/lib/retroAudio";

export function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password.trim()) {
      setError("Insira a senha de Game Master!");
      retroSound.playDodge();
      return;
    }

    setLoading(true);
    const res = await loginAdmin(password);
    setLoading(false);

    if (res.success) {
      retroSound.playVictory();
      window.location.reload();
    } else {
      retroSound.playDodge();
      setError(res.error || "Senha incorreta!");
    }
  };

  return (
    <main className="min-h-screen bg-[#070b12] text-[#f6eed9] flex flex-col items-center justify-center p-4 font-pixel select-none relative overflow-hidden">
      {/* Background Retrô */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-gradient-to-b from-[#03060c] via-[#0d1527] to-[#1a263d]">
        <div className="absolute top-12 left-1/4 w-2 h-2 bg-yellow-200 animate-pixel-blink" />
        <div className="absolute top-24 right-1/4 w-2 h-2 bg-yellow-300 animate-pixel-blink" />
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#122815] border-t-4 border-black" />
      </div>

      <div className="max-w-md w-full bg-[#161922] border-4 border-black pixel-shadow-lg rounded-2xl p-6 sm:p-8 space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[9px] text-stone-400 hover:text-gold-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          [ RETORNAR AO INÍCIO ]
        </Link>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-black/60 border-2 border-gold-400 rounded-xl flex items-center justify-center mx-auto text-gold-400 shadow-[0_0_15px_rgba(215,170,95,0.4)]">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-sm sm:text-base font-extrabold text-gold-400 tracking-wider">
            GAME MASTER ACCESS
          </h1>
          <p className="text-[9px] text-stone-400 font-sans">
            Área restrita aos noivos Jeniffer & Rian. Autenticação obrigatória.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gold-300 text-[9px] font-bold mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              DIGITE A MASTER PASSWORD:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="••••••••••••"
              autoFocus
              className="w-full px-3 py-2.5 bg-black border-2 border-gold-400 text-gold-300 text-[10px] rounded focus:outline-none placeholder:text-stone-700 font-pixel tracking-widest"
            />
          </div>

          {error && (
            <div className="p-2.5 bg-red-950/80 border-2 border-red-600 text-red-300 text-[8px] rounded animate-bounce">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#c79038] hover:bg-[#d7aa5f] text-black border-4 border-black pixel-shadow text-[10px] font-extrabold tracking-wider flex items-center justify-center gap-2 cursor-pointer active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <span>{loading ? "VERIFICANDO..." : "DESBLOQUEAR CONSOLE"}</span>
          </button>
        </form>

        <div className="text-center text-[8px] text-stone-500 pt-2 border-t border-stone-800">
          QUEST LAUNCH • 12/12/2026 • 10:30H
        </div>
      </div>
    </main>
  );
}
