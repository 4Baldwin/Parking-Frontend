// src/pages/LoginPage.tsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../services/api';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    // ... (โค้ด handleSubmit เหมือนเดิม)
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      localStorage.setItem('accessToken', response.data.access_token);
      navigate('/parking');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed.');
      setIsLoading(false);
    }
  };

  return (
    // Container: ให้มี padding เสมอ
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 sm:p-6">

      {/* กล่อง Form: ปรับ max-width และ padding */}
      <div className="w-full max-w-xs sm:max-w-sm bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl"> {/* max-w-xs บนมือถือ, sm:max-w-sm บนจอใหญ่ขึ้น */}
        <h2 className="text-xl sm:text-2xl font-bold text-center text-blue-400 mb-6">Login</h2> {/* ปรับขนาด H2 */}
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white mb-1 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              placeholder="********"
            />
            {/* Forgot Password Link: ปรับขนาดตัวอักษร */}
            <div className="text-right text-xs sm:text-sm">
              <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300">
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}

          {/* Submit Button: ปรับขนาดตัวอักษร */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${isLoading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm sm:text-base`}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        {/* Register Link: ปรับขนาดตัวอักษร */}
        <p className="mt-6 text-center text-gray-400 text-xs sm:text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:text-blue-300">
            Register here
          </Link>
        </p>
      </div>

    </div>
  );
}