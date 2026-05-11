import { motion } from 'framer-motion';
import { LogIn, Shield, Zap, Trophy, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export function Auth() {
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/profile';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden bg-luxury-black">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-luxury-red/10 to-transparent pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-luxury-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-px h-1/2 bg-gradient-to-b from-transparent via-luxury-red/50 to-transparent" />

      <div className="max-w-6xl w-full px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center z-10">
        {/* Left Side: Cinematic Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-4 flex items-center gap-3">
             <span className="text-luxury-gold text-[10px] font-black uppercase tracking-[0.4em]">Section // Auth_Protocol</span>
             <div className="w-20 h-px bg-luxury-gold/30"></div>
          </div>
          <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-[0.85] mb-8">
            ENLIST <br />
            <span className="text-stroke">PROTOCOL</span>
          </h1>
          <p className="text-white/40 text-sm leading-relaxed mb-12 max-w-sm font-light border-l border-luxury-red pl-6">
            Secure your unique UID in the global database. Verified accounts earn priority slot allocation and exclusive armory access.
          </p>

          <div className="space-y-6">
            {[
              { icon: Shield, title: 'Identity Sync', desc: 'Real-time Free Fire UID verification.' },
              { icon: Zap, title: 'Instant Rewards', desc: 'Claim 1,000 victory tokens on first link.' },
              { icon: Trophy, title: 'Rank Tracking', desc: 'Institutional grade K/D & Win-rate logs.' },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-6 group"
              >
                <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-luxury-red transition-colors">
                  <item.icon className="text-luxury-red" size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest group-hover:text-luxury-gold transition-colors">{item.title}</h4>
                  <p className="text-[10px] text-white/40 uppercase font-light mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Auth Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass p-12 relative overflow-hidden border-white/5"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-red/5 -skew-x-12 translate-x-16 -translate-y-16" />
          
          <div className="mb-12">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">
              MAINFRAME <span className="text-luxury-red">LOGIN / SIGNUP</span>
            </h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Authorized cloud credentials required</p>
          </div>

          <div className="space-y-8">
            <button 
              onClick={() => signInWithGoogle()}
              className="w-full btn-luxury py-6 flex items-center justify-center gap-4 group"
            >
              <LogIn size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="text-xs font-black uppercase tracking-[0.3em]">Synch via Google</span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[8px] uppercase tracking-[0.6em] font-black text-white/20">
                <span className="bg-luxury-grey px-4">Encryption: AES-256</span>
              </div>
            </div>

            <div className="p-6 bg-white/5 border border-white/10">
              <div className="flex gap-4 items-start">
                <Shield size={24} className="text-luxury-gold shrink-0" />
                <p className="text-[9px] uppercase leading-relaxed text-white/40 font-bold">
                  By initializing the enlistment protocol, you agree to our <span className="text-white">Rules of Engagement</span> and <span className="text-white">Privacy Framework</span>. Any breach of terms results in hardware-level blacklisting.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-between items-center text-[10px] uppercase font-mono text-white/20">
            <span>Server: ASIA-SE-1</span>
            <span className="animate-pulse">Status: Waiting_Link</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
