"use client";
import React, { useState, useEffect } from "react";
import { UserPlus, Search, Filter, MoreHorizontal, GraduationCap, Loader2, Plus } from "lucide-react";

export default function GestaoAlunos() {
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resS, resC] = await Promise.all([fetch("/api/students"), fetch("/api/classrooms")]);
        if (resS.ok) setStudents(await resS.json());
        if (resC.ok) setClasses(await resC.json());
      } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10 bg-[#F8FAFC] min-h-screen">
      {/* Header Estilizado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Gestão de Alunos</h1>
          <p className="text-slate-500 font-bold mt-1 uppercase text-xs tracking-widest opacity-60">Administração / Alunos</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all shadow-2xl shadow-blue-200 active:scale-95 uppercase text-xs tracking-widest">
          <Plus size={20} strokeWidth={3} /> Novo Aluno
        </button>
      </div>

      {/* Tabela Principal */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 text-sm font-bold text-slate-700 placeholder:text-slate-300 transition-all"
              placeholder="Pesquisar por nome do aluno..."
            />
          </div>
          <div className="flex gap-3">
            <button className="p-4 bg-slate-50 text-slate-500 rounded-2xl hover:bg-slate-100 transition-all border border-slate-100">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
              <tr>
                <th className="px-10 py-6">Informações do Aluno</th>
                <th className="px-10 py-6">Turma / Grupo</th>
                <th className="px-10 py-6">Status Matrícula</th>
                <th className="px-10 py-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-10 py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-blue-600 mb-4" size={32} />
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Sincronizando dados...</p>
                  </td>
                </tr>
              ) : students.map((s) => (
                <tr key={s.id} className="hover:bg-blue-50/30 transition-all group cursor-pointer">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner group-hover:from-blue-600 group-hover:to-blue-500 group-hover:text-white transition-all">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-base tracking-tight">{s.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">ID: {s.id.split('-')[0]}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="font-bold text-slate-600 text-sm">
                        {classes.find(c => c.id === s.classId)?.name || "Maternal A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                      Ativo
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button className="p-3 text-slate-300 hover:text-slate-900 hover:bg-white hover:shadow-sm rounded-xl transition-all">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
