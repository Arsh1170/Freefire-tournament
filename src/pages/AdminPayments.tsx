import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, X, Search, Filter, Clock, 
  ExternalLink, User, Trophy, DollarSign,
  AlertCircle, ShieldCheck, Loader2
} from 'lucide-react';
import { db } from '../lib/firebase';
import { 
  collection, query, where, onSnapshot, 
  doc, updateDoc, serverTimestamp, 
  getDoc, increment, addDoc, setDoc, getDocs 
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

interface Transaction {
  id: string;
  userId: string;
  tournamentId: string;
  amount: number;
  method: string;
  status: string;
  transactionId: string;
  type: string;
  createdAt: any;
  paymentId?: string;
  orderId?: string;
  itemName?: string;
  itemId?: number;
  userEmail?: string; 
}

export function AdminPayments() {
  const { user, isAdmin } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'HISTORY' | 'ROOM_MGMT'>('PENDING');
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [roomData, setRoomData] = useState<{ [key: string]: { roomId: string, password: string } }>({});

  useEffect(() => {
    if (!isAdmin) return;

    if (activeTab === 'ROOM_MGMT') {
      const q = query(collection(db, 'tournaments'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setTournaments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      const q = activeTab === 'PENDING' 
        ? query(collection(db, 'transactions'), where('status', '==', 'PENDING'))
        : query(collection(db, 'transactions'), where('status', 'in', ['APPROVED', 'REJECTED']));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
        setTransactions(data.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
        setLoading(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'admin-transactions');
      });

      return () => unsubscribe();
    }
  }, [isAdmin, activeTab]);

  const handleUpdateRoom = async (tId: string) => {
    const data = roomData[tId];
    if (!data?.roomId || !data?.password) return;

    try {
      await setDoc(doc(db, 'tournament_secrets', tId), {
        tournamentId: tId,
        roomId: data.roomId,
        password: data.password,
        updatedAt: serverTimestamp()
      });
      alert('Room updated successfully');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'admin-room-update');
    }
  };

  const handleAction = async (transaction: Transaction, action: 'APPROVE' | 'REJECT') => {
    try {
      const transactionRef = doc(db, 'transactions', transaction.id);
      
      if (action === 'APPROVE') {
        // 1. Approve transaction
        await updateDoc(transactionRef, {
          status: 'APPROVED',
          updatedAt: serverTimestamp()
        });

        // 2. Update registration status
        const qReg = query(
          collection(db, 'registrations'), 
          where('transactionId', '==', transaction.id)
        );
        const regSnap = await getDocs(qReg);
        if (!regSnap.empty) {
          const regDoc = regSnap.docs[0];
          await updateDoc(doc(db, 'registrations', regDoc.id), {
            status: 'VERIFIED',
            updatedAt: serverTimestamp()
          });
        }

        // 3. Increment tournament slots if it was an entry fee
        if (transaction.type === 'ENTRY_FEE') {
          const tournRef = doc(db, 'tournaments', transaction.tournamentId);
          await updateDoc(tournRef, {
            currentPlayers: increment(1)
          });
        }

        // 4. Send notification
        await addDoc(collection(db, 'notifications'), {
          userId: transaction.userId,
          title: 'Payment Approved',
          message: `Your payment of $${transaction.amount} has been verified. Registration complete.`,
          type: 'PAYMENT_APPROVAL',
          read: false,
          createdAt: serverTimestamp()
        });

        // 5. Trigger final verification email
        try {
          const userSnap = await getDoc(doc(db, 'users', transaction.userId));
          const userData = userSnap.data();
          const tournSnap = await getDoc(doc(db, 'tournaments', transaction.tournamentId));
          const tournData = tournSnap.data();

          if (userData?.email) {
            await fetch('/api/notify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'PAYMENT_SUCCESS',
                data: {
                  playerName: userData.displayName || 'Warrior',
                  playerEmail: userData.email,
                  uid: userData.uid || transaction.userId,
                  tournamentName: tournData?.title || 'TOURNAMENT',
                  amount: transaction.amount,
                  transactionId: transaction.transactionId
                }
              })
            });
          }
        } catch (err) {
          console.error("Final notification failed", err);
        }
      } else {
        // Reject
        await updateDoc(transactionRef, {
          status: 'REJECTED',
          updatedAt: serverTimestamp()
        });

        const qReg = query(
          collection(db, 'registrations'), 
          where('transactionId', '==', transaction.id)
        );
        const regSnap = await getDocs(qReg);
        if (!regSnap.empty) {
          const regDoc = regSnap.docs[0];
          await updateDoc(doc(db, 'registrations', regDoc.id), {
            status: 'REJECTED',
            updatedAt: serverTimestamp()
          });
        }

        await addDoc(collection(db, 'notifications'), {
          userId: transaction.userId,
          title: 'Payment Rejected',
          message: `Your payment of $${transaction.amount} was rejected. Please check your transaction details.`,
          type: 'PAYMENT_APPROVAL',
          read: false,
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'admin-action');
    }
  };

  if (!isAdmin) {
    return (
      <div className="pt-40 text-center">
        <AlertCircle size={48} className="mx-auto text-luxury-red mb-6" />
        <h2 className="text-3xl font-black uppercase italic italic tracking-tighter">ACCESS <span className="text-luxury-red">DENIED</span></h2>
        <p className="text-white/40 uppercase tracking-widest text-xs mt-4">Authorized Admin Clearance Required</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-12 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-16 border-l-4 border-luxury-red pl-8">
        <div>
          <h1 className="text-6xl md:text-8xl font-black italic mb-4 uppercase leading-[0.85] tracking-tighter">COMMERCE <span className="text-stroke text-white/20">VAULT</span></h1>
          <p className="text-white/40 uppercase tracking-[0.5em] text-xs font-bold font-mono">Financial Verification Protocol // {activeTab} Records</p>
        </div>
        <div className="flex bg-white/5 p-1 border border-white/10">
          {(['PENDING', 'HISTORY', 'ROOM_MGMT'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === tab ? "bg-luxury-red text-white" : "text-white/40 hover:text-white"
              )}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 text-luxury-red gap-6">
          <Loader2 className="animate-spin" size={64} />
          <p className="uppercase tracking-[1em] text-xs font-black animate-pulse">Scanning Ledger...</p>
        </div>
      ) : activeTab === 'ROOM_MGMT' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tournaments.map(t => (
            <div key={t.id} className="glass p-8 border-white/10 space-y-6">
               <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black italic uppercase">{t.title}</h3>
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{t.type} // {t.status}</p>
                  </div>
                  <ShieldCheck size={24} className="text-luxury-gold" />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-white/20 tracking-widest">Room ID</label>
                    <input 
                      type="text"
                      value={roomData[t.id]?.roomId || ''}
                      onChange={(e) => setRoomData(prev => ({ ...prev, [t.id]: { ...prev[t.id], roomId: e.target.value } }))}
                      placeholder="ENTER ID"
                      className="w-full bg-white/5 border border-white/10 p-3 text-sm font-black uppercase focus:border-luxury-red outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-white/20 tracking-widest">Password</label>
                    <input 
                      type="text"
                      value={roomData[t.id]?.password || ''}
                      onChange={(e) => setRoomData(prev => ({ ...prev, [t.id]: { ...prev[t.id], password: e.target.value } }))}
                      placeholder="ENTER PASS"
                      className="w-full bg-white/5 border border-white/10 p-3 text-sm font-black uppercase focus:border-luxury-red outline-none"
                    />
                  </div>
               </div>

               <button 
                onClick={() => handleUpdateRoom(t.id)}
                className="w-full py-4 bg-white/10 hover:bg-luxury-red transition-all text-[10px] font-black uppercase tracking-widest"
               >
                 Deploy Room Data
               </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {transactions.length === 0 ? (
            <div className="glass p-20 text-center border-dashed border-white/10">
              <ShieldCheck size={48} className="mx-auto text-white/5 mb-6" />
              <p className="text-white/20 uppercase tracking-widest font-black italic">No {activeTab.toLowerCase()} transactions found</p>
            </div>
          ) : (
            transactions.map((tx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass p-8 border-white/5 group hover:border-white/10 transition-all flex flex-col md:flex-row gap-8 items-center"
              >
                <div className="flex items-center gap-6 md:w-1/4">
                  <div className="w-12 h-12 bg-white/5 flex items-center justify-center border border-white/10">
                    <DollarSign size={20} className="text-luxury-gold" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-tight italic">User_ID: {tx.userId.slice(0, 8)}</p>
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{tx.method} Payment</p>
                  </div>
                </div>

                <div className="hidden lg:block h-10 w-px bg-white/5" />

                <div className="flex-1 text-center md:text-left">
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">Transaction Ref</p>
                  <p className="text-sm font-mono font-black text-luxury-gold">{tx.paymentId || tx.transactionId || 'INTERNAL_WALLET'}</p>
                  {tx.method === 'RAZORPAY' && (
                    <p className="text-[8px] text-green-500 font-bold uppercase tracking-widest mt-1">[ OFFICIAL GATEWAY VERIFIED ]</p>
                  )}
                  {tx.itemName && (
                    <p className="text-[9px] text-white/60 uppercase font-bold mt-1">Item: {tx.itemName}</p>
                  )}
                </div>

                <div className="hidden lg:block h-10 w-px bg-white/5" />

                <div className="md:w-32 text-center md:text-left">
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">Amount</p>
                  <p className="text-2xl font-black italic tracking-tighter">${tx.amount}</p>
                </div>

                <div className="flex gap-4">
                  {tx.status === 'PENDING' && tx.method !== 'RAZORPAY' ? (
                    <>
                      <button 
                        onClick={() => handleAction(tx, 'REJECT')}
                        className="p-4 bg-white/5 border border-white/10 text-white/40 hover:bg-luxury-red hover:text-white hover:border-luxury-red transition-all"
                      >
                        <X size={20} />
                      </button>
                      <button 
                        onClick={() => handleAction(tx, 'APPROVE')}
                        className="p-4 bg-white/5 border border-white/10 text-white/40 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all"
                      >
                        <Check size={20} />
                      </button>
                    </>
                  ) : (
                    <span className={cn(
                      "px-6 py-2 text-[10px] font-black uppercase tracking-widest",
                      tx.status === 'APPROVED' ? 'bg-green-500/10 text-green-500' : 'bg-luxury-red/10 text-luxury-red'
                    )}>
                      {tx.status}
                    </span>
                  )}
                  <button className="p-4 bg-white/5 border border-white/10 text-white/40 hover:bg-white hover:text-black transition-all">
                    <ExternalLink size={20} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
