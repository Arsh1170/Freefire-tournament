import { Users, Shield, Trophy, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

const topClans = [
  { rank: 1, name: 'LOUD', members: 42, points: '45,200', tag: 'BR', logo: 'https://picsum.photos/seed/loud/150/150' },
  { rank: 2, name: 'EVOS', members: 38, points: '42,800', tag: 'ID', logo: 'https://picsum.photos/seed/evos/150/150' },
  { rank: 3, name: 'TEAM_VITALITY', members: 40, points: '40,100', tag: 'FR', logo: 'https://picsum.photos/seed/vit/150/150' },
  { rank: 4, name: 'G2_ESPORTS', members: 35, points: '38,500', tag: 'EU', logo: 'https://picsum.photos/seed/g2/150/150' },
];

export function ClanRankings() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h1 className="text-6xl md:text-8xl font-black italic mb-4 uppercase">CLAN <span className="text-luxury-gold">WARS</span></h1>
        <p className="text-white/40 uppercase tracking-[0.5em] text-xs font-bold font-mono">Global Syndicate Standings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {topClans.map((clan, i) => (
          <motion.div 
            key={clan.rank}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-gold p-8 border-luxury-gold/20 flex items-center gap-8 group hover:scale-[1.02] transition-all duration-500"
          >
            <div className="text-4xl font-black italic opacity-20 group-hover:opacity-100 transition-opacity text-luxury-gold">0{clan.rank}</div>
            <div className="w-24 h-24 bg-black border border-luxury-gold/50 flex items-center justify-center p-2">
              <img src={clan.logo} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">{clan.name}</h3>
                <span className="text-[10px] bg-white/10 px-2 py-1 font-mono uppercase tracking-widest">{clan.tag}</span>
              </div>
              <div className="flex gap-8 text-[10px] uppercase tracking-widest font-bold text-white/40">
                <span className="flex items-center gap-1"><Users size={12} /> {clan.members} SQUADRON</span>
                <span className="flex items-center gap-1"><Trophy size={12} className="text-luxury-gold" /> {clan.points} PTS</span>
              </div>
            </div>
            <Flame className="text-luxury-red opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>

      <div className="glass p-12 text-center bg-gradient-to-br from-luxury-black via-luxury-black to-luxury-gold/5 border-white/5">
        <h3 className="text-3xl font-black italic mb-6">WANT TO FEATURE YOUR CLAN?</h3>
        <p className="text-white/40 text-sm max-w-lg mx-auto mb-10 leading-relaxed uppercase tracking-widest font-bold">
          Only verified organizations with at least 4 elite players can apply for official league partnership.
        </p>
        <button className="btn-luxury px-12 py-4">SUBMIT CLAN DATA</button>
      </div>
    </div>
  );
}

export function Rules() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <h1 className="text-6xl font-black italic mb-12 text-luxury-gold">PROTOCOL</h1>
      <div className="space-y-12">
        {[
          { title: 'Anti-Cheat Deployment', desc: 'Any form of third-party software, GFX tools, or macros will result in a permanent hardware ban from all IGNIS tournaments.' },
          { title: 'Identity Verification', desc: 'Players must use their registered UID. Identity spoofing during live matches is strictly prohibited.' },
          { title: 'Sportsmanship Protocol', desc: 'Toxic behavior in open chats or stream snipe attempts will lead to immediate disqualification of the entire team.' },
          { title: 'Technical Failures', desc: 'IGNIS is not responsible for player-side connectivity issues. Matches will proceed according to satellite timing.' },
        ].map((rule, i) => (
          <div key={i} className="flex gap-8 group">
            <div className="text-4xl font-black italic text-white/10 group-hover:text-luxury-gold transition-colors">0{i+1}</div>
            <div className="pb-8 border-b border-white/5 flex-grow">
              <h3 className="text-xl font-black uppercase italic mb-4 tracking-tighter">{rule.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed tracking-wide font-light">{rule.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Contact() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h1 className="text-6xl font-black italic mb-8">SIGNAL <span className="text-luxury-red">ACTIVE</span></h1>
          <p className="text-white/40 text-lg mb-12 leading-relaxed">Need tactical support or partnership inquiries? Our communications channel is open 24/7.</p>
          
          <div className="space-y-6">
            <div className="glass p-6 border-white/5 flex items-center gap-6">
              <div className="w-12 h-12 bg-luxury-gold flex items-center justify-center text-black">
                <Users size={20} />
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Discord Community</p>
                <p className="text-sm font-black italic uppercase">IGNIS_OFFICIAL_STATION</p>
              </div>
            </div>
            <div className="glass p-6 border-white/5 flex items-center gap-6">
              <div className="w-12 h-12 bg-luxury-red flex items-center justify-center text-white">
                <Flame size={20} />
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Support Ticket</p>
                <p className="text-sm font-black italic uppercase">SUPPORT@IGNIS.ESPORTS</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass p-12 border-white/5">
          <h3 className="text-2xl font-black italic mb-10 uppercase tracking-tighter">ENCRYPTED MESSAGE</h3>
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-white/40">Codename</label>
                <input className="w-full bg-white/5 border border-white/10 p-4 focus:border-luxury-gold transition-colors outline-none font-mono text-xs uppercase" placeholder="NAME" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-white/40">Frequency</label>
                <input className="w-full bg-white/5 border border-white/10 p-4 focus:border-luxury-gold transition-colors outline-none font-mono text-xs uppercase" placeholder="EMAIL" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-white/40">Message Payload</label>
              <textarea rows={6} className="w-full bg-white/5 border border-white/10 p-4 focus:border-luxury-gold transition-colors outline-none font-mono text-xs uppercase" placeholder="ENTER YOUR MESSAGE..."></textarea>
            </div>
            <button className="btn-luxury w-full py-5">TRANSMIT DATA</button>
          </form>
        </div>
      </div>
    </div>
  );
}
