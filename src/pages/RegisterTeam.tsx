import { motion } from 'framer-motion';
import { Shield, Users, Trophy, ChevronRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

export function RegisterTeam() {
  const [step, setStep] = useState(1);

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Left Side: Info */}
        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-6xl md:text-8xl font-black italic mb-6">RECRUIT <br /><span className="text-luxury-gold">PROTOCOL</span></h1>
            <p className="text-white/60 text-lg leading-relaxed max-w-md">
              Secure your place in the global database. Only verified clans are eligible for high-stakes platinum tournaments.
            </p>
          </motion.div>

          <div className="space-y-8">
            {[
              { icon: Shield, title: 'Verified Status', desc: 'Get institutional backing for your squad.' },
              { icon: Users, title: 'Clan Management', desc: 'Sync your roster with real-time stats.' },
              { icon: Trophy, title: 'Auto-Brackets', desc: 'Instant placement in upcoming wars.' },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 group"
              >
                <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-luxury-gold transition-colors">
                  <item.icon className="text-luxury-gold" size={20} />
                </div>
                <div>
                  <h3 className="font-display font-black uppercase text-sm tracking-widest group-hover:text-luxury-gold transition-colors">{item.title}</h3>
                  <p className="text-white/40 text-xs mt-1 uppercase tracking-widest">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-8 glass-gold border-luxury-gold/30 bg-luxury-gold/5 flex items-start gap-4">
            <ShieldAlert className="text-luxury-gold shrink-0" />
            <p className="text-[10px] text-white/60 uppercase tracking-[0.25em] leading-loose">
              <span className="text-white font-black">WARNING:</span> UNAUTHORIZED PLAYER UID SUBMISSIONS WILL RESULT IN TEMPORARY BAN FROM ALL SATELLITE TOURNAMENTS.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-12 relative overflow-hidden"
        >
          {/* Form Progress */}
          <div className="flex gap-2 mb-12">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1 flex-1 transition-colors duration-500 ${step >= i ? 'bg-luxury-gold' : 'bg-white/10'}`} />
            ))}
          </div>

          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">PHASE {step} <span className="opacity-20">/ 3</span></h2>
            <span className="text-[10px] uppercase font-mono text-luxury-gold">Encryption: AES-256</span>
          </div>

          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-black">Official Clan Name</label>
                  <input placeholder="ENTER NAME..." className="w-full bg-white/5 border-b border-white/20 p-4 font-display font-black uppercase tracking-widest text-xl focus:border-luxury-gold outline-none transition-colors" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-black">Primary Region</label>
                  <select className="w-full bg-white/5 border-b border-white/20 p-4 font-display font-black uppercase tracking-widest text-lg focus:border-luxury-gold outline-none text-white appearance-none">
                    <option className="bg-luxury-black">LATIN AMERICA</option>
                    <option className="bg-luxury-black">SOUTHEAST ASIA</option>
                    <option className="bg-luxury-black">EUROPE CENTRAL</option>
                    <option className="bg-luxury-black">NORTH AMERICA</option>
                  </select>
                </div>
              </div>
              <button onClick={() => setStep(2)} className="w-full btn-luxury py-6 mt-12 flex items-center justify-center gap-3">
                NEXT PHASE <ChevronRight size={20} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-black italic">Leader UID</label>
                  <input placeholder="UID: 123456789" className="w-full bg-white/5 border border-white/10 p-4 font-mono text-sm focus:border-luxury-gold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-black italic">Leader Discord</label>
                  <input placeholder="user#1234" className="w-full bg-white/5 border border-white/10 p-4 font-mono text-sm focus:border-luxury-gold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-black italic">WhatsApp Contact</label>
                  <input placeholder="+1 234 567 890" className="w-full bg-white/5 border border-white/10 p-4 font-mono text-sm focus:border-luxury-gold outline-none" />
                </div>
              </div>
              <div className="flex gap-4 mt-12">
                <button onClick={() => setStep(1)} className="flex-1 btn-outline py-5">BACK</button>
                <button onClick={() => setStep(3)} className="btn-luxury px-12 py-5">PROCEED</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="text-center py-10"
            >
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-luxury-gold flex items-center justify-center rounded-full animate-bounce">
                  <CheckCircle2 size={48} className="text-black" />
                </div>
              </div>
              <h3 className="text-3xl font-black italic uppercase mb-4">SQUAD UPLOADED</h3>
              <p className="text-white/40 uppercase tracking-widest text-xs mb-10 leading-relaxed font-bold">
                Your credentials have been encrypted and sent to HQ. Check your Discord for the verification token.
              </p>
              <button className="w-full btn-luxury py-6">EXIT PROTOCOL</button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
