import { Link, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';

export default function AdminLayout() {
  const { logout } = useAdminAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-blue-800 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-blue-700">
          Painel do Cliente
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin/dashboard" className="block px-2 py-1 hover:bg-blue-700 rounded">
            Dashboard
          </Link>
          <Link to="/admin/canais" className="block px-2 py-1 hover:bg-blue-700 rounded">
            Canais
          </Link>
          <Link to="/admin/operadores" className="block px-2 py-1 hover:bg-blue-700 rounded">
            Operadores
          </Link>
          <Link to="/admin/whatsapp" className="block px-2 py-1 hover:bg-blue-700 rounded">
            WhatsApp API
          </Link>
        </nav>
        <div className="p-4 border-t border-blue-700">
          <button onClick={logout} className="w-full bg-red-600 hover:bg-red-700 px-3 py-2 rounded">
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
