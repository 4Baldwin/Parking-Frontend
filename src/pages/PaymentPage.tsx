// src/pages/PaymentPage.tsx
// (ไฟล์เดิมที่แก้ไข Bug แล้ว)

import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

// ฟังก์ชันช่วยแปลงวินาทีเป็น MM:SS
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

export function PaymentPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); // <-- (success เป็น string (ข้อความ) หรือ null)
  const [countdown, setCountdown] = useState(900); // 15 นาที

  const { ticketId } = useParams<{ ticketId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const { qrCodeUrl, amountDue, spaceCode } = location.state || {};

  // (Effect นับถอยหลัง 15 นาที - เหมือนเดิม)
  useEffect(() => {
    if (success || countdown <= 0) {
      return;
    }
    const intervalId = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(intervalId);
          setError('Time expired! Your reservation has been cancelled. Please try again.');
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000); 

    return () => clearInterval(intervalId);
  }, [success, countdown]);

  // (ฟังก์ชันจำลองการจ่ายเงิน - เหมือนเดิม)
  const handleSimulatePayment = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await apiClient.post(`/tickets/reserve/confirm-payment/${ticketId}`);
      setSuccess('Payment successful! Your reservation is confirmed for 60 minutes.');

      setTimeout(() => {
        navigate('/parking');
      }, 3000);

    } catch (err: any) {
      console.error('Payment failed:', err);
      // (Error นี้คืออันที่คุณเจอครั้งที่แล้ว)
      setError(err.response?.data?.message || 'Payment failed. The ticket might have expired.');
      setIsLoading(false);
    }
  };

  // (เช็ก State - เหมือนเดิม)
  if (!amountDue || !qrCodeUrl) {
     useEffect(() => {
        if (!location.state) { // ป้องกัน loop ถ้า state ไม่มีจริงๆ
            console.warn("PaymentPage loaded without state. Redirecting to /parking.");
            navigate('/parking');
        }
     }, [location.state, navigate]);
     
     // (อาจจะดึงข้อมูลตั๋วจาก API /tickets/:id มาแสดงแทน)
     return (
        <div className="container mx-auto p-4 text-center text-gray-400">
            Loading payment details...
        </div>
     );
  }

  // (ส่วนแสดงผล - เหมือนเดิม)
  return (
    <div className="container mx-auto p-4">
      <div className="w-full max-w-sm bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl mx-auto mt-10">
        
        <h2 className="text-2xl font-bold text-center text-blue-400 mb-2">
          Complete Your Reservation
        </h2>
        <p className="text-center text-gray-300 text-lg mb-4">
          For Space: <span className="font-bold text-green-400">{spaceCode}</span>
        </p>

        <div className="text-center bg-gray-900 p-4 rounded-lg mb-6">
          <div className="text-sm text-gray-400">Time remaining (15 mins)</div>
          <div className={`text-4xl font-bold ${countdown < 60 ? 'text-red-500' : 'text-yellow-400'}`}>
            {formatTime(countdown)}
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-300">Amount Due (Pre-payment 30 mins)</p>
          <p className="text-3xl font-bold text-white">
            ฿ {Number(amountDue).toFixed(2)}
          </p>
        </div>
        
        <div className="flex justify-center mb-6">
           <div className="p-4 bg-white rounded-lg">
             <img 
               src={qrCodeUrl} 
               alt="QR Code for Payment" 
               className="w-48 h-48"
             />
           </div>
        </div>
        
        <p className="text-center text-gray-400 text-xs mb-6">
          Please scan the QR code with your banking app to pay ฿{Number(amountDue).toFixed(2)} within 15 minutes.
        </p>

        {error && <p className="text-red-500 text-center text-sm italic mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center text-sm italic mb-4">{success}</p>}

        {/* --- (*** นี่คือจุดที่แก้ไข Bug ***) --- */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handleSimulatePayment}
            // เปลี่ยนจาก 'success' (string) เป็น 'success !== null' (boolean)
            disabled={isLoading || (success !== null) || (countdown === 0)} 
            className={`w-full ${
              (isLoading || success || countdown === 0) // (className ไม่เป็นไรเพราะ Tailwind จัดการ truthy/falsy ได้)
                ? 'bg-gray-500' 
                : 'bg-green-600 hover:bg-green-700'
            } text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline text-base`}
          >
            {/* (ส่วน Text นี้ถูกต้องอยู่แล้ว ไม่ต้องแก้) */}
            {isLoading ? 'Processing Payment...' : 
             success ? 'Payment Successful!' : 
             countdown === 0 ? 'Time Expired' : 
             'Simulate Payment (Webhook)'}
          </button>
        </div>
        {/* --- (สิ้นสุดการแก้ไข) --- */}

      </div>
    </div>
  );
}