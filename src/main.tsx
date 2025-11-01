// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage'; // <-- หน้าหลัก
import './styles/index.css';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage.tsx';
import { ResetPasswordPage } from './pages/ResetPasswordPage.tsx';
import { ParkingLotPage } from './pages/ParkingLotPage.tsx';
import { MainLayout } from './components/layout/MainLayout'; // <-- 1. Import MainLayout

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />, // หน้าแรกแสดง HomePage (ไม่มี Navbar)
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
   {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    // --- 2. ใช้ MainLayout เป็น element หลักสำหรับกลุ่ม Route ที่ต้องการ Navbar ---
    element: <MainLayout />,
    // --- 3. ย้าย Route ที่ต้องการ Navbar มาเป็น children ---
    children: [
      {
        path: '/parking', // Route นี้จะแสดง Navbar + ParkingLotPage
        element: <ParkingLotPage />,
      },
      // คุณสามารถเพิ่ม Route อื่นๆ ที่ต้องการ Navbar ที่นี่
      // เช่น { path: '/my-tickets', element: <MyTicketsPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);