import { useAdminAuth } from '../contexts/AdminAuthContext';

export default function AdminDashboard() {
  const { logout, tenantId } = useAdminAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-blue-700 text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">Painel do Cliente</h1>
        <button onClick={logout} className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600">
          Sair
        </button>
      </header>
      <main className="p-6">
        <p className="text-gray-800">Bem-vindo, Tenant ID: <strong>{tenantId}</strong></p>
        <p className="text-sm mt-2">Aqui virá o menu lateral com os recursos estilo Zpro.</p>
      </main>
    </div>
  );
}
