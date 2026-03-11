"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.role === "teacher") {
          router.push("/diario-bordo");
        } else if (data.role === "parent") {
          router.push("/parent");
        } else {
          // Alterado de /admin/dashboard para /admin para não ir direto para o dashboard
          router.push("/admin");
        }
      } else {
        alert(data.error || "E-mail ou senha incorretos");
      }
    } catch (err) {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-[2rem] text-white font-black text-4xl mb-6 shadow-2xl">
            A
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Acelera</h1>
          <p className="text-slate-400 font-bold mt-2 uppercase text-[10px] tracking-[0.3em]">Gestão Escolar</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">E-mail de Acesso</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input 
                  type="email"
                  required
                  autoFocus
                  className="w-full pl-14 pr-6 py-5 bg-slate-900/50 border border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/20 text-white font-bold transition-all placeholder:text-slate-600"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Senha Secreta</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input 
                  type="password"
                  required
                  className="w-full pl-14 pr-6 py-5 bg-slate-900/50 border border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/20 text-white font-bold transition-all placeholder:text-slate-600"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-6 rounded-2xl shadow-2xl shadow-blue-900/40 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><ArrowRight size={20} strokeWidth={3} /> Entrar no Sistema</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}