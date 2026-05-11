import { Trophy, Users, Clock, Flame, Shield, Target, Loader2, CheckCircle2, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, addDoc, getDocs, where, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';
import { CheckoutModal } from '../components/CheckoutModal';

interface Tournament {
  id: string;
  title: string;
  type: string;
  entryFee: number;
  prizePool: number;
  status: string;
  currentPlayers: number;
  maxPlayers: number;
  startDate: string;
}

interface UserRegistration {
  id: string;
  tournamentId: string;
  userId: string;
  status: string;
}

export function Tournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [userRegistrations, setUserRegistrations] = useState<Record<string, UserRegistration>>({});
  const [loading, setLoading] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const { user } = useAuth();
  const [secrets, setSecrets] = useState<Record<string, { roomId: string, password: string }>>({});

  useEffect(() => {
    if (!user) return;

    // Fetch secrets for tournaments where user is verified
    const verifiedTourns = Object.values(userRegistrations)
      .filter((r: UserRegistration) => r.status === 'VERIFIED')
      .map((r: UserRegistration) => r.tournamentId);

    if (verifiedTourns.length === 0) return;

    const unsubscribes = verifiedTourns.map(tId => {
      return onSnapshot(doc(db, 'tournament_secrets', tId), (snap) => {
        if (snap.exists()) {
          setSecrets(prev => ({ ...prev, [tId]: snap.data() as any }));
        }
      });
    });

    return () => unsubscribes.forEach(unsub => unsub());
  }, [user, userRegistrations]);

  useEffect(() => {
    const q = query(collection(db, 'tournaments'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tournament));
      setTournaments(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'tournaments');
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'registrations'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const regs: Record<string, UserRegistration> = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data() as UserRegistration;
        regs[data.tournamentId] = { ...data, id: doc.id };
      });
      setUserRegistrations(regs);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'registrations-user');
    });

    return () => unsubscribe();
  }, [user]);

  const seedData = async () => {
    const demoTournaments = [
      { title: 'PLATINUM ELITE S4', type: 'SQUAD', entryFee: 20, prizePool: 10000, status: 'OPEN', currentPlayers: 42, maxPlayers: 48, startDate: 'MAY 15' },
      { title: 'GOLDEN DUO CUP', type: 'DUO', entryFee: 10, prizePool: 5000, status: 'FULL', currentPlayers: 50, maxPlayers: 50, startDate: 'MAY 12' },
      { title: 'SOLO ROGUE WAR', type: 'SOLO', entryFee: 5, prizePool: 1500, status: 'OPEN', currentPlayers: 88, maxPlayers: 100, startDate: 'MAY 10' },
    ];

    try {
      for (const t of demoTournaments) {
        await addDoc(collection(db, 'tournaments'), t);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'tournaments');
    }
  };

  const handleJoin = (tournament: Tournament) => {
    if (!user) {
      window.location.href = '/auth';
      return;
    }
    
    const reg = userRegistrations[tournament.id];
    if (reg) return; // Already registered

    setSelectedTournament(tournament);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="pt-32 pb-20 px-12 max-w-7xl mx-auto relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-red/5 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-l-4 border-luxury-red pl-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-luxury-gold text-xs font-bold uppercase tracking-[0.3em]">Operational Readiness</span>
            <div className="w-20 h-px bg-luxury-gold/50"></div>
          </div>
          <h1 className="text-6xl md:text-9xl font-black italic mb-4 uppercase leading-[0.85] tracking-tighter">THE <span className="text-stroke">ARENA</span></h1>
          <p className="text-white/40 uppercase tracking-[0.5em] text-xs font-bold font-mono">Satellite Deployment Active - Select Mission</p>
        </div>
        <div className="flex gap-4">
          <div className="glass px-8 py-6 border-white/5 flex flex-col items-center min-w-[180px]">
            <span className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-2">Total Prize Pool</span>
            <span className="text-4xl font-black text-luxury-gold italic tracking-tighter">$124,500</span>
          </div>
          {tournaments.length === 0 && !loading && (
            <button onClick={seedData} className="btn-outline px-6 py-2 text-[10px]">RECOVER DATA</button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 text-luxury-red gap-6">
          <Loader2 className="animate-spin" size={64} />
          <p className="uppercase tracking-[1em] text-xs font-black animate-pulse">Syncing with Mainframe...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {tournaments.map((t, i) => {
            const reg = userRegistrations[t.id];
            
            return (
              <motion.div 
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass group relative overflow-hidden flex flex-col md:flex-row border-white/5 hover:border-luxury-red/30 transition-all duration-500"
              >
                {/* Left Image Side */}
                <div className="w-full md:w-56 h-56 md:h-full bg-white/5 relative overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent z-10" />
                  <img 
                    src={`https://picsum.photos/seed/tourn${t.id}/600/600`} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    alt={t.title}
                  />
                  <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                    <span className={cn(
                      "px-3 py-1.5 text-[9px] font-black uppercase tracking-tighter italic shadow-xl",
                      t.status === 'OPEN' ? 'bg-luxury-red text-white' : 'bg-white/10 text-white/40'
                    )}>
                      {t.status}
                    </span>
                    {reg && (
                      <span className={cn(
                        "px-3 py-1.5 text-[9px] font-black uppercase tracking-tighter italic flex items-center gap-1.5",
                        reg.status === 'VERIFIED' ? 'bg-green-500 text-white' : 'bg-luxury-gold text-black'
                      )}>
                        {reg.status === 'VERIFIED' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                        {reg.status.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Info Side */}
                <div className="flex-grow p-10 flex flex-col justify-between relative">
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-luxury-red/5 skew-x-[45deg] group-hover:bg-luxury-red/10 transition-colors" />
                  
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-3xl font-black italic uppercase leading-tight tracking-tighter group-hover:text-luxury-red transition-colors">{t.title}</h3>
                      <div className="flex items-center gap-2 text-luxury-gold">
                        <Target size={16} className="animate-pulse" /> <span className="text-xs font-black tracking-widest">{t.type}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-6 mb-10 border-l border-white/10 pl-6">
                      <div>
                        <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] mb-1 font-bold">Entry Fee</p>
                        <p className="text-xl font-black italic tracking-tight">${t.entryFee}</p>
                      </div>
                      <div className="border-x border-white/10 px-6">
                        <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] mb-1 font-bold">Prize Pool</p>
                        <p className="text-xl font-black text-luxury-gold italic tracking-tight">${t.prizePool.toLocaleString()}</p>
                      </div>
                      <div className="pl-6">
                        <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] mb-1 font-bold">Starts</p>
                        <p className="text-xl font-black italic tracking-tight">{t.startDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {reg?.status === 'VERIFIED' && secrets[t.id] ? (
                      <div className="bg-luxury-red/10 border border-luxury-red/30 p-6 space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-luxury-red">
                          <span>MISSION SECRETS</span>
                          <Shield size={12} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-black/40 p-3 border border-white/5">
                            <p className="text-[8px] text-white/20 uppercase mb-1">Room ID</p>
                            <p className="text-sm font-black italic tracking-tight">{secrets[t.id].roomId}</p>
                          </div>
                          <div className="bg-black/40 p-3 border border-white/5">
                            <p className="text-[8px] text-white/20 uppercase mb-1">Password</p>
                            <p className="text-sm font-black italic tracking-tight">{secrets[t.id].password}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between text-[9px] font-bold text-white/40 uppercase tracking-widest">
                          <span>Infiltration Progress</span>
                          <span>{t.currentPlayers}/{t.maxPlayers}</span>
                        </div>
                        <div className="bg-white/5 h-1.5 w-full rounded-none overflow-hidden block">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(t.currentPlayers * 100 / t.maxPlayers)}%` }}
                            className="h-full bg-luxury-red"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <button 
                    onClick={() => handleJoin(t)}
                    disabled={t.status !== 'OPEN' || !!reg}
                    className={cn(
                      "w-full mt-10 py-5 uppercase tracking-[0.4em] text-[10px] font-black transition-all relative overflow-hidden group/btn",
                      t.status === 'OPEN' && !reg 
                        ? 'bg-luxury-red text-white hover:bg-white hover:text-black shadow-[0_0_20px_rgba(196,30,58,0.3)]' 
                        : reg?.status === 'VERIFIED'
                          ? 'bg-green-500/20 text-green-500 cursor-default border border-green-500/30'
                          : reg?.status === 'PAYMENT_PENDING'
                            ? 'bg-luxury-gold/10 text-luxury-gold cursor-default border border-luxury-gold/30'
                            : 'bg-white/5 text-white/10 cursor-not-allowed'
                    )}
                  >
                    <span className="relative z-10">
                      {reg?.status === 'VERIFIED' 
                        ? (secrets[t.id] ? 'MISSION DATA UNLOCKED' : 'AWAITING ROOM DATA') 
                        : reg?.status === 'PAYMENT_PENDING'
                          ? 'VERIFICATION PENDING'
                          : t.status === 'OPEN' ? 'INITIALIZE DEPLOYMENT' : 'ACCESS DENIED'
                      }
                    </span>
                    {t.status === 'OPEN' && !reg && (
                      <div className="absolute inset-0 bg-white transform translate-x-full group-hover/btn:translate-x-0 transition-transform skew-x-12" />
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {selectedTournament && (
        <CheckoutModal 
          isOpen={isCheckoutOpen} 
          onClose={() => {
            setIsCheckoutOpen(false);
            setSelectedTournament(null);
          }} 
          tournament={{
            id: selectedTournament.id,
            title: selectedTournament.title,
            entryFee: selectedTournament.entryFee,
            type: selectedTournament.type
          }}
        />
      )}
    </div>
  );
}

export function Results() { 
  return (
    <div className="pt-32 pb-20 px-12 max-w-7xl mx-auto">
      <div className="mb-16 border-l-4 border-luxury-gold pl-8">
        <h1 className="text-6xl md:text-8xl font-black italic mb-4 uppercase leading-[0.85] tracking-tighter">RECENT <span className="text-stroke">DATA</span></h1>
        <p className="text-white/40 uppercase tracking-[0.5em] text-xs font-bold font-mono">Archived Combat Records // Verified Victories</p>
      </div>

      <div className="space-y-6">
        {[1, 2, 3, 4, 5].map(i => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 items-center grid grid-cols-1 md:grid-cols-5 gap-8 border-white/5 hover:border-luxury-gold/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-luxury-gold/5 to-transparent skew-x-[30deg] pointer-events-none" />
            
            <div className="flex items-center gap-6">
              <span className="text-4xl font-black italic opacity-10 group-hover:opacity-40 transition-opacity">0{i}</span>
              <div className="h-10 w-px bg-white/10" />
              <div>
                <p className="text-sm font-black italic uppercase italic tracking-tight group-hover:text-luxury-gold transition-colors">Bermuda Pro League</p>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">MAY 0{i}, 2026</p>
              </div>
            </div>
            <div className="text-center md:text-left border-l border-white/5 pl-8">
              <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1 font-bold font-mono">Winner</p>
              <p className="text-sm font-black italic text-luxury-gold tracking-tight">TEAM_GOD_LEVEL</p>
            </div>
            <div className="text-center md:text-left border-l border-white/5 pl-8">
              <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1 font-bold font-mono">MVP</p>
              <p className="text-sm font-black italic uppercase tracking-tight">PLAYER_UNKNOWN</p>
            </div>
            <div className="text-center md:text-left border-l border-white/5 pl-8">
              <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1 font-bold font-mono">Total Kills</p>
              <p className="text-sm font-black italic uppercase tracking-tight">42 Kills</p>
            </div>
            <div className="flex justify-end">
              <button className="btn-outline px-8 py-3 text-[9px] font-black">REPLAY</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function PlayerProfile() { return <div className="pt-32 text-center"><h1>Profile Page</h1></div>; }
export function ClanRankings() { return <div className="pt-32 text-center"><h1>Clan Rankings</h1></div>; }
export function Store() { return <div className="pt-32 text-center"><h1>Rewards Store</h1></div>; }
export function Rules() { return <div className="pt-32 text-center"><h1>Rules Page</h1></div>; }
export function Contact() { return <div className="pt-32 text-center"><h1>Contact Page</h1></div>; }
export function AdminDashboard() { return <div className="pt-32 text-center"><h1>Admin Dashboard</h1></div>; }
