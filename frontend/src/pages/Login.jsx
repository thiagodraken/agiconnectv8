import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useOperatorAuth } from '../contexts/OperatorAuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const { login: superLogin } = useAuth();
  const { login: adminLogin } = useAdminAuth();
  const { login: operatorLogin } = useOperatorAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      const token = res.data.access_token;
      const payload = JSON.parse(atob(token.split('.')[1]));

      switch (payload.role?.toLowerCase()) {
        case 'superadmin':
          superLogin(token);
          navigate('/dashboard');
          break;
        case 'admin':
          adminLogin(token, payload.tenantId);
          navigate('/admin/dashboard');
          break;
        case 'operador':
          operatorLogin(token, payload.tenantId);
          navigate('/operador/dashboard');
          break;
        default:
          throw new Error('Perfil desconhecido.');
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        'Erro ao tentar autenticar.';
      setErro(`❌ ${msg}`);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full mb-3 p-2 border rounded"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {erro && <p className="text-red-500 mb-2 text-sm">{erro}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
