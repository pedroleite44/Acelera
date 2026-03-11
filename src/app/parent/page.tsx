"use client";
import React, { useState, useEffect } from "react";
import {
  User,
  Calendar,
  LogOut,
  Loader2,
  Heart,
} from "lucide-react";

export default function ParentPortal() {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [parentName, setParentName] = useState<string | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const userIdCookie = cookies.find((row) =>
      row.startsWith("user_id=")
    );
    const idFromCookie = userIdCookie
      ? userIdCookie.split("=")[1]
      : null;

    const idFromStorage = localStorage.getItem("user_id");
    const finalId = idFromCookie || idFromStorage;

    if (finalId) {
      setParentId(finalId);
      loadChildren(finalId);

      const nameCookie = cookies.find((row) =>
        row.startsWith("user_name=")
      );
      if (nameCookie)
        setParentName(
          decodeURIComponent(nameCookie.split("=")[1])
        );
    } else {
      window.location.href = "/login";
    }
  }, []);

  const loadChildren = async (id: string) => {
    try {
      const res = await fetch(
        `/api/parent/children?parentId=${id}`
      );
      const data = await res.json();

      setChildren(Array.isArray(data) ? data : []);

      if (Array.isArray(data) && data.length > 0) {
        setSelectedChild(data[0].id);
      }
    } catch (err) {
      console.error("Erro ao carregar filhos:", err);
      setChildren([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    document.cookie =
      "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "user_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "user_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
  };

  const selectedChildData = children.find(
    (c) => c.id === selectedChild
  );

  const diaryData = selectedChildData?.diary || [];

  const presentDays = diaryData.filter(
    (a: any) => a.present
  ).length;

  const absentDays = diaryData.filter(
    (a: any) => !a.present
  ).length;

  const frequencyPercentage =
    diaryData.length > 0
      ? Math.round((presentDays / diaryData.length) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              Portal do Responsável
            </h1>
            {parentName && (
              <p className="text-sm text-slate-500 font-bold mt-2 flex items-center gap-2">
                <Heart size={16} className="text-red-500" />
                Bem-vindo, {parentName}!
              </p>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2"
          >
            <LogOut size={20} /> Sair
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <Loader2
              className="animate-spin mx-auto text-blue-600 mb-4"
              size={48}
            />
            <p className="text-slate-500 font-bold">
              Carregando informações...
            </p>
          </div>
        ) : children.length === 0 ? (
          <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-lg text-center">
            <User
              size={48}
              className="mx-auto text-slate-300 mb-4"
            />
            <p className="text-slate-500 text-lg font-bold">
              Nenhum filho cadastrado
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Lista de Filhos */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg sticky top-8">
                <h2 className="text-lg font-black mb-6 uppercase tracking-tighter">
                  Meus Filhos
                </h2>
                <div className="space-y-3">
                  {children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() =>
                        setSelectedChild(child.id)
                      }
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        selectedChild === child.id
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                          : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                      }`}
                    >
                      <p className="font-black">
                        {child.name}
                      </p>
                      <p className="text-xs font-bold opacity-75 mt-1">
                        {child.className}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Detalhes do Filho */}
            <div className="lg:col-span-2">
              {selectedChildData && (
                <div className="space-y-6">

                  {/* Frequência */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Frequência
                      </p>
                      <p className="text-3xl font-black text-purple-600 mt-2">
                        {frequencyPercentage}%
                      </p>
                    </div>

                    <div className="bg-emerald-50 p-6 rounded-2xl shadow-md">
                      <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                        Presentes
                      </p>
                      <p className="text-3xl font-black text-emerald-600 mt-2">
                        {presentDays}
                      </p>
                    </div>

                    <div className="bg-red-50 p-6 rounded-2xl shadow-md">
                      <p className="text-xs font-bold text-red-600 uppercase tracking-widest">
                        Ausentes
                      </p>
                      <p className="text-3xl font-black text-red-600 mt-2">
                        {absentDays}
                      </p>
                    </div>
                  </div>

                  {/* Histórico */}
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-lg">
                    <h3 className="text-lg font-black mb-6 uppercase tracking-tighter flex items-center gap-2">
                      <Calendar size={24} />
                      Diário (Últimos 30 dias)
                    </h3>

                    {diaryData.length === 0 ? (
                      <p className="text-slate-500 text-center py-8">
                        Nenhum registro ainda
                      </p>
                    ) : (
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {diaryData.map(
                          (record: any) => (
                            <div
                              key={record.id}
                              className="p-5 rounded-2xl border bg-white shadow-sm space-y-3"
                            >
                              <p className="font-bold text-slate-800">
                                {new Date(
                                  record.date
                                ).toLocaleDateString(
                                  "pt-BR",
                                  {
                                    weekday:
                                      "long",
                                    year:
                                      "numeric",
                                    month:
                                      "long",
                                    day: "numeric",
                                  }
                                )}
                              </p>

                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <p>
                                  📌 Presença:{" "}
                                  {record.present
                                    ? "Presente"
                                    : "Ausente"}
                                </p>
                                <p>
                                  😴 Sono:{" "}
                                  {record.sleep_status ||
                                    "Não informado"}
                                </p>
                                <p>
                                  🍎 Alimentação:{" "}
                                  {record.meal_status ||
                                    "Não informado"}
                                </p>
                                <p>
                                  🙂 Comportamento:{" "}
                                  {record.behavior ||
                                    "Não informado"}
                                </p>
                                <p>
                                  🚽 Evacuação:{" "}
                                  {record.evacuation ||
                                    "Não informado"}
                                </p>
                                <p>
                                  🍼 Fralda:
                                  {record.diaper_pee &&
                                    " Xixi"}
                                  {record.diaper_poop &&
                                    " Cocô"}
                                  {!record.diaper_pee &&
                                    !record.diaper_poop &&
                                    " Não houve"}
                                </p>
                                <p>
                                  💧 Água:{" "}
                                  {record.water_amount
                                    ? `${record.water_amount} copos`
                                    : "Não informado"}
                                </p>
                                <p>
                                  🎨 Atividade:{" "}
                                  {record.activity_name ||
                                    "Não informado"}
                                </p>
                              </div>

                              {record.observations && (
                                <p className="italic text-sm text-slate-500 border-t pt-2">
                                  📝{" "}
                                  {record.observations}
                                </p>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}