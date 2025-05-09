import { useState } from 'react';
import api from '../services/api';

export default function ClienteForm({ onCriado }) {
  const [form, setForm] = useState({
    nome_empresa: '',
    email_admin: '',
    senhaAdmin: '',
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

    // ⚠️ Validações antes de enviar
    const {
      nome_empresa,
      email_admin,
      senhaAdmin,
      canais_maximos,
      operadores_maximos,
      espaco_em_disco_mb,
      expiracao,
    } = form;

    if (!nome_empresa || !email_admin || !senhaAdmin || !expiracao) {
      return alert('Preencha todos os campos obrigatórios.');
    }

    if (
      canais_maximos <= 0 ||
      operadores_maximos <= 0 ||
      espaco_em_disco_mb <= 0
    ) {
      return alert('Todos os limites devem ser maiores que 0.');
    }

    try {
      await api.post('/tenants', {
        ...form,
        canais_maximos: parseInt(canais_maximos),
        operadores_maximos: parseInt(operadores_maximos),
        espaco_em_disco_mb: parseInt(espaco_em_disco_mb),
      });

      setForm({
        nome_empresa: '',
        email_admin: '',
        senhaAdmin: '',
        canais_maximos: 1,
        operadores_maximos: 1,
        espaco_em_disco_mb: 100,
        expiracao: '',
      });

      onCriado?.();
    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao criar cliente';
      alert(`❌ ${msg}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-6">
      <input
        className="border p-2 w-full"
        placeholder="Empresa"
        name="nome_empresa"
        value={form.nome_empresa}
        onChange={handleChange}
        required
      />
      <input
        className="border p-2 w-full"
        placeholder="Email do Admin"
        name="email_admin"
        value={form.email_admin}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        className="border p-2 w-full"
        placeholder="Senha do Admin"
        name="senhaAdmin"
        value={form.senhaAdmin}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        className="border p-2 w-full"
        placeholder="Canais Máximos"
        name="canais_maximos"
        value={form.canais_maximos}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        className="border p-2 w-full"
        placeholder="Operadores Máximos"
        name="operadores_maximos"
        value={form.operadores_maximos}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        className="border p-2 w-full"
        placeholder="Espaço em Disco (MB)"
        name="espaco_em_disco_mb"
        value={form.espaco_em_disco_mb}
        onChange={handleChange}
        required
      />
      <input
        type="datetime-local"
        className="border p-2 w-full"
        name="expiracao"
        value={form.expiracao}
        onChange={handleChange}
        required
      />
      <button className="bg-green-600 text-white p-2 w-full hover:bg-green-700">
        Criar Cliente
      </button>
    </form>
  );
}
