const API_BASE = 'http://localhost:8000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const token = localStorage.getItem('auth-token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth API
  async login(email, password) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request('/logout', {
      method: 'POST',
    });
  }

  async me() {
    return this.request('/me');
  }

  async register(data) {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Room API
  async getRooms() {
    return this.request('/rooms');
  }

  async getRoom(id) {
    return this.request(`/rooms/${id}`);
  }

  async createRoom(data) {
    return this.request('/rooms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRoom(id, data) {
    return this.request(`/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRoom(id) {
    return this.request(`/rooms/${id}`, {
      method: 'DELETE',
    });
  }

  // Venue API
  async getVenues() {
    return this.request('/venues');
  }

  async getVenue(id) {
    return this.request(`/venues/${id}`);
  }

  async createVenue(data) {
    return this.request('/venues', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateVenue(id, data) {
    return this.request(`/venues/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteVenue(id) {
    return this.request(`/venues/${id}`, {
      method: 'DELETE',
    });
  }

  async checkVenueAvailability(venueId, startDate, endDate) {
    return this.request(`/venues/${venueId}/availability?start_date=${startDate}&end_date=${endDate}`);
  }

  // Room Reservation API
  async getReservations() {
    return this.request('/reservations');
  }

  async getReservation(id) {
    return this.request(`/reservations/${id}`);
  }

  async createReservation(data) {
    return this.request('/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateReservation(id, data) {
    return this.request(`/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteReservation(id) {
    return this.request(`/reservations/${id}`, {
      method: 'DELETE',
    });
  }

  async checkRoomAvailability(roomId, checkInDate, checkOutDate) {
    return this.request(`/rooms/${roomId}/availability?check_in_date=${checkInDate}&check_out_date=${checkOutDate}`);
  }

  async updateReservationPaymentStatus(id, status) {
    return this.request(`/reservations/${id}/payment-status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Venue Reservation API
  async getVenueReservations() {
    return this.request('/venue-reservations');
  }

  async getVenueReservation(id) {
    return this.request(`/venue-reservations/${id}`);
  }

  async createVenueReservation(data) {
    return this.request('/venue-reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateVenueReservation(id, data) {
    return this.request(`/venue-reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteVenueReservation(id) {
    return this.request(`/venue-reservations/${id}`, {
      method: 'DELETE',
    });
  }

  async updateVenueReservationPaymentStatus(id, status) {
    return this.request(`/venue-reservations/${id}/payment-status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Reports API
  async getReports() {
    return this.request('/reports');
  }
}

export default new ApiService(); 