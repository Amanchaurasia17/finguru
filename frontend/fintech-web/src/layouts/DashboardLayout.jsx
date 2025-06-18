import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Chatbot from '../components/chatbot';

const navLinks = [
   { to: '/dashboard', label: 'Dashboard', icon: '📊' },
   { to: '/dashboard/spending', label: 'Spending Analysis', icon: '' },
  { to: '/dashboard/stock', label: 'Stock Prediction', icon: '' },
  { to: '/dashboard/tax', label: 'Tax Optimization', icon: '' },
  { to: '/dashboard/profile', label: 'Profile', icon: '👤' },
];

const Sidebar = ({ isSidebarVisible, toggleSidebar }) => {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-20 transition-opacity duration-300 ${
          isSidebarVisible ? 'block lg:hidden' : 'hidden'
        }`}
        onClick={toggleSidebar}
        aria-label="Close sidebar"
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-full lg:w-64 h-screen bg-white/70 backdrop-blur-md shadow-2xl 
                    z-30 px-6 py-4 flex flex-col justify-between transition-transform duration-300 
                    ${isSidebarVisible ? 'translate-y-0' : '-translate-y-full'} lg:translate-y-0 lg:rounded-none rounded-b-3xl`}
      >
        {/* Logo */}
        <div className="flex flex-col items-center lg:items-start gap-1">
          <div className="flex items-center gap-2 text-[#0a3c4c] text-2xl font-bold">
            <div className="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-extrabold shadow-lg border-4 border-white">
              <span className="text-2xl">FG</span>
            </div>
            <span className="hidden lg:inline">FinGURU</span>
          </div>
          <span className="text-xs text-green-700 font-semibold tracking-wide hidden lg:block ml-1">
            Your Financial Partner
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-6 text-lg font-medium mt-10">
          {navLinks.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === to
                  ? 'bg-green-100 text-green-700 font-bold shadow'
                  : 'hover:bg-green-50 hover:text-green-600 text-[#0a3c4c]'
              }`}
            >
              <span className="text-xl">{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={logout}
          title="Logout"
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-5 rounded-xl shadow-lg transition duration-300 mt-auto font-semibold flex items-center gap-2"
        >
          Logout
        </button>

        {/* Hide on Mobile */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 lg:hidden bg-gray-200 hover:bg-gray-300 text-[#0a3c4c] p-2 rounded-full shadow-md"
          aria-label="Close sidebar"
        >
          ✖
        </button>
      </aside>
    </>
  );
};

export default function DashboardLayout() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const { currentUser } = useAuth();

  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#f9fafb] to-[#edf9f3] text-[#0a3c4c] relative">
      {/* Sidebar */}
      <div className="w-64 hidden lg:block fixed top-0 left-0 h-full z-30">
        <Sidebar isSidebarVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 p-4 overflow-y-auto w-full">
        {/* Toggle button on mobile */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-md fixed top-4 left-4 z-40"
          aria-label="Open sidebar"
        >
          ☰
        </button>

        {/* Welcome header */}
<div className=" bg-white shadow-md rounded-2xl px-6 py-4 mb-4 border border-green-100 ">
  <div className="flex items-center gap-3 mb-1">
    <span className="text-2xl">👋</span>
    <h1 className="text-xl lg:text-2xl font-bold text-[#0a3c4c]">
      Welcome, <span className="uppercase">{currentUser?.name || 'User'}</span>
    </h1>
  </div>
  <p className="text-sm text-[#0a3c4c] leading-relaxed">
    Manage your finances, track your investments, and optimize your taxes with <span className="font-semibold text-green-600">FinGURU</span>.
  </p>
</div>

        {/* Page content */}
        <div className="mt-2">
          <Outlet />
        </div>
      </div>

      {/* Chatbot */}
      <div className="fixed bottom-8 right-8 z-40">
        <Chatbot />
      </div>
    </div>
  );
}
