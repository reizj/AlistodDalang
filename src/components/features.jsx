import React from "react";
import { FaSolarPanel, FaMapMarkedAlt, FaBell, FaMicrochip } from "react-icons/fa";

const Features = () => {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-6 md:px-20">
        {/* Section Title */}
        <h2 className="text-4xl font-extrabold text-center mb-16 text-white tracking-wide">
          🔑 Key Features
        </h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
          {/* Feature 1 */}
          <div className="flex flex-col items-center h-full p-8 
            bg-white/10 backdrop-blur-md rounded-2xl shadow-lg 
            hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <FaMapMarkedAlt className="text-red-400 text-6xl mb-6" />
            <h3 className="text-xl font-semibold mb-3 text-white">Remote Area Coverage</h3>
            <p className="text-gray-200">
              Works efficiently in rural and remote areas where internet is limited or unavailable.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center h-full p-8 
            bg-white/10 backdrop-blur-md rounded-2xl shadow-lg 
            hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <FaSolarPanel className="text-yellow-400 text-6xl mb-6" />
            <h3 className="text-xl font-semibold mb-3 text-white">Solar-Powered</h3>
            <p className="text-gray-200">
              Sustainable and energy-independent system powered by solar panels for 24/7 operation.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center h-full p-8 
            bg-white/10 backdrop-blur-md rounded-2xl shadow-lg 
            hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <FaBell className="text-green-400 text-6xl mb-6" />
            <h3 className="text-xl font-semibold mb-3 text-white">Real-Time Alerts</h3>
            <p className="text-gray-200">
              Immediate SMS notifications sent to community members and local authorities.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col items-center h-full p-8 
            bg-white/10 backdrop-blur-md rounded-2xl shadow-lg 
            hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <FaMicrochip className="text-red-400 text-6xl mb-6" />
            <h3 className="text-xl font-semibold mb-3 text-white">IoT-Driven Monitoring</h3>
            <p className="text-gray-200">
              Smart integration of flame & smoke sensors with GSM module for reliable monitoring.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
