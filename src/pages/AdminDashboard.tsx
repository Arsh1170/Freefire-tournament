import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Shield, PlusCircle, Database, BarChart3, 
  AlertCircle, Send, Users, Key, MessageSquare, Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, getDocs, where, doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

export function AdminDashboard() {
  const [broadcasting, setBroadcasting] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleBroadcast = async () => {
    if (!roomId || !password) return;
    setBroadcasting(true);
    setStatus('Initializing broadcast protocol...');

    try {
      // 1. Get all registrations for Premium Clash Squad
      const q = query(collection(db, 'registrations'), where('tournamentId', '==', 'premium-clash-squad'));
      const snapshot = await getDocs(q);
      const players = snapshot.docs.map(doc => doc.data());

      setStatus(`Found ${players.length} registered soldiers. Transmitting...`);

      // 2. Save Room Credentials to Secrets
      await setDoc(doc(db, 'tournament_secrets', 'premium-clash-squad'), {
        tournamentId: 'premium-clash-squad',
        roomId,
        password,
        updatedAt: serverTimestamp()
      });

      // 3. Trigger Notifications for each player
      for (const player of players) {
        setStatus(`Notifying ${player.ffIgn}...`);
        
        // Fetch user email
        const userSnap = await getDocs(query(collection(db, 'users'), where('uid', '==', player.userId)));
        const userEmail = userSnap.docs[0]?.data()?.email;

        await fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'ROOM_DETAILS',
            data: {
              playerName: player.ffIgn,
              playerEmail: userEmail,
              whatsapp: player.whatsapp,
              tournamentName: 'PREMIUM CLASH SQUAD',
              roomId,
              password
            }
          })
        });
      }

      setStatus('Broadcast complete. All soldiers notified.');
      setRoomId('');
      setPassword('');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'registrations-broadcast');
      setStatus('Operational error in broadcast sequence.');
    } finally {
      setBroadcasting(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">MISSION <span className="text-red-600">CONTROL</span></h1>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-mono mt-2 flex items-center gap-2">
            <Shield size={12} className="text-luxury-gold" /> System Status: Optimal
          </p>
        </div>
        <div className="flex gap-4">
          <button className="bg-white/5 p-4 border border-white/10 hover:border-luxury-gold transition-colors">
            <Settings size={20} />
          </button>
          <button className="btn-luxury py-2 px-6 flex items-center gap-2">
            <PlusCircle size={20} /> NEW TOURNAMENT
          </button>
        </div>
      </div>

      {/* Broadcast Section */}
      <div className="mb-12 glass p-8 border-red-600/30 bg-red-600/5">
        <h2 className="text-xl font-black italic uppercase italic tracking-tighter mb-6 flex items-center gap-3">
          <Send className="text-red-500" /> PREMUM PROTOCOL: <span className="text-luxury-gold">ROOM BROADCAST</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-white/40 tracking-widest flex items-center gap-2">
              <Key size={12} /> Room ID
            </label>
            <input 
              type="text" 
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="ENTER ROOM ID"
              className="w-full bg-black/40 border border-white/10 p-3 text-sm font-bold uppercase tracking-widest focus:border-luxury-gold focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-white/40 tracking-widest flex items-center gap-2">
              <Shield size={12} /> Password
            </label>
            <input 
              type="text" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ENTER PASSWORD"
              className="w-full bg-black/40 border border-white/10 p-3 text-sm font-bold uppercase tracking-widest focus:border-luxury-gold focus:outline-none"
            />
          </div>
          <button 
            disabled={broadcasting || !roomId || !password}
            onClick={handleBroadcast}
            className="btn-luxury py-3 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {broadcasting ? <Loader2 className="animate-spin" /> : <><MessageSquare size={18} /> BROADCAST NOW</>}
          </button>
        </div>
        <AnimatePresence>
          {status && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-[10px] font-black uppercase tracking-widest text-red-500 animate-pulse"
            >
              [ SYSTEM ] {status}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Quick Stats */}
        <div className="lg:col-span-1 space-y-6">
          {[
            { label: 'Active Reports', value: '12', icon: AlertCircle, color: 'text-red-500' },
            { label: 'Database Load', value: '24%', icon: Database, color: 'text-luxury-gold' },
            { label: 'Revenue (24h)', value: '$12,450', icon: BarChart3, color: 'text-luxury-gold' },
          ].map((stat, i) => (
            <div key={i} className="glass p-6 flex items-center justify-between border-white/5">
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className={`text-2xl font-black font-mono ${stat.color}`}>{stat.value}</p>
              </div>
              <stat.icon className="opacity-20" size={32} />
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-3 space-y-8">
          <div className="glass p-8 border-white/5">
            <h3 className="text-sm font-black uppercase tracking-widest mb-8 border-b border-white/5 pb-4">Live Tournament Monitor</h3>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors border-l-2 border-luxury-gold cursor-pointer">
                  <div className="flex items-center gap-6">
                    <span className="text-[10px] font-mono text-white/40">#{1024 + i}</span>
                    <div>
                      <p className="text-sm font-black italic uppercase">Bermuda Pro Battle {i}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">Ongoing - 24/48 Players</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Status</p>
                      <span className="text-[10px] font-black uppercase text-red-500 animate-pulse">TRANSMITTING</span>
                    </div>
                    <button className="btn-outline px-4 py-2 text-[10px]">MANAGE</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass p-8 border-white/5">
              <h3 className="text-sm font-black uppercase tracking-widest mb-6">Security Logs</h3>
              <div className="space-y-4 font-mono text-[10px] opacity-40">
                <p>[12:04:12] AUTH_SUCCESS: ADMIN_01</p>
                <p>[11:58:45] DB_SYNC_COMPLETE: TOURN_ID_992</p>
                <p>[11:45:22] ALERT: INVALID_UID_ATTEMPT (UID: 124...)</p>
                <p>[11:30:10] SERVER_PING: 14ms (Optimal)</p>
              </div>
            </div>
            <div className="glass-gold p-8 border-luxury-gold/20 bg-luxury-gold/5 flex flex-col justify-center">
              <h3 className="text-luxury-gold text-lg font-black uppercase italic mb-4">SYSTEM BACKUP</h3>
              <p className="text-white/40 text-xs mb-6 uppercase tracking-widest leading-loose">Automated cloud snapshots are running every 60 minutes. Integrity verified.</p>
              <button className="w-full py-3 border border-luxury-gold/30 text-luxury-gold font-black uppercase tracking-[0.3em] text-[10px] hover:bg-luxury-gold hover:text-black transition-all">
                TRIGGER MANUAL SYNC
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
