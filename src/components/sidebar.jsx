// src/components/dashboard/Sidebar.jsx
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiCpu,
  FiAlertTriangle,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate("/"); // Redirect back to homepage
  };

  // Sidebar links config
  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <FiHome /> },
    { to: "/alerts", label: "Alerts", icon: <FiAlertTriangle /> },
    { to: "/devicemap", label: "Device Map", icon: <FiCpu /> },
  ];

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-64 text-gray-100 flex flex-col
  bg-black border-r border-red-500/30 shadow-lg z-50"
    >
      {/* Logo */}
      <div className="px-6 py-5 text-2xl font-bold border-b border-red-500/30 text-white tracking-wide">
        AlistodDalang
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${isActive
                      ? "bg-red-500/20 text-red-400 border border-red-500/40 shadow-md shadow-red-900/30"
                      : "hover:bg-white/10 hover:text-red-300"
                    }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span className="font-medium">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="px-6 py-4 border-t border-red-500/30">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-red-400 hover:text-red-300 w-full transition-colors"
        >
          <FiLogOut className="text-lg" />
          <span className="font-medium">Logout</span>
        </button>
      </div>

      {/* Footer */}
      <div className="px-6 py-2 text-xs text-gray-400 tracking-wide">
        © {new Date().getFullYear()} AlistodDalang
      </div>
    </aside>
  );
}
