// src/components/layout/Navbar.tsx
import { useState, useEffect } from 'react'; // ลบ React ออก
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../services/api';

// (Interface UserProfile เหมือนเดิม)
interface UserProfile { id: string; email: string; name?: string; }

export function Navbar() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login'); // ถ้าไม่มี Token ให้ไปหน้า Login เลย
        return;
      }
      try {
        const response = await apiClient.get('/auth/profile');
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        localStorage.removeItem('accessToken');
        navigate('/login');
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    delete apiClient.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
    // --- เปลี่ยนมาใช้ Tailwind ---
    <nav className="
      flex justify-between items-center 
      p-4 bg-gray-800 text-white shadow-md
    ">
      <div>
        <Link to="/parking" className="text-xl font-bold hover:text-blue-400">
          ConnectAPark {/* เปลี่ยนเป็นชื่อแอปฯ ของคุณ */}
        </Link>
      </div>
      <div className="flex items-center">
        {user ? (
          <>
            <span className="mr-4 text-sm text-gray-300">
              Welcome, {user.name || user.email}!
            </span>
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm">
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
    // --- สิ้นสุด Tailwind ---
  );
}