// src/components/layout/Navbar.tsx
// (ฉบับแก้ไข: จัดการ Error 401 อย่างถูกต้อง)

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../services/api';

// (Interface UserProfile เหมือนเดิม)
interface UserProfile {
  id: string;
  email: string;
  name?: string;
}

export function Navbar() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        // (ถ้าไม่มี Token ก็ไม่ต้องทำอะไร หรือจะเด้งไป Login ก็ได้)
        // (ใน MainLayout เราควรป้องกันหน้านี้ แต่ตอนนี้ปล่อยว่างไว้ก่อน)
        // navigate('/login'); // (ถ้าอยากให้บังคับ Login ตลอด)
        return;
      }

      try {
        // (พยายามดึงโปรไฟล์ตามปกติ)
        const response = await apiClient.get('/auth/profile');
        setUser(response.data);
      } catch (error: any) {
        
        // --- (*** นี่คือจุดที่แก้ไข ***) ---
        console.error('Failed to fetch profile:', error);

        // (เช็กว่า Error นี้เป็น 401 หรือ 403 หรือไม่)
        if (error.response?.status === 401 || error.response?.status === 403) {
          // (ถ้าใช่ = Token หมดอายุ หรือใช้ไม่ได้)
          console.warn('Token invalid or expired. Logging out.');
          localStorage.removeItem('accessToken');
          navigate('/login');
        }
        // (ถ้าเป็น Error อื่นๆ เช่น 500 (Server ล่ม) หรือเน็ตหลุด)
        // (เราจะไม่ทำอะไรเลย ปล่อยให้ผู้ใช้ยัง Login ค้างอยู่)
      }
    };

    fetchProfile();
  }, [navigate]);

  // (ฟังก์ชัน Logout - เหมือนเดิม)
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="
      flex justify-between items-center 
      p-4 bg-gray-800 text-white shadow-md
    ">
      <div>
        <Link to="/parking" className="text-xl font-bold hover:text-blue-400">
          ConnectAPark
        </Link>
      </div>
      <div className="flex items-center">
        
        {/* (ส่วนแสดงผล - เหมือนเดิม) */}
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
  );
}