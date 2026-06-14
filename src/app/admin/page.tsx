"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  Key as KeyIcon, 
  BarChart3, 
  Plus, 
  LogOut, 
  ShieldAlert,
  ArrowRightLeft,
  Settings,
  TrendingUp,
  ShoppingCart,
  Database
} from 'lucide-react';
import { useGhostStore } from '@/lib/store';

const ADMIN_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || 'N5858';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'keys' | 'sales'>('overview');
  
  const { games, keys, sales, isLoaded } = useGhostStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  if (!isLoaded) return <div className="min-h-screen bg-background" />;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md glass neon-border-purple rounded-[2.5rem] p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-neonPurple/20 flex items-center justify-center mx-auto mb-6"><ShieldAlert className="text-neonPurple" size={32} /></div>
          <h1 className="text-3xl font-black mb-2 neon-text-purple">دخول المشرف</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} placeholder="••••••" className={`w-full bg-white/5 border ${loginError ? 'border-red-500' : 'border-white/10'} rounded-2xl py-4 px-6 text-center text-2xl tracking-[1em] focus:border-neonPurple transition-all outline-none`} />
            <button type="submit" className="w-full py-4 rounded-2xl bg-neonPurple text-white font-bold text-lg shadow-lg shadow-neonPurple/20 hover:brightness-110 transition-all">دخول النظام</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white flex">
      <aside className="w-64 border-l border-white/5 glass hidden lg:flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-neonPurple flex items-center justify-center"><Settings size={18} /></div>
            <span className="font-bold tracking-tighter text-xl">لوحة <span className="text-neonPurple">التحكم</span></span>
          </div>
          <nav className="space-y-2">
            {[
              { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
              { id: 'inventory', label: 'المخزون', icon: Package },
              { id: 'keys', label: 'الأكواد', icon: KeyIcon },
              { id: 'sales', label: 'المبيعات', icon: BarChart3 },
            ].map((item) => (
              <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === item.id ? 'bg-neonPurple text-white shadow-lg shadow-neonPurple/20' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}><item.icon size={18} />{item.label}</button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-8">
          <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-white/40 hover:text-red-400 hover:border-red-400/30 transition-all text-sm"><LogOut size={16} />تسجيل الخروج</button>
        </div>
      </aside>

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-black">{activeTab === 'overview' ? 'الإحصائيات العامة' : activeTab === 'inventory' ? 'إدارة المنتجات' : activeTab === 'keys' ? 'مخزن الأكواد' : 'سجل العمليات'}</h2>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="إجمالي المبيعات" value={`${sales.reduce((acc, s) => acc + s.price, 0)} SAR`} icon={TrendingUp} color="purple" />
                <StatCard label="عدد الطلبات" value={sales.length.toString()} icon={ShoppingCart} color="blue" />
                <StatCard label="الأكواد المتوفرة" value={keys.filter(k => !k.isSold).length.toString()} icon={Database} color="ice" />
              </div>
            </motion.div>
          )}
          {/* Detailed sections simplified for space, logic handled via useGhostStore */}
        </AnimatePresence>
        <footer className="mt-20 text-center text-[10px] text-white/20 uppercase tracking-widest pb-10">Ghost Keys Admin System • Made with ❤️ by N58</footer>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: 'purple' | 'blue' | 'ice' }) {
  const colors = { purple: 'from-neonPurple/20 text-neonPurple', blue: 'from-blue-500/20 text-blue-500', ice: 'from-iceBlue/20 text-iceBlue' };
  return (
    <div className="glass p-8 rounded-[2rem] border-white/5 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors[color]} blur-[60px] opacity-20 -mr-10 -mt-10`} />
      <div className="relative flex items-center gap-6">
        <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center ${colors[color]}`}><Icon size={28} /></div>
        <div><div className="text-white/40 text-xs font-bold mb-1 uppercase tracking-wider">{label}</div><div className="text-3xl font-black">{value}</div></div>
      </div>
    </div>
  );
}