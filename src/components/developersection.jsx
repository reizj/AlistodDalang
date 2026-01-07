import React from "react";
import { FaEnvelope, FaPhoneAlt, FaGithub, FaFacebook } from "react-icons/fa";

const Developers = () => {
  return (
    <section id="developers" className="py-20">
      <div className="container mx-auto px-6 md:px-20 text-center">
        {/* Title */}
        <h2 className="text-4xl font-extrabold text-center mb-16 text-white tracking-wide">
          👨‍💻 Developers
        </h2>

        {/* Developer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Card Template */}
          {[
            {
              name: "Tristan Borromeo",
              img: "/tristan.jpg",
              email: "juan@example.com",
              phone: "+639123456789",
              github: "https://github.com/juan",
              fb: "https://facebook.com/juan",
            },
            {
              name: "Aizy Madelo",
              img: "/aizy.jpg",
              email: "maria@example.com",
              phone: "+639123456780",
              github: "https://github.com/maria",
              fb: "https://facebook.com/maria",
            },
            {
              name: "Omar Alawlaqi",
              img: "/omar.jpg",
              email: "pedro@example.com",
              phone: "+639123456781",
              github: "https://github.com/pedro",
              fb: "https://facebook.com/pedro",
            },
          ].map((dev, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl text-center
              border border-white/20 bg-white/10 backdrop-blur-md
              hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <img
                src={dev.img}
                alt={dev.name}
                className="w-32 h-32 mx-auto rounded-full mb-6 border-4 border-white/30 object-cover"
              />
              <h3 className="text-xl font-semibold mb-4 text-white">{dev.name}</h3>
              <div className="flex justify-center space-x-4 text-gray-300">
                <a href={`mailto:${dev.email}`} className="hover:text-red-400">
                  <FaEnvelope size={22} />
                </a>
                <a href={`tel:${dev.phone}`} className="hover:text-green-400">
                  <FaPhoneAlt size={22} />
                </a>
                <a href={dev.github} target="_blank" rel="noreferrer" className="hover:text-white">
                  <FaGithub size={22} />
                </a>
                <a href={dev.fb} target="_blank" rel="noreferrer" className="hover:text-blue-400">
                  <FaFacebook size={22} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Developers;
