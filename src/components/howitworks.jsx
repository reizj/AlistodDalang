import React from "react";
import { FaFireAlt, FaSignal, FaBell } from "react-icons/fa"; // icons for steps

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-6 md:px-20">
        {/* Section Title */}
        <h2 className="text-4xl font-extrabold text-center mb-16 text-white tracking-wide">
          🔥 How It Works
        </h2>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Step 1 */}
          <div className="flex flex-col items-center justify-between h-full 
            bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg 
            hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="relative mb-6">
              <FaFireAlt className="text-red-400 text-6xl" />
              <span className="absolute -top-3 -right-3 bg-red-600 text-white text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full shadow-md">
                1
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Detection</h3>
            <p className="text-gray-200 leading-relaxed">
              IoT sensors continuously monitor smoke and flame levels in remote
              areas to detect potential fire hazards early.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center justify-between h-full 
            bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg 
            hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="relative mb-6">
              <FaSignal className="text-blue-400 text-6xl" />
              <span className="absolute -top-3 -right-3 bg-blue-600 text-white text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full shadow-md">
                2
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Transmission</h3>
            <p className="text-gray-200 leading-relaxed">
              Once fire is detected, data is transmitted via GSM modules,
              ensuring connectivity even in areas with no internet access.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center justify-between h-full 
            bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg 
            hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="relative mb-6">
              <FaBell className="text-green-400 text-6xl" />
              <span className="absolute -top-3 -right-3 bg-green-600 text-white text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full shadow-md">
                3
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Alert & Action</h3>
            <p className="text-gray-200 leading-relaxed">
              Community members and authorities instantly receive SMS alerts to
              respond quickly and prevent fire from spreading.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

