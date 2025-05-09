import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// ✅ Interceptor de requisição: insere o token correto
api.interceptors.request.use((config) => {
  const superAdminToken = localStorage.getItem('token');
  const adminToken = localStorage.getItem('admin_token');
  const operatorToken = localStorage.getItem('operator_token');

  const token = superAdminToken || adminToken || operatorToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ❌ Interceptor de resposta: trata erros globais
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const code = error.response?.status;

    if (code === 401 || code === 403) {
      alert('❌ Sessão expirada ou acesso não autorizado.');

      // Redireciona para a rota de login apropriada
      const pathname = window.location.pathname;

      if (pathname.startsWith('/admin')) {
        window.location.href = '/admin';
      } else if (pathname.startsWith('/operador')) {
        window.location.href = '/operador';
      } else {
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
