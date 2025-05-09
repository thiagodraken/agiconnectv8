import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Channels from './pages/Channels';
import Operators from './pages/Operators';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminCanais from './pages/AdminCanais';
import AdminOperadores from './pages/AdminOperadores';
import AdminWhatsapp from './pages/AdminWhatsapp';
import AdminLayout from './layouts/AdminLayout';

import OperatorLogin from './pages/OperatorLogin';
import OperatorDashboard from './pages/OperatorDashboard';
import FilaConversas from './pages/FilaConversas';
import Chat from './pages/Chat';
import OperatorLayout from './layouts/OperatorLayout';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdminAuthProvider, useAdminAuth } from './contexts/AdminAuthContext';
import { OperatorAuthProvider, useOperatorAuth } from './contexts/OperatorAuthContext';

// 🔐 Rotas protegidas para cada tipo de usuário
function RotaProtegida({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/" />;
}

function RotaProtegidaAdmin({ children }) {
  const { token, loading } = useAdminAuth();
  if (loading) return null;
  return token ? children : <Navigate to="/admin" />;
}

function RotaProtegidaOperador({ children }) {
  const { token } = useOperatorAuth();
  return token ? children : <Navigate to="/operador" />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminAuthProvider>
          <OperatorAuthProvider>
            <Routes>
              {/* ✅ SUPER ADMIN */}
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<RotaProtegida><Dashboard /></RotaProtegida>} />
              <Route path="/clientes/:id/canais" element={<RotaProtegida><Channels /></RotaProtegida>} />
              <Route path="/clientes/:id/operadores" element={<RotaProtegida><Operators /></RotaProtegida>} />

              {/* ✅ ADMIN DO CLIENTE */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/*" element={<RotaProtegidaAdmin><AdminLayout /></RotaProtegidaAdmin>}>
                <Route index element={<Navigate to="dashboard" />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="canais" element={<AdminCanais />} />
                <Route path="operadores" element={<AdminOperadores />} />
                <Route path="whatsapp" element={<AdminWhatsapp />} />
              </Route>

              {/* ✅ OPERADOR */}
              <Route path="/operador" element={<OperatorLogin />} />
              <Route path="/operador/*" element={<RotaProtegidaOperador><OperatorLayout /></RotaProtegidaOperador>}>
                <Route index element={<Navigate to="dashboard" />} />
                <Route path="dashboard" element={<OperatorDashboard />} />
                <Route path="atendimento" element={<FilaConversas />} />
                <Route path="chat/:id" element={<Chat />} />
              </Route>
            </Routes>
          </OperatorAuthProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
