// 📁 frontend/src/pages/AdminTenants.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminTenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTenants();
  }, []);

  async function fetchTenants() {
    try {
      const response = await axios.get('/api/tenants');
      setTenants(response.data);
    } catch (error) {
      console.error('Erro ao buscar tenants:', error);
    } finally {
      setLoading(false);
    }
  }

  async function alterarStatus(id, novoStatus) {
    try {
      await axios.patch(`/api/tenants/${id}/status`, { status: novoStatus });
      fetchTenants();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  }

  async function salvarEdicao(id, dados) {
    try {
      await axios.put(`/api/tenants/${id}`, dados);
      fetchTenants();
    } catch (error) {
      console.error('Erro ao editar tenant:', error);
    }
  }

  if (loading) return <p>Carregando tenants...</p>;

  return (
    <div>
      <h1>Gestão de Tenants</h1>
      <table>
        <thead>
          <tr>
            <th>Empresa</th>
            <th>Email</th>
            <th>Status</th>
            <th>Expiração</th>
            <th>Limites</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr key={tenant.id}>
              <td>{tenant.nome_empresa}</td>
              <td>{tenant.email_admin}</td>
              <td>{tenant.status}</td>
              <td>{new Date(tenant.expiracao).toLocaleDateString()}</td>
              <td>
                canais: {tenant.canais_maximos}, operadores: {tenant.operadores_maximos}, espaço: {tenant.espaco_em_disco_mb}mb
              </td>
              <td>
                {tenant.status !== 'bloqueado' && (
                  <button onClick={() => alterarStatus(tenant.id, 'bloqueado')}>Bloquear</button>
                )}
                {tenant.status === 'bloqueado' && (
                  <button onClick={() => alterarStatus(tenant.id, 'ativo')}>Desbloquear</button>
                )}
                <button
                  onClick={() => {
                    const novosDados = prompt('Digite novo JSON com limites', JSON.stringify({
                      canais_maximos: tenant.canais_maximos,
                      operadores_maximos: tenant.operadores_maximos,
                      espaco_em_disco_mb: tenant.espaco_em_disco_mb,
                      expiracao: tenant.expiracao
                    }));
                    if (novosDados) salvarEdicao(tenant.id, JSON.parse(novosDados));
                  }}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
