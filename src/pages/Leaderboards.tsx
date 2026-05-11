import { Trophy, Medal, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const topPlayers = [
  { rank: 1, name: 'NOBRU_OFFICIAL', kills: 1420, booyahs: 85, points: 15400, avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=100&q=80' },
  { rank: 2, name: 'LOUD_THURZIN', kills: 1380, booyahs: 78, points: 14800, avatar: 'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?auto=format&fit=crop&w=100&q=80' },
  { rank: 3, name: 'CEROL_LIVES', kills: 1250, booyahs: 62, points: 13900, avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=100&q=80' },
];

export function Leaderboards() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h1 className="text-6xl md:text-8xl font-black italic mb-4">HALL OF <span className="text-luxury-gold">FAME</span></h1>
        <p className="text-white/40 uppercase tracking-[0.5em] text-xs font-bold font-mono">Real-time Global Rankings</p>
      </div>

      {/* Top 3 Podiums */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 items-end">
        {/* Rank 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-8 order-2 md:order-1 h-[350px] flex flex-col items-center justify-center relative border-luxury-gold/20"
        >
          <div className="absolute -top-10">
            <div className="w-20 h-20 rounded-full border-4 border-luxury-black overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <img src={topPlayers[1].avatar} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-zinc-400 text-black flex items-center justify-center font-black">2</div>
          </div>
          <h3 className="text-xl font-black mb-1">{topPlayers[1].name}</h3>
          <p className="text-luxury-gold font-mono font-bold mb-4">{topPlayers[1].points} PTS</p>
          <div className="flex gap-4 text-[10px] uppercase tracking-widest text-white/40">
            <span>KILLS: {topPlayers[1].kills}</span>
            <span>BOOYAH: {topPlayers[1].booyahs}</span>
          </div>
        </motion.div>

        {/* Rank 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-gold p-10 order-1 md:order-2 h-[450px] flex flex-col items-center justify-center relative scale-110 shadow-[0_0_50px_rgba(197,160,89,0.2)]"
        >
          <div className="absolute -top-14">
            <div className="w-28 h-28 rounded-full border-4 border-luxury-gold overflow-hidden shadow-[0_0_30px_rgba(197,160,89,0.4)]">
              <img src={topPlayers[0].avatar} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-luxury-gold text-black flex items-center justify-center font-black text-xl">1</div>
          </div>
          <Trophy className="text-luxury-gold mb-6" size={48} />
          <h3 className="text-3xl font-black mb-1 uppercase italic tracking-tighter">{topPlayers[0].name}</h3>
          <p className="text-luxury-gold text-2xl font-mono font-black mb-6 tracking-tighter">{topPlayers[0].points} PTS</p>
          <div className="flex gap-6 text-xs uppercase tracking-[0.2em] font-bold text-white/60">
            <span className="flex items-center gap-1"><Medal size={14} className="text-luxury-gold" /> {topPlayers[0].kills}</span>
            <span className="flex items-center gap-1"><Star size={14} className="text-luxury-gold" /> {topPlayers[0].booyahs}</span>
          </div>
        </motion.div>

        {/* Rank 3 */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass p-8 order-3 h-[300px] flex flex-col items-center justify-center relative border-luxury-gold/10"
        >
          <div className="absolute -top-10">
            <div className="w-20 h-20 rounded-full border-4 border-luxury-black overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <img src={topPlayers[2].avatar} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brown-600 bg-orange-800 text-white flex items-center justify-center font-black">3</div>
          </div>
          <h3 className="text-xl font-black mb-1">{topPlayers[2].name}</h3>
          <p className="text-luxury-gold font-mono font-bold mb-4">{topPlayers[2].points} PTS</p>
          <div className="flex gap-4 text-[10px] uppercase tracking-widest text-white/40">
            <span>KILLS: {topPlayers[2].kills}</span>
            <span>BOOYAH: {topPlayers[2].booyahs}</span>
          </div>
        </motion.div>
      </div>

      {/* Full List */}
      <div className="glass overflow-hidden border-white/5">
        <table className="w-full text-left">
          <thead className="bg-white/5 uppercase text-[10px] tracking-widest font-black text-luxury-gold border-b border-white/10">
            <tr>
              <th className="p-8">RANKING</th>
              <th className="p-8">COMPETITOR</th>
              <th className="p-8">ELIMINATIONS</th>
              <th className="p-8">VICTORIES</th>
              <th className="p-8 text-right">TOTAL SCORE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {Array.from({ length: 15 }).map((_, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors group">
                <td className="p-8 opacity-40 font-black italic">#{i + 4}</td>
                <td className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-none border border-white/10 overflow-hidden">
                      <img src={`https://picsum.photos/seed/${i + 10}/100/100`} />
                    </div>
                    <span className="font-display font-black text-white italic group-hover:text-luxury-gold transition-colors">IGN_WARRIOR_{i + 104}</span>
                  </div>
                </td>
                <td className="p-8 text-white/60">{800 - i * 24}</td>
                <td className="p-8 text-white/60">{45 - i * 2}</td>
                <td className="p-8 text-right text-luxury-gold font-black tracking-tighter text-xl">
                  {(12000 - i * 450).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
