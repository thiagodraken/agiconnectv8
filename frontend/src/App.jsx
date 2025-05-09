// 📁 frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Channels from './pages/Channels';
import Operators from './pages/Operators';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminCanais from './pages/AdminCanais';
import AdminOperadores from './pages/AdminOperadores';
import AdminWhatsapp from './pages/AdminWhatsapp';
import OperatorLogin from './pages/OperatorLogin';
import OperatorDashboard from './pages/OperatorDashboard';
import FilaConversas from './pages/FilaConversas';
import Chat from './pages/Chat';
import MenuGlobal from './components/MenuGlobal';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdminAuthProvider, useAdminAuth } from './contexts/AdminAuthContext';
import { OperatorAuthProvider, useOperatorAuth } from './contexts/OperatorAuthContext';

function RotaProtegida({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

function RotaProtegidaAdmin({ children }) {
  const { token, loading } = useAdminAuth();
  if (loading) return null;
  return token ? children : <Navigate to="/admin/login" />;
}

function RotaProtegidaOperador({ children }) {
  const { token } = useOperatorAuth();
  return token ? children : <Navigate to="/operador/login" />;
}

function MenuWrapper() {
  const { pathname } = useLocation();
  const isLoginPage = pathname.includes('/login');
  return !isLoginPage && <MenuGlobal />;
}

function LogoutRedirector() {
  const { logout: logoutAdmin } = useAdminAuth();
  const { logout: logoutOperador } = useOperatorAuth();
  const { logout: logoutAuth } = useAuth();
  const navigate = useNavigate();

  const logoutAll = () => {
    logoutAdmin();
    logoutOperador();
    logoutAuth();
    navigate('/login');
  };

  return <button onClick={logoutAll}>Sair</button>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminAuthProvider>
          <OperatorAuthProvider>
            <MenuWrapper />
            <Routes>
              {/* SUPERADMIN */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<RotaProtegidaAdmin><AdminDashboard /></RotaProtegidaAdmin>} />
              <Route path="/admin/canais" element={<RotaProtegidaAdmin><AdminCanais /></RotaProtegidaAdmin>} />
              <Route path="/admin/operadores" element={<RotaProtegidaAdmin><AdminOperadores /></RotaProtegidaAdmin>} />
              <Route path="/admin/whatsapp" element={<RotaProtegidaAdmin><AdminWhatsapp /></RotaProtegidaAdmin>} />

              {/* ADMIN CLIENTE */}
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<RotaProtegida><Dashboard /></RotaProtegida>} />
              <Route path="/channels" element={<RotaProtegida><Channels /></RotaProtegida>} />
              <Route path="/operators" element={<RotaProtegida><Operators /></RotaProtegida>} />

              {/* OPERADOR */}
              <Route path="/operador/login" element={<OperatorLogin />} />
              <Route path="/operador/dashboard" element={<RotaProtegidaOperador><OperatorDashboard /></RotaProtegidaOperador>} />
              <Route path="/chat" element={<RotaProtegidaOperador><Chat /></RotaProtegidaOperador>} />
              <Route path="/fila" element={<RotaProtegidaOperador><FilaConversas /></RotaProtegidaOperador>} />
            </Routes>
          </OperatorAuthProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
