import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import { SoundProvider, NavSoundListener } from './hooks/useSound';
import { Layout } from './components/Layout';
import { StaffRoute } from './components/StaffRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Progress from './pages/Progress';
import Store from './pages/Store';
import Inventory from './pages/Inventory';
import Achievements from './pages/Achievements';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Cashier from './pages/Cashier';
import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminMembers from './pages/admin/AdminMembers';
import AdminCodes from './pages/admin/AdminCodes';
import AdminRewards from './pages/admin/AdminRewards';
import AdminLogs from './pages/admin/AdminLogs';
import AdminSettings from './pages/admin/AdminSettings';
import AdminSecurity from './pages/admin/AdminSecurity';
import AdminOrders from './pages/admin/AdminOrders';
import AdminRoles from './pages/admin/AdminRoles';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminContent from './pages/admin/AdminContent';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import Redeem from './pages/Redeem';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import GamesHub from './pages/games/GamesHub';
import SpinWheel from './pages/games/SpinWheel';
import TicTacToe from './pages/games/TicTacToe';
import CafeMatch from './pages/games/CafeMatch';
import CoffeeCatch from './pages/games/CoffeeCatch';
import MemoryGame from './pages/games/MemoryGame';
import CafeQuiz from './pages/games/CafeQuiz';
import { DemoRoleToggle } from './components/DemoRoleToggle';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner className="min-h-screen" />;
  if (!user) return <Navigate to="/giris" replace />;
  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner className="min-h-screen" />;
  if (user) {
    const isAdmin = user.email === 'admin@nesve.com' || user.id === 'demo-admin-id';
    return <Navigate to={isAdmin ? '/admin-panel' : '/dashboard'} replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/giris" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/kayit" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/auth" element={<Navigate to="/giris" replace />} />
      <Route path="/hakkimizda" element={<About />} />
      <Route path="/iletisim" element={<Contact />} />
      <Route path="/gizlilik" element={<Privacy />} />
      <Route path="/kullanim-kosullari" element={<Terms />} />
      <Route path="/admin-panel" element={<ProtectedRoute><Layout><AdminLayout /></Layout></ProtectedRoute>}>
        <Route index element={<AdminOverview />} />
        <Route path="uyeler" element={<AdminMembers />} />
        <Route path="kodlar" element={<AdminCodes />} />
        <Route path="oduller" element={<AdminRewards />} />
        <Route path="kayitlar" element={<AdminLogs />} />
        <Route path="ayarlar" element={<AdminSettings />} />
        <Route path="guvenlik" element={<AdminSecurity />} />
        <Route path="siparisler" element={<AdminOrders />} />
        <Route path="roller" element={<AdminRoles />} />
        <Route path="bildirimler" element={<AdminNotifications />} />
        <Route path="icerik" element={<AdminContent />} />
      </Route>
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/progress" element={<ProtectedRoute><Layout><Progress /></Layout></ProtectedRoute>} />
      <Route path="/store" element={<ProtectedRoute><Layout><Store /></Layout></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute><Layout><Inventory /></Layout></ProtectedRoute>} />
      <Route path="/achievements" element={<ProtectedRoute><Layout><Achievements /></Layout></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><Layout><Leaderboard /></Layout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
      <Route path="/kod" element={<ProtectedRoute><Layout><Redeem /></Layout></ProtectedRoute>} />
      <Route path="/oyunlar" element={<ProtectedRoute><Layout><GamesHub /></Layout></ProtectedRoute>} />
      <Route path="/oyunlar/cark" element={<ProtectedRoute><Layout><SpinWheel /></Layout></ProtectedRoute>} />
      <Route path="/oyunlar/xo" element={<ProtectedRoute><Layout><TicTacToe /></Layout></ProtectedRoute>} />
      <Route path="/oyunlar/esles" element={<ProtectedRoute><Layout><CafeMatch /></Layout></ProtectedRoute>} />
      <Route path="/oyunlar/yakala" element={<ProtectedRoute><Layout><CoffeeCatch /></Layout></ProtectedRoute>} />
      <Route path="/oyunlar/hafiza" element={<ProtectedRoute><Layout><MemoryGame /></Layout></ProtectedRoute>} />
      <Route path="/oyunlar/quiz" element={<ProtectedRoute><Layout><CafeQuiz /></Layout></ProtectedRoute>} />
      <Route path="/cashier" element={<ProtectedRoute><StaffRoute roles={['admin', 'cashier']}><Layout><Cashier /></Layout></StaffRoute></ProtectedRoute>} />
      <Route path="/admin" element={<Navigate to="/admin-panel" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SoundProvider>
            <NavSoundListener />
            <AppRoutes />
            <DemoRoleToggle />
          </SoundProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
