import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaBed, 
  FaBuilding, 
  FaCalendarCheck, 
  FaCalendarAlt
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const { canAccess } = useAuth();

  const menuItems = [
    {
      path: '/',
      icon: FaTachometerAlt,
      label: 'Dashboard',
      exact: true,
      roles: ['admin', 'resepsionis']
    },
    {
      path: '/rooms',
      icon: FaBed,
      label: 'Kamar',
      roles: ['admin'] // Hanya admin
    },
    {
      path: '/venues',
      icon: FaBuilding,
      label: 'Venue',
      roles: ['admin'] // Hanya admin
    },
    {
      path: '/reservations',
      icon: FaCalendarCheck,
      label: 'Reservasi Kamar',
      roles: ['admin', 'resepsionis'] // Kedua role
    },
    {
      path: '/venue-reservations',
      icon: FaCalendarAlt,
      label: 'Reservasi Venue',
      roles: ['admin', 'resepsionis'] // Kedua role
    }
  ];

  // Filter menu berdasarkan role
  const allowedMenuItems = menuItems.filter(item => 
    canAccess(item.roles)
  );

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <aside className={`
      fixed left-0 top-16 h-full w-64 bg-white shadow-lg border-r border-gray-200 
      transform transition-transform duration-300 z-40
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      md:translate-x-0
    `}>
      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {allowedMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`sidebar-item ${isActive(item) ? 'active' : ''}`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar; 