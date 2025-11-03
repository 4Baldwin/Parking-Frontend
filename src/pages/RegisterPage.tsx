// src/pages/RegisterPage.tsx

import { useState, useEffect } from 'react'; // <-- 1. เพิ่ม useEffect
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // --- (เพิ่ม useEffect เพื่อ Redirect) ---
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      console.log('User is already logged in. Redirecting to /dashboard.');
      navigate('/dashboard', { replace: true }); // (แก้เป็น /dashboard)
    }
  }, [navigate]);
  // --- (สิ้นสุดการเพิ่ม) ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      await apiClient.post('/auth/register', {
        email: email,
        password: password,
        name: name || undefined,
      });

      setSuccess('Registration successful! Redirecting to login...');
      console.log('Registration successful!');

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err: any) {
      console.error('Registration failed:', err);
      if (err.response?.status === 409) {
        setError('This email is already registered.');
      } else if (err.response?.status === 400 && err.response?.data?.message) {
         setError(Array.isArray(err.response.data.message) ? err.response.data.message.join(', ') : err.response.data.message);
      } else {
        setError('Registration failed. Please try again.');
      }
      setIsLoading(false);
    }
  };

  return (
    // (ส่วน JSX เหมือนเดิมทั้งหมด)
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 sm:p-6">
      <div className="w-full max-w-xs sm:max-w-sm bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-blue-400 mb-6">Register</h2>
        <form onSubmit={handleSubmit}>
          {/* ... (เนื้อหา Form เหมือนเดิม) ... */}
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
          <div className="mb-4">
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
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="name">
              Name (Optional)
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          {success && <p className="text-green-500 text-xs italic mb-4">{success}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${isLoading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm sm:text-base`}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-gray-400 text-xs sm:text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}