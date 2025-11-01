// src/pages/ForgotPasswordPage.tsx

import { useState } from 'react'; // ลบ React ออก
import { Link } from 'react-router-dom';
import apiClient from '../services/api';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null); // For success/error messages
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    try {
      // Call the forgot-password API
      const response = await apiClient.post('/auth/forgot-password', { email });
      setMessage(response.data.message || 'Password reset link sent.'); // Show message from backend
    } catch (err: any) {
      console.error('Forgot password failed:', err);
      // Show a generic message even on error for security
      setMessage('If your email is registered, you will receive a password reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Container หลัก
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 sm:p-6">
      
      {/* กล่อง Form */}
      <div className="w-full max-w-xs sm:max-w-sm bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-blue-400 mb-4">Forgot Password</h2>
        <p className="text-center text-gray-300 text-sm mb-6">
          Enter your email and we'll send you a reset link.
        </p>
        
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
              disabled={isLoading} // Disable input while loading
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>

          {/* Message (Success/Error) */}
          {message && (
            <p className="text-green-500 text-sm text-center mb-4">
              {message}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            style={{ marginTop: '15px' }}
            disabled={isLoading}
            className={`w-full ${isLoading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm sm:text-base`}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        
        {/* Login Link */}
        <p className="mt-6 text-center text-gray-400 text-xs sm:text-sm">
          Remembered your password?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Login here
          </Link>
        </p>
      </div>
      
    </div>
  );
}