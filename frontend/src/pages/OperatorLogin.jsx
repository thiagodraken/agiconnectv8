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
      const token = res.data.access_token;
      const payload = JSON.parse(atob(token.split('.')[1]));

      console.log('🎟️ Payload do operador:', payload);

      if (payload.role?.toLowerCase() !== 'operador') {
        throw new Error('Este login não pertence a um operador.');
      }

      login(token, payload.tenantId);
      navigate('/operador/dashboard');
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        'Erro ao tentar autenticar operador.';
      setErro(`❌ ${msg}`);
    }
  };

  return (
    <div>
      <h2>Login do Operador</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {erro && <p style={{ color: 'red' }}>{erro}</p>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
