"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Gamepad2, Zap, ShieldCheck, Cpu, CheckCircle2, Copy, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGhostStore } from '@/lib/store';

export default function Home() {
  const { games, sellGame, isLoaded } = useGhostStore();
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [checkoutStep, setCheckoutStep] = useState(0); 
  const [cartCount, setCartCount] = useState(0);
  const [deliveredKey, setDeliveredKey] = useState<string | null>(null);

  const handleBuy = (game: any) => {
    setSelectedGame(game);
    setCheckoutStep(1);
  };

  const simulateCheckout = () => {
    setCheckoutStep(2);
    setTimeout(() => {
      const key = sellGame(selectedGame.id);
      if (key) {
        setDeliveredKey(key);
        setCheckoutStep(3);
        setCartCount(prev => prev + 1);
      } else {
        alert("عذراً، نفذت الأكواد لهذه اللعبة!");
        setCheckoutStep(0);
      }
    }, 2000);
  };

  if (!isLoaded) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen bg-background text-white selection:bg-neonPurple/30">
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neonPurple to-iceBlue flex items-center justify-center shadow-lg shadow-neonPurple/20">
              <Zap size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tighter neon-text-purple">GHOST <span className="text-iceBlue neon-text-blue">KEYS</span></span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <ShoppingCart size={24} className="text-white/80 hover:text-iceBlue transition-colors cursor-pointer" />
              {cartCount > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 bg-neonPurple text-[10px] flex items-center justify-center rounded-full border-2 border-background font-bold animate-pulse">{cartCount}</span>}
            </div>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 container mx-auto px-6">
        <section className="mb-20 text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-neonPurple/10 blur-[120px] rounded-full -z-10" />
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-black mb-6 tracking-tight">عالم الألعاب <br/> <span className="bg-gradient-to-r from-neonPurple to-iceBlue bg-clip-text text-transparent">بلمسة شبح</span></motion.h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto mb-10">أكواد ألعاب أصلية 100%، تسليم فوري، وأسعار تجلد السوق. قوست كيز هو خيارك الأول يا وحش.</p>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game) => (
            <motion.div key={game.id} whileHover={{ y: -8 }} className="group relative glass rounded-3xl overflow-hidden neon-border-purple transition-all duration-300">
              <div className="aspect-[3/4] relative overflow-hidden">
                <img src={game.image} alt={game.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold border border-white/10">{game.tag}</div>
              </div>
              <div className="p-6">
                <div className="text-[10px] font-bold text-iceBlue mb-1 uppercase tracking-widest">{game.platform}</div>
                <h3 className="font-bold mb-4 line-clamp-1">{game.title}</h3>
                <div className="flex items-center justify-between mb-4">
                   <div className="flex flex-col">
                    <span className="text-[10px] text-white/40">السعر</span>
                    <span className="text-xl font-black text-neonPurple">{game.price} <span className="text-xs">SAR</span></span>
                   </div>
                   <div className="text-left">
                    <span className="text-[10px] text-white/40 block">التقييم</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-iceBlue/10 text-iceBlue border border-iceBlue/20">{game.perf}</span>
                   </div>
                </div>
                <button onClick={() => handleBuy(game)} className="w-full py-3 rounded-xl bg-white/5 border border-white/10 group-hover:bg-neonPurple group-hover:border-neonPurple group-hover:text-white transition-all font-bold text-sm flex items-center justify-center gap-2">اشترِ الآن <Zap size={16} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="border-t border-white/5 py-10 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-xl font-bold tracking-tighter">GHOST <span className="text-iceBlue">KEYS</span></div>
          <p className="text-white/30 text-xs">جميع الحقوق محفوظة {new Date().getFullYear()} © قوست كيز</p>
          <div className="text-[10px] text-white/20">Made with ❤️ by N58</div>
        </div>
      </footer>

      <AnimatePresence>
        {checkoutStep > 0 && selectedGame && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCheckoutStep(0)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg glass neon-border-purple rounded-[2rem] p-8 overflow-hidden">
              <button onClick={() => setCheckoutStep(0)} className="absolute top-6 left-6 text-white/40 hover:text-white transition-colors"><X size={24} /></button>
              
              {checkoutStep === 1 && (
                <div className="space-y-6">
                  <div className="flex gap-6">
                    <img src={selectedGame.image} className="w-24 h-32 rounded-xl object-cover" />
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{selectedGame.title}</h3>
                      <p className="text-sm text-white/50 mb-4">كود رقمي يعمل على منصة {selectedGame.platform}</p>
                      <span className="text-2xl font-black text-iceBlue">{selectedGame.price} SAR</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-lg font-bold py-3 border-t border-white/5">
                    <span>الإجمالي</span>
                    <span className="text-neonPurple">{selectedGame.price} SAR</span>
                  </div>
                  <button onClick={simulateCheckout} className="w-full py-4 rounded-2xl bg-neonPurple text-white font-bold text-lg shadow-lg shadow-neonPurple/20 hover:brightness-110 transition-all flex items-center justify-center gap-3">تأكيد الدفع <Zap size={20} /></button>
                </div>
              )}

              {checkoutStep === 2 && (
                <div className="py-10 text-center space-y-6">
                  <div className="w-20 h-20 border-4 border-iceBlue border-t-transparent rounded-full animate-spin mx-auto" />
                  <h3 className="text-2xl font-bold">جاري معالجة طلبك...</h3>
                </div>
              )}

              {checkoutStep === 3 && deliveredKey && (
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-500/50"><CheckCircle2 size={40} /></div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">مبروك يا وحش!</h3>
                    <p className="text-white/40">تمت العملية بنجاح. هذا كود لعبتك:</p>
                  </div>
                  <div className="glass p-6 rounded-2xl border-iceBlue/30 flex items-center justify-between group cursor-pointer hover:bg-iceBlue/5 transition-all">
                    <code className="text-lg font-mono text-iceBlue font-bold tracking-wider">{deliveredKey}</code>
                    <Copy size={20} className="text-white/20 group-hover:text-iceBlue transition-colors" />
                  </div>
                  <p className="text-[10px] text-white/30">انسخ الكود وفعله واستمتع!</p>
                  <button onClick={() => setCheckoutStep(0)} className="w-full py-3 rounded-xl bg-white/5 border border-white/10 font-bold">إغلاق</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}