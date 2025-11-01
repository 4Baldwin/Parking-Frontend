// src/pages/ResetPasswordPage.tsx

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../services/api';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token'); // Get token from URL query string

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if token is missing
  useEffect(() => {
    if (!token) {
      setError('Invalid reset link: Token is missing.');
    }
  }, [token]); // ลบ navigate ออกจาก dependency array ถ้าไม่ใช้

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!token) {
       setError('Invalid reset link: Token is missing.');
       return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.post('/auth/reset-password', {
        token: token,
        newPassword: newPassword,
      });

      setSuccess(response.data.message || 'Password reset successfully! Redirecting to login...');
      console.log('Password reset successful!');

      setTimeout(() => {
        navigate('/login');
      }, 3000); // Wait 3 seconds

    } catch (err: any) {
      console.error('Reset password failed:', err);
      setError(err.response?.data?.message || 'Password reset failed. The link might be expired or invalid.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- ส่วนแสดงผลถ้าไม่มี Token ---
  if (!token) {
     return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 sm:p-6 text-center">
           <div className="w-full max-w-xs sm:max-w-sm bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl">
              <h2 className="text-xl sm:text-2xl font-bold text-red-500 mb-4">Error</h2>
              <p className="text-gray-300 mb-6">{error || 'Invalid password reset link.'}</p>
              <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300">
                Request a new link
              </Link>
           </div>
        </div>
     );
  }

  // --- ส่วนแสดงผลหลัก (ถ้ามี Token) ---
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 sm:p-6">
      
      <div className="w-full max-w-xs sm:max-w-sm bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-blue-400 mb-6">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          {/* New Password Input */}
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="newPassword">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              placeholder="********"
            />
          </div>
          
          {/* Confirm Password Input */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              placeholder="********"
            />
          </div>

          {/* Error/Success Messages */}
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          {success && <p className="text-green-500 text-xs italic mb-4">{success}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            style={{ marginTop: '15px' }}
            disabled={isLoading}
            className={`w-full ${isLoading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm sm:text-base`}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
      
    </div>
  );
}