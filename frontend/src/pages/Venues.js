import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaBuilding, FaSearch, FaUsers } from 'react-icons/fa';
import apiService from '../services/api';
import { formatRupiah } from '../utils/formatCurrency';

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    price_per_day: ''
  });

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const response = await apiService.getVenues();
      setVenues(response.data || []);
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVenue) {
        await apiService.updateVenue(editingVenue.id, formData);
      } else {
        await apiService.createVenue(formData);
      }
      
      await fetchVenues();
      resetForm();
    } catch (error) {
      console.error('Error saving venue:', error);
      alert('Terjadi kesalahan saat menyimpan venue: ' + error.message);
    }
  };

  const handleEdit = (venue) => {
    setEditingVenue(venue);
    setFormData({
      name: venue.name,
      capacity: venue.capacity,
      price_per_day: venue.price_per_day
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus venue ini?')) {
      try {
        await apiService.deleteVenue(id);
        await fetchVenues();
      } catch (error) {
        console.error('Error deleting venue:', error);
        alert('Terjadi kesalahan saat menghapus venue: ' + error.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      capacity: '',
      price_per_day: ''
    });
    setEditingVenue(null);
    setShowModal(false);
  };

  const filteredVenues = venues.filter(venue =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Memuat venue...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Venue</h1>
          <p className="text-gray-600">Kelola venue acara dan ruang meeting</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <FaPlus className="w-4 h-4" />
          <span>Tambah Venue</span>
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari venue berdasarkan nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10"
          />
        </div>
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVenues.map((venue) => (
          <div key={venue.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FaBuilding className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{venue.name}</h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <FaUsers className="w-3 h-3" />
                    <span>{venue.capacity} orang</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(venue)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(venue.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Kapasitas:</span>
                <span className="font-medium text-gray-900">{venue.capacity} orang</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Harga per hari:</span>
                <span className="font-medium text-gray-900">
                  {formatRupiah(venue.price_per_day)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVenues.length === 0 && (
        <div className="text-center py-12">
          <FaBuilding className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Tidak ada venue ditemukan</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingVenue ? 'Edit Venue' : 'Tambah Venue Baru'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Nama Venue</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  placeholder="contoh: Grand Ballroom, Ruang Konferensi A"
                />
              </div>
              
              <div>
                <label className="form-label">Kapasitas (Orang)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="form-input"
                  placeholder="contoh: 50, 100, 200"
                />
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
                  {editingVenue ? 'Perbarui' : 'Buat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Venues; 