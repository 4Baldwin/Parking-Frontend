// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import './styles/index.css';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage.tsx';
import { ResetPasswordPage } from './pages/ResetPasswordPage.tsx';
import { ParkingLotPage } from './pages/ParkingLotPage.tsx';
import { MainLayout } from './components/layout/MainLayout';
import { ReservationConfirmPage } from './pages/ReservationConfirmPage.tsx';
import { PaymentPage } from './pages/PaymentPage.tsx';

// --- (เพิ่ม Import 1 บรรทัดสำหรับ Dashboard) ---
import { DashboardPage } from './pages/DashboardPage.tsx'; // (ไฟล์ที่เราเพิ่งสร้าง)

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
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
    element: <MainLayout />, // (หน้าที่มี Navbar)
    children: [
      // --- (เพิ่ม Route /dashboard) ---
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/parking',
        element: <ParkingLotPage />,
      },
      {
        path: '/reserve-confirm',
        element: <ReservationConfirmPage />,
      },
      {
        path: '/payment/:ticketId',
        element: <PaymentPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);