import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Star, Zap, Diamond, ShieldCheck, 
  Info, X, QrCode, Smartphone, Copy, 
  CheckCircle2, ArrowRight, Crown, Wallet, 
  LogOut, Clock, Loader2 
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { 
  collection, query, where, onSnapshot, 
  addDoc, serverTimestamp 
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';
import { cn } from '../lib/utils';

const storeItems = [
  { 
    id: 1, 
    name: 'BATTLE ROYAL PASS', 
    price: 100, 
    priceDisplay: '₹100',
    type: 'Win the clash squad match to receive the pass', 
    icon: ShieldCheck, 
    rarity: 'ELITE',
    tooltip: 'The battle pass will be given to the mvp player'
  },
];

export function Store() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'PAY' | 'SUCCESS'>('PAY');

  const upiId = "ad2101492-1@okhdfcbank";
  const upiName = "C__M KILLER";

  const [razorpayKey, setRazorpayKey] = useState("");

  useEffect(() => {
    fetch("/api/keys/razorpay")
      .then(res => res.json())
      .then(data => setRazorpayKey(data.keyId))
      .catch(err => console.error("Failed to load Razorpay key", err));
  }, []);

  const handlePurchase = async () => {
    if (!selectedItem || !user || !profile) return;
    setLoading(true);

    try {
      // 1. Create order on backend
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedItem.price,
          currency: "INR"
        })
      });
      const order = await orderRes.json();

      if (!order.id) {
        throw new Error(order.error || "Order creation failed");
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: "IGNIS ESPORTS",
        description: `Purchase: ${selectedItem.name}`,
        order_id: order.id,
        handler: async (response: any) => {
          // 3. Verify payment on backend
          setLoading(true);
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            const verifyData = await verifyRes.json();

            if (verifyData.verified) {
              // 4. Record successful payment in Firebase
              await addDoc(collection(db, "transactions"), {
                userId: user.uid,
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount: selectedItem.price,
                itemName: selectedItem.name,
                itemId: selectedItem.id,
                status: "APPROVED",
                type: "STORE_PURCHASE",
                method: "RAZORPAY",
                createdAt: serverTimestamp()
              });

              // Optional: Send Email Notification
              await fetch('/api/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  type: 'PAYMENT_SUCCESS',
                  data: {
                    playerName: profile.displayName,
                    playerEmail: user.email,
                    tournamentName: selectedItem.name,
                    transactionId: response.razorpay_payment_id,
                    amount: selectedItem.price,
                    uid: user.uid
                  }
                })
              });

              setStep("SUCCESS");
            } else {
              alert("Payment verification failed! Potential fraud detected.");
            }
          } catch (err) {
            console.error("Verification error", err);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: profile.displayName,
          email: user.email,
        },
        theme: {
          color: "#c41e3a"
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          }
        }
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.error("Payment initiation failed", err);
      alert("System error. Payment could not be initiated.");
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-16 underline-offset-8">
        <div>
          <h1 className="text-6xl font-black italic">ELITE <span className="text-luxury-gold">VAULT</span></h1>
          <p className="text-white/40 uppercase tracking-[0.4em] text-xs font-bold font-mono mt-4">Exchange your victory tokens for legendary assets</p>
        </div>
        <div className="glass px-8 py-4 border-luxury-gold/30">
          <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Your Tokens</p>
          <p className="text-2xl font-mono font-black text-luxury-gold">{profile?.coins || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {storeItems.map((item, i) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 border-white/5 group hover:border-luxury-gold transition-all duration-500 flex flex-col text-center"
          >
            <div className="mb-8 flex justify-center relative group/info">
              <div className="w-24 h-24 bg-white/5 flex items-center justify-center rounded-none border border-white/10 group-hover:bg-luxury-gold group-hover:text-black transition-all duration-500">
                <item.icon size={48} />
              </div>
              {item.tooltip && (
                <div className="absolute -top-1 -right-1">
                   <div className="relative group">
                      <button className="p-1 bg-white/10 hover:bg-luxury-red transition-colors">
                        <Info size={12} className="text-white/60" />
                      </button>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-black border border-white/10 text-[10px] font-bold uppercase tracking-widest leading-relaxed opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 text-center">
                        {item.tooltip}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black" />
                      </div>
                   </div>
                </div>
              )}
            </div>
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-luxury-gold mb-2">{item.rarity}</span>
            <h3 className="text-xl font-black italic uppercase mb-2 tracking-tighter">{item.name}</h3>
            <p className="text-white/60 text-[10px] uppercase font-bold tracking-widest mb-8 px-4 leading-relaxed">{item.type}</p>
            
            <div className="mt-auto pt-8 border-t border-white/5">
              <div className="flex justify-center items-center gap-2 mb-6">
                <span className="text-2xl font-mono font-black">{item.priceDisplay}</span>
              </div>
              <button 
                onClick={() => setSelectedItem(item)}
                className="w-full btn-luxury py-3 flex items-center justify-center gap-2"
              >
                <ShoppingBag size={18} /> PURCHASE
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-luxury-black border border-white/10 p-8 shadow-2xl"
            >
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 text-white/40 hover:text-white"
              >
                <X size={24} />
              </button>

              {step === 'PAY' ? (
                <div className="space-y-8">
                  <div className="text-center">
                     <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">COMPLETE <span className="text-luxury-gold">PURCHASE</span></h3>
                     <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold font-mono">Item: {selectedItem.name}</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-luxury-gold/10 flex items-center justify-center border border-luxury-gold/50 mb-6">
                      <selectedItem.icon size={48} className="text-luxury-gold" />
                    </div>
                    
                    <div className="text-center mb-8">
                      <p className="text-4xl font-black italic tracking-tighter text-white mb-2">{selectedItem.priceDisplay}</p>
                      <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">Authorized Razorpay Payment Secure Flow</p>
                    </div>

                    <div className="w-full space-y-4">
                      <div className="glass p-4 border-white/5 bg-white/5">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[8px] text-white/40 uppercase font-black tracking-widest">Player Identified</span>
                          <span className="text-[10px] font-bold text-white uppercase">{profile?.displayName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] text-white/40 uppercase font-black tracking-widest">Security Status</span>
                          <span className="text-[10px] font-bold text-green-500 uppercase">Verified</span>
                        </div>
                      </div>

                      <button 
                        onClick={handlePurchase}
                        disabled={loading}
                        className="w-full bg-luxury-red py-6 flex items-center justify-center gap-4 text-white text-[12px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-[0_0_30px_rgba(196,30,58,0.3)]"
                      >
                        {loading ? <Loader2 className="animate-spin" size={24} /> : <>SECURE PAY NOW <ArrowRight size={20} /></>}
                      </button>

                      <p className="text-center text-[8px] text-white/20 uppercase font-bold tracking-widest">
                        By clicking Pay Now, you agree to the deployment terms & conditions.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/50">
                    <CheckCircle2 size={40} className="text-green-500" />
                  </div>
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4 text-green-500">PAYMENT SENT</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] font-bold max-w-sm mx-auto leading-loose mb-12 italic">
                    Your request for the Battle Pass is being verified. Click below to complete your tournament registration.
                  </p>
                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={() => navigate('/registration?tid=premium-clash-squad')}
                      className="w-full py-6 bg-luxury-gold text-black text-[12px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all flex items-center justify-center gap-3"
                    >
                      COMPLETE REGISTRATION <ArrowRight size={20} />
                    </button>
                    <button 
                      onClick={() => { setSelectedItem(null); setStep('PAY'); setTransactionId(''); }}
                      className="w-full py-4 border border-white/10 hover:border-white transition-colors text-[10px] font-black uppercase tracking-widest text-white/40 font-bold"
                    >
                      GO BACK TO STORE
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function PlayerProfile() {
  const { user, profile } = useAuth();
  const [registrations, setRegistrations] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'registrations'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRegistrations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'profile-registrations');
    });
    return () => unsubscribe();
  }, [user]);

  if (!user || !profile) return (
    <div className="pt-40 text-center">
      <Loader2 className="animate-spin mx-auto text-luxury-red mb-6" size={48} />
      <p className="uppercase tracking-[1em] text-xs font-black">Syncing Player Data...</p>
    </div>
  );

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="glass p-8 text-center border-luxury-red/20 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-luxury-red" />
            
            {profile.isVip && (
              <div className="absolute top-4 right-4 animate-pulse">
                <Crown className="text-luxury-gold" size={24} />
              </div>
            )}

            <div className="w-40 h-40 mx-auto mb-6 border-4 border-white/5 p-2 bg-luxury-black relative overflow-hidden">
               <img src={user.photoURL || ''} alt="Profile" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
               <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 to-transparent" />
            </div>

            <h2 className="text-3xl font-black italic uppercase tracking-tighter">{profile.displayName}</h2>
            <p className={cn(
              "font-mono text-[10px] uppercase tracking-[0.4em] mt-2",
              profile.isVip ? "text-luxury-gold" : "text-white/40"
            )}>
              {profile.isVip ? `ELITE VIP ${profile.membershipType}` : `${profile.rank} OPERATIVE`}
            </p>
            
            <div className="flex gap-4 justify-center mt-10">
              <div className="glass px-6 py-4 border-white/5 flex-1">
                <p className="text-[8px] text-white/40 uppercase font-bold tracking-widest mb-1">Rank Status</p>
                <p className="text-sm font-black italic text-luxury-red">{profile.rank}</p>
              </div>
              <div className="glass px-6 py-4 border-white/5 flex-1">
                <p className="text-[8px] text-white/40 uppercase font-bold tracking-widest mb-1">Victory Points</p>
                <p className="text-sm font-black italic text-luxury-gold">{profile.coins}</p>
              </div>
            </div>

            <button className="w-full btn-luxury mt-8 py-4 flex items-center justify-center gap-2 group">
              <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> 
              SECURE LOGOUT
            </button>
          </div>

          <div className="glass p-8 border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-luxury-gold">Esports Wallet</h4>
              <button className="text-[9px] text-white/40 hover:text-white uppercase font-bold tracking-widest">Add Funds</button>
            </div>
            <div className="bg-white/5 p-6 border border-white/10 relative overflow-hidden mb-6">
               <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Wallet size={48} />
               </div>
               <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-2">Available Balance</p>
               <p className="text-4xl font-black italic tracking-tighter">${profile.walletBalance?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-[9px] font-black uppercase tracking-widest transition-all">Withdraw</button>
              <button className="py-3 bg-luxury-red text-white text-[9px] font-black uppercase tracking-widest transition-all">Manage VIP</button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { label: 'Total Matches', value: profile.matches },
              { label: 'Win Rate', value: `${profile.winRate}%` },
              { label: 'K/D Ratio', value: profile.kd },
            ].map((s, i) => (
              <div key={i} className="glass p-8 border-white/5">
                <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] mb-2">{s.label}</p>
                <p className="text-4xl font-black text-white italic tracking-tighter">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="glass p-10 border-white/5">
            <h3 className="text-xl font-black uppercase italic mb-8 border-b border-white/10 pb-4">Tournament History</h3>
            <div className="space-y-4">
              {registrations.length === 0 ? (
                <div className="py-12 text-center text-white/20 uppercase text-xs font-black tracking-widest italic">
                   No recent deployments recorded
                </div>
              ) : (
                registrations.map((reg, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-white/5 border-l-4 border-luxury-red">
                    <div className="flex items-center gap-8">
                      <div className="text-luxury-red">
                         {reg.status === 'VERIFIED' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                      </div>
                      <div>
                        <p className="text-sm font-black italic uppercase tracking-tight">Mission_ID: {reg.tournamentId.slice(0, 8)}</p>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{reg.status.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-white/20 font-mono mb-1">DATE_RECORDED</p>
                      <p className="text-xs font-black italic">{new Date(reg.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

