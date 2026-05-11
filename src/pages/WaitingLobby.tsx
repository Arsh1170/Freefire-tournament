import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, getCountFromServer } from 'firebase/firestore';
import { useSearchParams } from 'react-router-dom';
import { 
  Users, Timer, Map as MapIcon, Award, 
  MessageCircle, Bell, Zap, Radio, 
  ShieldAlert, Target, Sparkles, ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

export function WaitingLobby() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get('tid') || 'premium-clash-squad';
  
  const [playerCount, setPlayerCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  const [tickerIndex, setTickerIndex] = useState(0);

  const announcements = [
    "PROTOCOL: ROOM ID WILL BE BROADCASTED VIA WHATSAPP 15 MINS PRIOR TO DEPLOYMENT.",
    "ATTENTION: ALL EMULATORS DETECTED WILL BE INSTANTLY DISQUALIFIED.",
    "FAIR PLAY: RE-SHADE AND CONFIG TOOLS ARE STRICTLY FORBIDDEN.",
    "VICTORY: MVP PLAYER RECEIVES BATTLE PASS UPGRADE AUTOMATICALLY.",
    "STATUS: SYSTEM SCANNING FOR ANOMALIES. ALL REGISTRATIONS VERIFIED."
  ];

  // Live Player Count
  useEffect(() => {
    const q = query(collection(db, 'registrations'), where('tournamentId', '==', tournamentId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPlayerCount(snapshot.size);
    });
    return () => unsubscribe();
  }, [tournamentId]);

  // Daily Countdown to 10:00 AM
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(10, 0, 0, 0);

      if (now > target) {
        target.setDate(target.getDate() + 1);
      }

      const diff = target.getTime() - now.getTime();
      
      return {
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / 1000 / 60) % 60),
        s: Math.floor((diff / 1000) % 60)
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Ticker Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-6 overflow-hidden relative">
      {/* Cinematic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80')] bg-cover opacity-10 mix-blend-color-dodge" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-luxury-red shadow-[0_0_15px_#ff4d4d]" />
      </div>

      {/* Announcement Ticker */}
      <div className="fixed top-20 left-0 w-full bg-luxury-red/10 border-y border-luxury-red/20 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto py-2 px-6 flex items-center gap-4">
          <Radio size={14} className="text-luxury-red animate-pulse shrink-0" />
          <AnimatePresence mode="wait">
            <motion.p
              key={tickerIndex}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-white italic truncate"
            >
              [ ALERT ] {announcements[tickerIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 pt-10">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass bg-white/5 border-luxury-gold/20 p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Users size={40} />
            </div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Players Joined</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black italic numbering text-luxury-gold">{playerCount}</span>
              <span className="text-lg font-black text-white/20">/ 48</span>
            </div>
            <div className="mt-4 w-full h-1 bg-white/5 overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${(playerCount / 48) * 100}%` }}
                 className="h-full bg-luxury-gold" 
               />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass bg-white/5 border-luxury-red/20 p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-2 opacity-10 text-luxury-red">
               <Zap size={40} />
            </div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Slots Remaining</p>
            <span className="text-4xl font-black italic text-white">{48 - playerCount}</span>
            <p className="text-[10px] font-bold text-luxury-red mt-2 animate-pulse">URGENT: SLOTS FILLING FAST</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2 glass bg-luxury-red/5 border-luxury-red/30 p-6 flex items-center justify-between"
          >
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1 flex items-center gap-2">
                <Timer size={14} className="text-luxury-red" /> Next Deployment
              </p>
              <div className="flex gap-4">
                {[
                  { label: 'H', val: timeLeft.h },
                  { label: 'M', val: timeLeft.m },
                  { label: 'S', val: timeLeft.s }
                ].map((t, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-4xl font-black italic text-white tabular-nums leading-none">
                      {String(t.val).padStart(2, '0')}
                      {idx < 2 && <span className="text-luxury-red mx-1">:</span>}
                    </span>
                    <span className="text-[8px] font-black text-white/20">{t.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-white uppercase tracking-widest">Scheduled Takeoff</p>
              <p className="text-2xl font-black italic text-luxury-red tracking-tighter">10:00 AM IST</p>
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Mission Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-luxury-red to-luxury-gold rounded-none blur opacity-25 group-hover:opacity-40 transition duration-1000" />
              <div className="relative glass p-10 border-white/5 bg-black/60 leading-relaxed overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-red/10 -rotate-45 translate-x-10 -translate-y-10" />
                
                <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-4">
                  <Target className="text-luxury-red" /> OPERATION: <span className="text-luxury-gold">CLASH SQUAD</span>
                </h2>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                  <DetailItem icon={MapIcon} label="Map" value="Bermuda Remastered" />
                  <DetailItem icon={Award} label="Mode" value="Competitive 4v4" />
                  <DetailItem icon={Sparkles} label="Prize Pool" value="ā‚¹450 MVP Pass" />
                  <DetailItem icon={ShieldAlert} label="Anti-Cheat" value="Active Scan" />
                </div>

                <div className="space-y-4 pt-8 border-t border-white/10 text-white/60">
                   <h3 className="text-xs font-black uppercase tracking-widest text-white mb-4">Tactical Directives:</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "Standard 13 rounds win condition.",
                        "Default coins: 1500 per round.",
                        "Character skill: Enabled.",
                        "Map advantage: Random side assignment.",
                        "Reporting: MVP must screenshot score.",
                        "Network: No reconnect allowance."
                      ].map((rule, idx) => (
                        <div key={idx} className="flex items-start gap-3 group/rule">
                           <div className="mt-1 w-1.5 h-1.5 bg-luxury-red rotate-45 group-hover/rule:scale-150 transition-transform" />
                           <p className="text-[10px] font-bold uppercase tracking-widest leading-6">{rule}</p>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>

            {/* Notification Subscription Status */}
            <div className="glass p-8 border-luxury-gold/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-luxury-gold" />
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-luxury-gold/10 flex items-center justify-center border border-luxury-gold/30">
                  <Bell className="text-luxury-gold animate-bounce" />
                </div>
                <div>
                  <h4 className="text-lg font-black italic uppercase tracking-tighter">PROTOCOLS ACTIVE</h4>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">You will receive the Room ID via WhatsApp & Email</p>
                </div>
              </div>
              <button 
                onClick={() => window.open('https://chat.whatsapp.com/your-group-link', '_blank')}
                className="btn-luxury px-8 py-4 flex items-center gap-3 w-full md:w-auto justify-center"
              >
                <MessageCircle size={20} /> JOIN OPS CENTER
              </button>
            </div>
          </div>

          {/* Right Column: Intensity Components */}
          <div className="space-y-8">
            {/* Visual Intensity Card */}
            <div className="glass aspect-square relative overflow-hidden flex flex-col items-center justify-center p-8 text-center border-white/5">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80')] bg-cover opacity-20" />
              <div className="relative z-10">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="mb-8"
                >
                  <div className="w-32 h-32 bg-luxury-red/20 rounded-full flex items-center justify-center border-4 border-luxury-red relative">
                    <div className="absolute inset-0 border-t-4 border-luxury-gold rounded-full animate-spin" />
                    <Target size={64} className="text-luxury-red" />
                  </div>
                </motion.div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-2 underline underline-offset-8 decoration-luxury-red">IGNIS ELITE</h3>
                <p className="text-[10px] font-black uppercase text-luxury-gold tracking-[0.4em] mb-8">Tournament Ready</p>
                <div className="flex items-center gap-2 text-[9px] font-bold text-white/40 bg-black/50 px-4 py-2 border border-white/10 uppercase tracking-widest">
                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                   Connection Stable // No Latency
                </div>
              </div>
            </div>

            {/* Prize Detail */}
            <div className="glass p-8 border-luxury-gold/50 bg-luxury-gold/5 text-center group">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4">Ultimate Objective</p>
               <h4 className="text-4xl font-black italic uppercase italic tracking-tighter text-luxury-gold group-hover:scale-110 transition-transform">BATTLE PASS</h4>
               <p className="text-[9px] font-bold uppercase tracking-widest text-white mt-2">Awarded to the squad MVP</p>
            </div>

            {/* Support Link */}
            <button className="w-full flex items-center justify-between p-6 border border-white/5 bg-white/5 hover:border-luxury-gold transition-all group">
               <div className="flex items-center gap-4">
                  <ShieldAlert size={20} className="text-white/40 group-hover:text-luxury-gold" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Report Enlistment Issue</span>
               </div>
               <ChevronRight size={16} className="text-white/20 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Starting Soon Animation Overlay (Only when timer is very low) */}
      {timeLeft.h === 0 && timeLeft.m === 0 && timeLeft.s < 60 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
           <motion.div 
             initial={{ opacity: 0, scale: 2 }}
             animate={{ opacity: 1, scale: 1 }}
             className="text-[20vw] font-black italic text-luxury-red/20 uppercase tracking-tighter select-none"
           >
              DEPLOYING
           </motion.div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }: any) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase text-white/40 tracking-widest">
        <Icon size={12} className="text-luxury-red" /> {label}
      </div>
      <p className="text-xs font-black uppercase tracking-wide text-white">{value}</p>
    </div>
  );
}
