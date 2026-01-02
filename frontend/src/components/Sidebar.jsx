import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      icon: '🏠',
      label: 'Dashboard',
      path: '/dashboard',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: '🌾',
      label: 'Crop Recommendation',
      path: '/crop-recommendation',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: '🧪',
      label: 'Fertilizer',
      path: '/fertilizer-recommendation',
      gradient: 'from-teal-500 to-green-500',
    },
    {
      icon: '🦠',
      label: 'Disease Detection',
      path: '/disease-detection',
      gradient: 'from-purple-500 to-pink-500',
    },

  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
      >
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${isCollapsed ? 'lg:w-20' : 'w-64'} bg-white shadow-2xl border-r border-gray-200`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-6 border-b border-gray-200 relative">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
              <div className={`${isCollapsed ? 'w-10 h-10' : 'w-12 h-12'} bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110`}>
                <span className={`${isCollapsed ? 'text-xl' : 'text-2xl'}`}>🌱</span>
              </div>
              {!isCollapsed && (
                <div className="transition-opacity duration-300">
                  <h1 className="text-xl font-bold text-gray-800">AgriSmart</h1>
                  <p className="text-xs text-gray-500">Yield Prediction</p>
                </div>
              )}
            </div>
            
            {/* Collapse Toggle - Desktop only */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex absolute -right-3 top-8 bg-white border-2 border-gray-200 rounded-full p-1.5 hover:bg-gray-50 hover:scale-110 transition-all shadow-md"
            >
              <svg
                className={`w-3 h-3 text-gray-600 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* User Info */}
          {!isCollapsed && (
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {user?.username || 'User'}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {user?.email || ''}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {isCollapsed && (
            <div className="p-4 border-b border-gray-200 flex justify-center">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-green-100">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`group flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden ${
                        active
                          ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg scale-105`
                          : 'text-gray-700 hover:bg-gray-100 hover:scale-105'
                      }`}
                      title={isCollapsed ? item.label : ''}
                    >
                      {/* Active indicator */}
                      {active && !isCollapsed && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
                      )}
                      {active && isCollapsed && (
                        <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-green-600 rounded-r-full"></div>
                      )}
                      
                      <span className={`text-2xl transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {item.icon}
                      </span>
                      
                      {!isCollapsed && (
                        <span className="font-medium">{item.label}</span>
                      )}
                      
                      {/* Pulse effect for active item */}
                      {active && !isCollapsed && (
                        <div className="ml-auto">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-200 space-y-2 bg-gray-50">
            {!isCollapsed ? (
              <>
                <button
                  onClick={() => {
                    navigate('/');
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all hover:scale-105 group shadow-md hover:shadow-lg font-medium"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">🏡</span>
                  <span className="font-medium">Home</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-medium shadow-md hover:shadow-lg hover:scale-105 group"
                >
                  <span className="text-xl group-hover:rotate-12 transition-transform">🚪</span>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate('/');
                    setIsOpen(false);
                  }}
                  className="w-full flex justify-center p-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all hover:scale-110 shadow-md hover:shadow-lg"
                  title="Home"
                >
                  <span className="text-xl">🏡</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex justify-center p-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg hover:scale-110"
                  title="Logout"
                >
                  <span className="text-xl">🚪</span>
                </button>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
