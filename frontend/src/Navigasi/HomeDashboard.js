// src/Dashboard.js
import React from 'react';

const HomeDashboard = () => {
  return (
    <div className="min-vh-100 bg-light p-md-3 mt-- pt-0 mb-0 pb-0">
        <div className="bg-primary text-white py-5" style={{
            backgroundImage: "url('/Picture/SeratonSamping.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'top-center',
            backgroundRepeat: 'no-repeat',
            color: 'white',
            overflowX: 'hidden'

        }}
        >
      <div className="container py-5">
        {/* Form Pencarian Hotel */}
        <div className="card p-4 shadow-lg" style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
          <div className="card-body">
            <h5 className="card-title text-center mb-4" style={{ fontFamily: 'var(--heading-font)', color: 'var(--text-color)' }}>
              Cari Hotel
            </h5>
            <form>
              <div className="row g-3"> {/* g-3 untuk gap antar kolom */}
                {/* Input Destinasi/Nama Hotel */}
                <div className="col-md-6 col-lg-4">
                  <label htmlFor="destination" className="form-label">Pilih ruangan</label>
                  <input
                    type="text"
                    className="form-control"
                    id="destination"
                    placeholder="Contoh: Bali, Hotel Grand"
                  />
                </div>

                {/* Input Tanggal Check-in */}
                <div className="col-md-6 col-lg-3">
                  <label htmlFor="checkinDate" className="form-label">Check-in</label>
                  <input
                    type="date"
                    className="form-control"
                    id="checkinDate"
                  />
                </div>

                {/* Input Tanggal Check-out */}
                <div className="col-md-6 col-lg-3">
                  <label htmlFor="checkoutDate" className="form-label">Check-out</label>
                  <input
                    type="date"
                    className="form-control"
                    id="checkoutDate"
                  />
                </div>

                {/* Input Jumlah Kamar */}
                <div className="col-md-6 col-lg-2">
                  <label htmlFor="rooms" className="form-label">Kamar</label>
                  <input
                    type="number"
                    className="form-control"
                    id="rooms"
                    defaultValue="1"
                    min="1"
                  />
                </div>
                {/* Tombol Cari */}
                <div className="col-12 text-center mt-4">
                  <button type="submit" className="btn btn-primary btn-lg" style={{ backgroundColor: 'var(--accent-color)', borderColor: 'var(--accent-color)' }}>
                    Cari Sekarang
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    
     <div className="container d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '300px', backgroundColor: '#f8f9fa', padding: '20px 0' }}>
        {/* Sesuaikan minHeight, backgroundColor, dan padding */}
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 text-center">
            <h2 style={{ fontFamily: 'var(--heading-font)', color: 'var(--primary-color)' }}>
              Find Luxury and Awesome Experience in Seraton Hotel
            </h2>
            <p className="lead">
              Temukan pengalaman menginap terbaik Anda bersama kami. Kami berkomitmen untuk memberikan kenyamanan dan pelayanan istimewa di setiap kunjungan Anda.
            </p>
          </div>
        </div>
      </div>
    
     <div className="d-flex align-items-center justify-content-center"
        style={{ minHeight: '50vh', backgroundColor: '#f8f9fa' }}
        >
        <h1 className="text-secondary text-center" style={{ fontFamily: 'var(--heading-font)' }}>
            Konten Aplikasi Anda
        </h1>
    </div>

      
    </div>
  );
};

export default HomeDashboard;
