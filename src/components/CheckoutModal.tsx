import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Check, Wallet, QrCode, Smartphone, 
  ChevronRight, ArrowRight, ShieldCheck, 
  CreditCard, AlertCircle, Copy, CheckCircle2,
  Clock, Flame, Crown, Gift
} from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournament: {
    id: string;
    title: string;
    entryFee: number;
    type: string;
  };
}

type PaymentMethod = 'UPI' | 'QR' | 'WALLET';

export function CheckoutModal({ isOpen, onClose, tournament }: CheckoutModalProps) {
  const { user, profile } = useAuth();
  const [step, setStep] = useState<'SELECT' | 'PAYING' | 'VERIFYING' | 'SUCCESS'>('SELECT');
  const [method, setMethod] = useState<PaymentMethod>('UPI');
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upiId = "ad2101492-1@okhdfcbank"; // Updated UPI ID
  const upiName = "C__M KILLER";

  const getUpiUrl = (app?: string) => {
    const baseUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${tournament.entryFee}&tn=${encodeURIComponent(`Entry for ${tournament.title} | Player: ${profile?.uid}`)}&cu=INR`;
    if (!app) return baseUrl;
    // Some apps might need specific prefixes, but standard upi:// usually works across apps
    return baseUrl;
  };

  const notifyAdmin = async (txId: string) => {
    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'PAYMENT_SUCCESS',
          data: {
            playerName: profile?.displayName || user?.displayName || 'Unknown',
            playerEmail: user?.email,
            uid: profile?.uid || user?.uid,
            tournamentName: tournament.title,
            amount: tournament.entryFee,
            transactionId: txId
          }
        })
      });
    } catch (err) {
      console.error("Notification failed", err);
    }
  };

  const handleWalletPayment = async () => {
    if (!profile || profile.walletBalance < tournament.entryFee) {
      setError('Insufficient wallet balance. Please top up or use UPI.');
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, 'users', auth.currentUser!.uid);
      await updateDoc(userRef, {
        walletBalance: increment(-tournament.entryFee)
      });

      const transactionRef = await addDoc(collection(db, 'transactions'), {
        userId: auth.currentUser!.uid,
        tournamentId: tournament.id,
        amount: tournament.entryFee,
        method: 'WALLET',
        status: 'APPROVED',
        type: 'ENTRY_FEE',
        createdAt: serverTimestamp()
      });

      const registrationId = `${auth.currentUser!.uid}_${tournament.id}`;
      await setDoc(doc(db, 'registrations', registrationId), {
        userId: auth.currentUser!.uid,
        tournamentId: tournament.id,
        transactionId: transactionRef.id,
        status: 'VERIFIED',
        createdAt: serverTimestamp()
      });

      const tournamentRef = doc(db, 'tournaments', tournament.id);
      await updateDoc(tournamentRef, {
        currentPlayers: increment(1)
      });

      await notifyAdmin('WALLET_TX');
      setStep('SUCCESS');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'checkout-wallet');
      setError('Wallet transaction failed. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProof = async () => {
    if (!transactionId || transactionId.length < 10) {
      setError('Please enter a valid Transaction ID.');
      return;
    }

    setLoading(true);
    setStep('VERIFYING');

    // Simulated "AI Verification Bot" delay
    await new Promise(resolve => setTimeout(resolve, 3500));

    try {
      const transactionRef = await addDoc(collection(db, 'transactions'), {
        userId: auth.currentUser!.uid,
        tournamentId: tournament.id,
        amount: tournament.entryFee,
        method: method,
        status: 'PENDING',
        transactionId: transactionId,
        type: 'ENTRY_FEE',
        createdAt: serverTimestamp()
      });

      const registrationId = `${auth.currentUser!.uid}_${tournament.id}`;
      await setDoc(doc(db, 'registrations', registrationId), {
        userId: auth.currentUser!.uid,
        tournamentId: tournament.id,
        transactionId: transactionRef.id,
        status: 'PAYMENT_PENDING',
        createdAt: serverTimestamp()
      });

      await notifyAdmin(transactionId);
      setStep('SUCCESS');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'checkout-upi');
      setError('Submission failed. Please check your connection.');
      setStep('PAYING');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/95 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-luxury-grey border border-white/10 overflow-hidden shadow-[0_0_100px_rgba(196,30,58,0.2)]"
          >
            {/* Design Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-red/5 -skew-x-[45deg] translate-x-16 -translate-y-16" />
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-luxury-red via-transparent to-transparent" />

            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between relative">
              <div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">SECURE <span className="text-luxury-red text-stroke">CHECKOUT</span></h3>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] font-bold mt-1">Order Ref: {tournament.id.slice(0, 8)}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 transition-colors text-white/40 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              {step === 'SELECT' && (
                <div className="space-y-8">
                  <div className="bg-white/5 p-6 border border-white/10 relative group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[10px] font-black uppercase text-luxury-gold tracking-widest mb-1">Missions Protocol</p>
                        <h4 className="text-xl font-black uppercase italic tracking-tight">{tournament.title}</h4>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">Entry Fee</p>
                        <p className="text-2xl font-black italic text-luxury-gold">${tournament.entryFee}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                       <span className="px-3 py-1 bg-white/5 text-[9px] font-bold uppercase tracking-widest text-white/60">{tournament.type} MATCH</span>
                       <span className="px-3 py-1 bg-luxury-red/10 text-[9px] font-bold uppercase tracking-widest text-luxury-red">SLOT_LOCKED</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <button 
                      onClick={() => { setMethod('UPI'); setStep('PAYING'); }}
                      className="group p-6 bg-white/5 border border-white/10 hover:border-luxury-red transition-all text-center"
                    >
                      <Smartphone className="mx-auto mb-4 text-white/40 group-hover:text-luxury-red" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Instant UPI</p>
                    </button>
                    <button 
                       onClick={() => { setMethod('QR'); setStep('PAYING'); }}
                      className="group p-6 bg-white/5 border border-white/10 hover:border-luxury-red transition-all text-center"
                    >
                      <QrCode className="mx-auto mb-4 text-white/40 group-hover:text-luxury-red" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Scan QR</p>
                    </button>
                    <button 
                      onClick={() => { setMethod('WALLET'); handleWalletPayment(); }}
                      disabled={!profile || profile.walletBalance < tournament.entryFee}
                      className="group p-6 bg-white/5 border border-white/10 hover:border-luxury-gold transition-all text-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Wallet className="mx-auto mb-4 text-white/40 group-hover:text-luxury-gold" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Esports Wallet</p>
                      <p className="text-[9px] text-white/40 mt-1 uppercase font-bold">${profile?.walletBalance || 0} Bal</p>
                    </button>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-luxury-red/5 border border-luxury-red/20">
                    <ShieldCheck size={20} className="text-luxury-red shrink-0" />
                    <p className="text-[9px] uppercase leading-relaxed text-white/40 font-bold tracking-wider">
                      Payments are processed through a 256-bit encrypted secure tunnel. Identity theft or fraudulent transaction ID submission leads to permanent device-level banning.
                    </p>
                  </div>
                </div>
              )}

              {step === 'PAYING' && (
                <div className="space-y-8">
                  {method === 'QR' ? (
                    <div className="flex flex-col items-center">
                      <div className="w-56 h-56 bg-white p-4 mb-6 relative">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(getUpiUrl())}`} 
                          alt="Payment QR" 
                          className="w-full h-full"
                        />
                        <div className="absolute inset-0 border-[10px] border-black/5 pointer-events-none" />
                      </div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] mb-2 text-luxury-gold text-center">Scan to Pay via any App</p>
                      <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest text-center">GPay, PhonePe, Paytm, Amazon Pay</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-white/5 p-8 border border-white/10 text-center relative overflow-hidden group">
                        <p className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em] mb-4">Official Payment Protocol</p>
                        <div className="flex items-center justify-center gap-4">
                          <p className="text-2xl font-black italic tracking-tight text-luxury-gold">{upiId}</p>
                          <button 
                            onClick={() => { navigator.clipboard.writeText(upiId); }}
                            className="p-3 bg-white/5 hover:bg-luxury-red transition-colors text-white/40 hover:text-white"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                          { name: 'Google Pay', icon: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Google_Pay_%28GPay%29_Logo.svg' },
                          { name: 'PhonePe', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg' },
                          { name: 'Paytm', icon: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg' },
                          { name: 'BHIM', icon: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/BHIM_Logo.png' }
                        ].map(app => (
                          <a 
                            key={app.name}
                            href={getUpiUrl()} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex flex-col items-center gap-2 p-3 bg-white/5 border border-white/5 hover:border-white/20 transition-all group"
                          >
                            <img src={app.icon} className="w-8 h-8 object-contain gray-scale group-hover:grayscale-0 transition-all" alt={app.name} />
                            <span className="text-[8px] font-black uppercase tracking-tighter text-white/40 group-hover:text-white">{app.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-white/40 tracking-widest">Transaction Verification Token (UTR)</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="ENTER 12-DIGIT TRANSACTION ID"
                        className="w-full bg-white/5 border border-white/10 p-5 text-sm font-black uppercase tracking-widest focus:border-luxury-red focus:outline-none transition-colors"
                      />
                      {transactionId.length >= 10 && <CheckCircle2 size={20} className="absolute right-5 top-5 text-green-500" />}
                    </div>
                    {error && <p className="text-[10px] text-luxury-red font-bold uppercase tracking-widest animate-pulse">{error}</p>}
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setStep('SELECT')}
                      className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-[0.3em] transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handleSubmitProof}
                      disabled={loading || transactionId.length < 10}
                      className="flex-3 btn-luxury py-5 group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {loading ? 'Initializing...' : 'Confirm Submission'}
                        {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {step === 'VERIFYING' && (
                <div className="py-20 text-center space-y-12">
                   <div className="relative w-32 h-32 mx-auto">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-t-2 border-luxury-red rounded-full"
                      />
                      <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-4 border-b-2 border-luxury-gold rounded-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <ShieldCheck className="text-white/20" size={32} />
                      </div>
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter">AI <span className="text-luxury-red">VERIFICATION</span> BOT</h3>
                      <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] font-bold animate-pulse">Syncing with Banking Gateway...</p>
                   </div>
                   <div className="max-w-xs mx-auto space-y-2">
                       <div className="h-1 w-full bg-white/5 overflow-hidden">
                          <motion.div 
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="h-full w-1/2 bg-luxury-red"
                          />
                       </div>
                       <p className="text-[8px] text-white/20 font-mono">ENCRYPTED_SIGNATURE_MATCHING...</p>
                   </div>
                </div>
              )}

              {step === 'SUCCESS' && (
                <div className="py-12 text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/50"
                  >
                    <Check size={48} className="text-green-500" />
                  </motion.div>
                  <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-4">DEPLOYMENT <span className="text-green-500">INITIATED</span></h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] font-bold max-w-sm mx-auto leading-loose mb-12">
                    {method === 'WALLET' 
                      ? 'Payment verified via wallet balance. You are now officially registered.'
                      : 'Payment proof received. Our tactical agents are verifying your UTR. Approval typically takes 5-15 minutes.'
                    }
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                    <button 
                      onClick={onClose}
                      className="py-4 border border-white/10 hover:border-white transition-colors text-[10px] font-black uppercase tracking-widest"
                    >
                      Done
                    </button>
                    <button className="py-4 bg-white text-black hover:bg-luxury-red hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
                      View Missions
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-black/40 border-t border-white/5 flex justify-between items-center text-[8px] uppercase font-mono text-white/20">
              <div className="flex gap-6">
                 <span className="flex items-center gap-2"><CreditCard size={12} /> PCI-DSS COMPLIANT</span>
                 <span className="flex items-center gap-2"><Lock size={12} className="" /> SSL ENCRYPTED</span>
              </div>
              <span className="animate-pulse">Session_Secure</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Lock({ size, className }: { size: number, className: string }) {
  return <ShieldCheck size={size} className={className} />;
}
