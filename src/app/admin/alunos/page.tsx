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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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

  const handleEditStudent = (student:any) => {
    setStudentName(student.name);
    setStudentClass(student.classId);
    setShowModal(true);
    setOpenMenuId(null);
  };

  const handleDeleteStudent = async (id:string) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    const res = await fetch("/api/students", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });

    if (res.ok) {
      loadData();
    } else {
      alert("Erro ao excluir");
    }

    setOpenMenuId(null);
  };

  return (
    <div
      className="p-10 max-w-7xl mx-auto space-y-10 bg-[#F8FAFC] min-h-screen"
      onClick={() => setOpenMenuId(null)} // 🔥 fecha menu ao clicar fora
    >

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black">Gestão de Alunos</h1>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2"
        >
          <Plus size={18} /> Novo Aluno
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white p-6 rounded-xl w-[400px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between mb-4">
              <h2 className="font-bold">Aluno</h2>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <input
                value={studentName}
                onChange={(e)=>setStudentName(e.target.value)}
                placeholder="Nome"
                className="w-full p-3 bg-gray-100 rounded"
              />

              <select
                value={studentClass}
                onChange={(e)=>setStudentClass(e.target.value)}
                className="w-full p-3 bg-gray-100 rounded"
              >
                <option value="">Turma</option>
                {classes.map((c:any)=>(
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <button className="w-full bg-blue-600 text-white p-3 rounded">
                Salvar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TABELA */}
      <div className="bg-white rounded-xl p-6 overflow-visible">

        {loading ? (
          <Loader2 className="animate-spin mx-auto" />
        ) : (
          <table className="w-full">

            <thead>
              <tr>
                <th>Aluno</th>
                <th>Turma</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {students.map((s)=>(
                <tr key={s.id} className="border-t hover:bg-gray-50">

                  <td>{s.name}</td>

                  <td>
                    {classes.find(c=>c.id === s.classId)?.name || "-"}
                  </td>

                  <td className="text-green-600">Ativo</td>

                  <td className="text-right relative">
                    <button
                      onClick={(e)=>{
                        e.stopPropagation(); // 🔥 evita fechar
                        setOpenMenuId(openMenuId === s.id ? null : s.id);
                      }}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <MoreHorizontal />
                    </button>

                    {openMenuId === s.id && (
                      <div className="absolute right-0 mt-2 bg-white shadow-xl rounded-xl p-2 w-40 z-50 border">

                        <button
                          onClick={() => handleEditStudent(s)}
                          className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                        >
                          ✏️ Editar
                        </button>

                        <button
                          onClick={() => handleDeleteStudent(s.id)}
                          className="block w-full text-left px-3 py-2 hover:bg-red-100 text-red-600"
                        >
                          🗑 Excluir
                        </button>

                      </div>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>

    </div>
  );
}