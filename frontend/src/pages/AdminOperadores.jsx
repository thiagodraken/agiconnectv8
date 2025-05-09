import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAdminAuth } from '../contexts/AdminAuthContext';

export default function AdminOperadores() {
  const { tenantId } = useAdminAuth();
  const [operadores, setOperadores] = useState([]);
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    ativo: true,
  });

  const carregar = async () => {
    const res = await api.get(`/operators/tenant/${tenantId}`);
    setOperadores(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/operators', {
        ...form,
        tenant: { id: tenantId },
      });
      setForm({ nome: '', email: '', senha: '', ativo: true });
      carregar();
    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao criar operador';
      alert(`❌ ${msg}`);
    }
  };

  const excluir = async (id) => {
    if (window.confirm('Excluir este operador?')) {
      await api.delete(`/operators/${id}`);
      carregar();
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Operadores</h1>

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
        {operadores.map((op) => (
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
