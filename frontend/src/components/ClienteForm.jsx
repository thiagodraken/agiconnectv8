import { useState } from 'react';
import api from '../services/api';

export default function ClienteForm({ onCriado }) {
  const [form, setForm] = useState({
    nome_empresa: '',
    email_admin: '',
    canais_maximos: 1,
    operadores_maximos: 1,
    espaco_em_disco_mb: 100,
    expiracao: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tenants', {
        ...form,
        canais_maximos: parseInt(form.canais_maximos),
        operadores_maximos: parseInt(form.operadores_maximos),
        espaco_em_disco_mb: parseInt(form.espaco_em_disco_mb),
      });
      setForm({ ...form, nome_empresa: '', email_admin: '', expiracao: '' });
      onCriado?.();
    } catch (err) {
      console.error('Erro ao criar cliente:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 mb-6">
      <input
        className="border p-2"
        placeholder="Empresa"
        name="nome_empresa"
        value={form.nome_empresa}
        onChange={handleChange}
        required
      />
      <input
        className="border p-2"
        placeholder="Email do Admin"
        name="email_admin"
        value={form.email_admin}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        className="border p-2"
        placeholder="Canais Máximos"
        name="canais_maximos"
        value={form.canais_maximos}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        className="border p-2"
        placeholder="Operadores Máximos"
        name="operadores_maximos"
        value={form.operadores_maximos}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        className="border p-2"
        placeholder="Espaço em Disco (MB)"
        name="espaco_em_disco_mb"
        value={form.espaco_em_disco_mb}
        onChange={handleChange}
        required
      />
      <input
        type="datetime-local"
        className="border p-2"
        name="expiracao"
        value={form.expiracao}
        onChange={handleChange}
        required
      />
      <button className="bg-green-600 text-white py-2 rounded hover:bg-green-700">
        Criar Cliente
      </button>
    </form>
  );
}
