"use client";
import React, { useState, useEffect } from "react";
import { ClipboardList, Search, Calendar, User, ChevronRight } from "lucide-react";

export default function HistoricoLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/logs").then(res => res.json()).then(data => {
      setLogs(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10 bg-[#F8FAFC] min-h-screen">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Histórico</h1>
        <p className="text-slate-500 font-bold mt-1 uppercase text-xs tracking-widest opacity-60">Registros do Diário de Bordo</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
              <tr>
                <th className="px-10 py-6">Data</th>
                <th className="px-10 py-6">Aluno</th>
                <th className="px-10 py-6">Resumo</th>
                <th className="px-10 py-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-blue-50/30 transition-all group cursor-pointer">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3 font-bold text-slate-600 text-sm">
                      <Calendar size={16} className="text-blue-500" />
                      {new Date(log.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-10 py-6 font-black text-slate-900">{log.studentName}</td>
                  <td className="px-10 py-6">
                    <div className="flex gap-2">
                      <span className="bg-orange-50 text-orange-600 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">Alim: {log.food}</span>
                      <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">Sono: {log.sleep}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">Ver Detalhes</button>
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
