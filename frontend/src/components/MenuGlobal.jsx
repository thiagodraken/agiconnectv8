// 📁 frontend/src/components/MenuGlobal.jsx
import { useAuth } from '../contexts/AuthContext';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useOperatorAuth } from '../contexts/OperatorAuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function MenuGlobal() {
  const { token: isAdmin, logout: logoutAdmin } = useAuth();
  const { token: isSuper, logout: logoutSuper } = useAdminAuth();
  const { token: isOperator, logout: logoutOperator } = useOperatorAuth();
  const navigate = useNavigate();

  const logoutAll = () => {
    logoutAdmin();
    logoutSuper();
    logoutOperator();
    navigate('/login');
  };

  return (
    <nav style={{ padding: '12px', background: '#eee', marginBottom: '16px' }}>
      {isSuper && (
        <>
          <Link to="/admin">Dashboard Super</Link> |{' '}
          <Link to="/admin/canais">Canais</Link> |{' '}
          <Link to="/admin/operadores">Operadores</Link> |{' '}
        </>
      )}
      {isAdmin && (
        <>
          <Link to="/dashboard">Dashboard</Link> |{' '}
          <Link to="/channels">Canais</Link> |{' '}
          <Link to="/operators">Operadores</Link> |{' '}
        </>
      )}
      {isOperator && (
        <>
          <Link to="/operador/dashboard">Painel</Link> |{' '}
          <Link to="/chat">Chat</Link> |{' '}
          <Link to="/fila">Fila</Link> |{' '}
        </>
      )}
      {(isAdmin || isSuper || isOperator) && <button onClick={logoutAll}>Sair</button>}
    </nav>
  );
}