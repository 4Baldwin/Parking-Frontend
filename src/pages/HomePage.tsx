// src/pages/HomePage.tsx

import ConnectAParkLogo from '../assets/Logo-ConnectAPark.png';
import { Link } from 'react-router-dom';

function HomePage() {
  const appName = "ConnectAPark";

  return (
    // Container: ใช้ p-4 สำหรับมือถือ, เพิ่มเป็น sm:p-6, md:p-8 สำหรับจอใหญ่
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 sm:p-6 md:p-8 text-center">

      {/* Logo: ปรับขนาดตามหน้าจอ */}
      <div className="flex justify-center items-center mb-4 sm:mb-6">
        {/* h-24 บนมือถือ, ใหญ่ขึ้นเป็น sm:h-28, md:h-32 */}
        <img src={ConnectAParkLogo} className="h-24 sm:h-28 md:h-32" alt="ConnectAPark Logo" />
      </div>

      {/* ชื่อแอปฯ: ปรับขนาดตัวอักษร */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-blue-400">{appName}</h1>

      {/* คำอธิบาย: ปรับขนาดตัวอักษร, กำหนดความกว้างสูงสุด */}
      <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 max-w-md"> {/* max-w-md ช่วยให้อ่านง่ายบนจอใหญ่ */}
        เชื่อมต่อคุณไปยังที่จอดรถที่คุณต้องการ
      </p>

      {/* ปุ่ม Login (ย้ายมาใต้คำอธิบาย): ปรับขนาด/margin */}
      <div className="mt-6 sm:mt-8">
          <Link to="/login">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 sm:py-3 sm:px-7 rounded text-base sm:text-lg">
                  Login / Register
              </button>
          </Link>
      </div>

      {/* (Optional) ส่วน Counter (อาจซ่อนหรือลบออก) */}
      {/* <div className="bg-gray-800 p-4 rounded-lg shadow-md mt-10 opacity-50 hidden"> ... </div> */}

    </div>
  )
}

export default HomePage;