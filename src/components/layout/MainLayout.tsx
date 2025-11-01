// src/components/layout/MainLayout.tsx
import { Outlet } from 'react-router-dom'; // ลบ React ออก
import { Navbar } from './Navbar';

export function MainLayout() {
  return (
    // ใช้ Flex column เพื่อให้ Navbar อยู่บน และ main ขยายเต็มที่
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Navbar /> {/* แสดง Navbar ด้านบนเสมอ */}
      
      {/* --- แก้ไข: ลบ Padding ออก --- */}
      <main> 
        <Outlet /> {/* เนื้อหาของแต่ละหน้า (เช่น ParkingLotPage) จะแสดงตรงนี้ */}
      </main>
      {/* --- สิ้นสุดการแก้ไข --- */}
      
      {/* <Footer /> */}
    </div>
  );
}