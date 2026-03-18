"use client";
import React, { useState, useEffect } from "react";
import {
  Loader2,
  LogOut,
} from "lucide-react";

export default function DiarioBordo() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<{ [key: string]: boolean }>({});
  const [dailyInfo, setDailyInfo] = useState<any>({});
  const [activeTab, setActiveTab] = useState("sono");
  const [selectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [saving, setSaving] = useState(false);
  const [teacherName, setTeacherName] = useState<string | null>(null);

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const userIdCookie = cookies.find((row) =>
      row.startsWith("user_id=")
    );
    const userNameCookie = cookies.find((row) =>
      row.startsWith("user_name=")
    );

    if (userIdCookie) {
      const id = userIdCookie.split("=")[1];

      if (userNameCookie) {
        const name = decodeURIComponent(
          userNameCookie.split("=")[1]
        );
        setTeacherName(name);
      }

      loadClasses(id);
    } else {
      window.location.href = "/login";
    }
  }, []);

  const loadClasses = async (id: string) => {
    const res = await fetch(`/api/classrooms?teacherId=${id}`);
    const data = await res.json();
    setClasses(Array.isArray(data) ? data : []);
  };

  const handleSelectClass = async (classId: string) => {
    setSelectedClass(classId);
    setAttendance({});
    setDailyInfo({});

    const studentsRes = await fetch("/api/students");
    const allStudents = await studentsRes.json();
    const classStudents = allStudents.filter(
      (s: any) => s.classId === classId
    );
    setStudents(classStudents);
  };

  const handleSaveAttendance = async () => {
    if (!selectedClass) return;

    setSaving(true);

    await Promise.all(
      students.map((student) =>
        fetch("/api/save-log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            classId: selectedClass,
            studentId: student.id,
            present: attendance[student.id] ?? true,
            date: selectedDate,
            ...dailyInfo[student.id], // 🔥 agora inclui observação individual
          }),
        })
      )
    );

    setSaving(false);
    alert("Diário salvo com sucesso!");
  };

  const handleLogout = () => {
    document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Diário
            </h1>
            {teacherName && (
              <p className="text-slate-500">
                Professor: {teacherName}
              </p>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-xl"
          >
            <LogOut size={18} /> Sair
          </button>
        </div>

        <select
          value={selectedClass}
          onChange={(e) => handleSelectClass(e.target.value)}
          className="w-full p-3 border rounded-xl"
        >
          <option value="">Selecione a turma</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {selectedClass &&
          students.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
            >
              <h2 className="text-xl font-bold text-slate-800">
                {student.name}
              </h2>

              {/* PRESENÇA */}
              <div className="flex gap-4">
                <button
                  onClick={() =>
                    setAttendance((prev) => ({
                      ...prev,
                      [student.id]: true,
                    }))
                  }
                  className={`flex-1 py-3 rounded-xl font-semibold ${
                    attendance[student.id] !== false
                      ? "bg-green-600 text-white"
                      : "bg-slate-100"
                  }`}
                >
                  Presente
                </button>

                <button
                  onClick={() =>
                    setAttendance((prev) => ({
                      ...prev,
                      [student.id]: false,
                    }))
                  }
                  className={`flex-1 py-3 rounded-xl font-semibold ${
                    attendance[student.id] === false
                      ? "bg-red-600 text-white"
                      : "bg-slate-100"
                  }`}
                >
                  Faltou
                </button>
              </div>

              {/* ABAS */}
              <div className="flex border-b">
                {["comida", "sono", "higiene"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 font-semibold ${
                      activeTab === tab
                        ? "border-b-4 border-blue-600 text-blue-600"
                        : "text-slate-500"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* SONO */}
              {activeTab === "sono" && (
                <div className="flex gap-4">
                  {[
                    { label: "Dormiu Bem", value: "bem" },
                    { label: "Agitado", value: "agitado" },
                    { label: "Não Dormiu", value: "nao" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setDailyInfo((prev: any) => ({
                          ...prev,
                          [student.id]: {
                            ...prev[student.id],
                            sleep_status: option.value,
                          },
                        }))
                      }
                      className={`flex-1 py-4 rounded-xl font-semibold ${
                        dailyInfo[student.id]?.sleep_status === option.value
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}

              {/* COMIDA */}
              {activeTab === "comida" && (
                <div className="flex gap-4">
                  {[
                    { label: "Comeu Tudo", value: "bem" },
                    { label: "Comeu Pouco", value: "parcial" },
                    { label: "Recusou", value: "nao" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setDailyInfo((prev: any) => ({
                          ...prev,
                          [student.id]: {
                            ...prev[student.id],
                            meal_status: option.value,
                          },
                        }))
                      }
                      className={`flex-1 py-4 rounded-xl font-semibold ${
                        dailyInfo[student.id]?.meal_status === option.value
                          ? "bg-green-600 text-white"
                          : "bg-slate-100"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}

              {/* HIGIENE */}
              {activeTab === "higiene" && (
                <div className="flex gap-6">
                  <label>
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        setDailyInfo((prev: any) => ({
                          ...prev,
                          [student.id]: {
                            ...prev[student.id],
                            diaper_pee: e.target.checked,
                          },
                        }))
                      }
                    />{" "}
                    Xixi
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        setDailyInfo((prev: any) => ({
                          ...prev,
                          [student.id]: {
                            ...prev[student.id],
                            diaper_poop: e.target.checked,
                          },
                        }))
                      }
                    />{" "}
                    Cocô
                  </label>
                </div>
              )}

              {/* 🔥 NOVO: OBSERVAÇÃO POR ALUNO */}
              <textarea
                placeholder="Observações sobre o aluno..."
                className="w-full p-3 border rounded-xl mt-4"
                value={dailyInfo[student.id]?.observations || ""}
                onChange={(e) =>
                  setDailyInfo((prev: any) => ({
                    ...prev,
                    [student.id]: {
                      ...prev[student.id],
                      observations: e.target.value,
                    },
                  }))
                }
              />
            </div>
          ))}

        <button
          onClick={handleSaveAttendance}
          disabled={saving}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl text-lg font-bold"
        >
          {saving ? (
            <Loader2 className="animate-spin mx-auto" />
          ) : (
            "Finalizar Diário"
          )}
        </button>
      </div>
    </div>
  );
}