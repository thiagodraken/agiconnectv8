import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useOperatorAuth } from '../contexts/OperatorAuthContext';

export default function OperatorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const { login } = useOperatorAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      const payload = JSON.parse(atob(res.data.access_token.split('.')[1]));
      if (payload.role !== 'operador') throw new Error();
      login(res.data.access_token, payload.sub);
      navigate('/operador/dashboard');
    } catch {
      setErro('Credenciais inválidas para Operador');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Login do Operador</h2>

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

        {erro && <p className="text-red-500 mb-2">{erro}</p>}

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
