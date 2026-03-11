"use client";
import React, { useState, useEffect } from "react";
import { Users, GraduationCap, ClipboardCheck, TrendingUp, ArrowUpRight, Loader2 } from "lucide-react";

const StatCard = ({ label, value, icon: Icon, color, trend, loading }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`${color} p-3 rounded-2xl text-white shadow-lg shadow-blue-900/10`}>
        <Icon size={24} />
      </div>
      {!loading && trend && (
        <span className="flex items-center gap-1 text-emerald-500 text-xs font-black bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-tighter">
          {trend} <ArrowUpRight size={14} strokeWidth={3} />
        </span>
      )}
      {loading && <Loader2 className="animate-spin text-slate-300" size={20} />}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
      <p className="text-3xl font-black text-slate-900 mt-1 tracking-tighter">{loading ? "-" : value}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats");
        const data = await response.json();
        setStats(data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10 bg-[#F8FAFC] min-h-screen">
      <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Alunos" value={stats?.totalStudents ?? 0} icon={Users} color="bg-blue-600" trend="+12%" loading={loading} />
        <StatCard label="Turmas Ativas" value={stats?.activeClassrooms ?? 0} icon={GraduationCap} color="bg-indigo-600" trend="+2" loading={loading} />
        <StatCard label="Presença Hoje" value={stats?.dailyPresence ?? 0} icon={ClipboardCheck} color="bg-emerald-600" trend="+3%" loading={loading} />
        <StatCard label="Novas Matrículas" value={stats?.newEnrollments ?? 0} icon={TrendingUp} color="bg-amber-600" trend="+5%" loading={loading} />
      </div>
    </div>
  );
}
