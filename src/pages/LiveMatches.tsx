import { Swords, Twitch, Youtube, Users, MessageSquare, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

const liveMatches = [
  { id: 1, title: 'ELITE SQUAD LEAGUE', teamA: 'LOUD', teamB: 'EVOS', viewers: '4.2K', time: '18:24', status: 'LIVE', color: 'text-luxury-red' },
  { id: 2, title: 'PLATINUM DUO CUP', teamA: 'VITALITY', teamB: 'G2', viewers: '2.8K', time: '05:12', status: 'LIVE', color: 'text-luxury-red' },
  { id: 3, title: 'SOLO SURVIVOR', teamA: 'CHAMPIONS', teamB: 'LEGENDS', viewers: '15.2K', time: 'UPCOMING', status: '20:00 UTC', color: 'text-luxury-gold' },
];

export function LiveMatches() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <h1 className="text-6xl md:text-8xl font-black italic mb-4 neon-text">LIVE <span className="text-white">WAR</span></h1>
          <p className="text-white/40 uppercase tracking-[0.5em] text-xs font-bold font-mono">Satellite Feed Active - Real-time Coverage</p>
        </div>
        <div className="flex gap-4">
          <div className="glass px-6 py-4 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-luxury-red animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-widest">Global Watch: 52.4K</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {liveMatches.map((match) => (
            <motion.div 
              key={match.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-8 border-white/5 hover:border-luxury-gold/50 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <span className={match.color + " text-[10px] font-black uppercase tracking-[0.3em] italic"}>{match.status}</span>
                  <div className="h-4 w-[1px] bg-white/10" />
                  <span className="text-white/40 text-[10px] uppercase tracking-widest">{match.title}</span>
                </div>
                <div className="flex items-center gap-2 text-white/40">
                  <Users size={14} />
                  <span className="text-[10px] font-mono">{match.viewers}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 md:gap-12 text-center">
                <div className="flex-1 space-y-4">
                  <div className="w-20 h-20 bg-white/5 mx-auto border border-white/10 flex items-center justify-center glass-gold">
                    <span className="text-2xl font-black italic">{match.teamA[0]}</span>
                  </div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter">{match.teamA}</h3>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="px-4 py-1 bg-luxury-red text-black text-[10px] font-black italic -rotate-2">VERSUS</div>
                  <Swords size={32} className="text-white/20 group-hover:text-luxury-gold transition-colors duration-500" />
                  <span className="font-mono text-2xl font-black text-luxury-gold">{match.time}</span>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="w-20 h-20 bg-white/5 mx-auto border border-white/10 flex items-center justify-center glass-gold">
                    <span className="text-2xl font-black italic">{match.teamB[0]}</span>
                  </div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter">{match.teamB}</h3>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button className="flex-1 btn-luxury py-3 flex items-center justify-center gap-2">
                  <Twitch size={18} /> WATCH LIVE
                </button>
                <button className="flex-1 btn-outline py-3 flex items-center justify-center gap-2">
                  <MessageSquare size={18} /> LIVE CHAT
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="glass p-8 border-white/5">
            <h3 className="text-xl font-black mb-6 italic flex items-center gap-2 uppercase">
              <Flame className="text-luxury-red" size={20} /> TOP STREAMERS
            </h3>
            <div className="space-y-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 -m-2 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-none border border-white/10 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                      <img src={`https://picsum.photos/seed/stream${i}/100/100`} />
                    </div>
                    <div>
                      <p className="text-sm font-black italic uppercase">ELITE_STREAMER_{i}</p>
                      <p className="text-[10px] text-white/40 font-mono italic">Playing: Bermuda Ranked</p>
                    </div>
                  </div>
                  <div className="w-3 h-3 rounded-none bg-luxury-red animate-pulse" />
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-colors">
              VIEW ALL CHANNELS
            </button>
          </div>

          <div className="glass-gold p-8 border-luxury-gold/30 relative overflow-hidden bg-luxury-gold">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Youtube size={120} className="text-black" />
            </div>
            <h3 className="text-black text-2xl font-black mb-4 italic">JOIN THE CREW</h3>
            <p className="text-black/60 text-sm mb-6 leading-relaxed">Become a verified stream partner and get featured on the main dashboard.</p>
            <button className="bg-black text-luxury-gold px-8 py-3 text-[10px] font-black uppercase tracking-widest shadow-xl">
              APPLY NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
