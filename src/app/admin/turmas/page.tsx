"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, School } from "lucide-react";

type Classroom = {
  id: string;
  name: string;
};

export default function GestaoTurmas() {
  const [classes, setClasses] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [newClassName, setNewClassName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchClasses(); }, []);

  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/classrooms");
      if (res.ok) setClasses(await res.json());
    } catch (e) { 
      console.error("Erro ao buscar turmas", e); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleAddClass = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Clique detectado!");
    
    if (!newClassName) {
      alert("Por favor, digite o nome da turma.");
      return;
    }

    setSaving(true);
    try {
      console.log("Enviando para API...");
      const res = await fetch("/api/classrooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newClassName }),
      });

      if (res.ok) {
        alert("Turma '" + newClassName + "' criada com sucesso!");
        setNewClassName("");
        fetchClasses();
      } else {
        const err = await res.json();
        alert("Erro do servidor: " + (err.error || "Erro desconhecido"));
      }
    } catch (error: any) {
      alert("Erro de conexão: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10 bg-[#F8FAFC] min-h-screen">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Turmas</h1>
        <p className="text-slate-500 font-bold mt-1 uppercase text-xs tracking-widest opacity-60">
          Administração / Salas e Grupos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-fit">
          <h2 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight">
            Nova Turma
          </h2>

          <form onSubmit={handleAddClass} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                Nome da Turma
              </label>

              <input 
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 text-sm font-bold"
                placeholder="Ex: Maternal II B"
                value={newClassName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewClassName(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-100 flex items-center justify-center gap-2 uppercase text-xs tracking-widest hover:bg-blue-700 transition-colors"
            >
              {saving ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Plus size={18} strokeWidth={3} /> Criar Turma
                </>
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
              <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" /> Carregando turmas...
            </div>
          ) : classes.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
              Nenhuma turma encontrada.
            </div>
          ) : classes.map((c) => (
            <div key={c.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <School size={28} />
                </div>

                <button className="text-slate-200 hover:text-red-500 p-2 transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>

              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{c.name}</h3>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">
                Escola Acelera
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}