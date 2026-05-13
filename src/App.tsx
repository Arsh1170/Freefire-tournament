/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Tournaments, Results } from './pages/Tournaments';
import { Leaderboards } from './pages/Leaderboards';
import { LiveMatches } from './pages/LiveMatches';
import { RegisterTeam } from './pages/RegisterTeam';
import { AdminPayments } from './pages/AdminPayments';
import { Store, PlayerProfile } from './pages/PlayerProfile';
import { ClanRankings, Rules, Contact } from './pages/ClanRanking';
import { Auth } from './pages/Auth';
import { AuthProvider } from './context/AuthContext';
import { PremiumRegistration } from './pages/PremiumRegistration';
import { WaitingLobby } from './pages/WaitingLobby';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-luxury-black text-white selection:bg-luxury-gold selection:text-black flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tournaments" element={<Tournaments />} />
              <Route path="/register" element={<RegisterTeam />} />
              <Route path="/live" element={<LiveMatches />} />
              <Route path="/leaderboards" element={<Leaderboards />} />
              <Route path="/results" element={<Results />} />
              <Route path="/profile" element={<PlayerProfile />} />
              <Route path="/clans" element={<ClanRankings />} />
              <Route path="/store" element={<Store />} />
              <Route path="/rules" element={<Rules />} /> 
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin/payments" element={<AdminPayments />} />
              <Route path="/registration" element={<PremiumRegistration />} />
              <Route path="/lobby" element={<WaitingLobby />} />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
