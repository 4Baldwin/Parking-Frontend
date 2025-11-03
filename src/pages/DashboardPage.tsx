// src/pages/DashboardPage.tsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';

// (Interface นี้อิงจาก Backend)
interface Ticket {
  id: string;
  status: string;
  vehiclePlate: string;
  checkinAt: string | null;
  reservationStartTime: string | null;
  space: {
    code: string;
  };
  amountDue: number | null;
  createdAt: string;
}

// (Helper เพื่อจัดรูปแบบวันที่)
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('th-TH', { // (ใช้ th-TH)
    day: '2-digit', 
    month: 'short', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// (Helper เพื่อกำหนดสีสถานะ)
const getStatusColor = (status: string) => {
  switch (status) {
    case 'PARKED':
      return 'bg-blue-600 text-blue-100';
    case 'RESERVED':
      return 'bg-yellow-600 text-yellow-100';
    case 'PENDING_PAYMENT':
      return 'bg-orange-600 text-orange-100';
    case 'COMPLETED':
      return 'bg-green-600 text-green-100';
    case 'NO_SHOW':
      return 'bg-red-700 text-red-100';
    default:
      return 'bg-gray-600 text-gray-100';
  }
};

export function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyTickets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // (เรียก Endpoint ใหม่ที่เราสร้างใน Backend)
        const response = await apiClient.get('/tickets/my');
        setTickets(response.data);
      } catch (err: any) {
        console.error('Failed to fetch tickets:', err);
        setError('Failed to load your tickets.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyTickets();
  }, []);

  // (แยกตั๋วที่ Active)
  const activeTickets = tickets.filter(t => 
    t.status === 'RESERVED' || 
    t.status === 'PARKED' || 
    t.status === 'PENDING_PAYMENT'
  );
  const pastTickets = tickets.filter(t => 
    t.status !== 'RESERVED' && 
    t.status !== 'PARKED' && 
    t.status !== 'PENDING_PAYMENT'
  );

  const renderTicketList = (ticketList: Ticket[]) => {
    if (ticketList.length === 0) {
      return <p className="text-gray-400">No tickets found in this category.</p>;
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ticketList.map(ticket => (
          <div key={ticket.id} className="bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold text-white">
                  Space {ticket.space.code}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
                </span>
              </div>
              <p className="text-sm text-gray-300">Plate: {ticket.vehiclePlate}</p>
              <p className="text-sm text-gray-400">Booked: {formatDate(ticket.createdAt)}</p>
              {ticket.checkinAt && (
                <p className="text-sm text-gray-400">Checked-in: {formatDate(ticket.checkinAt)}</p>
              )}
            </div>
            {ticket.status === 'PENDING_PAYMENT' && ticket.amountDue && (
              <div className="mt-3 text-right">
                <span className="text-yellow-400 font-bold">Due: {Number(ticket.amountDue).toFixed(2)} THB</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    // (หน้านี้จะถูกแสดงใน MainLayout จึงมี Navbar อยู่แล้ว)
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-white mb-6">My Dashboard</h1>
      
      {/* (ปุ่มไปหน้า Parking) */}
      <div className="mb-8">
        <Link to="/parking">
          <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg text-lg">
            Go to Parking Lot
          </button>
        </Link>
      </div>

      {/* (ส่วนแสดงตั๋ว) */}
      {isLoading ? (
        <p className="text-gray-400">Loading your tickets...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <h2 className="text-2xl font-semibold text-white mb-4">Active Tickets</h2>
          {renderTicketList(activeTickets)}
          
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Past Tickets</h2>
          {renderTicketList(pastTickets)}
        </>
      )}
    </div>
  );
}