import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Swords, LayoutDashboard, ScrollText, Users, ShoppingBag, Menu, X, User, LogOut, LogIn } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { name: 'Tournaments', path: '/tournaments', icon: Trophy },
  { name: 'Live', path: '/live', icon: Swords },
  { name: 'Ranks', path: '/leaderboards', icon: LayoutDashboard },
  { name: 'Results', path: '/results', icon: ScrollText },
  { name: 'Clans', path: '/clans', icon: Users },
  { name: 'Rewards', path: '/store', icon: ShoppingBag },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, profile, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 h-20 px-12 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-md",
      isScrolled && "bg-luxury-black/95"
    )}>
      <div className="flex items-center gap-12">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-luxury-red flex items-center justify-center transform rotate-45 border border-white/20 group-hover:rotate-180 transition-transform duration-700">
            <span className="-rotate-45 font-black text-xl text-black">V</span>
          </div>
          <span className="text-2xl font-display font-black tracking-tighter uppercase italic">
            IGNIS <span className="text-luxury-red">ESPORTS</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="h-4 w-px bg-white/20" />
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-[10px] uppercase tracking-[0.2em] font-black transition-all duration-300 hover:text-white flex flex-col items-center gap-1",
                location.pathname === item.path ? "text-white border-b border-luxury-red" : "text-white/60"
              )}
            >
              {item.name}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin/payments"
              className={cn(
                "text-[10px] uppercase tracking-[0.2em] font-black transition-all duration-300 bg-luxury-red/20 px-3 py-1 border border-luxury-red/50 hover:bg-luxury-red hover:text-white",
                location.pathname === '/admin/payments' ? "text-white border-luxury-red" : "text-luxury-red"
              )}
            >
              Admin Vault
            </Link>
          )}
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-6">
        <div className="flex items-center gap-2 bg-luxury-red/10 border border-luxury-red/30 px-3 py-1 rounded">
          <div className="w-2 h-2 bg-luxury-red rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold uppercase tracking-tighter">1,284 Players Online</span>
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">{profile?.rank || 'ROOKIE'}</p>
              <Link to="/profile" className="text-xs font-black uppercase tracking-widest text-luxury-red hover:text-white transition-colors">
                {user.displayName?.split(' ')[0]}
              </Link>
            </div>
            <Link to="/profile" className="w-10 h-10 rounded-none border border-luxury-red/30 p-0.5 group overflow-hidden">
              <img src={user.photoURL || ''} alt="Profile" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
            </Link>
            <button 
              onClick={signOut}
              className="text-white/40 hover:text-luxury-red transition-colors"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link 
            to="/auth"
            className="px-6 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-luxury-red hover:text-white transition-colors"
          >
            LOGIN
          </Link>
        )}
      </div>

      <button 
        className="lg:hidden text-white"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X /> : <Menu />}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-luxury-black z-[60] flex flex-col p-10 md:hidden"
          >
            <div className="flex justify-between items-center mb-20">
               <span className="text-2xl font-display font-black tracking-tighter uppercase italic">IGNIS</span>
               <button onClick={() => setIsMobileMenuOpen(false)}><X size={32} /></button>
            </div>
            
            <div className="flex flex-col gap-10">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-4xl font-black italic uppercase tracking-tighter flex items-center gap-4 hover:text-luxury-gold transition-colors"
                >
                  <item.icon className="text-luxury-gold" size={32} />
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto space-y-6">
              {user ? (
                <button onClick={signOut} className="w-full py-4 border border-luxury-red text-luxury-red font-black uppercase tracking-widest text-[10px]">Sign Out</button>
              ) : (
                <Link 
                  to="/auth" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-4 border border-luxury-gold text-luxury-gold font-black uppercase tracking-widest text-[10px] block text-center"
                >
                  Initialize Enlistment
                </Link>
              )}
              <Link to="/register" className="btn-luxury w-full text-center block" onClick={() => setIsMobileMenuOpen(false)}>
                Join Tournament
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
