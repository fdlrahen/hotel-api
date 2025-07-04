import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaBuilding, FaSearch, FaMoneyBillWave } from 'react-icons/fa';
import apiService from '../services/api';
import { formatRupiah } from '../utils/formatCurrency';
import { useAuth } from '../contexts/AuthContext';

const VenueReservations = () => {
  const { isAdmin } = useAuth();
  const [venueReservations, setVenueReservations] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_phone: '',
    venue_id: '',
    start_date: '',
    end_date: '',
    status: 'unpaid'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [venueReservationsRes, venuesRes] = await Promise.all([
        apiService.getVenueReservations(),
        apiService.getVenues()
      ]);
      setVenueReservations(venueReservationsRes.data || []);
      setVenues(venuesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingReservation) {
        await apiService.updateVenueReservation(editingReservation.id, formData);
      } else {
        await apiService.createVenueReservation(formData);
      }
      
      await fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving venue reservation:', error);
      alert('Terjadi kesalahan saat menyimpan reservasi venue: ' + error.message);
    }
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setFormData({
      guest_name: reservation.guest_name,
      guest_phone: reservation.guest_phone,
      venue_id: reservation.venue_id,
      start_date: reservation.start_date.split('T')[0],
      end_date: reservation.end_date.split('T')[0],
      status: reservation.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus reservasi venue ini?')) {
      try {
        await apiService.deleteVenueReservation(id);
        await fetchData();
      } catch (error) {
        console.error('Error deleting venue reservation:', error);
        alert('Terjadi kesalahan saat menghapus reservasi venue: ' + error.message);
      }
    }
  };

  const handlePaymentStatusUpdate = async (id, status) => {
    try {
      await apiService.updateVenueReservationPaymentStatus(id, status);
      await fetchData();
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Terjadi kesalahan saat mengupdate status pembayaran: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      guest_name: '',
      guest_phone: '',
      venue_id: '',
      start_date: '',
      end_date: '',
      status: 'unpaid'
    });
    setEditingReservation(null);
    setShowModal(false);
  };

  const filteredReservations = venueReservations
    .filter(reservation =>
      reservation.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.guest_phone.includes(searchTerm) ||
      (reservation.venue && reservation.venue.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Memuat reservasi venue...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reservasi Venue</h1>
          <p className="text-gray-600">Kelola booking venue acara dan ruang meeting</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <FaPlus className="w-4 h-4" />
          <span>Tambah Reservasi</span>
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama tamu, telepon, atau nama venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10"
          />
        </div>
      </div>

      {/* Venue Reservations List */}
      <div className="space-y-4">
        {filteredReservations.length > 0 && (
          <div className="text-sm text-gray-500 px-1">
            Menampilkan {filteredReservations.length} reservasi venue (terbaru di atas)
          </div>
        )}
        {filteredReservations.map((reservation) => (
          <div key={reservation.id} className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FaBuilding className="w-6 h-6 text-purple-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="font-semibold text-gray-900">{reservation.guest_name}</h3>
                    <span className={`status-badge ${
                      reservation.status === 'paid' ? 'status-paid' : 'status-unpaid'
                    }`}>
                      {reservation.status === 'paid' ? 'Lunas' : 'Belum Lunas'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Venue:</span> {reservation.venue?.name}
                    </div>
                    <div>
                      <span className="font-medium">Telepon:</span> {reservation.guest_phone}
                    </div>
                    <div>
                      <span className="font-medium">Mulai:</span> {new Date(reservation.start_date).toLocaleDateString('id-ID')}
                    </div>
                    <div>
                      <span className="font-medium">Selesai:</span> {new Date(reservation.end_date).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="text-sm">
                      <span className="font-medium text-gray-600">Total:</span>
                      <span className="font-bold text-gray-900 ml-1">{formatRupiah(reservation.total_price)}</span>
                    </div>
                    {reservation.days_count && (
                      <div className="text-sm text-gray-500">
                        {reservation.days_count} hari
                      </div>
                    )}
                    <div className="text-sm text-gray-500">
                      Kapasitas: {reservation.venue?.capacity} orang
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {reservation.status === 'unpaid' && (
                  <button
                    onClick={() => handlePaymentStatusUpdate(reservation.id, 'paid')}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Tandai Sudah Bayar"
                  >
                    <FaMoneyBillWave className="w-4 h-4" />
                  </button>
                )}
                
                <button
                  onClick={() => handleEdit(reservation)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
                
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(reservation.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReservations.length === 0 && (
        <div className="text-center py-12">
          <FaBuilding className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Tidak ada reservasi venue ditemukan</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingReservation ? 'Edit Reservasi Venue' : 'Tambah Reservasi Venue Baru'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Nama Tamu</label>
                  <input
                    type="text"
                    required
                    value={formData.guest_name}
                    onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                    className="form-input"
                    placeholder="Masukkan nama tamu"
                  />
                </div>
                
                <div>
                  <label className="form-label">Nomor Telepon</label>
                  <input
                    type="tel"
                    required
                    value={formData.guest_phone}
                    onChange={(e) => setFormData({ ...formData, guest_phone: e.target.value })}
                    className="form-input"
                    placeholder="Masukkan nomor telepon"
                  />
                </div>
              </div>
              
              <div>
                <label className="form-label">Venue</label>
                <select
                  required
                  value={formData.venue_id}
                  onChange={(e) => setFormData({ ...formData, venue_id: e.target.value })}
                  className="form-input"
                >
                  <option value="">Pilih venue</option>
                  {venues.map(venue => (
                    <option key={venue.id} value={venue.id}>
                      {venue.name} - {venue.capacity} orang ({formatRupiah(venue.price_per_day)}/hari)
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Tanggal Mulai</label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="form-input"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label className="form-label">Tanggal Selesai</label>
                  <input
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="form-input"
                    min={formData.start_date || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              
              <div>
                <label className="form-label">Status Pembayaran</label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="form-input"
                >
                  <option value="unpaid">Belum Lunas</option>
                  <option value="paid">Lunas</option>
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary flex-1"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  {editingReservation ? 'Perbarui' : 'Buat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueReservations; 