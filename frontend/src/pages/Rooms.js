import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaBed, FaSearch } from 'react-icons/fa';
import apiService from '../services/api';
import { formatRupiah } from '../utils/formatCurrency';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    room_number: '',
    room_type: '',
    price_per_day: ''
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await apiService.getRooms();
      setRooms(response.data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await apiService.updateRoom(editingRoom.id, formData);
      } else {
        await apiService.createRoom(formData);
      }
      
      await fetchRooms();
      resetForm();
    } catch (error) {
      console.error('Error saving room:', error);
      alert('Terjadi kesalahan saat menyimpan kamar: ' + error.message);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      room_number: room.room_number,
      room_type: room.room_type,
      price_per_day: room.price_per_day
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus kamar ini?')) {
      try {
        await apiService.deleteRoom(id);
        await fetchRooms();
      } catch (error) {
        console.error('Error deleting room:', error);
        alert('Terjadi kesalahan saat menghapus kamar: ' + error.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      room_number: '',
      room_type: '',
      price_per_day: ''
    });
    setEditingRoom(null);
    setShowModal(false);
  };

  const filteredRooms = rooms.filter(room =>
    room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.room_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Memuat kamar...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Kamar</h1>
          <p className="text-gray-600">Kelola kamar hotel dan detailnya</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <FaPlus className="w-4 h-4" />
          <span>Tambah Kamar</span>
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari kamar berdasarkan nomor atau tipe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10"
          />
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <div key={room.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaBed className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Kamar {room.room_number}</h3>
                  <p className="text-sm text-gray-500">{room.room_type}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(room)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(room.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Harga per hari:</span>
                <span className="font-medium text-gray-900">
                  {formatRupiah(room.price_per_day)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <FaBed className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Tidak ada kamar ditemukan</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingRoom ? 'Edit Kamar' : 'Tambah Kamar Baru'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Nomor Kamar</label>
                <input
                  type="text"
                  required
                  value={formData.room_number}
                  onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                  className="form-input"
                  placeholder="contoh: 101, 202A"
                />
              </div>
              
              <div>
                <label className="form-label">Tipe Kamar</label>
                <select
                  required
                  value={formData.room_type}
                  onChange={(e) => setFormData({ ...formData, room_type: e.target.value })}
                  className="form-input"
                >
                  <option value="">Pilih tipe kamar</option>
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Presidential">Presidential</option>
                </select>
              </div>
              
              <div>
                <label className="form-label">Harga per Hari (Rp)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1000"
                  value={formData.price_per_day}
                  onChange={(e) => setFormData({ ...formData, price_per_day: e.target.value })}
                  className="form-input"
                  placeholder="0"
                />
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
                  {editingRoom ? 'Perbarui' : 'Buat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms; 