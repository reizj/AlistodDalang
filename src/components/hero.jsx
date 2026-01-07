import React from "react";
import { Link } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";

const HeroSection = () => {
  return (
    <div className="relative w-full h-screen flex items-center justify-center px-6 text-center">
      {/* Content Wrapper */}
      <div className="max-w-3xl">
        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight bg-gradient-to-r from-red-600 to-yellow-400 bg-clip-text text-transparent">
          AlistodDalang
        </h1>

        {/* Subtitle */}
        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-200 flex items-center justify-center gap-2">
          <FiAlertTriangle className="text-red-500 text-2xl" />
          IoT Fire Detection & Realtime Alert System
        </h2>

        {/* Description */}
        <p className="text-lg mb-10 text-gray-300 leading-relaxed">
          Equipped with <span className="font-semibold text-white">flame and smoke sensors</span>, 
          <span className="font-semibold text-white"> GSM-based SMS alerts</span>, and a 
          <span className="font-semibold text-white"> real-time monitoring dashboard</span>, 
          this project is designed to assist <span className="font-semibold text-white">rural and remote communities </span> 
           in detecting fire hazards early. By sending instant notifications and providing live 
          status updates, the system enables faster response times and helps prevent small fire 
          incidents from becoming large-scale disasters.
        </p>

        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          <a
            href="#features"
            className="px-6 py-3 rounded-xl font-semibold bg-red-600 shadow-lg hover:bg-red-500 hover:scale-105 transition-transform"
          >
            How It Works
          </a>
          <Link
            to="/dashboard"
            className="px-6 py-3 rounded-xl font-semibold border border-white text-white shadow-lg hover:bg-white hover:text-black hover:scale-105 transition-transform"
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
