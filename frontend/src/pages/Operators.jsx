import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Operators() {
  const { id } = useParams(); // id do tenant
  const navigate = useNavigate();
  const [operators, setOperators] = useState([]);
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    ativo: true,
  });

  const carregar = async () => {
    try {
      const res = await api.get(`/operators/tenant/${id}`);
      setOperators(res.data);
    } catch (err) {
      console.error('Erro ao carregar operadores:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/operators', { ...form, tenant: { id } });
      setForm({ nome: '', email: '', senha: '', ativo: true });
      carregar();
    } catch (err) {
      console.error('Erro ao criar operador:', err);
    }
  };

  const excluir = async (opId) => {
    if (!window.confirm('Excluir este operador?')) return;
    try {
      await api.delete(`/operators/${opId}`);
      carregar();
    } catch (err) {
      console.error('Erro ao excluir operador:', err);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/dashboard')}
        className="mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Voltar ao painel
      </button>

      <h1 className="text-2xl font-bold mb-4">Operadores do Cliente</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 max-w-md mb-6">
        <input
          className="border p-2"
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
        />
        <input
          className="border p-2"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          className="border p-2"
          placeholder="Senha"
          value={form.senha}
          onChange={(e) => setForm({ ...form, senha: e.target.value })}
          required
        />
        <button className="bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Criar Operador
        </button>
      </form>

      <ul className="border-t">
        {operators.map((op) => (
          <li key={op.id} className="py-2 border-b flex justify-between items-center">
            <div>
              <strong>{op.nome}</strong> — {op.email} — {op.ativo ? 'Ativo' : 'Inativo'}
            </div>
            <button
              onClick={() => excluir(op.id)}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
