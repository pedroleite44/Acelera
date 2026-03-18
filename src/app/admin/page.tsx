"use client";
import React, { useState, useEffect } from "react";
import {
  Users,
  GraduationCap,
  ClipboardCheck,
  TrendingUp,
  LayoutDashboard,
  Plus,
  Loader2,
  Heart,
} from "lucide-react";
import Link from "next/link";

const QuickStat = ({ label, value, icon: Icon, color, loading }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
    <div className={`${color} p-3 rounded-2xl text-white`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {label}
      </p>
      <p className="text-xl font-black text-slate-900">
        {loading ? "..." : value}
      </p>
    </div>
  </div>
);

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [parents, setParents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [showAddParent, setShowAddParent] = useState(false);
  const [showAddClass, setShowAddClass] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);

  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");
  const [teacherRg, setTeacherRg] = useState("");
  const [teacherCpf, setTeacherCpf] = useState("");

  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentPassword, setParentPassword] = useState("");
  const [parentRg, setParentRg] = useState("");
  const [parentCpf, setParentCpf] = useState("");

  const [className, setClassName] = useState("");
  const [classTeacher, setClassTeacher] = useState("");

  const [studentName, setStudentName] = useState("");
  const [studentRg, setStudentRg] = useState("");
  const [studentCpf, setStudentCpf] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [studentParent, setStudentParent] = useState("");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const roleCookie = cookies.find((row) => row.startsWith("user_role="));

    if (!roleCookie || roleCookie.split("=")[1] !== "admin") {
      window.location.href = "/login";
      return;
    }

    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, teachersRes, parentsRes, classesRes, studentsRes] =
        await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/teachers?role=teacher"),
          fetch("/api/teachers?role=parent"),
          fetch("/api/classrooms"),
          fetch("/api/students"),
        ]);

      setStats(await statsRes.json());

      const teachersData = await teachersRes.json();
      setTeachers(Array.isArray(teachersData) ? teachersData : []);

      const parentsData = await parentsRes.json();
      setParents(Array.isArray(parentsData) ? parentsData : []);

      const classesData = await classesRes.json();
      setClasses(Array.isArray(classesData) ? classesData : []);

      const studentsData = await studentsRes.json();
      setStudents(Array.isArray(studentsData) ? studentsData : []);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setTeachers([]);
      setParents([]);
      setClasses([]);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = async (e: any) => {
    e.preventDefault();
    if (!teacherName || !teacherEmail || !teacherPassword) {
      alert("Preencha nome, email e senha do professor.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teacherName,
          email: teacherEmail,
          password: teacherPassword,
          rg: teacherRg,
          cpf: teacherCpf,
          role: "teacher",
        }),
      });

      if (res.ok) {
        alert("✅ Professor adicionado com sucesso!");
        setShowAddTeacher(false);
        setTeacherName("");
        setTeacherEmail("");
        setTeacherPassword("");
        setTeacherRg("");
        setTeacherCpf("");
        loadData();
      } else {
        const errorData = await res.json();
        alert(
          "Erro ao adicionar professor: " +
            (errorData.error || "Erro desconhecido")
        );
      }
    } catch (err: any) {
      alert("Erro de conexão: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddParent = async (e: any) => {
    e.preventDefault();
    if (!parentName || !parentEmail || !parentPassword) {
      alert("Preencha nome, email e senha do responsável.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: parentName,
          email: parentEmail,
          password: parentPassword,
          rg: parentRg,
          cpf: parentCpf,
          role: "parent",
        }),
      });

      if (res.ok) {
        alert("✅ Responsável adicionado com sucesso!");
        setShowAddParent(false);
        setParentName("");
        setParentEmail("");
        setParentPassword("");
        setParentRg("");
        setParentCpf("");
        loadData();
      } else {
        const errorData = await res.json();
        alert(
          "Erro ao adicionar responsável: " +
            (errorData.error || "Erro desconhecido")
        );
      }
    } catch (err: any) {
      alert("Erro de conexão: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddClass = async (e: any) => {
    e.preventDefault();
    if (!className) {
      alert("Digite o nome da turma.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/classrooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: className, teacherId: classTeacher || null }),
      });

      if (res.ok) {
        alert("✅ Turma criada com sucesso!");
        setShowAddClass(false);
        setClassName("");
        setClassTeacher("");
        loadData();
      } else {
        const errorData = await res.json();
        alert("Erro ao criar turma: " + (errorData.error || "Erro desconhecido"));
      }
    } catch (err: any) {
      alert("Erro de conexão: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddStudent = async (e: any) => {
    e.preventDefault();
    if (!studentName || !studentClass) {
      alert("Preencha nome e turma do aluno.");
      return;
    }
    if (!studentParent) {
      alert("Selecione um responsável para o aluno.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: studentName,
          classId: studentClass,
          rg: studentRg,
          cpf: studentCpf,
          parentId: studentParent,
        }),
      });

      if (res.ok) {
        alert("✅ Aluno adicionado com sucesso!");
        setShowAddStudent(false);
        setStudentName("");
        setStudentRg("");
        setStudentCpf("");
        setStudentClass("");
        setStudentParent("");
        loadData();
      } else {
        const errorData = await res.json();
        alert("Erro ao adicionar aluno: " + (errorData.error || "Erro desconhecido"));
      }
    } catch (err: any) {
      alert("Erro de conexão: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10 bg-[#F8FAFC] min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
          Gestão Escolar
        </h1>
        <Link
          href="/admin/dashboard"
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:scale-105 transition-all shadow-xl"
        >
          <LayoutDashboard size={20} /> Ver Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickStat
          label="Alunos"
          value={stats?.totalStudents ?? 0}
          icon={Users}
          color="bg-blue-600"
          loading={loading}
        />
        <QuickStat
          label="Turmas"
          value={stats?.activeClassrooms ?? 0}
          icon={GraduationCap}
          color="bg-indigo-600"
          loading={loading}
        />
        <QuickStat
          label="Presença"
          value={stats?.dailyPresence ?? 0}
          icon={ClipboardCheck}
          color="bg-emerald-600"
          loading={loading}
        />
        <QuickStat
          label="Novos"
          value={stats?.newEnrollments ?? 0}
          icon={TrendingUp}
          color="bg-amber-600"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black flex items-center gap-2">
              <Plus size={20} className="text-blue-600" /> Novo Professor
            </h2>
            {!showAddTeacher && (
              <button
                onClick={() => setShowAddTeacher(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
              >
                <Plus size={20} />
              </button>
            )}
          </div>

          {showAddTeacher ? (
            <form onSubmit={handleAddTeacher} className="space-y-4">
              <input
                type="text"
                placeholder="Nome Completo"
                className="w-full p-4 bg-slate-50 rounded-xl border-none font-bold"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email de Acesso"
                className="w-full p-4 bg-slate-50 rounded-xl border-none font-bold"
                value={teacherEmail}
                onChange={(e) => setTeacherEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Senha"
                className="w-full p-4 bg-slate-50 rounded-xl border-none font-bold"
                value={teacherPassword}
                onChange={(e) => setTeacherPassword(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="RG (Opcional)"
                className="w-full p-4 bg-slate-50 rounded-xl border-none font-bold"
                value={teacherRg}
                onChange={(e) => setTeacherRg(e.target.value)}
              />
              <input
                type="text"
                placeholder="CPF (Opcional)"
                className="w-full p-4 bg-slate-50 rounded-xl border-none font-bold"
                value={teacherCpf}
                onChange={(e) => setTeacherCpf(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                  Adicionar
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTeacher(false)}
                  className="flex-1 bg-slate-200 text-slate-600 py-3 rounded-xl font-bold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <p className="text-slate-500 text-sm">
              Clique em + para adicionar professor
            </p>
          )}
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black flex items-center gap-2">
              <Heart size={20} className="text-rose-600" /> Novo Responsável
            </h2>
            {!showAddParent && (
              <button
                onClick={() => setShowAddParent(true)}
                className="bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-lg"
              >
                <Plus size={20} />
              </button>
            )}
          </div>

          {showAddParent ? (
            <form onSubmit={handleAddParent} className="space-y-4">
              <input
                type="text"
                placeholder="Nome do Pai/Mãe"
                className="w-full p-4 bg-slate-50 rounded-xl border-none font-bold"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email de Acesso"
                className="w-full p-4 bg-slate-50 rounded-xl border-none font-bold"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Senha"
                className="w-full p-4 bg-slate-50 rounded-xl border-none font-bold"
                value={parentPassword}
                onChange={(e) => setParentPassword(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="RG (Opcional)"
                className="w-full p-4 bg-slate-50 rounded-xl border-none font-bold"
                value={parentRg}
                onChange={(e) => setParentRg(e.target.value)}
              />
              <input
                type="text"
                placeholder="CPF (Opcional)"
                className="w-full p-4 bg-slate-50 rounded-xl border-none font-bold"
                value={parentCpf}
                onChange={(e) => setParentCpf(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                  Adicionar
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddParent(false)}
                  className="flex-1 bg-slate-200 text-slate-600 py-3 rounded-xl font-bold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <p className="text-slate-500 text-sm">
              Clique em + para adicionar responsável
            </p>
          )}
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black flex items-center gap-2">
              <Plus size={20} className="text-indigo-600" /> Nova Turma
            </h2>
            {!showAddClass && (
              <button
                onClick={() => setShowAddClass(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg"
              >
                <Plus size={20} />
              </button>
            )}
          </div>

          {showAddClass ? (
            <form onSubmit={handleAddClass} className="space-y-4">
              <input
                type="text"
                placeholder="Nome da Turma (Ex: Berçário A)"
                className="w-full p-4 bg-slate-50 rounded-xl border-none font-bold"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                required
              />
              <select
                className="w-full p-4 bg-slate-50 rounded-xl border-none font-bold text-slate-500"
                value={classTeacher}
                onChange={(e) => setClassTeacher(e.target.value)}
              >
                <option value="">Selecione o Professor Responsável</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                  Criar
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddClass(false)}
                  className="flex-1 bg-slate-200 text-slate-600 py-3 rounded-xl font-bold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <p className="text-slate-500 text-sm">Clique em + para criar turma</p>
          )}
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black flex items-center gap-2">
              <Plus size={20} className="text-emerald-600" /> Matricular Aluno
            </h2>
            {!showAddStudent && (
              <button
                onClick={() => setShowAddStudent(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg"
              >
                <Plus size={20} />
              </button>
            )}
          </div>

          {showAddStudent ? (
            <form onSubmit={handleAddStudent} className="space-y-4">
              <input
                type="text"
                placeholder="Nome Completo do Aluno"
                className="w-full p-4 bg-slate-50 rounded-xl border-none font-bold"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="RG Aluno"
                  className="w-full p-4 bg-slate-50 rounded-xl border-none font-bold"
                  value={studentRg}
                  onChange={(e) => setStudentRg(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="CPF Aluno"
                  className="w-full p-4 bg-slate-50 rounded-xl border-none font-bold"
                  value={studentCpf}
                  onChange={(e) => setStudentCpf(e.target.value)}
                />
              </div>
              <select
                className="w-full p-4 bg-slate-50 rounded-xl border-none font-bold text-slate-500"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                required
              >
                <option value="">Selecione a Turma</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <select
                className="w-full p-4 bg-slate-50 rounded-xl border-none font-bold text-slate-500"
                value={studentParent}
                onChange={(e) => setStudentParent(e.target.value)}
                required
              >
                <option value="">Selecione o Responsável (Pai/Mãe)</option>
                {parents.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                  Finalizar Matrícula
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddStudent(false)}
                  className="flex-1 bg-slate-200 text-slate-600 py-3 rounded-xl font-bold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <p className="text-slate-500 text-sm">Clique em + para matricular aluno</p>
          )}
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-black mb-8 text-slate-900 tracking-tighter">
          Visão das Turmas e Famílias
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map((c) => {
            const classStudents = students.filter((s) => s.classId === c.id);

            return (
              <div
                key={c.id}
                className="p-6 bg-slate-50 rounded-3xl border border-slate-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xl font-black text-slate-900">
                      {c.name} ({classStudents.length})
                    </p>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                      Professor: {teachers.find((t) => t.id === c.teacherId)?.name || "Não atribuído"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {classStudents.map((s) => (
                    <div
                      key={s.id}
                      className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-black text-slate-800 text-sm">{s.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter flex items-center gap-1">
                          <Heart size={10} className="text-rose-500" />
                          Resp: {parents.find((p) => p.id === s.parentId)?.name || "Não vinculado"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-300 font-bold uppercase">
                          RG: {s.rg || "-"}
                        </p>
                        <p className="text-[10px] text-slate-300 font-bold uppercase">
                          CPF: {s.cpf || "-"}
                        </p>
                      </div>
                    </div>
                  ))}

                  {classStudents.length === 0 && (
                    <p className="text-sm text-slate-400 font-medium">
                      Nenhum aluno nesta turma ainda.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}