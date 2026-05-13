import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Trophy, ChevronRight, Zap, Target, ShieldCheck, Flame } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Character3D() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        y: [0, -20, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className="relative w-full max-w-[500px] aspect-[4/5] bg-white/5 border border-white/10 group cursor-crosshair shadow-[0_0_50px_rgba(197,160,89,0.1)]"
    >
      <div 
        style={{ transform: "translateZ(50px)" }}
        className="absolute inset-4 overflow-hidden border border-white/20 bg-luxury-black"
      >
        <img 
          src="https://images.unsplash.com/photo-1589241062272-c0a000072dfa?auto=format&fit=crop&q=80" 
          className="w-full h-full object-cover brightness-90 group-hover:brightness-110 transition-all duration-700 scale-110 group-hover:scale-100"
          alt="Free Fire Elite"
        />
        {/* Glow Overlay to match the Pink/Purple in the user image */}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-red-600/5" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      </div>

      <motion.div
        style={{ transform: "translateZ(80px)" }}
        className="absolute -right-8 -bottom-8 w-48 h-48 border-r-4 border-b-4 border-red-600 pointer-events-none drop-shadow-[0_0_15px_rgba(196,30,58,0.5)]"
      />

      <motion.div
        style={{ transform: "translateZ(100px)" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] text-center pointer-events-none"
      >
        <span className="text-[12px] font-black text-red-500 bg-black/90 px-6 py-3 border border-red-600/50 uppercase tracking-[0.6em] italic shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          ELITE_PROTOCOL_ACTIVE
        </span>
      </motion.div>

      {/* Atmospheric Scanning line */}
      <motion.div 
        animate={{ y: ["0%", "100%", "0%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-x-4 h-px bg-red-600/30 z-20 pointer-events-none blur-sm"
        style={{ transform: "translateZ(60px)" }}
      />
    </motion.div>
  );
}

export function Home() {
  const { user } = useAuth();
  return (
    <div className="pt-20 relative min-h-screen overflow-hidden">
      {/* High-Impact Motion Background (Free Fire & PUBG Mix Aesthetic) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-black"
        >
          {/* Layer 1: PUBG Style Tactical Landscape */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 1, 0]
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <img 
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80" 
              className="w-full h-full object-cover grayscale brightness-[0.4] contrast-125"
              alt=""
            />
          </motion.div>

          {/* Layer 2: Free Fire Style Urban Elements / Glows */}
          <motion.div
            animate={{ 
              x: [-20, 20, -20],
              y: [-10, 10, -10]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 mix-blend-screen opacity-30"
          >
            <img 
              src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80" 
              className="w-full h-full object-cover sepia-[0.5] hue-rotate-[320deg] brightness-75"
              alt=""
            />
          </motion.div>

          {/* Layer 3: Particles & Smoke */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-20" />
        </motion.div>
        
        {/* Intense Vignette & Gradients for Readability */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_50%,transparent_0%,rgba(5,5,5,0.9)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-transparent to-luxury-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-black/80 via-transparent to-transparent" />
      </div>

      {/* Existing Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-red-600/10 to-transparent pointer-events-none z-0" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-luxury-gold/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute top-1/4 left-10 w-px h-1/2 bg-gradient-to-b from-transparent via-red-600/50 to-transparent z-0" />

      {/* Hero Section */}
      <section className="relative min-h-screen pt-32 pb-20 px-12 flex items-center overflow-hidden z-10">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-2 flex items-center gap-3">
              <span className="text-luxury-gold text-xs font-bold uppercase tracking-[0.3em]">Premium Circuit // Season 04</span>
              <div className="flex-1 h-px bg-gradient-to-r from-luxury-gold/50 to-transparent"></div>
            </div>
            
            <h1 className="text-[80px] md:text-[110px] leading-[0.85] font-black uppercase italic tracking-tighter mb-8">
              ASCENSION<br/>
              <span className="text-stroke">SERIES</span>
            </h1>

            <p className="text-white/60 max-w-md text-sm leading-relaxed mb-10 border-l-2 border-red-600 pl-6 font-light">
              The most prestigious Free Fire tournament in the region. Compete against the elite, claim the crown, and secure your share of the legendary prize pool.
            </p>

            <div className="flex flex-wrap gap-6">
              <Link to={user ? "/tournaments" : "/auth"} className="btn-luxury group relative overflow-hidden flex items-center justify-center gap-3">
                <Flame size={18} className="animate-pulse" />
                <span className="relative z-10">{user ? "Enter Arena" : "Join Tournament"}</span>
                <div className="absolute inset-0 bg-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform skew-x-12"></div>
                <div className="absolute -right-2 -top-2 w-8 h-8 bg-black transform rotate-45"></div>
              </Link>
              <button className="btn-outline">
                Rules & Regs
              </button>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-12">
              <div>
                <p className="text-[10px] uppercase text-white/40 tracking-widest mb-1 font-bold">Prize Pool</p>
                <p className="text-2xl font-black text-luxury-gold italic tracking-tight">$50,000</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-white/40 tracking-widest mb-1 font-bold">Slots Left</p>
                <p className="text-2xl font-black italic tracking-tight">12 / 128</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-white/40 tracking-widest mb-1 font-bold">Region</p>
                <p className="text-2xl font-black italic tracking-tight">Global</p>
              </div>
            </div>
          </motion.div>

          {/* Right Content: 3D Character or Info Dashboard */}
          <div className="hidden lg:flex flex-col items-center justify-center relative min-h-[500px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="w-full h-full flex items-center justify-center relative z-10"
            >
              <Character3D />
            </motion.div>
            
            {/* Overlay Dashboard Elements */}
            {!user && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -right-12 top-12 glass p-6 border-red-600/50 bg-black/80 max-w-[200px] z-20"
              >
                <h3 className="text-[10px] font-black uppercase text-red-500 mb-2 tracking-widest">Enlistment Required</h3>
                <p className="text-[8px] text-white/40 uppercase leading-relaxed font-bold">Operative identity not detected in local mainframe. Secured deployment link required.</p>
              </motion.div>
            )}

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute -left-12 bottom-12 bg-white/5 backdrop-blur-xl border border-white/10 p-6 z-20 max-w-[220px]"
            >
              <div className="flex justify-between items-center mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Prize Tracking</p>
                <div className="w-2 h-2 bg-luxury-gold rounded-full animate-pulse" />
              </div>
              <p className="text-2xl font-black italic text-luxury-gold tracking-tighter mb-2">$50,000</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className={`h-1 flex-1 ${i <= 4 ? 'bg-luxury-gold' : 'bg-white/10'}`} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* HUD Controls */}
        <div className="absolute top-40 right-10 hidden xl:flex flex-col gap-4">
          {[
            { color: 'hover:bg-red-600' },
            { color: 'hover:bg-[#5865F2]' },
            { color: 'hover:bg-[#25D366]' }
          ].map((h, i) => (
            <div key={i} className={cn("w-14 h-14 bg-white/5 border border-white/10 flex items-center justify-center transition-colors cursor-pointer group", h.color)}>
              <div className="w-6 h-6 border-2 border-white/40 group-hover:border-white transition-all transform group-hover:rotate-45" />
            </div>
          ))}
        </div>
      </section>

      {/* Featured Banner / Rewards */}
      <section className="py-20 px-12 z-10 relative">
        <div className="max-w-7xl mx-auto h-32 bg-luxury-gold p-8 flex items-center justify-between relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.01]">
          <div className="absolute -right-4 top-0 h-full w-64 bg-white/20 transform skew-x-[30deg] transition-transform group-hover:translate-x-12"></div>
          <div>
            <p className="text-black font-black uppercase text-3xl leading-tight tracking-tighter">PRO PASS <span className="italic text-white">REWARDS</span></p>
            <p className="text-black/60 text-xs font-bold uppercase tracking-widest">Unlock the battle royal pass</p>
          </div>
          <Link to={user ? "/store" : "/auth"} className="px-10 py-4 bg-black text-white text-xs font-black uppercase tracking-widest relative z-10 transition-colors hover:bg-red-600">
            Claim Now
          </Link>
        </div>
      </section>

      {/* Dynamic CTA Section for Unauthenticated Users */}
      {!user && (
        <section className="py-32 px-12 relative overflow-hidden border-y border-white/5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(197,160,89,0.05),transparent_70%)]" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-8 leading-[0.9]">
                SECURE YOUR <br/>
                <span className="text-red-500 text-stroke">LEGACY</span>
              </h2>
              <p className="text-white/40 text-sm max-w-lg mx-auto mb-12 font-bold uppercase tracking-[0.3em] leading-relaxed">
                Join 1,200+ elite operatives. Secure your tactical statistics and unlock the legendary arena.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link to="/auth" className="btn-luxury px-12">
                  ENLIST NOW
                </Link>
                <Link to="/tournaments" className="btn-outline px-12">
                  VIEW MISSIONS
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-20 border-y border-white/5 bg-luxury-grey">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { label: 'Active Players', value: '14.2K+', icon: Zap },
            { label: 'Prize Pool', value: '$50K+', icon: Trophy },
            { label: 'Tournaments', value: '150+', icon: Target },
            { label: 'Verified Clans', value: '800+', icon: ShieldCheck },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="flex justify-center mb-4">
                <stat.icon className="text-luxury-gold group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-3xl md:text-5xl font-black mb-2">{stat.value}</h3>
              <p className="text-white/40 text-[10px] uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Tournament */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-16">
            <div>
              <h2 className="text-4xl md:text-6xl font-black italic">ULTIMATE WAR</h2>
              <p className="text-luxury-gold flex items-center gap-2 uppercase tracking-widest font-bold mt-2">
                <Flame size={18} /> Season 4 Registration Open
              </p>
            </div>
            <button className="hidden md:block btn-outline py-2 px-6">View All</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-gold p-8 rounded-none relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className="bg-red-600 px-3 py-1 text-[10px] font-black uppercase tracking-tighter italic">LIVE</span>
              </div>
              <h3 className="text-3xl font-black mb-4">PLATINUM LEAGUE</h3>
              <div className="flex gap-8 mb-8">
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Entry Fee</p>
                  <p className="text-xl font-mono text-luxury-gold">$15</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Prize Pool</p>
                  <p className="text-xl font-mono text-luxury-gold">$5,000</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Format</p>
                  <p className="text-xl font-mono text-luxury-gold">SQUAD</p>
                </div>
              </div>
              <button className="w-full btn-luxury">Register Now</button>
            </div>

            <div className="glass p-8 rounded-none border-white/5">
              <h3 className="text-2xl font-black mb-6">LIVE COUNTDOWN</h3>
              <div className="grid grid-cols-4 gap-4 mb-8">
                {['05', '12', '45', '18'].map((val, i) => (
                  <div key={i} className="bg-white/5 p-4 text-center">
                    <p className="text-3xl font-mono font-black">{val}</p>
                    <p className="text-[8px] text-white/40 uppercase tracking-widest">
                      {['Days', 'Hours', 'Mins', 'Secs'][i]}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/60 mb-6 italic">Next match: Team LOUD vs EVOS - 18:00 UTC</p>
              <button className="w-full py-4 border border-white/10 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-white/5 transition-colors">
                Set Reminder
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Luxury Armory */}
      <section className="py-32 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(197,160,89,0.1),transparent_70%)]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-black mb-8 italic leading-tight">
              LEGENDARY <br />
              <span className="text-luxury-gold">ARMORY</span>
            </h2>
            <p className="text-white/40 text-lg mb-12 leading-relaxed font-light">
              Unlock exclusive platinum-tier skins and legendary weapons available only to tournament MVPs. Your performance dictates your arsenal.
            </p>
            <div className="space-y-6">
              {['DRAGON BREATH AWM', 'KUMIHO M1887', 'CHRONO AUG'].map((weapon, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-[1px] bg-luxury-gold/30 group-hover:w-20 transition-all duration-500" />
                  <span className="text-sm font-black uppercase tracking-[0.3em] group-hover:text-luxury-gold transition-colors">{weapon}</span>
                </div>
              ))}
            </div>
            <button className="btn-luxury mt-16 px-12 py-4">ENTER VAULT</button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, rotateY: 30 }}
            whileInView={{ opacity: 1, rotateY: 0 }}
            viewport={{ once: true }}
            className="relative perspective-1000"
          >
            <div className="relative z-10 glass-gold p-4 rotate-3 hover:rotate-0 transition-transform duration-700 shadow-[0_0_100px_rgba(197,160,89,0.15)]">
              <img 
                src="https://images.unsplash.com/photo-1614294149010-950b698f72c0?q=80&w=2070&auto=format&fit=crop" 
                alt="Legendary Weapon" 
                className="w-full h-auto grayscale brightness-110 group-hover:grayscale-0 transition-all"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 border border-luxury-gold/20 -z-10 animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 border border-red-600/10 -z-10 animate-pulse" />
          </motion.div>
        </div>
      </section>

      {/* Sponsors */}
      <section className="py-20 border-t border-white/5 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-12 md:gap-20">
          {['ROG', 'RAZER', 'LOGITECH', 'MONSTER', 'RED BULL'].map((s, i) => (
            <span key={i} className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase">{s}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
