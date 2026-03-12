"use client";
import React, { useState, useEffect } from "react";
import { Search, Filter, MoreHorizontal, Loader2, Plus, X } from "lucide-react";

export default function GestaoAlunos() {
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resS, resC] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/classrooms")
      ]);

      if (resS.ok) setStudents(await resS.json());
      if (resC.ok) setClasses(await resC.json());
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudent = async (e:any) => {
    e.preventDefault();

    if (!studentName || !studentClass) {
      alert("Preencha nome e turma.");
      return;
    }

    const res = await fetch("/api/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: studentName,
        classId: studentClass
      })
    });

    if (res.ok) {
      setShowModal(false);
      setStudentName("");
      setStudentClass("");
      loadData();
    } else {
      alert("Erro ao cadastrar aluno");
    }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10 bg-[#F8FAFC] min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Gestão de Alunos
          </h1>
          <p className="text-slate-500 font-bold mt-1 uppercase text-xs tracking-widest opacity-60">
            Administração / Alunos
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all shadow-2xl shadow-blue-200 active:scale-95 uppercase text-xs tracking-widest"
        >
          <Plus size={20} strokeWidth={3} />
          Novo Aluno
        </button>
      </div>


      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl w-[400px] space-y-6 shadow-2xl">

            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black">Cadastrar Aluno</h2>
              <button onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4">

              <input
                type="text"
                placeholder="Nome do aluno"
                value={studentName}
                onChange={(e)=>setStudentName(e.target.value)}
                className="w-full p-4 bg-slate-50 rounded-xl"
              />

              <select
                value={studentClass}
                onChange={(e)=>setStudentClass(e.target.value)}
                className="w-full p-4 bg-slate-50 rounded-xl"
              >
                <option value="">Selecione a turma</option>
                {classes.map((c:any)=>(
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold"
              >
                Cadastrar
              </button>

            </form>

          </div>
        </div>
      )}


      {/* TABELA */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">

        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl"
              placeholder="Pesquisar por nome do aluno..."
            />
          </div>

          <button className="p-4 bg-slate-50 rounded-2xl">
            <Filter size={20} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">

            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
              <tr>
                <th className="px-10 py-6">Informações do Aluno</th>
                <th className="px-10 py-6">Turma</th>
                <th className="px-10 py-6">Status</th>
                <th className="px-10 py-6 text-right">Ações</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-10 py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-blue-600 mb-4" size={32} />
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s.id} className="hover:bg-blue-50">

                    <td className="px-10 py-6">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center font-bold">
                          {s.name.charAt(0)}
                        </div>
                        {s.name}
                      </div>
                    </td>

                    <td className="px-10 py-6">
                      {classes.find(c => c.id === s.classId)?.name || "-"}
                    </td>

                    <td className="px-10 py-6">
                      <span className="text-green-600 font-bold">Ativo</span>
                    </td>

                    <td className="px-10 py-6 text-right">
                      <MoreHorizontal />
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>
        </div>

      </div>

    </div>
  );
}