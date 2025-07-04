import React, { useState, useEffect } from 'react';
import { 
  FaBed, 
  FaBuilding, 
  FaCalendarCheck, 
  FaMoneyBillWave,
  FaUsers,
  FaChartLine
} from 'react-icons/fa';
import apiService from '../services/api';
import { formatRupiah } from '../utils/formatCurrency';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalVenues: 0,
    totalReservations: 0,
    totalVenueReservations: 0,
    paidReservations: 0,
    unpaidReservations: 0
  });
  const [recentReservations, setRecentReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data
      const [roomsRes, venuesRes, reservationsRes, venueReservationsRes] = await Promise.all([
        apiService.getRooms(),
        apiService.getVenues(),
        apiService.getReservations(),
        apiService.getVenueReservations()
      ]);

      // Calculate stats
      const reservations = reservationsRes.data || [];
      const venueReservations = venueReservationsRes.data || [];
      
      const paidCount = reservations.filter(r => r.status === 'paid').length + 
                        venueReservations.filter(r => r.status === 'paid').length;
      const unpaidCount = reservations.filter(r => r.status === 'unpaid').length + 
                          venueReservations.filter(r => r.status === 'unpaid').length;

      setStats({
        totalRooms: roomsRes.data?.length || 0,
        totalVenues: venuesRes.data?.length || 0,
        totalReservations: reservations.length,
        totalVenueReservations: venueReservations.length,
        paidReservations: paidCount,
        unpaidReservations: unpaidCount
      });

      // Get recent reservations (combine both types)
      const allReservations = [
        ...reservations.map(r => ({ ...r, type: 'room' })),
        ...venueReservations.map(r => ({ ...r, type: 'venue' }))
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);

      setRecentReservations(allReservations);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, subtitle }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Memuat dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Selamat datang di Sistem Manajemen Hotel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard
          icon={FaBed}
          title="Total Kamar"
          value={stats.totalRooms}
          color="bg-blue-500"
          subtitle="Kamar tersedia"
        />
        <StatCard
          icon={FaBuilding}
          title="Total Venue"
          value={stats.totalVenues}
          color="bg-purple-500"
          subtitle="Ruang acara"
        />
        <StatCard
          icon={FaCalendarCheck}
          title="Reservasi Kamar"
          value={stats.totalReservations}
          color="bg-green-500"
          subtitle="Booking aktif"
        />
        <StatCard
          icon={FaUsers}
          title="Reservasi Venue"
          value={stats.totalVenueReservations}
          color="bg-orange-500"
          subtitle="Booking acara"
        />
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          icon={FaMoneyBillWave}
          title="Reservasi Lunas"
          value={stats.paidReservations}
          color="bg-green-600"
          subtitle="Pembayaran selesai"
        />
        <StatCard
          icon={FaChartLine}
          title="Reservasi Belum Lunas"
          value={stats.unpaidReservations}
          color="bg-red-500"
          subtitle="Menunggu pembayaran"
        />
      </div>

      {/* Recent Reservations */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Reservasi Terbaru</h2>
        
        {recentReservations.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Belum ada reservasi terbaru</p>
        ) : (
          <div className="space-y-3">
            {recentReservations.map((reservation, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    reservation.type === 'room' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    {reservation.type === 'room' ? 
                      <FaBed className={`w-4 h-4 ${reservation.type === 'room' ? 'text-blue-600' : 'text-purple-600'}`} /> :
                      <FaBuilding className="w-4 h-4 text-purple-600" />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{reservation.guest_name}</p>
                    <p className="text-sm text-gray-500">
                      Reservasi {reservation.type === 'room' ? 'Kamar' : 'Venue'} • {reservation.guest_phone}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`status-badge ${
                    reservation.status === 'paid' ? 'status-paid' : 'status-unpaid'
                  }`}>
                    {reservation.status === 'paid' ? 'Lunas' : 'Belum Lunas'}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatRupiah(reservation.total_price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 