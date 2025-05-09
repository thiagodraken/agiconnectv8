// 📁 frontend/src/utils/authCleaner.js
export function clearAllAuthTokens(preserve = []) {
  const keys = [
    'token',
    'admin_token',
    'admin_tenant',
    'operator_token',
    'operator_tenant',
  ];

  keys.forEach((key) => {
    if (!preserve.includes(key)) {
      localStorage.removeItem(key);
    }
  });
}