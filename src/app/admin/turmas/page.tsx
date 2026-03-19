"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, School } from "lucide-react";

type Classroom = {
  id: string;
  name: string;
  shift?: string;
  capacity?: number;
  year?: string;
};

export default function GestaoTurmas() {
  const [classes, setClasses] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);

  const [newClassName, setNewClassName] = useState("");
  const [classShift, setClassShift] = useState("");
  const [classCapacity, setClassCapacity] = useState("");
  const [classYear, setClassYear] = useState("");

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

    if (!newClassName) {
      alert("Digite o nome da turma.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/classrooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newClassName,
          shift: classShift || null,
          capacity: classCapacity ? Number(classCapacity) : null,
          year: classYear || null,
        }),
      });

      if (res.ok) {
        alert("Turma criada!");
        setNewClassName("");
        setClassShift("");
        setClassCapacity("");
        setClassYear("");
        fetchClasses();
      }
    } catch (error: any) {
      alert("Erro: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10 bg-[#F8FAFC] min-h-screen">
      
      <div>
        <h1 className="text-4xl font-black">Turmas</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* FORM */}
        <div className="bg-white p-8 rounded-3xl shadow-sm">
          <h2 className="font-black mb-6">Nova Turma</h2>

          <form onSubmit={handleAddClass} className="space-y-4">

            <input
              className="w-full p-4 bg-slate-50 rounded-xl font-bold"
              placeholder="Nome da turma"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
            />

            <select
              className="w-full p-4 bg-slate-50 rounded-xl font-bold"
              value={classShift}
              onChange={(e) => setClassShift(e.target.value)}
            >
              <option value="">Turno</option>
              <option value="morning">Manhã</option>
              <option value="afternoon">Tarde</option>
              <option value="night">Noite</option>
            </select>

            <input
              type="number"
              placeholder="Capacidade"
              className="w-full p-4 bg-slate-50 rounded-xl font-bold"
              value={classCapacity}
              onChange={(e) => setClassCapacity(e.target.value)}
            />

            <input
              placeholder="Ano (2026)"
              className="w-full p-4 bg-slate-50 rounded-xl font-bold"
              value={classYear}
              onChange={(e) => setClassYear(e.target.value)}
            />

            <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">
              {saving ? <Loader2 className="animate-spin" /> : "Criar"}
            </button>

          </form>
        </div>

        {/* CARDS */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">

          {loading ? (
            <Loader2 className="animate-spin mx-auto" />
          ) : classes.map((c) => (

            <div key={c.id} className="bg-white p-6 rounded-3xl shadow-md space-y-4">

              <div className="flex justify-between">
                <School />
                <Trash2 className="text-red-500 cursor-pointer" />
              </div>

              <h3 className="font-black text-xl">{c.name}</h3>

              <p className="text-sm text-gray-500">
                {c.shift === "morning" && "Manhã"}
                {c.shift === "afternoon" && "Tarde"}
                {c.shift === "night" && "Noite"}
              </p>

              <p className="text-sm">
                Capacidade: {c.capacity || "∞"}
              </p>

              <p className="text-sm">
                Ano: {c.year || "-"}
              </p>

              <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded-xl">
                  Detalhes
                </button>

                <button className="flex-1 bg-yellow-500 text-white py-2 rounded-xl">
                  Editar
                </button>
              </div>

            </div>

          ))}

        </div>
      </div>
    </div>
  );
}