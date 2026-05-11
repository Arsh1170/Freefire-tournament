import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { 
  collection, addDoc, serverTimestamp, query, 
  where, getDocs, doc, getDoc, setDoc 
} from 'firebase/firestore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ShieldCheck, Smartphone, Globe, MessageSquare, 
  User, Hash, Trophy, Loader2, CheckCircle2, ArrowRight
} from 'lucide-react';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';
import { cn } from '../lib/utils';

export function PremiumRegistration() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get('tid') || 'premium-clash-squad';

  const [formData, setFormData] = useState({
    whatsapp: '',
    ffUid: '',
    ffIgn: '',
    teamName: '',
    region: 'INDIA',
    device: 'MOBILE'
  });

  const [loading, setLoading] = useState(true); // Start as loading to verify payment
  const [success, setSuccess] = useState(false);
  const [regId, setRegId] = useState('');
  const [error, setError] = useState('');
  const [paymentVerified, setPaymentVerified] = useState(false);

  const regions = ['INDIA', 'NEPAL', 'BANGLADESH', 'GLOBAL'];
  const devices = ['MOBILE', 'IPAD/TABLET', 'PC (EMULATOR)'];

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const checkPayment = async () => {
      try {
        const q = query(
          collection(db, 'transactions'),
          where('userId', '==', user.uid),
          where('status', '==', 'APPROVED'),
          where('type', '==', 'STORE_PURCHASE'),
          where('itemId', '==', 1) // ID 1 is the Battle Royal Pass
        );
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          setPaymentVerified(false);
          // Redirect back to store if no payment found
          setTimeout(() => navigate('/store'), 3000);
        } else {
          setPaymentVerified(true);
        }
      } catch (err) {
        console.error("Payment check failed", err);
      } finally {
        setLoading(false);
      }
    };

    checkPayment();
  }, [user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError('');

    try {
      // 1. Duplicate check (UID)
      const q = query(
        collection(db, 'registrations'), 
        where('tournamentId', '==', tournamentId),
        where('ffUid', '==', formData.ffUid)
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        throw new Error('This Free Fire UID is already registered for this tournament.');
      }

      // 2. Submit Registration
      const registrationId = `${user.uid}_${tournamentId}`;
      await setDoc(doc(db, 'registrations', registrationId), {
        userId: user.uid,
        tournamentId,
        ...formData,
        status: 'VERIFIED', // Directly verified if they came from a payment flow
        createdAt: serverTimestamp()
      });

      // 3. Notify Backend for Gmail/WhatsApp
      try {
        await fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'REGISTRATION_SUCCESS',
            data: {
              playerName: formData.ffIgn,
              playerEmail: user.email,
              whatsapp: formData.whatsapp,
              tournamentName: 'PREMIUM CLASH SQUAD',
              regId: registrationId
            }
          })
        });
      } catch (err) {
        console.error("Delayed notification failed", err);
      }

      setRegId(registrationId);
      setSuccess(true);
      
      // Auto-redirect to lobby after 3 seconds
      setTimeout(() => {
        navigate(`/lobby?tid=${tournamentId}&rid=${registrationId}`);
      }, 3500);

    } catch (err: any) {
      setError(err.message);
      handleFirestoreError(err, OperationType.WRITE, 'registrations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex flex-col items-center justify-center p-6 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
        <div className="relative z-10 text-center">
          <Loader2 className="animate-spin text-luxury-gold mx-auto mb-6" size={64} />
          <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">VERIFYING <span className="text-luxury-gold">PAYMENT...</span></h2>
          <p className="text-white/40 uppercase tracking-[0.4em] text-[10px] font-bold">Connecting to Secure Gateway Node</p>
        </div>
      </div>
    );
  }

  if (!paymentVerified) {
    return (
      <div className="min-h-screen bg-luxury-black flex flex-col items-center justify-center p-6 text-center">
        <div className="glass p-12 border-luxury-red/40 max-w-md">
          <div className="w-20 h-20 bg-luxury-red/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-luxury-red/50">
            <ShieldCheck size={40} className="text-luxury-red" />
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4 text-white">ACCESS <span className="text-luxury-red text-outline">DENIED</span></h2>
          <p className="text-[10px] text-white/40 uppercase font-black tracking-widest leading-loose mb-10">
            No verified payment record found for this mission. Purchase the Battle Pass to unlock deployment.
          </p>
          <button 
            onClick={() => navigate('/store')}
            className="w-full btn-luxury py-4 flex items-center justify-center gap-2"
          >
            GO TO STORE <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center p-6 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-red/20 via-transparent to-black" />
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 glass p-12 border-luxury-gold/30 text-center max-w-md w-full"
        >
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/50">
            <CheckCircle2 size={48} className="text-green-500" />
          </div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4 text-white">DEPOLOYMENT <span className="text-luxury-gold">READY</span></h2>
          <p className="text-white/60 text-xs font-black uppercase tracking-[0.3em] mb-8">Registration ID: {regId}</p>
          <div className="space-y-4">
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest leading-loose">
              Your details have been locked into the mainframe. Redirecting to the combat lobby...
            </p>
            <div className="flex justify-center">
              <Loader2 className="animate-spin text-luxury-gold" size={24} />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden bg-luxury-black">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-luxury-red/20 blur-[120px]" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-luxury-gold/10 blur-[120px]" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-4">
              PREMIUM <span className="text-luxury-gold text-outline">REGISTRATION</span>
            </h1>
            <p className="text-white/40 uppercase tracking-[0.5em] text-[10px] font-bold">Clash Squad Elite Protocol // Phase One</p>
          </motion.div>
          <div className="glass px-6 py-3 border-luxury-red/30 flex items-center gap-3">
            <div className="w-2 h-2 bg-luxury-red rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">Live Enrollment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Side */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass p-6 border-white/5 bg-white/5">
              <ShieldCheck className="text-luxury-gold mb-4" size={32} />
              <h3 className="text-sm font-black uppercase tracking-widest mb-2 italic">Elite Verification</h3>
              <p className="text-[10px] text-white/40 font-bold leading-relaxed tracking-wider uppercase">
                Only verified accounts can access the premium lobby. Spoofing or fake UIDs will result in a permanent ban.
              </p>
            </div>
            
            <div className="glass p-6 border-luxury-red/20 bg-luxury-red/5">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-red mb-4">Mission Brief</h3>
              <ul className="space-y-3">
                {['Daily 10:00 AM Start', 'Standard CS Rules', 'Prize: ₹450 MVP', 'Room ID via WhatsApp'].map((rule, i) => (
                  <li key={i} className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-white/60">
                    <div className="w-1 h-1 bg-luxury-red" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form Side */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* WhatsApp */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/40 tracking-widest flex items-center gap-2">
                  <MessageSquare size={12} /> WhatsApp Number
                </label>
                <input 
                  required
                  type="tel"
                  placeholder="+91 XXXX XXXX XX"
                  className="w-full bg-white/5 border border-white/10 p-4 text-sm font-bold uppercase tracking-widest focus:border-luxury-gold focus:outline-none transition-colors"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                />
              </div>

              {/* FF UID */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/40 tracking-widest flex items-center gap-2">
                  <Hash size={12} /> Free Fire UID
                </label>
                <input 
                  required
                  type="text"
                  placeholder="PLAYER UID (eg. 12345678)"
                  className="w-full bg-white/5 border border-white/10 p-4 text-sm font-bold uppercase tracking-widest focus:border-luxury-gold focus:outline-none transition-colors"
                  value={formData.ffUid}
                  onChange={(e) => setFormData({...formData, ffUid: e.target.value})}
                />
              </div>

              {/* FF IGN */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/40 tracking-widest flex items-center gap-2">
                  <User size={12} /> In-Game Name
                </label>
                <input 
                  required
                  type="text"
                  placeholder="D-LEADER_77"
                  className="w-full bg-white/5 border border-white/10 p-4 text-sm font-bold uppercase tracking-widest focus:border-luxury-gold focus:outline-none transition-colors"
                  value={formData.ffIgn}
                  onChange={(e) => setFormData({...formData, ffIgn: e.target.value})}
                />
              </div>

              {/* Team Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/40 tracking-widest flex items-center gap-2">
                  <Trophy size={12} /> Team Name (Optional)
                </label>
                <input 
                  type="text"
                  placeholder="SOUL ESPORTS"
                  className="w-full bg-white/5 border border-white/10 p-4 text-sm font-bold uppercase tracking-widest focus:border-luxury-gold focus:outline-none transition-colors"
                  value={formData.teamName}
                  onChange={(e) => setFormData({...formData, teamName: e.target.value})}
                />
              </div>

              {/* Region */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/40 tracking-widest flex items-center gap-2">
                  <Globe size={12} /> Combat Region
                </label>
                <div className="flex gap-2">
                  {regions.map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFormData({...formData, region: r})}
                      className={cn(
                        "flex-1 py-3 text-[9px] font-black uppercase tracking-widest border transition-all",
                        formData.region === r ? "bg-luxury-gold border-luxury-gold text-black" : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Device */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/40 tracking-widest flex items-center gap-2">
                  <Smartphone size={12} /> Hardware Module
                </label>
                <div className="flex gap-2">
                  {devices.map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setFormData({...formData, device: d})}
                      className={cn(
                        "flex-1 py-3 text-[9px] font-black uppercase tracking-widest border transition-all",
                        formData.device === d ? "bg-luxury-red border-luxury-red text-white" : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                      )}
                    >
                      {d.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-bold uppercase tracking-widest">
                ERROR: {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-luxury-red hover:bg-red-700 text-white font-black uppercase tracking-[0.4em] text-xs flex items-center justify-center gap-4 transition-all group overflow-hidden relative"
            >
              <div className="absolute inset-0 w-24 bg-white/20 -skew-x-[30deg] -translate-x-full group-hover:translate-x-[600px] transition-transform duration-1000" />
              {loading ? <Loader2 className="animate-spin" /> : <>FINALIZE ENROLLMENT <ArrowRight size={20} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
