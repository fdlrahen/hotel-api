import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaBed, 
  FaBuilding, 
  FaCalendarCheck, 
  FaCalendarAlt 
} from 'react-icons/fa';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/',
      icon: FaTachometerAlt,
      label: 'Dashboard',
      exact: true
    },
    {
      path: '/rooms',
      icon: FaBed,
      label: 'Rooms'
    },
    {
      path: '/venues',
      icon: FaBuilding,
      label: 'Venues'
    },
    {
      path: '/reservations',
      icon: FaCalendarCheck,
      label: 'Room Reservations'
    },
    {
      path: '/venue-reservations',
      icon: FaCalendarAlt,
      label: 'Venue Reservations'
    }
  ];

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
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
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

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="px-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="text-sm">
                <span className="text-gray-600">Active Rooms:</span>
                <span className="font-medium text-gray-900 ml-2">--</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Today's Reservations:</span>
                <span className="font-medium text-gray-900 ml-2">--</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar; 