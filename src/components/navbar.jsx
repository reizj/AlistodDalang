import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import "./navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar fixed top-0 left-0 w-full z-50 bg-transparent">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <a href="#home" className="navbar-brand text-white font-bold text-xl">
          AlistodDalang
        </a>

        {/* Hamburger */}
        <button
          className="navbar-toggle text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Links */}
        <div
          className={`custom-menu ${isOpen ? "open" : ""} 
          flex space-x-6 text-white`}
        >
          <a
            href="#home"
            className="custom-nav-link transition duration-300 hover:opacity-70"
            onClick={() => setIsOpen(false)}
          >
            Home
          </a>
          <a
            href="#how-it-works"
            className="custom-nav-link transition duration-300 hover:opacity-70"
            onClick={() => setIsOpen(false)}
          >
            How It Works
          </a>
          <a
            href="#features"
            className="custom-nav-link transition duration-300 hover:opacity-70"
            onClick={() => setIsOpen(false)}
          >
            Features
          </a>
          <a
            href="#contact"
            className="custom-nav-link transition duration-300 hover:opacity-70"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
