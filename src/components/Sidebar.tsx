"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, 
  LogOut, GraduationCap, ChevronRight, History, Home
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const cookies = document.cookie.split('; ');
    const roleCookie = cookies.find(row => row.startsWith('user_role='));
    setRole(roleCookie ? roleCookie.split('=')[1] : null);
  }, []);

  const menuItems = [
    { name: "Início", href: "/admin", icon: Home, roles: ['admin'] },
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, roles: ['admin'] },
    { name: "Alunos", href: "/admin/alunos", icon: Users, roles: ['admin'] },
    { name: "Histórico", href: "/admin/historico", icon: History, roles: ['admin'] },
    { name: "Turmas", href: "/admin/turmas", icon: GraduationCap, roles: ['admin'] },
  ].filter(item => !role || item.roles.includes(role));

  if (pathname === '/login') return null;

  return (
    <div className="w-72 bg-[#0F172A] flex flex-col h-screen sticky top-0 shrink-0">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">
            A
          </div>
          <span className="text-xl font-black text-white tracking-tight uppercase">
            Acelera
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
          Menu Principal
        </p>

        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  size={20}
                  className={isActive ? "text-white" : "text-slate-400 group-hover:text-white"}
                />
                <span className="font-bold text-sm tracking-tight">
                  {item.name}
                </span>
              </div>

              {isActive && <ChevronRight size={16} />}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-800/50">
        <button 
          onClick={() => {
            document.cookie = "user_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = "/login";
          }} 
          className="flex items-center gap-3 px-4 py-3.5 w-full text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all font-bold text-sm"
        >
          <LogOut size={20} /> 
          Sair do Sistema
        </button>
      </div>
    </div>
  );
}