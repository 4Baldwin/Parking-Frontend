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

  // (ฟังก์ชัน fetch แยกออกมาเพื่อให้เรียกซ้ำได้)
  const fetchSpaces = async (isManualRefresh = false) => {
    // (ถ้าไม่ได้กด Refresh เอง หรือไม่ใช่ครั้งแรก ไม่ต้องโชว์ Loading)
    if (isManualRefresh || spaces.length === 0) {
      setIsLoading(true);
    }
    setError(null);
    try {
      const response = await apiClient.get('/spaces', {
        params: { page_size: 100 }
      });
      // (เรียงข้อมูลตาม 'code' เพื่อให้ A-01 มาก่อน A-02)
      const sortedSpaces = response.data.data.sort((a: Space, b: Space) => 
        a.code.localeCompare(b.code, undefined, { numeric: true })
      );
      setSpaces(sortedSpaces);

    } catch (err: any) {
      console.error('Failed to fetch spaces:', err);
      setError('Failed to load parking spaces. Please try again.');
      if (err.response?.status === 401) {
        localStorage.removeItem('accessToken');
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces(true); // โหลดครั้งแรก (โชว์ Loading)
    
    // --- (เพิ่ม Interval) ---
    // ดึงข้อมูลใหม่ทุก 15 วินาที เพื่ออัปเดตสถานะ
    const intervalId = setInterval(() => fetchSpaces(false), 15000); 

    // คืนค่า interval เมื่อ component ถูก unmount
    return () => clearInterval(intervalId);
    
  }, [navigate]); // (เอา spaces.length ออกจาก dependency array)

  // --- (*** นี่คือจุดที่แก้ไข ***) ---
  const handleReserveClick = (space: Space) => {
    if (space.status !== 'AVAILABLE') {
      alert(`Space ${space.code} is not available.`);
      return;
    }
    
    // (ใช้ navigate เพื่อส่งต่อไปยังหน้ายืนยัน)
    navigate('/reserve-confirm', { 
      state: { spaceId: space.id, spaceCode: space.code } 
    });
  };
  // --- (สิ้นสุดการแก้ไข) ---
  
  // --- (ส่วนแสดงผล) ---
  if (isLoading && spaces.length === 0) { // (โชว์ Loading แค่ครั้งแรกสุด)
    return (
      <div className="container mx-auto p-4 text-center text-gray-400">
        Loading parking spaces...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        <h2 className="text-xl mb-4">Error</h2>
        <p>{error}</p>
      </div>
    );
  }
  
  // (แยกโซน)
  const availableSpaces = spaces.filter(s => s.status === 'AVAILABLE');
  const reservedSpaces = spaces.filter(s => s.status === 'RESERVED');
  const occupiedSpaces = spaces.filter(s => s.status === 'OCCUPIED' || s.status === 'PENDING_VACATE');

  return (
    <div className="container mx-auto p-4">
      
      {/* (เพิ่มปุ่ม Refresh) */}
      <div className="flex justify-between items-center mb-4">
         <h2 className="text-2xl sm:text-3xl font-bold text-green-400">
          Available Parking Spaces
         </h2>
         <button
            onClick={() => fetchSpaces(true)} // (กด Refresh ให้โชว์ Loading)
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
         </button>
      </div>
      
      {/* (Grid Layout) */}
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
      
      {availableSpaces.length === 0 && !isLoading && (
          <p className="text-gray-400 mt-4">No available spaces found.</p>
      )}

      {/* (Reserved Spaces) */}
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

      {/* (Occupied Spaces) */}
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