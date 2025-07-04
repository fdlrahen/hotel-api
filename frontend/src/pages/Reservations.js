import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCalendarCheck, FaSearch, FaMoneyBillWave } from 'react-icons/fa';
import apiService from '../services/api';
import { formatRupiah } from '../utils/formatCurrency';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_phone: '',
    room_id: '',
    check_in_date: '',
    check_out_date: '',
    status: 'unpaid'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reservationsRes, roomsRes] = await Promise.all([
        apiService.getReservations(),
        apiService.getRooms()
      ]);
      setReservations(reservationsRes.data || []);
      setRooms(roomsRes.data || []);
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
        await apiService.updateReservation(editingReservation.id, formData);
      } else {
        await apiService.createReservation(formData);
      }
      
      await fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving reservation:', error);
      alert('Terjadi kesalahan saat menyimpan reservasi: ' + error.message);
    }
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setFormData({
      guest_name: reservation.guest_name,
      guest_phone: reservation.guest_phone,
      room_id: reservation.room_id,
      check_in_date: reservation.check_in_date.split('T')[0],
      check_out_date: reservation.check_out_date.split('T')[0],
      status: reservation.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus reservasi ini?')) {
      try {
        await apiService.deleteReservation(id);
        await fetchData();
      } catch (error) {
        console.error('Error deleting reservation:', error);
        alert('Terjadi kesalahan saat menghapus reservasi: ' + error.message);
      }
    }
  };

  const handlePaymentStatusUpdate = async (id, status) => {
    try {
      await apiService.updateReservationPaymentStatus(id, status);
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
      room_id: '',
      check_in_date: '',
      check_out_date: '',
      status: 'unpaid'
    });
    setEditingReservation(null);
    setShowModal(false);
  };

  const filteredReservations = reservations
    .filter(reservation =>
      reservation.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.guest_phone.includes(searchTerm) ||
      (reservation.room && reservation.room.room_number.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Memuat reservasi...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reservasi Kamar</h1>
          <p className="text-gray-600">Kelola booking dan reservasi kamar hotel</p>
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
            placeholder="Cari berdasarkan nama tamu, telepon, atau nomor kamar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10"
          />
        </div>
      </div>

      {/* Reservations List */}
      <div className="space-y-4">
        {filteredReservations.length > 0 && (
          <div className="text-sm text-gray-500 px-1">
            Menampilkan {filteredReservations.length} reservasi (terbaru di atas)
          </div>
        )}
        {filteredReservations.map((reservation) => (
          <div key={reservation.id} className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaCalendarCheck className="w-6 h-6 text-blue-600" />
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
                      <span className="font-medium">Kamar:</span> {reservation.room?.room_number} ({reservation.room?.room_type})
                    </div>
                    <div>
                      <span className="font-medium">Telepon:</span> {reservation.guest_phone}
                    </div>
                    <div>
                      <span className="font-medium">Check-in:</span> {new Date(reservation.check_in_date).toLocaleDateString('id-ID')}
                    </div>
                    <div>
                      <span className="font-medium">Check-out:</span> {new Date(reservation.check_out_date).toLocaleDateString('id-ID')}
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
                
                <button
                  onClick={() => handleDelete(reservation.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReservations.length === 0 && (
        <div className="text-center py-12">
          <FaCalendarCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Tidak ada reservasi ditemukan</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingReservation ? 'Edit Reservasi' : 'Tambah Reservasi Baru'}
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
                <label className="form-label">Kamar</label>
                <select
                  required
                  value={formData.room_id}
                  onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
                  className="form-input"
                >
                  <option value="">Pilih kamar</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>
                      Kamar {room.room_number} - {room.room_type} ({formatRupiah(room.price_per_day)}/hari)
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Tanggal Check-in</label>
                  <input
                    type="date"
                    required
                    value={formData.check_in_date}
                    onChange={(e) => setFormData({ ...formData, check_in_date: e.target.value })}
                    className="form-input"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label className="form-label">Tanggal Check-out</label>
                  <input
                    type="date"
                    required
                    value={formData.check_out_date}
                    onChange={(e) => setFormData({ ...formData, check_out_date: e.target.value })}
                    className="form-input"
                    min={formData.check_in_date || new Date().toISOString().split('T')[0]}
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

export default Reservations; 