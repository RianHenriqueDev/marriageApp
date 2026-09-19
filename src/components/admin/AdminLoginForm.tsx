"use client";

import { useState } from "react";
import { loginAdmin } from "@/app/admin/actions";
import { Lock } from "lucide-react";

export function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await loginAdmin(password);
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Senha incorreta.");
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-canvas-base flex items-center justify-center p-4">
      <div className="bg-surface-card border border-border-hairline shadow-editorial-lg rounded-3xl max-w-sm w-full p-8 space-y-6 text-center animate-fade-up">
        <div className="w-12 h-12 rounded-full bg-canvas-subtle flex items-center justify-center mx-auto text-accent-olive border border-border-hairline">
          <Lock className="w-5 h-5" strokeWidth={1.5} />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-content-muted block">
            Painel dos Noivos
          </span>
          <h2 className="font-serif text-2xl font-normal text-content-primary">
            Jeniffer & Rian
          </h2>
          <p className="text-xs text-content-secondary pt-1">
            Digite a senha de acesso para gerenciar a lista de convidados:
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              placeholder="Digite a senha..."
              className="w-full px-4 py-3 rounded-xl bg-canvas-subtle/70 border border-border-hairline text-xs font-sans text-content-primary focus:outline-none focus:border-accent-olive focus:bg-surface-card transition-all"
            />
            {error && (
              <p className="text-xs text-red-600 mt-1 font-sans">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-accent-olive text-white font-sans text-xs font-semibold tracking-wider uppercase hover:bg-accent-olive-hover transition-all cursor-pointer shadow-editorial"
          >
            {loading ? "Verificando..." : "Entrar no Painel"}
          </button>
        </form>
      </div>
    </div>
  );
}
