"use client";
import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";

export default function HistoricoLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<any>(null);

  useEffect(() => {
    fetch("/api/logs")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLogs(data);
        } else {
          console.error("Erro na API:", data);
          setLogs([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setLogs([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10 bg-[#F8FAFC] min-h-screen">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Histórico</h1>
        <p className="text-slate-500 font-bold mt-1 uppercase text-xs tracking-widest opacity-60">
          Registros do Diário de Bordo
        </p>
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
              {logs.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-slate-400">
                    Nenhum registro encontrado
                  </td>
                </tr>
              )}

              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-blue-50/30 transition-all group">
                  
                  {/* DATA */}
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3 font-bold text-slate-600 text-sm">
                      <Calendar size={16} className="text-blue-500" />
                      {log?.createdAt
                        ? new Date(log.createdAt).toLocaleDateString("pt-BR")
                        : "-"}
                    </div>
                  </td>

                  {/* ALUNO */}
                  <td className="px-10 py-6 font-black text-slate-900">
                    {log?.studentName || "-"}
                  </td>

                  {/* RESUMO */}
                  <td className="px-10 py-6">
                    <div className="flex gap-2">
                      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-[10px] font-black uppercase">
                        Registro criado
                      </span>
                    </div>
                  </td>

                  {/* AÇÕES */}
                  <td className="px-10 py-6 text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline"
                    >
                      Ver Detalhes
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {selectedLog && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setSelectedLog(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-[420px] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-black text-slate-900 mb-4">
              Detalhes do Registro
            </h2>

            <div className="space-y-2 text-sm text-slate-700">
              <p><strong>Aluno:</strong> {selectedLog?.studentName || "-"}</p>

              <p>
                <strong>Data:</strong>{" "}
                {selectedLog?.createdAt
                  ? new Date(selectedLog.createdAt).toLocaleDateString("pt-BR")
                  : "-"}
              </p>

              <p><strong>ID do Registro:</strong> {selectedLog?.id || "-"}</p>
              <p><strong>ID do Aluno:</strong> {selectedLog?.studentId || "-"}</p>
            </div>

            <button
              onClick={() => setSelectedLog(null)}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}