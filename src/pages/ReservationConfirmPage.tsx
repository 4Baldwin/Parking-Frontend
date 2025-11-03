// src/pages/ReservationConfirmPage.tsx
// (ฉบับแก้ไข: เพิ่มตัวเลือก 30/60 นาที)

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

export function ReservationConfirmPage() {
  const [vehiclePlate, setVehiclePlate] = useState('');
  
  // --- (เพิ่ม State สำหรับตัวเลือก) ---
  const [selectedDuration, setSelectedDuration] = useState<number>(30); // (ค่าเริ่มต้น 30 นาที)
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { spaceId, spaceCode } = location.state || {};

  useEffect(() => {
    if (!spaceId) {
      console.error('No space selected. Redirecting to parking.');
      navigate('/parking');
    }
  }, [spaceId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!vehiclePlate) {
      setError('Please enter a vehicle plate.');
      setIsLoading(false);
      return;
    }

    try {
      // (เรียก API /tickets/reserve ที่เราเพิ่งทดสอบผ่าน)
      const response = await apiClient.post('/tickets/reserve', {
        spaceId: spaceId, // (ID นี้จะมาจาก ParkingLotPage)
        vehiclePlate: vehiclePlate,
        prePaidDurationMinutes: selectedDuration, // (ส่งตัวเลือก 30/60)
      });

      // (ดึง ticketId ที่ถูกต้อง)
      const ticketId = response.data.ticketId;
      const qrCodeUrl = response.data.qrCodeUrl;
      const amountDue = response.data.amountDue; // (API จะส่ง 15 หรือ 30 กลับมา)

      if (!ticketId) {
        throw new Error("Failed to retrieve ticketId from API response.");
      }

      // (ส่งต่อไปยังหน้า Payment)
      navigate(`/payment/${ticketId}`, {
        state: {
          qrCodeUrl: qrCodeUrl,
          amountDue: amountDue,
          spaceCode: spaceCode
        }
      });

    } catch (err: any) {
      console.error('Reservation failed:', err);
      if (err.response?.status === 400 && err.response?.data?.message) {
         setError(Array.isArray(err.response.data.message) ? err.response.data.message.join(', ') : err.response.data.message);
      } else {
         setError(err.response?.data?.message || 'Reservation failed. Please try again.');
      }
      setIsLoading(false);
    }
  };

  if (!spaceId) {
    return null;
  }

  // (Helper สำหรับปุ่มตัวเลือก)
  const getButtonClass = (duration: number) => {
    const isSelected = selectedDuration === duration;
    return isSelected
      ? 'bg-blue-600 border-blue-400 text-white' // (สไตล์เมื่อถูกเลือก)
      : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'; // (สไตล์ปกติ)
  };

  return (
    <div className="container mx-auto p-4">
      <div className="w-full max-w-xs sm:max-w-sm bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl mx-auto mt-10">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-blue-400 mb-4">
          Confirm Reservation
        </h2>
        
        <p className="text-center text-gray-300 text-lg mb-6">
          You are reserving space: 
          <span className="font-bold text-green-400 ml-2">{spaceCode}</span>
        </p>

        <form onSubmit={handleSubmit}>
          
          {/* --- (เพิ่มตัวเลือก 30/60 นาที) --- */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-3">
              Select Pre-payment Option
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setSelectedDuration(30)}
                className={`w-1/2 p-3 rounded-lg border-2 text-center ${getButtonClass(30)}`}
              >
                <span className="font-bold">15 THB</span>
                <span className="block text-xs">30 Mins Pre-paid</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedDuration(60)}
                className={`w-1/2 p-3 rounded-lg border-2 text-center ${getButtonClass(60)}`}
              >
                <span className="font-bold">30 THB</span>
                <span className="block text-xs">60 Mins Pre-paid</span>
              </button>
            </div>
          </div>
          {/* --- (สิ้นสุดตัวเลือก) --- */}
          
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="vehiclePlate">
              Vehicle License Plate
            </label>
            <input
              id="vehiclePlate"
              type="text"
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())} // (บังคับพิมพ์ใหญ่)
              required
              disabled={isLoading}
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              placeholder="e.g., กก-1234"
            />
          </div>

          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          
          <div className="flex items-center justify-between mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${
                isLoading
                  ? 'bg-gray-500' 
                  : 'bg-blue-500 hover:bg-blue-700'
              } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm sm:text-base`}
            >
              {isLoading ? 'Creating ticket...' : 'Proceed to Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}