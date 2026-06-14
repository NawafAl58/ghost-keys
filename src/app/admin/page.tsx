"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  Key as KeyIcon, 
  BarChart3, 
  Plus, 
  LogOut, 
  ShieldAlert,
  Settings,
  TrendingUp,
  ShoppingCart,
  Database,
  Edit2,
  Trash2,
  Save,
  X,
  PlusCircle,
  User,
  Mail,
  Phone,
  Clock
} from 'lucide-react';
import { useGhostStore, Game } from '@/lib/store';

const ADMIN_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || 'N5858';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'keys' | 'sales'>('overview');
  
  const { games, keys, sales, addKey, deleteKey, updateGame, addGame, deleteGame, isLoaded } = useGhostStore();

  // Form States
  const [isAddingGame, setIsAddingGame] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [newKeyData, setNewKeyData] = useState({ gameId: 0, value: '' });
  const [newGameData, setNewGameData] = useState({
    title: '',
    price: 0,
    platform: 'Steam',
    image: '',
    tag: 'جديد',
    perf: 'ممتاز',
    status: 'In Stock' as const
  });

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

  const handleAddGame = async (e: React.FormEvent) => {
    e.preventDefault();
    await addGame(newGameData);
    setIsAddingGame(false);
    setNewGameData({ title: '', price: 0, platform: 'Steam', image: '', tag: 'جديد', perf: 'ممتاز', status: 'In Stock' });
  };

  const handleUpdateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGame) {
      await updateGame(editingGame);
      setEditingGame(null);
    }
  };

  const handleAddKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeyData.gameId && newKeyData.value) {
      await addKey(Number(newKeyData.gameId), newKeyData.value);
      setNewKeyData({ gameId: 0, value: '' });
      alert("تمت إضافة الكود بنجاح!");
    }
  };

  const handleDeleteGame = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذه اللعبة وجميع الأكواد التابعة لها؟')) {
      await deleteGame(id);
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الكود؟')) {
      await deleteKey(id);
    }
  };

  if (!isLoaded) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
       <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-10 h-10 border-4 border-neonPurple border-t-transparent rounded-full" />
    </div>
  );

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
      {/* Sidebar */}
      <aside className="w-64 border-l border-white/5 glass hidden lg:flex flex-col fixed inset-y-0 right-0">
        <div className="p-8">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 rounded-lg bg-neonPurple flex items-center justify-center font-black text-xl">N58</div>
            <span className="font-bold tracking-tighter text-xl">لوحة <span className="text-neonPurple">التحكم</span></span>
          </div>
          <nav className="space-y-2">
            {[
              { id: 'overview', label: 'الإحصائيات', icon: LayoutDashboard },
              { id: 'inventory', label: 'إدارة الألعاب', icon: Package },
              { id: 'keys', label: 'إدارة الأكواد', icon: KeyIcon },
              { id: 'sales', label: 'سجل الطلبات', icon: BarChart3 },
            ].map((item) => (
              <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === item.id ? 'bg-neonPurple text-white shadow-lg shadow-neonPurple/20' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}><item.icon size={18} />{item.label}</button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-8">
          <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-white/40 hover:text-red-400 hover:border-red-400/30 transition-all text-sm"><LogOut size={16} />تسجيل الخروج</button>
        </div>
      </aside>

      <main className="flex-1 lg:pr-64 p-8 lg:p-12 overflow-y-auto">
        <header className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-black">
            {activeTab === 'overview' && 'نظرة عامة'}
            {activeTab === 'inventory' && 'المخزون والأسعار'}
            {activeTab === 'keys' && 'إدارة مفاتيح الألعاب'}
            {activeTab === 'sales' && 'سجل العمليات والطلبات'}
          </h2>
          {activeTab === 'inventory' && (
            <button 
              onClick={() => setIsAddingGame(true)}
              className="bg-neonPurple px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:brightness-110 transition-all"
            >
              <PlusCircle size={18} />
              إضافة لعبة جديدة
            </button>
          )}
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="إجمالي المبيعات" value={`${sales.reduce((acc, s) => acc + s.price, 0)} SAR`} icon={TrendingUp} color="purple" />
                <StatCard label="الطلبات المكتملة" value={sales.length.toString()} icon={ShoppingCart} color="blue" />
                <StatCard label="الأكواد المتوفرة" value={keys.filter(k => !k.isSold).length.toString()} icon={Database} color="ice" />
              </div>
            </motion.div>
          )}

          {activeTab === 'inventory' && (
            <motion.div key="inventory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="glass rounded-[2rem] overflow-hidden border-white/5">
                <table className="w-full text-right">
                  <thead className="bg-white/5 text-white/40 text-xs font-bold">
                    <tr>
                      <th className="px-8 py-6">اللعبة</th>
                      <th className="px-8 py-6">المنصة</th>
                      <th className="px-8 py-6">السعر (SAR)</th>
                      <th className="px-8 py-6">الأداء</th>
                      <th className="px-8 py-6">الحالة</th>
                      <th className="px-8 py-6">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {games.map(game => (
                      <tr key={game.id} className="hover:bg-white/[0.02]">
                        <td className="px-8 py-6 font-bold">{game.title}</td>
                        <td className="px-8 py-6 text-white/60">{game.platform}</td>
                        <td className="px-8 py-6 font-black text-neonPurple">{game.price}</td>
                        <td className="px-8 py-6 text-xs text-iceBlue">{game.perf}</td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${game.status === 'In Stock' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {game.status === 'In Stock' ? 'متوفر' : 'منتهي'}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setEditingGame(game)} className="p-2 hover:text-neonPurple transition-colors"><Edit2 size={18} /></button>
                            <button onClick={() => handleDeleteGame(game.id)} className="p-2 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'keys' && (
            <motion.div key="keys" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="max-w-2xl">
                <div className="glass p-8 rounded-[2rem] border-white/5">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><KeyIcon className="text-iceBlue" /> إضافة أكواد تفعيل</h3>
                  <form onSubmit={handleAddKey} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-white/40 mb-2">اختر اللعبة</label>
                      <select 
                        value={newKeyData.gameId}
                        onChange={(e) => setNewKeyData({...newKeyData, gameId: Number(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-iceBlue"
                      >
                        <option value={0} className="bg-black">--- اختر لعبة ---</option>
                        {games.map(g => <option key={g.id} value={g.id} className="bg-black">{g.title}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/40 mb-2">كود التفعيل (Key)</label>
                      <input 
                        type="text" 
                        placeholder="XXXX-XXXX-XXXX"
                        value={newKeyData.value}
                        onChange={(e) => setNewKeyData({...newKeyData, value: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-iceBlue font-mono"
                      />
                    </div>
                    <button type="submit" className="w-full bg-iceBlue text-black font-bold py-4 rounded-xl hover:brightness-110 transition-all">حفظ الكود في المخزن</button>
                  </form>
                </div>
              </div>

              <div className="glass rounded-[2rem] overflow-hidden border-white/5">
                <div className="p-8 border-b border-white/5">
                  <h3 className="text-xl font-bold">الأكواد المتوفرة في المخزن (قاعدة بيانات Supabase)</h3>
                </div>
                <table className="w-full text-right">
                  <thead className="bg-white/5 text-white/40 text-xs font-bold">
                    <tr>
                      <th className="px-8 py-6">اللعبة</th>
                      <th className="px-8 py-6">الكود</th>
                      <th className="px-8 py-6">الحالة</th>
                      <th className="px-8 py-6">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {keys.filter(k => !k.isSold).map(key => {
                      const game = games.find(g => g.id === key.gameId);
                      return (
                        <tr key={key.id} className="hover:bg-white/[0.02]">
                          <td className="px-8 py-6 font-bold">{game?.title || 'Unknown'}</td>
                          <td className="px-8 py-6 font-mono text-iceBlue">{key.value}</td>
                          <td className="px-8 py-6">
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-500">متوفر</span>
                          </td>
                          <td className="px-8 py-6">
                            <button onClick={() => handleDeleteKey(key.id)} className="p-2 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'sales' && (
             <motion.div key="sales" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {sales.map(sale => (
                    <div key={sale.id} className="glass p-8 rounded-[2rem] border-white/5 hover:border-neonPurple/30 transition-all group">
                      <div className="flex flex-wrap justify-between gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-neonPurple/10 flex items-center justify-center text-neonPurple font-black">N58</div>
                            <div>
                              <h4 className="text-xl font-black">{sale.gameTitle}</h4>
                              <div className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Order ID: {sale.id}</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                            <div className="space-y-1">
                              <div className="text-[10px] text-white/40 font-bold uppercase flex items-center gap-1"><User size={10} /> المشتري</div>
                              <div className="font-bold text-sm text-iceBlue">{sale.buyer_name || 'ضيف'}</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-[10px] text-white/40 font-bold uppercase flex items-center gap-1"><Mail size={10} /> البريد الإلكتروني</div>
                              <div className="text-sm">{sale.buyer_email || 'N/A'}</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-[10px] text-white/40 font-bold uppercase flex items-center gap-1"><Phone size={10} /> رقم التواصل</div>
                              <div className="text-sm">{sale.buyer_phone || 'N/A'}</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between gap-4">
                          <div className="text-right">
                             <div className="text-[10px] text-white/40 font-bold uppercase mb-1">المبلغ المدفوع</div>
                             <div className="text-2xl font-black text-neonPurple">{sale.price} SAR</div>
                          </div>
                          <div className="text-right">
                             <div className="text-[10px] text-white/40 font-bold uppercase mb-1 flex items-center justify-end gap-1"><Clock size={10}/> وقت الشراء</div>
                             <div className="text-xs text-white/60">{new Date(sale.soldAt).toLocaleString('ar-SA')}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <KeyIcon size={14} className="text-iceBlue" />
                           <span className="text-[10px] text-white/40 font-bold uppercase">الكود المستلم:</span>
                           <span className="font-mono text-sm bg-white/5 px-3 py-1 rounded-lg text-iceBlue">{sale.keyValue}</span>
                        </div>
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-500 uppercase">Completed</span>
                      </div>
                    </div>
                  ))}
                </div>
             </motion.div>
          )}
        </AnimatePresence>

        {/* Modals remain same as before with await in handlers */}
        {isAddingGame && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsAddingGame(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-2xl glass neon-border-purple rounded-[2.5rem] p-10">
              <h3 className="text-2xl font-black mb-8">إضافة لعبة جديدة للمتجر</h3>
              <form onSubmit={handleAddGame} className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-white/40 mb-2">اسم اللعبة</label>
                  <input type="text" required value={newGameData.title} onChange={e => setNewGameData({...newGameData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-neonPurple" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/40 mb-2">السعر (SAR)</label>
                  <input type="number" required value={newGameData.price} onChange={e => setNewGameData({...newGameData, price: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-neonPurple" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/40 mb-2">المنصة</label>
                  <input type="text" required value={newGameData.platform} onChange={e => setNewGameData({...newGameData, platform: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-neonPurple" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-white/40 mb-2">رابط الصورة (Unsplash URL)</label>
                  <input type="text" required value={newGameData.image} onChange={e => setNewGameData({...newGameData, image: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-neonPurple" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/40 mb-2">التاق (مثال: جديد، عرض)</label>
                  <input type="text" value={newGameData.tag} onChange={e => setNewGameData({...newGameData, tag: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-neonPurple" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/40 mb-2">الأداء مقابل الريال</label>
                  <input type="text" value={newGameData.perf} onChange={e => setNewGameData({...newGameData, perf: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-neonPurple" />
                </div>
                <button type="submit" className="col-span-2 bg-neonPurple py-4 rounded-xl font-bold mt-4 shadow-lg shadow-neonPurple/20">حفظ اللعبة</button>
              </form>
            </motion.div>
          </div>
        )}

        {editingGame && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setEditingGame(null)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-2xl glass neon-border-blue rounded-[2.5rem] p-10">
              <h3 className="text-2xl font-black mb-8">تعديل: {editingGame.title}</h3>
              <form onSubmit={handleUpdateGame} className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-white/40 mb-2">السعر الجديد (SAR)</label>
                  <input type="number" value={editingGame.price} onChange={e => setEditingGame({...editingGame, price: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-iceBlue" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/40 mb-2">الحالة</label>
                  <select value={editingGame.status} onChange={e => setEditingGame({...editingGame, status: e.target.value as any})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-iceBlue">
                    <option value="In Stock" className="bg-black">متوفر (In Stock)</option>
                    <option value="Out of Stock" className="bg-black">منتهي (Out of Stock)</option>
                  </select>
                </div>
                <div className="col-span-2 flex gap-4 mt-6">
                  <button type="submit" className="flex-1 bg-iceBlue text-black py-4 rounded-xl font-bold">تحديث البيانات</button>
                  <button type="button" onClick={() => setEditingGame(null)} className="flex-1 bg-white/5 py-4 rounded-xl font-bold">إلغاء</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        <footer className="mt-20 text-center text-[10px] text-white/20 uppercase tracking-widest pb-10">Ghost Keys Admin System • Supabase Cloud Persistence • Made by N58</footer>
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