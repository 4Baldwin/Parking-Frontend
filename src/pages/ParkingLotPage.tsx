// src/pages/ParkingLotPage.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

// (Interface Space เหมือนเดิม)
interface Space {
  id: string;
  code: string;
  status: 'AVAILABLE' | 'RESERVED' | 'OCCUPIED' | 'PENDING_VACATE';
  zoneId: string;
}

export function ParkingLotPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpaces = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/spaces', {
          params: { page_size: 100 }
        });
        setSpaces(response.data.data);
      } catch (err: any) {
        console.error('Failed to fetch spaces:', err);
        setError('Failed to load parking spaces. Please try again.');
        if (err.response?.status === 401) {
          // ถ้า Token หมดอายุ ให้เด้งไปหน้า Login
          localStorage.removeItem('accessToken');
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchSpaces();
  }, [navigate]); // เพิ่ม navigate ใน dependency array

  // ฟังก์ชันเมื่อผู้ใช้กดจองช่องจอด
  const handleReserveClick = (space: Space) => {
    if (space.status !== 'AVAILABLE') {
      alert(`Space ${space.code} is not available.`);
      return;
    }
    // TODO: สร้างหน้าใหม่สำหรับยืนยันการจองและกรอกเลขทะเบียน
    // โดยส่งข้อมูล space ไปด้วย
    console.log(`Reserving space: ${space.code} (ID: ${space.id})`);
    
    // ตัวอย่างการส่งต่อไปยังหน้าใหม่ (คุณต้องสร้างหน้านี้และ Route ใน main.tsx)
    // navigate('/reserve-confirm', { state: { spaceId: space.id, spaceCode: space.code } });
    
    alert(`Initiating reservation for ${space.code}... (Implement next step: Vehicle Plate Input)`);
  };

  // --- ส่วนแสดงผลตอน Loading ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading parking spaces...
      </div>
    );
  }

  // --- ส่วนแสดงผลตอน Error ---
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500 p-4 text-center">
        <h2 className="text-xl mb-4">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  // --- ส่วนแสดงผลหลัก ---
  
  // กรองช่องจอดแยกตามสถานะ
  const availableSpaces = spaces.filter(s => s.status === 'AVAILABLE');
  const occupiedSpaces = spaces.filter(s => s.status === 'OCCUPIED' || s.status === 'PENDING_VACATE');
  const reservedSpaces = spaces.filter(s => s.status === 'RESERVED');

  return (
    // Container หลัก (ไม่มี MainLayout เพราะหน้านี้มี Navbar ของตัวเอง)
    // <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8">
    // (หมายเหตุ: โค้ดนี้อยู่ใน MainLayout แล้ว จึงไม่จำเป็นต้องมี min-h-screen หรือ bg-gray-900 อีก)
    
    <div className="container mx-auto p-4"> {/* ใช้ Padding จาก MainLayout แล้ว */}
      
      {/* ส่วนช่องจอดที่ว่าง */}
      <h2 className="text-2xl sm:text-3xl font-bold text-green-400 mb-4">
        Available Parking Spaces
      </h2>
      
      {/* Grid Layout (Responsive) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {availableSpaces.map((space) => (
            <button
              key={space.id}
              onClick={() => handleReserveClick(space)}
              className="
                p-4 sm:p-5 
                border-2 border-green-500 bg-green-500 bg-opacity-20 
                text-white text-lg sm:text-xl font-bold 
                rounded-lg shadow-md 
                hover:bg-green-500 hover:text-gray-900 
                transition-all duration-200 
                focus:outline-none focus:ring-2 focus:ring-green-300
              "
            >
              {space.code}
            </button>
          ))}
      </div>
      
      {availableSpaces.length === 0 && (
          <p className="text-gray-400 mt-4">No available spaces found.</p>
      )}

      {/* ส่วนช่องจอดที่ถูกจอง (RESERVED) */}
      <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mt-8 mb-4">
        Reserved Spaces
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
         {reservedSpaces.map((space) => (
              <div
                key={space.id}
                className="
                  p-4 sm:p-5 
                  border border-yellow-600 bg-yellow-600 bg-opacity-20 
                  text-yellow-200 text-center 
                  rounded-lg shadow-sm 
                  opacity-70
                "
              >
                {space.code}
              </div>
            ))}
      </div>
      {reservedSpaces.length === 0 && (
          <p className="text-gray-500 mt-4">No reserved spaces.</p>
      )}

      {/* ส่วนช่องจอดที่ไม่ว่าง (OCCUPIED / PENDING_VACATE) */}
      <h3 className="text-xl sm:text-2xl font-bold text-red-400 mt-8 mb-4">
        Occupied Spaces
      </h3>
       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
         {occupiedSpaces.map((space) => (
              <div
                key={space.id}
                className="
                  p-4 sm:p-5 
                  border border-red-700 bg-red-700 bg-opacity-20 
                  text-red-200 text-center 
                  rounded-lg shadow-sm 
                  opacity-70
                "
              >
                {space.code}
              </div>
            ))}
       </div>
       {occupiedSpaces.length === 0 && (
          <p className="text-gray-500 mt-4">No occupied spaces.</p>
      )}

    </div>
  );
}