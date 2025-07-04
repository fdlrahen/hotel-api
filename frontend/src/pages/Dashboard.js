import React, { useState, useEffect } from 'react';
import { 
  FaBed, 
  FaBuilding, 
  FaCalendarCheck, 
  FaMoneyBillWave,
  FaUsers,
  FaChartLine,
  FaClock,
  FaCalendarWeek,
  FaCalendarAlt
} from 'react-icons/fa';
import apiService from '../services/api';
import { formatRupiah } from '../utils/formatCurrency';

const Dashboard = () => {
  const [reportData, setReportData] = useState(null);
  const [recentReservations, setRecentReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch reports data from new API
      const reportsResponse = await apiService.getReports();
      setReportData(reportsResponse.data);

      // Fetch recent reservations (tetap menggunakan cara lama untuk recent reservations)
      const [reservationsRes, venueReservationsRes] = await Promise.all([
        apiService.getReservations(),
        apiService.getVenueReservations()
      ]);

      const reservations = reservationsRes.data || [];
      const venueReservations = venueReservationsRes.data || [];

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
        {/* Conditionally render the icon container only if 'Icon' is provided */}
        {Icon && (
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
    </div>
  );

  const PeriodStatsCard = ({ title, icon: Icon, data, color }) => (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Reservasi Kamar:</span>
          <span className="font-medium">{data.room_reservations}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Reservasi Venue:</span>
          <span className="font-medium">{data.venue_reservations}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-sm font-medium text-gray-600">Pendapatan:</span>
          <span className="font-bold text-green-600">{formatRupiah(data.revenue)}</span>
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

  if (!reportData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Gagal memuat data laporan</div>
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

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={FaBed}
          title="Total Kamar"
          value={reportData.totals.total_rooms}
          color="bg-blue-500"
          subtitle="Kamar tersedia"
        />
        <StatCard
          icon={FaBuilding}
          title="Total Venue"
          value={reportData.totals.total_venues}
          color="bg-purple-500"
          subtitle="Ruang acara"
        />
        <StatCard
          title="Total Pendapatan"
          value={formatRupiah(reportData.totals.total_revenue)}
          color="bg-orange-500"
          subtitle="Pembayaran lunas"
        />
      </div>

      {/* Period Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PeriodStatsCard
          title="Hari Ini"
          icon={FaClock}
          data={reportData.today}
          color="bg-blue-600"
        />
        <PeriodStatsCard
          title="Bulan Ini"
          icon={FaCalendarWeek}
          data={reportData.this_month}
          color="bg-green-600"
        />
        <PeriodStatsCard
          title="Tahun Ini"
          icon={FaCalendarAlt}
          data={reportData.this_year}
          color="bg-purple-600"
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
                      <FaBed className="w-4 h-4 text-blue-600" /> :
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