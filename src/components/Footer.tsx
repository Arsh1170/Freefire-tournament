import { Mail, MessageCircle, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-luxury-black border-t border-white/5 pt-24">
      <div className="max-w-7xl mx-auto px-12 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-luxury-red flex items-center justify-center transform rotate-45 border border-white/20">
                <span className="-rotate-45 font-black text-xl text-black">V</span>
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase italic">
                IGNIS <span className="text-luxury-red">ESPORTS</span>
              </span>
            </div>
            <p className="text-white/40 text-xs leading-relaxed mb-8 uppercase tracking-widest font-bold">
              The most prestigious Free Fire tournament in the region. <br/>Compete against the elite.
            </p>
            <div className="flex gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-luxury-red transition-all cursor-pointer group hover:-translate-y-1">
                  <div className="w-4 h-4 border border-white/40 group-hover:border-white transform rotate-45 transition-all" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-luxury-gold text-[10px] font-black uppercase tracking-[0.4em] mb-10 border-b border-white/5 pb-2">Navigation</h4>
            <ul className="flex flex-col gap-5 text-[10px] text-white/40 font-black uppercase tracking-widest">
              <li><a href="#" className="hover:text-luxury-red hover:pl-2 transition-all block">Tournaments</a></li>
              <li><a href="#" className="hover:text-luxury-red hover:pl-2 transition-all block">Leaderboards</a></li>
              <li><a href="#" className="hover:text-luxury-red hover:pl-2 transition-all block">Clan Wars</a></li>
              <li><a href="#" className="hover:text-luxury-red hover:pl-2 transition-all block">Hall of Fame</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-luxury-gold text-[10px] font-black uppercase tracking-[0.4em] mb-10 border-b border-white/5 pb-2">Contact</h4>
            <ul className="flex flex-col gap-5 text-[10px] text-white/40 font-black uppercase tracking-widest">
              <li><a href="mailto:ops@ignis.net" className="hover:text-luxury-red transition-all flex items-center gap-3">ops@ignis.net</a></li>
              <li><span className="flex items-center gap-3">Sector-7 Deployment HQ</span></li>
              <li><a href="tel:+1800IGNIS" className="hover:text-luxury-red transition-all flex items-center gap-3">+1 (800) IGNIS-99</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-luxury-gold text-[10px] font-black uppercase tracking-[0.4em] mb-10 border-b border-white/5 pb-2">Intelligence</h4>
            <p className="text-[10px] text-white/40 mb-8 uppercase tracking-widest font-black leading-relaxed">Join the neural link for priority deployment orders.</p>
            <div className="flex border-b border-white/10 pb-2 focus-within:border-luxury-red transition-colors">
              <input 
                type="email" 
                placeholder="NEURAL_EMAIL@IGNIS.NET" 
                className="bg-transparent px-0 py-2 text-[10px] w-full focus:outline-none placeholder:text-white/10 font-bold tracking-widest"
              />
              <button className="text-luxury-gold font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors">Link</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Ticker / Sponsors */}
      <div className="h-16 border-t border-white/5 flex items-center bg-black/80 relative z-20 overflow-hidden">
        <div className="px-10 bg-luxury-red h-full flex items-center shrink-0">
          <span className="font-black uppercase italic tracking-tighter text-sm">Latest Records</span>
        </div>
        <div className="flex-1 flex items-center px-10 gap-12 whitespace-nowrap text-[10px] font-black uppercase tracking-[0.3em] text-white/40 animate-ticker">
          <span className="flex items-center gap-4"><span className="text-white">BOOYAH!</span> SQUAD ALPHA VS TEAM KAPPA // MAP: BERMUDA</span>
          <span className="text-white/10">|</span>
          <span className="flex items-center gap-4"><span className="text-white">BOOYAH!</span> LOUD ESPORTS VS EVOS // MAP: PURGATORY</span>
          <span className="text-white/10">|</span>
          <span className="flex items-center gap-4"><span className="text-white">MVP:</span> LOUD_NODA7 WITH 12 KILLS</span>
          <span className="text-white/10">|</span>
          <span className="flex items-center gap-4">MATCH #47 STARTING IN <span className="text-luxury-red">00:14:59</span></span>
        </div>
        <div className="px-10 h-full flex items-center gap-8 border-l border-white/5 bg-black">
          <span className="text-[9px] uppercase text-white/20 font-black tracking-widest">Ignis OS v4.2.1</span>
          <div className="flex gap-4 opacity-50 contrast-125">
             <div className="w-8 h-4 bg-white/20 skew-x-12" />
             <div className="w-8 h-4 bg-white/20 skew-x-12" />
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 20s linear infinite;
        }
      `}} />
    </footer>
  );
}
