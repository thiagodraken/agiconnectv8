// 📁 frontend/src/__tests__/authCleaner.test.js
import { clearAllAuthTokens } from '../utils/authCleaner';

describe('clearAllAuthTokens()', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('token', 'super');
    localStorage.setItem('admin_token', 'admin');
    localStorage.setItem('admin_tenant', 't1');
    localStorage.setItem('operator_token', 'op');
    localStorage.setItem('operator_tenant', 't2');
  });

  test('remove all by default', () => {
    clearAllAuthTokens();
    expect(localStorage.length).toBe(0);
  });

  test('preserve only "token"', () => {
    clearAllAuthTokens(['token']);
    expect(localStorage.getItem('token')).toBe('super');
    expect(localStorage.getItem('admin_token')).toBeNull();
    expect(localStorage.getItem('operator_token')).toBeNull();
  });
});
