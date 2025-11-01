// src/services/api.ts

import axios from 'axios';

// สร้าง instance ของ axios
const apiClient = axios.create({
  // ตั้งค่า URL พื้นฐานของ Backend API ของคุณ
  baseURL: 'http://localhost:3000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// (Optional) ส่วนนี้ใช้สำหรับดึง Token จาก Local Storage 
// และแนบไปกับทุก Request โดยอัตโนมัติ (หลังจาก Login)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;